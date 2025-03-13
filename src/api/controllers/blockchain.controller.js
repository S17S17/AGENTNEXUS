/**
 * Blockchain Controller
 * 
 * Handles API requests related to blockchain operations
 */

const { 
  publishToBlockchain, 
  verifyOnBlockchain, 
  updateOnBlockchain,
  deactivateOnBlockchain,
  getOwnerAgentsFromBlockchain,
  verifyOwnershipOnBlockchain
} = require('../../blockchain/registry');
const { uploadMetadataToIPFS, getMetadataFromIPFS } = require('../../blockchain/ipfs');
const { validateMetadata } = require('../../blockchain/metadata');
const { BlockchainError } = require('../../core/errors');
const { 
  getCachedBlockchainStatus, 
  getCachedMetadata,
  cacheMetadata,
  getCachedTransactions,
  invalidateMetadataCache
} = require('../../blockchain/cache');

/**
 * Register an agent on the blockchain
 * 
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
async function registerAgent(req, res, next) {
  try {
    const { id, did, metadata, ownerId } = req.body;
    
    // Validate request body
    if (!id) return res.status(400).json({ error: 'Agent ID is required' });
    if (!did) return res.status(400).json({ error: 'Agent DID is required' });
    if (!metadata) return res.status(400).json({ error: 'Agent metadata is required' });
    if (!ownerId) return res.status(400).json({ error: 'Owner ID is required' });
    
    // Validate metadata
    const validationResult = validateMetadata(metadata);
    if (!validationResult.valid) {
      return res.status(400).json({ 
        error: 'Invalid metadata', 
        details: validationResult.errors 
      });
    }
    
    // Upload metadata to IPFS
    const metadataUri = await uploadMetadataToIPFS(metadata);
    
    // Register agent on blockchain
    const result = await publishToBlockchain({
      id,
      did,
      metadataUri,
      ownerId
    });
    
    // Return success response
    res.status(201).json({
      message: 'Agent registered successfully',
      transactionHash: result.transactionHash,
      agentId: id,
      metadataUri
    });
  } catch (error) {
    if (error instanceof BlockchainError) {
      return res.status(400).json({ error: error.message });
    }
    next(error);
  }
}

/**
 * Get agent data from the blockchain
 * 
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
async function getAgent(req, res, next) {
  try {
    const { id } = req.params;
    
    // Validate request parameters
    if (!id) return res.status(400).json({ error: 'Agent ID is required' });
    
    // Get agent data from blockchain
    const agentData = await verifyOnBlockchain(id);
    
    // Get metadata from IPFS
    let metadata = await getCachedMetadata(agentData.metadataUri);
    if (!metadata) {
      metadata = await getMetadataFromIPFS(agentData.metadataUri);
      // Cache the metadata
      await cacheMetadata(agentData.metadataUri, metadata);
    }
    
    // Return agent data with metadata
    res.status(200).json({
      ...agentData,
      metadata
    });
  } catch (error) {
    if (error instanceof BlockchainError) {
      return res.status(404).json({ error: error.message });
    }
    next(error);
  }
}

/**
 * Update agent metadata on the blockchain
 * 
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
async function updateAgent(req, res, next) {
  try {
    const { id } = req.params;
    const { metadata } = req.body;
    
    // Validate request parameters
    if (!id) return res.status(400).json({ error: 'Agent ID is required' });
    if (!metadata) return res.status(400).json({ error: 'Agent metadata is required' });
    
    // Verify agent exists
    const agentData = await verifyOnBlockchain(id);
    
    // Verify ownership if user is authenticated
    if (req.user && req.user.id !== agentData.ownerId) {
      return res.status(403).json({ error: 'You do not have permission to update this agent' });
    }
    
    // Validate metadata
    const validationResult = validateMetadata(metadata);
    if (!validationResult.valid) {
      return res.status(400).json({ 
        error: 'Invalid metadata', 
        details: validationResult.errors 
      });
    }
    
    // Upload updated metadata to IPFS
    const metadataUri = await uploadMetadataToIPFS(metadata);
    
    // Invalidate metadata cache
    await invalidateMetadataCache(agentData.metadataUri);
    
    // Update agent on blockchain
    const result = await updateOnBlockchain({
      id,
      metadataUri
    });
    
    // Return success response
    res.status(200).json({
      message: 'Agent updated successfully',
      transactionHash: result.transactionHash,
      agentId: id,
      metadataUri
    });
  } catch (error) {
    if (error instanceof BlockchainError) {
      return res.status(400).json({ error: error.message });
    }
    next(error);
  }
}

/**
 * Deactivate an agent on the blockchain
 * 
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
async function deactivateAgent(req, res, next) {
  try {
    const { id } = req.params;
    
    // Validate request parameters
    if (!id) return res.status(400).json({ error: 'Agent ID is required' });
    
    // Verify agent exists
    const agentData = await verifyOnBlockchain(id);
    
    // Verify ownership if user is authenticated
    if (req.user && req.user.id !== agentData.ownerId) {
      return res.status(403).json({ error: 'You do not have permission to deactivate this agent' });
    }
    
    // Deactivate agent on blockchain
    const result = await deactivateOnBlockchain(id);
    
    // Return success response
    res.status(200).json({
      message: 'Agent deactivated successfully',
      transactionHash: result.transactionHash,
      agentId: id
    });
  } catch (error) {
    if (error instanceof BlockchainError) {
      return res.status(400).json({ error: error.message });
    }
    next(error);
  }
}

/**
 * Get all agents for an owner from the blockchain
 * 
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
async function getOwnerAgents(req, res, next) {
  try {
    const { ownerId } = req.params;
    
    // Validate request parameters
    if (!ownerId) return res.status(400).json({ error: 'Owner ID is required' });
    
    // Get owner agents from blockchain
    const agents = await getOwnerAgentsFromBlockchain(ownerId);
    
    // Return agents
    res.status(200).json({
      ownerId,
      agents,
      count: agents.length
    });
  } catch (error) {
    if (error instanceof BlockchainError) {
      return res.status(400).json({ error: error.message });
    }
    next(error);
  }
}

/**
 * Verify agent ownership on the blockchain
 * 
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
async function verifyOwnership(req, res, next) {
  try {
    const { agentId, ownerId } = req.params;
    
    // Validate request parameters
    if (!agentId) return res.status(400).json({ error: 'Agent ID is required' });
    if (!ownerId) return res.status(400).json({ error: 'Owner ID is required' });
    
    // Verify ownership
    const isOwner = await verifyOwnershipOnBlockchain(agentId, ownerId);
    
    // Return result
    res.status(200).json({
      agentId,
      ownerId,
      isOwner
    });
  } catch (error) {
    if (error instanceof BlockchainError) {
      return res.status(400).json({ error: error.message });
    }
    next(error);
  }
}

/**
 * Get blockchain status
 * 
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
async function getBlockchainStatus(req, res, next) {
  try {
    // Get blockchain status from cache
    const status = await getCachedBlockchainStatus();
    
    // Return status
    res.status(200).json(status);
  } catch (error) {
    if (error instanceof BlockchainError) {
      return res.status(400).json({ error: error.message });
    }
    next(error);
  }
}

/**
 * Get recent transactions
 * 
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
async function getRecentTransactions(req, res, next) {
  try {
    const limit = parseInt(req.query.limit) || 10;
    
    // Get recent transactions from cache
    const transactions = await getCachedTransactions(limit);
    
    // Return transactions
    res.status(200).json({
      transactions,
      count: transactions.length
    });
  } catch (error) {
    if (error instanceof BlockchainError) {
      return res.status(400).json({ error: error.message });
    }
    next(error);
  }
}

module.exports = {
  registerAgent,
  getAgent,
  updateAgent,
  deactivateAgent,
  getOwnerAgents,
  verifyOwnership,
  getBlockchainStatus,
  getRecentTransactions
}; 