/**
 * IPFS Integration
 * 
 * This module provides functionality for interacting with IPFS
 * for storing and retrieving agent metadata.
 */

const { create } = require('ipfs-http-client');
const { BlockchainError } = require('../core/errors');
const { getCachedMetadata, cacheMetadata } = require('./cache');
const logger = require('../core/logger');

// IPFS client instance
let ipfsClient = null;

/**
 * Initialize IPFS client
 * 
 * @returns {Object} IPFS client instance
 */
function initializeIpfs() {
  try {
    // Check if already initialized
    if (ipfsClient) {
      return ipfsClient;
    }
    
    // Get IPFS configuration from environment variables
    const ipfsApiUrl = process.env.IPFS_API_URL || 'https://ipfs.infura.io:5001';
    const ipfsProjectId = process.env.IPFS_PROJECT_ID;
    const ipfsProjectSecret = process.env.IPFS_PROJECT_SECRET;
    
    // Create authentication header
    const auth = ipfsProjectId && ipfsProjectSecret
      ? 'Basic ' + Buffer.from(ipfsProjectId + ':' + ipfsProjectSecret).toString('base64')
      : undefined;
    
    // Create IPFS client
    ipfsClient = create({
      url: ipfsApiUrl,
      headers: {
        authorization: auth
      }
    });
    
    logger.info('IPFS client initialized');
    return ipfsClient;
  } catch (error) {
    logger.error(`Failed to initialize IPFS client: ${error.message}`);
    throw new BlockchainError(`Failed to initialize IPFS client: ${error.message}`);
  }
}

/**
 * Upload metadata to IPFS
 * 
 * @param {Object} metadata - The metadata to upload
 * @returns {Promise<string>} The IPFS URI of the uploaded metadata
 */
async function uploadMetadataToIPFS(metadata) {
  try {
    // Initialize IPFS client if not already initialized
    if (!ipfsClient) {
      initializeIpfs();
    }
    
    // Convert metadata to JSON string
    const metadataString = JSON.stringify(metadata);
    
    // Upload to IPFS
    const { cid } = await ipfsClient.add(metadataString);
    
    // Create IPFS URI
    const ipfsUri = `ipfs://${cid.toString()}`;
    
    // Cache the metadata
    await cacheMetadata(ipfsUri, metadata);
    
    logger.info(`Uploaded metadata to IPFS: ${ipfsUri}`);
    return ipfsUri;
  } catch (error) {
    logger.error(`Failed to upload metadata to IPFS: ${error.message}`);
    throw new BlockchainError(`Failed to upload metadata to IPFS: ${error.message}`);
  }
}

/**
 * Get metadata from IPFS
 * 
 * @param {string} ipfsUri - The IPFS URI of the metadata
 * @returns {Promise<Object>} The metadata
 */
async function getMetadataFromIPFS(ipfsUri) {
  try {
    // Check cache first
    const cachedMetadata = await getCachedMetadata(ipfsUri);
    if (cachedMetadata) {
      logger.debug(`Retrieved metadata from cache: ${ipfsUri}`);
      return cachedMetadata;
    }
    
    // Initialize IPFS client if not already initialized
    if (!ipfsClient) {
      initializeIpfs();
    }
    
    // Validate IPFS URI
    if (!isValidIpfsUri(ipfsUri)) {
      throw new BlockchainError(`Invalid IPFS URI: ${ipfsUri}`);
    }
    
    // Extract CID from URI
    const cid = ipfsUri.replace('ipfs://', '');
    
    // Get metadata from IPFS
    let metadataString = '';
    for await (const chunk of ipfsClient.cat(cid)) {
      metadataString += chunk.toString();
    }
    
    // Parse metadata
    const metadata = JSON.parse(metadataString);
    
    // Cache the metadata
    await cacheMetadata(ipfsUri, metadata);
    
    logger.info(`Retrieved metadata from IPFS: ${ipfsUri}`);
    return metadata;
  } catch (error) {
    logger.error(`Failed to get metadata from IPFS: ${error.message}`);
    throw new BlockchainError(`Failed to get metadata from IPFS: ${error.message}`);
  }
}

/**
 * Check if a string is a valid IPFS URI
 * 
 * @param {string} uri - The URI to check
 * @returns {boolean} Whether the URI is a valid IPFS URI
 */
function isValidIpfsUri(uri) {
  return typeof uri === 'string' && uri.startsWith('ipfs://');
}

module.exports = {
  initializeIpfs,
  uploadMetadataToIPFS,
  getMetadataFromIPFS,
  isValidIpfsUri
}; 