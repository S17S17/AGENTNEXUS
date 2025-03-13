/**
 * Blockchain Registry
 * 
 * This module provides functionality for interacting with the
 * registry smart contract on the Polygon blockchain.
 */

const { ethers } = require('ethers');
const { BlockchainError } = require('../core/errors');
const { getBlockchainComponents, waitForTransaction } = require('./setup');
const { 
  cacheAgentData, 
  getCachedAgentData,
  cacheOwnerAgents,
  getCachedOwnerAgents,
  invalidateAgentCache,
  invalidateOwnerAgentsCache
} = require('./cache');

/**
 * Publish agent data to the blockchain registry
 * 
 * @param {Object} agentData - The agent data to publish
 * @param {string} agentData.id - The agent ID
 * @param {string} agentData.did - The agent DID
 * @param {string} agentData.metadataUri - The IPFS URI of the agent metadata
 * @param {string} agentData.ownerId - The ID of the agent owner
 * @returns {Promise<Object>} The transaction receipt
 */
async function publishToBlockchain(agentData) {
  try {
    // Get blockchain components
    const { registryContract, signer } = getBlockchainComponents();
    
    if (!registryContract) {
      throw new BlockchainError('Registry contract not initialized');
    }
    
    if (!signer) {
      throw new BlockchainError('Signer not initialized');
    }
    
    // Validate required fields
    if (!agentData.id) throw new BlockchainError('Agent ID is required');
    if (!agentData.did) throw new BlockchainError('Agent DID is required');
    if (!agentData.metadataUri) throw new BlockchainError('Agent metadata URI is required');
    if (!agentData.ownerId) throw new BlockchainError('Agent owner ID is required');
    
    // Prepare transaction
    const tx = await registryContract.registerAgent(
      agentData.id,
      agentData.did,
      agentData.metadataUri,
      agentData.ownerId
    );
    
    // Wait for transaction to be mined
    const receipt = await waitForTransaction(tx.hash, 1);
    
    // Invalidate cache for owner agents
    await invalidateOwnerAgentsCache(agentData.ownerId);
    
    // Return transaction receipt with additional data
    return {
      ...receipt,
      agentId: agentData.id,
      transactionHash: tx.hash
    };
  } catch (error) {
    throw new BlockchainError(`Failed to publish agent to blockchain: ${error.message}`);
  }
}

/**
 * Verify agent data on the blockchain registry
 * 
 * @param {string} agentId - The agent ID
 * @returns {Promise<Object>} The agent data from the blockchain
 */
async function verifyOnBlockchain(agentId) {
  try {
    // Check cache first
    const cachedAgent = await getCachedAgentData(agentId);
    if (cachedAgent) {
      console.log(`Retrieved agent ${agentId} from cache`);
      return cachedAgent;
    }
    
    // Get blockchain components
    const { registryContract } = getBlockchainComponents();
    
    if (!registryContract) {
      throw new BlockchainError('Registry contract not initialized');
    }
    
    // Get agent data from blockchain
    const agentData = await registryContract.getAgent(agentId);
    
    // Check if agent exists
    if (!agentData.exists) {
      throw new BlockchainError(`Agent with ID ${agentId} not found on blockchain`);
    }
    
    // Format agent data
    const formattedData = {
      id: agentId,
      did: agentData.did,
      metadataUri: agentData.metadataUri,
      ownerId: agentData.ownerId,
      registeredAt: new Date(agentData.registeredAt.toNumber() * 1000),
      updatedAt: new Date(agentData.updatedAt.toNumber() * 1000),
      active: agentData.active
    };
    
    // Cache agent data
    await cacheAgentData(agentId, formattedData);
    
    // Return agent data
    return formattedData;
  } catch (error) {
    throw new BlockchainError(`Failed to verify agent on blockchain: ${error.message}`);
  }
}

/**
 * Update agent data on the blockchain registry
 * 
 * @param {Object} updateData - The data to update
 * @param {string} updateData.id - The agent ID
 * @param {string} updateData.metadataUri - The new IPFS URI of the agent metadata
 * @returns {Promise<Object>} The transaction receipt
 */
