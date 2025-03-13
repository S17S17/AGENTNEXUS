const mongoose = require('mongoose');
const { Pool } = require('pg');
const redis = require('redis');

// MongoDB connection
let mongoClient;
async function connectMongoDB() {
  try {
    mongoClient = await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('MongoDB connected successfully');
    return mongoClient;
  } catch (error) {
    console.error('MongoDB connection error:', error);
    throw error;
  }
}

// PostgreSQL connection
let pgPool;
async function connectPostgreSQL() {
  try {
    pgPool = new Pool({
      connectionString: process.env.POSTGRES_URI,
    });
    
    // Test the connection
    const client = await pgPool.connect();
    client.release();
    
    console.log('PostgreSQL connected successfully');
    return pgPool;
  } catch (error) {
    console.error('PostgreSQL connection error:', error);
    throw error;
  }
}

// Redis connection
let redisClient;
async function connectRedis() {
  try {
    redisClient = redis.createClient({
      url: process.env.REDIS_URI,
    });
    
    redisClient.on('error', (err) => {
      console.error('Redis client error:', err);
    });
    
    await redisClient.connect();
    console.log('Redis connected successfully');
    return redisClient;
  } catch (error) {
    console.error('Redis connection error:', error);
    throw error;
  }
}

// Connect to all databases
async function connectDatabases() {
  try {
    await Promise.all([
      connectMongoDB(),
      connectPostgreSQL(),
      connectRedis(),
    ]);
    return {
      mongoClient,
      pgPool,
      redisClient,
    };
  } catch (error) {
    console.error('Failed to connect to databases:', error);
    throw error;
  }
}

// Close all database connections
async function closeDatabases() {
  try {
    const closePromises = [];
    
    if (mongoClient) {
      closePromises.push(mongoose.disconnect());
    }
    
    if (pgPool) {
      closePromises.push(pgPool.end());
    }
    
    if (redisClient) {
      closePromises.push(redisClient.quit());
    }
    
    await Promise.all(closePromises);
    console.log('All database connections closed');
  } catch (error) {
    console.error('Error closing database connections:', error);
    throw error;
  }
}

// Get database clients
function getDatabaseClients() {
  return {
    mongoClient,
    pgPool,
    redisClient,
  };
}

module.exports = {
  connectDatabases,
  closeDatabases,
  getDatabaseClients,
  connectMongoDB,
  connectPostgreSQL,
  connectRedis,
}; 