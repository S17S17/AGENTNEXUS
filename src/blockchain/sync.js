/**
 * Blockchain Sync Service
 * 
 * This module provides functionality for synchronizing blockchain data
 * with the database and handling blockchain events.
 */

const { registerEventHandler, startEventListener, stopEventListener } = require('./events');
const { retrieveAgentMetadata } = require('./ipfs');
const { BlockchainError } = require('../core/errors');

// Import database models (adjust based on your actual model structure)
const Agent = require('../models/agent.model');
const Transaction = require('../models/transaction.model');

/**
 * Initialize blockchain sync service
 * 
 * @param {Object} options - Initialization options
 * @param {boolean} options.processHistorical - Whether to process historical events
 * @param {number} options.fromBlock - The block to start processing from
 * @returns {Promise<boolean>} Whether the service was initialized
 */
async function initializeSyncService(options = {}) {
  try {
    console.log('Initializing blockchain sync service...');
    
    // Register event handlers
    registerAgentEventHandlers();
    
    // Start event listener
    await startEventListener({
      historical: options.processHistorical || false,
      fromBlock: options.fromBlock || 0
    });
    
    console.log('Blockchain sync service initialized');
    return true;
  } catch (error) {
    console.error('Failed to initialize blockchain sync service:', error);
    return false;
  }
}

/**
 * Register handlers for agent-related events
 */
function registerAgentEventHandlers() {
  // Handler for AgentRegistered events
  registerEventHandler('AgentRegistered', async (agentId, did, metadataUri, ownerId, event) => {
    try {
      console.log(`Processing AgentRegistered event for agent ${agentId}`);
      
      // Get metadata from IPFS if available
      let metadata = null;
      try {
        if (metadataUri && metadataUri.startsWith('ipfs://')) {
          metadata = await retrieveAgentMetadata(metadataUri);
        }
      } catch (error) {
        console.warn(`Failed to retrieve metadata: ${error.message}`);
      }
      
      // Check if agent already exists in database
      const existingAgent = await Agent.findOne({ blockchainId: agentId });
      
      if (existingAgent) {
        console.log(`Agent ${agentId} already exists in database, updating...`);
        
        // Update existing agent
        existingAgent.did = did;
        existingAgent.metadataUri = metadataUri;
        existingAgent.ownerId = ownerId;
        existingAgent.active = true;
        existingAgent.metadata = metadata;
        existingAgent.lastSyncedBlock = event.blockNumber;
        
        await existingAgent.save();
      } else {
        console.log(`Creating new agent ${agentId} in database...`);
        
        // Create new agent
        const newAgent = new Agent({
          blockchainId: agentId,
          did,
          metadataUri,
          ownerId,
          active: true,
          metadata,
          registeredAt: new Date(),
          lastSyncedBlock: event.blockNumber
        });
        
        await newAgent.save();
      }
      
      // Record transaction
      await recordTransaction(event, 'AgentRegistered', {
        agentId,
        did,
        metadataUri,
        ownerId
      });
      
      console.log(`Successfully processed AgentRegistered event for agent ${agentId}`);
    } catch (error) {
      console.error(`Error processing AgentRegistered event for agent ${agentId}:`, error);
    }
  });
  
  // Handler for AgentUpdated events
  registerEventHandler('AgentUpdated', async (agentId, metadataUri, event) => {
    try {
      console.log(`Processing AgentUpdated event for agent ${agentId}`);
      
      // Get metadata from IPFS if available
      let metadata = null;
      try {
        if (metadataUri && metadataUri.startsWith('ipfs://')) {
          metadata = await retrieveAgentMetadata(metadataUri);
        }
      } catch (error) {
        console.warn(`Failed to retrieve metadata: ${error.message}`);
      }
      
      // Update agent in database
      const agent = await Agent.findOne({ blockchainId: agentId });
      
      if (!agent) {
        console.warn(`Agent ${agentId} not found in database, skipping update`);
        return;
      }
      
      // Update agent
      agent.metadataUri = metadataUri;
      agent.metadata = metadata;
      agent.updatedAt = new Date();
      agent.lastSyncedBlock = event.blockNumber;
      
      await agent.save();
      
      // Record transaction
      await recordTransaction(event, 'AgentUpdated', {
        agentId,
        metadataUri
      });
      
      console.log(`Successfully processed AgentUpdated event for agent ${agentId}`);
    } catch (error) {
      console.error(`Error processing AgentUpdated event for agent ${agentId}:`, error);
    }
  });
  
  // Handler for AgentDeactivated events
  registerEventHandler('AgentDeactivated', async (agentId, event) => {
    try {
      console.log(`Processing AgentDeactivated event for agent ${agentId}`);
      
      // Update agent in database
      const agent = await Agent.findOne({ blockchainId: agentId });
      
      if (!agent) {
        console.warn(`Agent ${agentId} not found in database, skipping deactivation`);
        return;
      }
      
      // Update agent
      agent.active = false;
      agent.updatedAt = new Date();
      agent.lastSyncedBlock = event.blockNumber;
      
      await agent.save();
      
      // Record transaction
      await recordTransaction(event, 'AgentDeactivated', {
        agentId
      });
      
      console.log(`Successfully processed AgentDeactivated event for agent ${agentId}`);
    } catch (error) {
      console.error(`Error processing AgentDeactivated event for agent ${agentId}:`, error);
    }
  });
  
  // Handler for AgentReactivated events
  registerEventHandler('AgentReactivated', async (agentId, event) => {
    try {
      console.log(`Processing AgentReactivated event for agent ${agentId}`);
      
      // Update agent in database
      const agent = await Agent.findOne({ blockchainId: agentId });
      
      if (!agent) {
        console.warn(`Agent ${agentId} not found in database, skipping reactivation`);
        return;
      }
      
      // Update agent
      agent.active = true;
      agent.updatedAt = new Date();
      agent.lastSyncedBlock = event.blockNumber;
      
      await agent.save();
      
      // Record transaction
      await recordTransaction(event, 'AgentReactivated', {
        agentId
      });
      
      console.log(`Successfully processed AgentReactivated event for agent ${agentId}`);
    } catch (error) {
      console.error(`Error processing AgentReactivated event for agent ${agentId}:`, error);
    }
  });
  
  console.log('Registered handlers for agent events');
}

