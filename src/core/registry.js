/**
 * Agent Registry
 * 
 * This module provides functionality for registering, discovering,
 * and managing agents in the AGENTNEXUS ecosystem.
 */

const { v4: uuidv4 } = require('uuid');
const { ValidationError, NotFoundError, AuthorizationError } = require('./errors');
const { createDID, verifyDID, createVerifiableCredential, verifyCredential } = require('./identity');
const { storeMetadataOnIPFS, retrieveMetadataFromIPFS } = require('./ipfs');
const { createUAISMessage, validateUAISMessage } = require('./uais');
const db = require('./database');

// Collection name for agent registry
const REGISTRY_COLLECTION = 'agent_registry';

/**
 * Register a new agent in the registry
 * 
 * @param {Object} agentData - The agent data
 * @param {string} agentData.name - The agent name
 * @param {string} agentData.description - The agent description
 * @param {string} agentData.version - The agent version
 * @param {string} agentData.ownerId - The ID of the agent owner
 * @param {Array<string>} agentData.capabilities - The agent capabilities
 * @param {Object} agentData.metadata - Additional agent metadata
 * @param {Object} options - Additional options
 * @returns {Promise<Object>} The registered agent
 */
async function registerAgent(agentData, options = {}) {
  // Validate required fields
  if (!agentData.name) throw new ValidationError('Agent name is required');
  if (!agentData.description) throw new ValidationError('Agent description is required');
  if (!agentData.version) throw new ValidationError('Agent version is required');
  if (!agentData.ownerId) throw new ValidationError('Owner ID is required');
  
  try {
    // Generate agent ID
    const agentId = uuidv4();
    
    // Create DID for the agent
    const did = await createDID(agentId, {
      quantumResistant: options.quantumResistant || false,
      controller: agentData.ownerId
    });
    
    // Store metadata on IPFS if enabled
    let metadataUri = null;
    if (options.storeMetadataOnIPFS && agentData.metadata) {
      metadataUri = await storeMetadataOnIPFS(agentData.metadata);
    }
    
    // Create agent record
    const agent = {
      id: agentId,
      name: agentData.name,
      description: agentData.description,
      version: agentData.version,
      did,
      ownerId: agentData.ownerId,
      capabilities: agentData.capabilities || [],
      metadataUri,
      status: 'active',
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    // Store agent in database
    const collection = await db.getCollection(REGISTRY_COLLECTION);
    await collection.insertOne(agent);
    
    // Create verifiable credential for the agent
    if (options.createCredential) {
      const credential = await createVerifiableCredential({
        issuer: agentData.ownerId,
        subject: did,
        claims: {
          name: agentData.name,
          type: 'Agent',
          capabilities: agentData.capabilities || []
        },
        expiresIn: options.credentialExpiresIn || '1y'
      });
      
      // Update agent with credential
      await collection.updateOne(
        { id: agentId },
        { $set: { credential, updatedAt: new Date() } }
      );
      
      agent.credential = credential;
    }
    
    return agent;
  } catch (error) {
    throw new Error(`Failed to register agent: ${error.message}`);
  }
}

/**
 * Get an agent by ID
 * 
 * @param {string} agentId - The agent ID
 * @returns {Promise<Object>} The agent
 */
async function getAgentById(agentId) {
  try {
    const collection = await db.getCollection(REGISTRY_COLLECTION);
    const agent = await collection.findOne({ id: agentId });
    
    if (!agent) {
      throw new NotFoundError(`Agent with ID ${agentId} not found`);
    }
    
    // Fetch metadata from IPFS if available
    if (agent.metadataUri) {
      try {
        agent.metadata = await retrieveMetadataFromIPFS(agent.metadataUri);
      } catch (error) {
        console.warn(`Failed to retrieve agent metadata: ${error.message}`);
      }
    }
    
    return agent;
  } catch (error) {
    if (error instanceof NotFoundError) throw error;
    throw new Error(`Failed to get agent: ${error.message}`);
  }
}

/**
 * Get an agent by DID
 * 
 * @param {string} did - The agent DID
 * @returns {Promise<Object>} The agent
 */
async function getAgentByDID(did) {
  try {
    // Verify DID format
    await verifyDID(did);
    
    const collection = await db.getCollection(REGISTRY_COLLECTION);
    const agent = await collection.findOne({ did });
    
    if (!agent) {
      throw new NotFoundError(`Agent with DID ${did} not found`);
    }
    
    // Fetch metadata from IPFS if available
    if (agent.metadataUri) {
      try {
        agent.metadata = await retrieveMetadataFromIPFS(agent.metadataUri);
      } catch (error) {
        console.warn(`Failed to retrieve agent metadata: ${error.message}`);
      }
    }
    
    return agent;
  } catch (error) {
    if (error instanceof NotFoundError) throw error;
    throw new Error(`Failed to get agent by DID: ${error.message}`);
  }
}

/**
 * Update an agent in the registry
 * 
 * @param {string} agentId - The agent ID
 * @param {Object} updateData - The data to update
 * @param {string} requesterId - The ID of the requester
 * @returns {Promise<Object>} The updated agent
 */
async function updateAgent(agentId, updateData, requesterId) {
  try {
    // Get the agent
    const agent = await getAgentById(agentId);
    
    // Check if requester is the owner
    if (agent.ownerId !== requesterId) {
      throw new AuthorizationError('Only the agent owner can update the agent');
    }
    
    // Prepare update object
    const update = {
      ...updateData,
      updatedAt: new Date()
    };
    
    // Remove fields that cannot be updated
    delete update.id;
    delete update.did;
    delete update.ownerId;
    delete update.createdAt;
    
    // Update metadata on IPFS if provided
    if (update.metadata) {
      update.metadataUri = await storeMetadataOnIPFS(update.metadata);
      delete update.metadata;
    }
    
    // Update agent in database
    const collection = await db.getCollection(REGISTRY_COLLECTION);
    await collection.updateOne(
      { id: agentId },
      { $set: update }
    );
    
    // Get updated agent
    return await getAgentById(agentId);
  } catch (error) {
    if (error instanceof NotFoundError || error instanceof AuthorizationError) throw error;
    throw new Error(`Failed to update agent: ${error.message}`);
  }
}

/**
 * Deactivate an agent in the registry
 * 
 * @param {string} agentId - The agent ID
 * @param {string} requesterId - The ID of the requester
 * @returns {Promise<Object>} The deactivated agent
 */
async function deactivateAgent(agentId, requesterId) {
  try {
    // Get the agent
    const agent = await getAgentById(agentId);
    
    // Check if requester is the owner
    if (agent.ownerId !== requesterId) {
      throw new AuthorizationError('Only the agent owner can deactivate the agent');
    }
    
    // Update agent status in database
    const collection = await db.getCollection(REGISTRY_COLLECTION);
    await collection.updateOne(
      { id: agentId },
      { $set: { status: 'inactive', updatedAt: new Date() } }
    );
    
    // Get updated agent
    return await getAgentById(agentId);
  } catch (error) {
    if (error instanceof NotFoundError || error instanceof AuthorizationError) throw error;
    throw new Error(`Failed to deactivate agent: ${error.message}`);
  }
}

/**
 * Delete an agent from the registry
 * 
 * @param {string} agentId - The agent ID
 * @param {string} requesterId - The ID of the requester
 * @returns {Promise<boolean>} Whether the agent was deleted
 */
async function deleteAgent(agentId, requesterId) {
  try {
    // Get the agent
    const agent = await getAgentById(agentId);
    
    // Check if requester is the owner
    if (agent.ownerId !== requesterId) {
      throw new AuthorizationError('Only the agent owner can delete the agent');
    }
    
    // Delete agent from database
    const collection = await db.getCollection(REGISTRY_COLLECTION);
    const result = await collection.deleteOne({ id: agentId });
    
    return result.deletedCount > 0;
  } catch (error) {
    if (error instanceof NotFoundError || error instanceof AuthorizationError) throw error;
    throw new Error(`Failed to delete agent: ${error.message}`);
  }
}

/**
 * Search for agents in the registry
 * 
 * @param {Object} query - The search query
 * @param {Object} options - Search options
 * @returns {Promise<Array<Object>>} The matching agents
 */
async function searchAgents(query = {}, options = {}) {
  try {
    // Prepare database query
    const dbQuery = {};
    
    // Add search criteria
    if (query.name) {
      dbQuery.name = { $regex: query.name, $options: 'i' };
    }
    
    if (query.ownerId) {
      dbQuery.ownerId = query.ownerId;
    }
    
    if (query.capabilities && query.capabilities.length > 0) {
      dbQuery.capabilities = { $all: query.capabilities };
    }
    
    if (query.status) {
      dbQuery.status = query.status;
    } else {
      // Default to active agents only
      dbQuery.status = 'active';
    }
    
    // Prepare pagination options
    const limit = options.limit || 20;
    const skip = options.skip || 0;
    
    // Prepare sort options
    const sort = {};
    if (options.sortBy) {
      sort[options.sortBy] = options.sortOrder === 'asc' ? 1 : -1;
    } else {
      sort.createdAt = -1; // Default sort by creation date, newest first
    }
    
    // Execute query
    const collection = await db.getCollection(REGISTRY_COLLECTION);
    const agents = await collection.find(dbQuery)
      .sort(sort)
      .skip(skip)
      .limit(limit)
      .toArray();
    
    // Get total count
    const total = await collection.countDocuments(dbQuery);
    
    return {
      agents,
      pagination: {
        total,
        limit,
        skip,
        hasMore: skip + agents.length < total
      }
    };
  } catch (error) {
    throw new Error(`Failed to search agents: ${error.message}`);
  }
}

/**
 * Verify an agent's credential
 * 
 * @param {string} agentId - The agent ID
 * @returns {Promise<Object>} The verification result
 */
async function verifyAgentCredential(agentId) {
  try {
    // Get the agent
    const agent = await getAgentById(agentId);
    
    // Check if agent has a credential
    if (!agent.credential) {
      return { verified: false, reason: 'Agent has no credential' };
    }
    
    // Verify the credential
    const verificationResult = await verifyCredential(agent.credential);
    
    return verificationResult;
  } catch (error) {
    if (error instanceof NotFoundError) throw error;
    throw new Error(`Failed to verify agent credential: ${error.message}`);
  }
}

/**
 * Get agents by capability
 * 
 * @param {string} capability - The capability to search for
 * @param {Object} options - Search options
 * @returns {Promise<Array<Object>>} The matching agents
 */
async function getAgentsByCapability(capability, options = {}) {
  return await searchAgents({ capabilities: [capability], status: 'active' }, options);
}

/**
 * Get agents by owner
 * 
 * @param {string} ownerId - The owner ID
 * @param {Object} options - Search options
 * @returns {Promise<Array<Object>>} The matching agents
 */
async function getAgentsByOwner(ownerId, options = {}) {
  return await searchAgents({ ownerId, status: options.includeInactive ? undefined : 'active' }, options);
}

/**
 * Create a UAIS message for an agent
 * 
 * @param {string} agentId - The agent ID
 * @param {string} messageType - The message type
 * @param {Object} content - The message content
 * @returns {Promise<Object>} The UAIS message
 */
async function createAgentMessage(agentId, messageType, content) {
  try {
    // Get the agent
    const agent = await getAgentById(agentId);
    
    // Create UAIS message
    const message = createUAISMessage({
      sender: agent.did,
      messageType,
      content
    });
    
    return message;
  } catch (error) {
    if (error instanceof NotFoundError) throw error;
    throw new Error(`Failed to create agent message: ${error.message}`);
  }
}

/**
 * Validate a UAIS message from an agent
 * 
 * @param {Object} message - The UAIS message
 * @returns {Promise<Object>} The validation result
 */
async function validateAgentMessage(message) {
  try {
    // Validate UAIS message format
    const formatValidation = validateUAISMessage(message);
    if (!formatValidation.valid) {
      return { valid: false, reason: formatValidation.reason };
    }
    
    // Get the agent by DID
    try {
      await getAgentByDID(message.sender);
    } catch (error) {
      return { valid: false, reason: 'Unknown agent DID' };
    }
    
    return { valid: true };
  } catch (error) {
    throw new Error(`Failed to validate agent message: ${error.message}`);
  }
}

module.exports = {
  registerAgent,
  getAgentById,
  getAgentByDID,
  updateAgent,
  deactivateAgent,
  deleteAgent,
  searchAgents,
  verifyAgentCredential,
  getAgentsByCapability,
  getAgentsByOwner,
  createAgentMessage,
  validateAgentMessage
}; 