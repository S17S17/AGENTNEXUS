/**
 * AGENTNEXUS Platform
 * 
 * Main application entry point.
 */

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const http = require('http');
const socketIo = require('socket.io');
const { connectDatabases } = require('./core/database');
const apiRoutes = require('./api/routes');
const { setupBlockchain } = require('./blockchain/setup');
const { initializeValidationPipeline } = require('./validation/pipeline');
const { initializeSearchEngine } = require('./search/engine');
const { initializeSandbox } = require('./sandbox/manager');
const { initializeBlockchainService, shutdownBlockchainService } = require('./services/blockchain.service');

// Initialize Express app
const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  }
});

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// API Routes
app.use('/api', apiRoutes);

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', version: process.env.npm_package_version });
});

// Socket.IO connection handling
io.on('connection', (socket) => {
  console.log('New client connected:', socket.id);
  
  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
  });
  
  // Handle agent communication
  socket.on('agent:message', (data) => {
    // Process and route agent messages
    io.to(data.recipient).emit('agent:message', data);
  });
  
  // Handle sandbox events
  socket.on('sandbox:event', (data) => {
    // Process sandbox events
    io.to(data.sessionId).emit('sandbox:update', data);
  });
});

// Initialize components based on feature flags
async function initializeComponents() {
  try {
    // Connect to databases
    await connectDatabases();
    console.log('✅ Database connections established');
    
    // Initialize blockchain if enabled
    if (process.env.ENABLE_BLOCKCHAIN === 'true') {
      await setupBlockchain();
      console.log('✅ Blockchain components initialized');
    }
    
    // Initialize validation pipeline if enabled
    if (process.env.ENABLE_VALIDATION === 'true') {
      await initializeValidationPipeline();
      console.log('✅ Validation pipeline initialized');
    }
    
    // Initialize search engine if enabled
    if (process.env.ENABLE_AI_SEARCH === 'true') {
      await initializeSearchEngine();
      console.log('✅ AI search engine initialized');
    }
    
    // Initialize sandbox environment if enabled
    if (process.env.ENABLE_SANDBOX === 'true') {
      await initializeSandbox();
      console.log('✅ Sandbox environment initialized');
    }
    
    // Initialize blockchain service
    if (process.env.ENABLE_BLOCKCHAIN === 'true') {
      await initializeBlockchainService({
        enableSync: true,
        processHistorical: process.env.PROCESS_HISTORICAL_EVENTS === 'true'
      });
      console.log('Blockchain service initialized');
    }
    
    // Start the server
    const PORT = process.env.PORT || 3000;
    server.listen(PORT, () => {
      console.log(`
      ╔═══════════════════════════════════════════════╗
      ║                                               ║
      ║               AGENTNEXUS Server               ║
      ║                                               ║
      ║  🚀 Server running on http://localhost:${PORT}  ║
      ║  🌐 Environment: ${process.env.NODE_ENV}          ║
      ║                                               ║
      ╚═══════════════════════════════════════════════╝
      `);
    });
  } catch (error) {
    console.error('❌ Failed to initialize components:', error);
    process.exit(1);
  }
}

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
  console.error('❌ Uncaught Exception:', error);
  // Perform graceful shutdown
  process.exit(1);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (reason, promise) => {
  console.error('❌ Unhandled Rejection at:', promise, 'reason:', reason);
  // Perform graceful shutdown
  process.exit(1);
});

// Initialize the application
initializeComponents(); 

// Graceful shutdown
function setupGracefulShutdown() {
  // Handle SIGINT (Ctrl+C)
  process.on('SIGINT', async () => {
    console.log('Received SIGINT. Shutting down gracefully...');
    await performShutdown();
  });
  
  // Handle SIGTERM
  process.on('SIGTERM', async () => {
    console.log('Received SIGTERM. Shutting down gracefully...');
    await performShutdown();
  });
  
  // Handle uncaught exceptions
  process.on('uncaughtException', async (error) => {
    console.error('Uncaught exception:', error);
    await performShutdown();
  });
  
  // Handle unhandled promise rejections
  process.on('unhandledRejection', async (reason, promise) => {
    console.error('Unhandled promise rejection:', reason);
    await performShutdown();
  });
}

// Perform shutdown tasks
async function performShutdown() {
  try {
    // Shutdown blockchain service
    if (process.env.ENABLE_BLOCKCHAIN === 'true') {
      await shutdownBlockchainService();
      console.log('Blockchain service shut down');
    }
    
    // Close database connection
    // Add any other cleanup tasks here
    
    console.log('Shutdown complete');
    process.exit(0);
  } catch (error) {
    console.error('Error during shutdown:', error);
    process.exit(1);
  }
} 