async function updateOnBlockchain(updateData) {
  try {
    // Get blockchain components
    const { registryContract, signer } = getBlockchainComponents();
    
    if (!registryContract) {
      throw new BlockchainError('Registry contract not initialized');
    }
    
    if (!signer) {
      throw new BlockchainError('Signer not initialized');
    }
    
    // Validate required fields
    if (!updateData.id) throw new BlockchainError('Agent ID is required');
    if (!updateData.metadataUri) throw new BlockchainError('Agent metadata URI is required');
    
    // Prepare transaction
    const tx = await registryContract.updateAgent(
      updateData.id,
      updateData.metadataUri
    );
    
    // Wait for transaction to be mined
    const receipt = await waitForTransaction(tx.hash, 1);
    
    // Invalidate cache for agent
    await invalidateAgentCache(updateData.id);
    
    // Return transaction receipt with additional data
    return {
      ...receipt,
      agentId: updateData.id,
      transactionHash: tx.hash
    };
  } catch (error) {
    throw new BlockchainError(`Failed to update agent on blockchain: ${error.message}`);
  }
}

/**
 * Deactivate agent on the blockchain registry
 * 
 * @param {string} agentId - The agent ID
 * @returns {Promise<Object>} The transaction receipt
 */
async function deactivateOnBlockchain(agentId) {
  try {
    // Get blockchain components
    const { registryContract, signer } = getBlockchainComponents();
    
    if (!registryContract) {
      throw new BlockchainError('Registry contract not initialized');
    }
    
    if (!signer) {
      throw new BlockchainError('Signer not initialized');
    }
    
    // Prepare transaction
    const tx = await registryContract.deactivateAgent(agentId);
    
    // Wait for transaction to be mined
    const receipt = await waitForTransaction(tx.hash, 1);
    
    // Invalidate cache for agent
    await invalidateAgentCache(agentId);
    
    // Get agent data to invalidate owner cache
    try {
      const agentData = await registryContract.getAgent(agentId);
      if (agentData.exists) {
        await invalidateOwnerAgentsCache(agentData.ownerId);
      }
    } catch (error) {
      console.warn(`Failed to invalidate owner cache: ${error.message}`);
    }
    
    // Return transaction receipt with additional data
    return {
      ...receipt,
      agentId,
      transactionHash: tx.hash
    };
  } catch (error) {
    throw new BlockchainError(`Failed to deactivate agent on blockchain: ${error.message}`);
  }
}

/**
 * Get all agents for an owner from the blockchain registry
 * 
 * @param {string} ownerId - The owner ID
 * @returns {Promise<Array<Object>>} The agent data from the blockchain
 */
async function getOwnerAgentsFromBlockchain(ownerId) {
  try {
    // Check cache first
    const cachedAgents = await getCachedOwnerAgents(ownerId);
    if (cachedAgents) {
      console.log(`Retrieved owner agents for ${ownerId} from cache`);
      return cachedAgents;
    }
    
    // Get blockchain components
    const { registryContract } = getBlockchainComponents();
    
    if (!registryContract) {
      throw new BlockchainError('Registry contract not initialized');
    }
    
    // Get agent IDs for owner
    const agentIds = await registryContract.getOwnerAgents(ownerId);
    
    // Get agent data for each ID
    const agents = await Promise.all(
      agentIds.map(async (id) => {
        try {
          return await verifyOnBlockchain(id);
        } catch (error) {
          console.warn(`Failed to get agent ${id}: ${error.message}`);
          return null;
        }
      })
    );
    
    // Filter out null values
    const validAgents = agents.filter(agent => agent !== null);
    
    // Cache owner agents
    await cacheOwnerAgents(ownerId, validAgents);
    
    return validAgents;
  } catch (error) {
    throw new BlockchainError(`Failed to get owner agents from blockchain: ${error.message}`);
  }
}

/**
 * Verify agent ownership on the blockchain registry
 * 
 * @param {string} agentId - The agent ID
 * @param {string} ownerId - The owner ID
 * @returns {Promise<boolean>} Whether the owner owns the agent
 */
async function verifyOwnershipOnBlockchain(agentId, ownerId) {
  try {
    // Get agent data from blockchain
    const agentData = await verifyOnBlockchain(agentId);
    
    // Check if owner matches
    return agentData.ownerId === ownerId;
  } catch (error) {
    if (error.message.includes('not found')) {
      return false;
    }
    throw new BlockchainError(`Failed to verify ownership on blockchain: ${error.message}`);
  }
}

module.exports = {
  publishToBlockchain,
  verifyOnBlockchain,
  updateOnBlockchain,
  deactivateOnBlockchain,
  getOwnerAgentsFromBlockchain,
  verifyOwnershipOnBlockchain
}; 