/**
 * Blockchain Cache Service
 * 
 * This module provides caching functionality for blockchain data
 * to improve performance and reduce blockchain calls.
 */

const Redis = require('ioredis');
const { BlockchainError } = require('../core/errors');

// Redis client instance
let redisClient = null;

// Cache configuration
const DEFAULT_TTL = 3600; // 1 hour in seconds
const CACHE_KEYS = {
  AGENT: 'blockchain:agent:',
  METADATA: 'blockchain:metadata:',
  OWNER_AGENTS: 'blockchain:owner:',
  TRANSACTION: 'blockchain:tx:',
  STATUS: 'blockchain:status'
};

/**
 * Initialize cache service
 * 
 * @param {Object} options - Initialization options
 * @param {string} options.redisUrl - Redis connection URL (defaults to env var)
 * @param {number} options.ttl - Default TTL in seconds (defaults to 1 hour)
 * @returns {Object} The initialized Redis client
 */
function initializeCache(options = {}) {
  try {
    // Get options with defaults from environment variables
    const redisUrl = options.redisUrl || process.env.REDIS_URI || 'redis://localhost:6379';
    
    // Create Redis client
    redisClient = new Redis(redisUrl, {
      maxRetriesPerRequest: 3,
      enableReadyCheck: true,
      connectTimeout: 10000,
      retryStrategy: (times) => {
        const delay = Math.min(times * 50, 2000);
        return delay;
      }
    });
    
    // Handle connection events
    redisClient.on('connect', () => {
      console.log('Connected to Redis cache');
    });
    
    redisClient.on('error', (error) => {
      console.error('Redis cache error:', error);
    });
    
    redisClient.on('reconnecting', () => {
      console.log('Reconnecting to Redis cache...');
    });
    
    console.log('Blockchain cache service initialized');
    
    return redisClient;
  } catch (error) {
    console.error('Failed to initialize cache service:', error);
    return null;
  }
}

/**
 * Get Redis client
 * 
 * @returns {Object} The Redis client
 */
function getRedisClient() {
  if (!redisClient) {
    console.warn('Redis client not initialized. Call initializeCache() first.');
  }
  
  return redisClient;
}

/**
 * Set cache value
 * 
 * @param {string} key - The cache key
 * @param {Object|string} value - The value to cache
 * @param {number} ttl - TTL in seconds (optional)
 * @returns {Promise<boolean>} Whether the value was cached
 */
async function setCacheValue(key, value, ttl = DEFAULT_TTL) {
  try {
    if (!redisClient) {
      return false;
    }
    
    // Convert object to string if needed
    const valueToCache = typeof value === 'object' ? JSON.stringify(value) : value;
    
    // Set cache with TTL
    await redisClient.set(key, valueToCache, 'EX', ttl);
    
    return true;
  } catch (error) {
    console.error(`Failed to set cache value for key ${key}:`, error);
    return false;
  }
}

/**
 * Get cache value
 * 
 * @param {string} key - The cache key
 * @param {boolean} parseJson - Whether to parse the value as JSON
 * @returns {Promise<Object|string|null>} The cached value or null if not found
 */
async function getCacheValue(key, parseJson = true) {
  try {
    if (!redisClient) {
      return null;
    }
    
    // Get cache value
    const value = await redisClient.get(key);
    
    if (!value) {
      return null;
    }
    
    // Parse JSON if requested
    if (parseJson) {
      try {
        return JSON.parse(value);
      } catch (error) {
        console.warn(`Failed to parse JSON for key ${key}:`, error);
        return value;
      }
    }
    
    return value;
  } catch (error) {
    console.error(`Failed to get cache value for key ${key}:`, error);
    return null;
  }
}

/**
 * Delete cache value
 * 
 * @param {string} key - The cache key
 * @returns {Promise<boolean>} Whether the value was deleted
 */
async function deleteCacheValue(key) {
  try {
    if (!redisClient) {
      return false;
    }
    
    // Delete cache value
    await redisClient.del(key);
    
    return true;
  } catch (error) {
    console.error(`Failed to delete cache value for key ${key}:`, error);
    return false;
  }
}

/**
 * Clear cache by pattern
 * 
 * @param {string} pattern - The key pattern to clear
 * @returns {Promise<number>} The number of keys cleared
 */
async function clearCacheByPattern(pattern) {
  try {
    if (!redisClient) {
      return 0;
    }
    
    // Get keys matching pattern
    const keys = await redisClient.keys(pattern);
    
    if (keys.length === 0) {
      return 0;
    }
    
    // Delete keys
    await redisClient.del(keys);
    
    return keys.length;
  } catch (error) {
    console.error(`Failed to clear cache for pattern ${pattern}:`, error);
    return 0;
  }
}

/**
 * Cache agent data
 * 
 * @param {string} agentId - The agent ID
 * @param {Object} agentData - The agent data
 * @param {number} ttl - TTL in seconds (optional)
 * @returns {Promise<boolean>} Whether the data was cached
 */
async function cacheAgentData(agentId, agentData, ttl = DEFAULT_TTL) {
  return setCacheValue(`${CACHE_KEYS.AGENT}${agentId}`, agentData, ttl);
}

/**
 * Get cached agent data
 * 
 * @param {string} agentId - The agent ID
 * @returns {Promise<Object|null>} The cached agent data or null if not found
 */
async function getCachedAgentData(agentId) {
  return getCacheValue(`${CACHE_KEYS.AGENT}${agentId}`);
}

