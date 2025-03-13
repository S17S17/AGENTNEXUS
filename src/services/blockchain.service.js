/**
 * Blockchain Service
 * 
 * This module provides a service for initializing and managing
 * blockchain components.
 */

const { initializeBlockchain } = require('../blockchain/setup');
const { initializeIpfs } = require('../blockchain/ipfs');
const { initializeSyncService, shutdownSyncService } = require('../blockchain/sync');
const { initializeCache, updateBlockchainStatus } = require('../blockchain/cache');
const { BlockchainError } = require('../core/errors');
const logger = require('../core/logger');

/**
 * Initialize blockchain service
 * 
 * @param {Object} options - Initialization options
 * @param {boolean} options.enableSync - Whether to enable blockchain sync
 * @param {boolean} options.processHistorical - Whether to process historical events
 * @returns {Promise<Object>} The initialized components
 */
async function initializeBlockchainService(options = {}) {
  try {
    logger.info('Initializing blockchain service...');
    
    // Check if blockchain integration is enabled
    if (process.env.ENABLE_BLOCKCHAIN !== 'true') {
      logger.info('Blockchain integration is disabled');
      return null;
    }
    
    // Initialize blockchain components
    const blockchainComponents = await initializeBlockchain();
    
    // Initialize IPFS client
    const ipfsClient = initializeIpfs();
    
    // Initialize cache service
    const cacheInitialized = await initializeCache();
    if (!cacheInitialized) {
      logger.warn('Failed to initialize blockchain cache service');
      // Continue without cache
    }
    
    // Initialize sync service if enabled
    if (options.enableSync) {
      await initializeSyncService({
        processHistorical: options.processHistorical || false
      });
    }
    
    // Update blockchain status in cache
    await updateBlockchainStatus();
    
    logger.info('Blockchain service initialized');
    
    return {
      blockchainComponents,
      ipfsClient
    };
  } catch (error) {
    logger.error(`Failed to initialize blockchain service: ${error.message}`);
    throw new BlockchainError(`Failed to initialize blockchain service: ${error.message}`);
  }
}

/**
 * Shutdown blockchain service
 * 
 * @returns {Promise<boolean>} Whether the service was shut down
 */
async function shutdownBlockchainService() {
  try {
    logger.info('Shutting down blockchain service...');
    
    // Shutdown sync service
    await shutdownSyncService();
    
    logger.info('Blockchain service shut down');
    return true;
  } catch (error) {
    logger.error('Failed to shut down blockchain service:', error);
    return false;
  }
}

module.exports = {
  initializeBlockchainService,
  shutdownBlockchainService
}; 