/**
 * Record a blockchain transaction in the database
 * 
 * @param {Object} event - The blockchain event
 * @param {string} eventType - The type of event
 * @param {Object} data - The event data
 */
async function recordTransaction(event, eventType, data) {
  try {
    const transaction = new Transaction({
      transactionHash: event.transactionHash,
      blockNumber: event.blockNumber,
      eventType,
      data,
      timestamp: new Date()
    });
    
    await transaction.save();
    console.log(`Recorded ${eventType} transaction ${event.transactionHash}`);
  } catch (error) {
    console.error(`Error recording transaction:`, error);
  }
}

/**
 * Manually sync an agent from the blockchain
 * 
 * @param {string} agentId - The agent ID
 * @returns {Promise<Object>} The synced agent
 */
async function syncAgent(agentId) {
  try {
    // This function would use the registry.js functions to get agent data
    // from the blockchain and update the database
    // Implementation depends on your specific requirements
    
    throw new Error('Not implemented');
  } catch (error) {
    throw new BlockchainError(`Failed to sync agent: ${error.message}`);
  }
}

/**
 * Shutdown the blockchain sync service
 * 
 * @returns {Promise<boolean>} Whether the service was shut down
 */
async function shutdownSyncService() {
  try {
    console.log('Shutting down blockchain sync service...');
    
    // Stop event listener
    await stopEventListener();
    
    console.log('Blockchain sync service shut down');
    return true;
  } catch (error) {
    console.error('Failed to shut down blockchain sync service:', error);
    return false;
  }
}

module.exports = {
  initializeSyncService,
  shutdownSyncService,
  syncAgent
}; 