/**
 * Cache metadata
 * 
 * @param {string} uri - The metadata URI
 * @param {Object} metadata - The metadata
 * @param {number} ttl - TTL in seconds (optional)
 * @returns {Promise<boolean>} Whether the metadata was cached
 */
async function cacheMetadata(uri, metadata, ttl = DEFAULT_TTL) {
  // Extract CID from URI
  const cid = uri.startsWith('ipfs://') ? uri.substring(7) : uri;
  return setCacheValue(`${CACHE_KEYS.METADATA}${cid}`, metadata, ttl);
}

/**
 * Get cached metadata
 * 
 * @param {string} uri - The metadata URI
 * @returns {Promise<Object|null>} The cached metadata or null if not found
 */
async function getCachedMetadata(uri) {
  // Extract CID from URI
  const cid = uri.startsWith('ipfs://') ? uri.substring(7) : uri;
  return getCacheValue(`${CACHE_KEYS.METADATA}${cid}`);
}

/**
 * Cache owner agents
 * 
 * @param {string} ownerId - The owner ID
 * @param {Array} agents - The owner's agents
 * @param {number} ttl - TTL in seconds (optional)
 * @returns {Promise<boolean>} Whether the agents were cached
 */
async function cacheOwnerAgents(ownerId, agents, ttl = DEFAULT_TTL) {
  return setCacheValue(`${CACHE_KEYS.OWNER_AGENTS}${ownerId}`, agents, ttl);
}

/**
 * Get cached owner agents
 * 
 * @param {string} ownerId - The owner ID
 * @returns {Promise<Array|null>} The cached agents or null if not found
 */
async function getCachedOwnerAgents(ownerId) {
  return getCacheValue(`${CACHE_KEYS.OWNER_AGENTS}${ownerId}`);
}

/**
 * Cache transaction
 * 
 * @param {string} txHash - The transaction hash
 * @param {Object} txData - The transaction data
 * @param {number} ttl - TTL in seconds (optional)
 * @returns {Promise<boolean>} Whether the transaction was cached
 */
async function cacheTransaction(txHash, txData, ttl = DEFAULT_TTL) {
  return setCacheValue(`${CACHE_KEYS.TRANSACTION}${txHash}`, txData, ttl);
}

/**
 * Get cached transaction
 * 
 * @param {string} txHash - The transaction hash
 * @returns {Promise<Object|null>} The cached transaction or null if not found
 */
async function getCachedTransaction(txHash) {
  return getCacheValue(`${CACHE_KEYS.TRANSACTION}${txHash}`);
}

/**
 * Cache blockchain status
 * 
 * @param {Object} status - The blockchain status
 * @param {number} ttl - TTL in seconds (optional, defaults to 5 minutes)
 * @returns {Promise<boolean>} Whether the status was cached
 */
async function cacheBlockchainStatus(status, ttl = 300) {
  return setCacheValue(CACHE_KEYS.STATUS, status, ttl);
}

/**
 * Get cached blockchain status
 * 
 * @returns {Promise<Object|null>} The cached status or null if not found
 */
async function getCachedBlockchainStatus() {
  return getCacheValue(CACHE_KEYS.STATUS);
}

/**
 * Invalidate agent cache
 * 
 * @param {string} agentId - The agent ID
 * @returns {Promise<boolean>} Whether the cache was invalidated
 */
async function invalidateAgentCache(agentId) {
  return deleteCacheValue(`${CACHE_KEYS.AGENT}${agentId}`);
}

/**
 * Invalidate owner agents cache
 * 
 * @param {string} ownerId - The owner ID
 * @returns {Promise<boolean>} Whether the cache was invalidated
 */
async function invalidateOwnerAgentsCache(ownerId) {
  return deleteCacheValue(`${CACHE_KEYS.OWNER_AGENTS}${ownerId}`);
}

/**
 * Invalidate metadata cache
 * 
 * @param {string} uri - The metadata URI
 * @returns {Promise<boolean>} Whether the cache was invalidated
 */
async function invalidateMetadataCache(uri) {
  // Extract CID from URI
  const cid = uri.startsWith('ipfs://') ? uri.substring(7) : uri;
  return deleteCacheValue(`${CACHE_KEYS.METADATA}${cid}`);
}

/**
 * Clear all blockchain cache
 * 
 * @returns {Promise<number>} The number of keys cleared
 */
async function clearAllBlockchainCache() {
  return clearCacheByPattern('blockchain:*');
}

/**
 * Shutdown cache service
 * 
 * @returns {Promise<boolean>} Whether the service was shut down
 */
async function shutdownCache() {
  try {
    if (!redisClient) {
      return true;
    }
    
    await redisClient.quit();
    console.log('Blockchain cache service shut down');
    
    return true;
  } catch (error) {
    console.error('Failed to shut down cache service:', error);
    return false;
  }
}

module.exports = {
  initializeCache,
  getRedisClient,
  setCacheValue,
  getCacheValue,
  deleteCacheValue,
  clearCacheByPattern,
  cacheAgentData,
  getCachedAgentData,
  cacheMetadata,
  getCachedMetadata,
  cacheOwnerAgents,
  getCachedOwnerAgents,
  cacheTransaction,
  getCachedTransaction,
  cacheBlockchainStatus,
  getCachedBlockchainStatus,
  invalidateAgentCache,
  invalidateOwnerAgentsCache,
  invalidateMetadataCache,
  clearAllBlockchainCache,
  shutdownCache,
  CACHE_KEYS
}; 