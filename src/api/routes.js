/**
 * API Routes
 * 
 * This module defines the main API routes for the AGENTNEXUS platform.
 */

const express = require('express');
const router = express.Router();

// Import route modules
const agentRoutes = require('./routes/agent.routes');
const registryRoutes = require('./routes/registry.routes');
const validationRoutes = require('./routes/validation.routes');
const searchRoutes = require('./routes/search.routes');
const reputationRoutes = require('./routes/reputation.routes');
const sandboxRoutes = require('./routes/sandbox.routes');
const forumRoutes = require('./routes/forum.routes');
const authRoutes = require('./routes/auth.routes');
const blockchainRoutes = require('./routes/blockchain.routes');

// API version
const API_VERSION = 'v1';

// Mount routes
router.use(`/${API_VERSION}/agents`, agentRoutes);
router.use(`/${API_VERSION}/registry`, registryRoutes);
router.use(`/${API_VERSION}/validation`, validationRoutes);
router.use(`/${API_VERSION}/search`, searchRoutes);
router.use(`/${API_VERSION}/reputation`, reputationRoutes);
router.use(`/${API_VERSION}/sandbox`, sandboxRoutes);
router.use(`/${API_VERSION}/forum`, forumRoutes);
router.use(`/${API_VERSION}/auth`, authRoutes);
router.use('/blockchain', blockchainRoutes);

// API documentation route
router.get('/', (req, res) => {
  res.json({
    name: 'AGENTNEXUS API',
    version: API_VERSION,
    endpoints: [
      { path: `/api/${API_VERSION}/agents`, description: 'Agent management and communication' },
      { path: `/api/${API_VERSION}/registry`, description: 'Decentralized registry operations' },
      { path: `/api/${API_VERSION}/validation`, description: 'Agent validation and trust scoring' },
      { path: `/api/${API_VERSION}/search`, description: 'AI-driven search and recommendations' },
      { path: `/api/${API_VERSION}/reputation`, description: 'Reputation and reward system' },
      { path: `/api/${API_VERSION}/sandbox`, description: 'Sandbox environment for testing agents' },
      { path: `/api/${API_VERSION}/forum`, description: 'Collaborative forum and version control' },
      { path: `/api/${API_VERSION}/auth`, description: 'Authentication and authorization' },
      { path: '/blockchain', description: 'Blockchain operations' },
    ],
    documentation: 'https://docs.agentnexus.io/api',
  });
});

// Health check route
router.get('/health', (req, res) => {
  res.status(200).json({
    status: 'ok',
    message: 'AGENTNEXUS API is running',
    timestamp: new Date().toISOString()
  });
});

// Error handling middleware
router.use((err, req, res, next) => {
  console.error('API Error:', err);
  
  // Handle specific error types
  if (err.name === 'ValidationError') {
    return res.status(400).json({
      error: 'Validation Error',
      message: err.message,
      details: err.details || [],
    });
  }
  
  if (err.name === 'AuthenticationError') {
    return res.status(401).json({
      error: 'Authentication Error',
      message: err.message,
    });
  }
  
  if (err.name === 'AuthorizationError') {
    return res.status(403).json({
      error: 'Authorization Error',
      message: err.message,
    });
  }
  
  if (err.name === 'NotFoundError') {
    return res.status(404).json({
      error: 'Not Found',
      message: err.message,
    });
  }
  
  // Default to 500 server error
  res.status(500).json({
    error: 'Internal Server Error',
    message: process.env.NODE_ENV === 'production' 
      ? 'An unexpected error occurred' 
      : err.message,
    requestId: req.id,
  });
});

module.exports = router; 