/**
 * IPFS Integration
 * 
 * This module provides functionality for storing and retrieving
 * data from IPFS (InterPlanetary File System).
 */

const { create } = require('ipfs-http-client');
const { IPFSError } = require('./errors');

// Initialize IPFS client
let ipfsClient;

/**
 * Initialize the IPFS client
 * 
 * @returns {Object} The IPFS client
 */
function initializeIPFS() {
  try {
    // Create IPFS client with authentication if provided
    const auth = process.env.IPFS_API_KEY && process.env.IPFS_API_SECRET
      ? 'Basic ' + Buffer.from(process.env.IPFS_API_KEY + ':' + process.env.IPFS_API_SECRET).toString('base64')
      : undefined;
    
    const options = {
      host: process.env.IPFS_API_URL || 'ipfs.infura.io',
      port: 5001,
      protocol: 'https',
      headers: auth ? { authorization: auth } : {}
    };
    
    ipfsClient = create(options);
    return ipfsClient;
  } catch (error) {
    throw new IPFSError(`Failed to initialize IPFS client: ${error.message}`);
  }
}

/**
 * Get the IPFS client, initializing it if necessary
 * 
 * @returns {Object} The IPFS client
 */
function getIPFSClient() {
  if (!ipfsClient) {
    ipfsClient = initializeIPFS();
  }
  return ipfsClient;
}

/**
 * Store data on IPFS
 * 
 * @param {Buffer|string} data - The data to store
 * @param {Object} [options] - Additional options
 * @returns {Promise<string>} The IPFS CID (Content Identifier)
 */
async function storeOnIPFS(data, options = {}) {
  try {
    const client = getIPFSClient();
    
    // Add the data to IPFS
    const result = await client.add(data, options);
    
    // Return the CID
    return result.cid.toString();
  } catch (error) {
    throw new IPFSError(`Failed to store data on IPFS: ${error.message}`);
  }
}

/**
 * Retrieve data from IPFS
 * 
 * @param {string} cid - The CID of the data to retrieve
 * @returns {Promise<Buffer>} The retrieved data
 */
async function retrieveFromIPFS(cid) {
  try {
    const client = getIPFSClient();
    
    // Get the data from IPFS
    const chunks = [];
    for await (const chunk of client.cat(cid)) {
      chunks.push(chunk);
    }
    
    // Combine chunks into a single buffer
    return Buffer.concat(chunks);
  } catch (error) {
    throw new IPFSError(`Failed to retrieve data from IPFS: ${error.message}`);
  }
}

/**
 * Store JSON data on IPFS
 * 
 * @param {Object} data - The JSON data to store
 * @param {Object} [options] - Additional options
 * @returns {Promise<string>} The IPFS CID
 */
async function storeJSONOnIPFS(data, options = {}) {
  try {
    // Convert JSON to string
    const jsonString = JSON.stringify(data);
    
    // Store on IPFS
    return await storeOnIPFS(jsonString, options);
  } catch (error) {
    throw new IPFSError(`Failed to store JSON on IPFS: ${error.message}`);
  }
}

/**
 * Retrieve JSON data from IPFS
 * 
 * @param {string} cid - The CID of the JSON data
 * @returns {Promise<Object>} The retrieved JSON data
 */
async function retrieveJSONFromIPFS(cid) {
  try {
    // Retrieve data from IPFS
    const data = await retrieveFromIPFS(cid);
    
    // Parse JSON
    return JSON.parse(data.toString());
  } catch (error) {
    throw new IPFSError(`Failed to retrieve JSON from IPFS: ${error.message}`);
  }
}

/**
 * Store agent metadata on IPFS
 * 
 * @param {Object} metadata - The agent metadata
 * @returns {Promise<string>} The IPFS URI
 */
async function storeMetadataOnIPFS(metadata) {
  try {
    // Store metadata on IPFS
    const cid = await storeJSONOnIPFS(metadata);
    
    // Return IPFS URI
    return `ipfs://${cid}`;
  } catch (error) {
    throw new IPFSError(`Failed to store agent metadata on IPFS: ${error.message}`);
  }
}

/**
 * Retrieve agent metadata from IPFS
 * 
 * @param {string} uri - The IPFS URI
 * @returns {Promise<Object>} The agent metadata
 */
async function retrieveMetadataFromIPFS(uri) {
  try {
    // Extract CID from URI
    if (!uri.startsWith('ipfs://')) {
      throw new IPFSError(`Invalid IPFS URI: ${uri}`);
    }
    
    const cid = uri.substring(7);
    
    // Retrieve metadata from IPFS
    return await retrieveJSONFromIPFS(cid);
  } catch (error) {
    throw new IPFSError(`Failed to retrieve agent metadata from IPFS: ${error.message}`);
  }
}

/**
 * Pin data on IPFS to ensure it remains available
 * 
 * @param {string} cid - The CID of the data to pin
 * @returns {Promise<void>}
 */
async function pinOnIPFS(cid) {
  try {
    const client = getIPFSClient();
    
    // Pin the data
    await client.pin.add(cid);
  } catch (error) {
    throw new IPFSError(`Failed to pin data on IPFS: ${error.message}`);
  }
}

/**
 * Unpin data from IPFS
 * 
 * @param {string} cid - The CID of the data to unpin
 * @returns {Promise<void>}
 */
async function unpinFromIPFS(cid) {
  try {
    const client = getIPFSClient();
    
    // Unpin the data
    await client.pin.rm(cid);
  } catch (error) {
    throw new IPFSError(`Failed to unpin data from IPFS: ${error.message}`);
  }
}

/**
 * Check if data is available on IPFS
 * 
 * @param {string} cid - The CID of the data to check
 * @returns {Promise<boolean>} Whether the data is available
 */
async function isAvailableOnIPFS(cid) {
  try {
    const client = getIPFSClient();
    
    // Try to get the data
    for await (const _ of client.cat(cid, { timeout: 5000, length: 1 })) {
      // If we get here, the data is available
      return true;
    }
    
    return true;
  } catch (error) {
    // If we get an error, the data is not available
    return false;
  }
}

module.exports = {
  initializeIPFS,
  getIPFSClient,
  storeOnIPFS,
  retrieveFromIPFS,
  storeJSONOnIPFS,
  retrieveJSONFromIPFS,
  storeMetadataOnIPFS,
  retrieveMetadataFromIPFS,
  pinOnIPFS,
  unpinFromIPFS,
  isAvailableOnIPFS
}; 