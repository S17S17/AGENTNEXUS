/**
 * Blockchain Setup
 * 
 * This module provides functionality for setting up connections to the
 * Polygon blockchain and initializing contract instances.
 */

const { ethers } = require('ethers');
const { BlockchainError } = require('../core/errors');
const RegistryABI = require('./abi/Registry.json');
require('dotenv').config();

// Cached blockchain components
let provider = null;
let signer = null;
let registryContract = null;

/**
 * Initialize blockchain components
 * 
 * @param {Object} options - Initialization options
 * @param {string} options.rpcUrl - The RPC URL to connect to (defaults to env var)
 * @param {string} options.privateKey - The private key to use (defaults to env var)
 * @param {string} options.contractAddress - The registry contract address (defaults to env var)
 * @returns {Promise<Object>} The initialized blockchain components
 */
async function initializeBlockchain(options = {}) {
  try {
    // Get options with defaults from environment variables
    const rpcUrl = options.rpcUrl || process.env.POLYGON_RPC_URL;
    const privateKey = options.privateKey || process.env.POLYGON_PRIVATE_KEY;
    const contractAddress = options.contractAddress || process.env.REGISTRY_CONTRACT_ADDRESS;
    
    // Validate required options
    if (!rpcUrl) {
      throw new BlockchainError('RPC URL is required. Set POLYGON_RPC_URL in .env or provide in options.');
    }
    
    if (!privateKey) {
      throw new BlockchainError('Private key is required. Set POLYGON_PRIVATE_KEY in .env or provide in options.');
    }
    
    if (!contractAddress) {
      throw new BlockchainError('Contract address is required. Set REGISTRY_CONTRACT_ADDRESS in .env or provide in options.');
    }
    
    // Initialize provider
    provider = new ethers.providers.JsonRpcProvider(rpcUrl);
    
    // Initialize signer
    signer = new ethers.Wallet(privateKey, provider);
    
    // Initialize registry contract
    registryContract = new ethers.Contract(
      contractAddress,
      RegistryABI.abi,
      signer
    );
    
    // Test connection
    const network = await provider.getNetwork();
    const balance = await provider.getBalance(signer.address);
    
    console.log(`Connected to network: ${network.name} (chainId: ${network.chainId})`);
    console.log(`Signer address: ${signer.address}`);
    console.log(`Signer balance: ${ethers.utils.formatEther(balance)} ETH`);
    console.log(`Registry contract address: ${contractAddress}`);
    
    return {
      provider,
      signer,
      registryContract
    };
  } catch (error) {
    throw new BlockchainError(`Failed to initialize blockchain: ${error.message}`);
  }
}

/**
 * Get blockchain components
 * 
 * @returns {Object} The blockchain components
 */
function getBlockchainComponents() {
  if (!provider || !signer || !registryContract) {
    console.warn('Blockchain components not initialized. Call initializeBlockchain() first.');
  }
  
  return {
    provider,
    signer,
    registryContract
  };
}

/**
 * Wait for a transaction to be mined
 * 
 * @param {string} txHash - The transaction hash
 * @param {number} confirmations - The number of confirmations to wait for
 * @returns {Promise<Object>} The transaction receipt
 */
async function waitForTransaction(txHash, confirmations = 1) {
  try {
    if (!provider) {
      throw new BlockchainError('Provider not initialized');
    }
    
    console.log(`Waiting for transaction ${txHash} to be mined...`);
    
    // Wait for transaction to be mined
    const receipt = await provider.waitForTransaction(txHash, confirmations);
    
    console.log(`Transaction mined in block ${receipt.blockNumber}`);
    
    return receipt;
  } catch (error) {
    throw new BlockchainError(`Failed to wait for transaction: ${error.message}`);
  }
}

/**
 * Get gas price estimate
 * 
 * @returns {Promise<BigNumber>} The gas price in wei
 */
async function getGasPrice() {
  try {
    if (!provider) {
      throw new BlockchainError('Provider not initialized');
    }
    
    const gasPrice = await provider.getGasPrice();
    return gasPrice;
  } catch (error) {
    throw new BlockchainError(`Failed to get gas price: ${error.message}`);
  }
}

/**
 * Estimate gas for a transaction
 * 
 * @param {Object} tx - The transaction object
 * @returns {Promise<BigNumber>} The estimated gas
 */
async function estimateGas(tx) {
  try {
    if (!provider) {
      throw new BlockchainError('Provider not initialized');
    }
    
    const gasEstimate = await provider.estimateGas(tx);
    return gasEstimate;
  } catch (error) {
    throw new BlockchainError(`Failed to estimate gas: ${error.message}`);
  }
}

module.exports = {
  initializeBlockchain,
  getBlockchainComponents,
  waitForTransaction,
  getGasPrice,
  estimateGas
}; 