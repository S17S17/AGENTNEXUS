/**
 * Blockchain API Routes
 * 
 * This module defines the API routes for blockchain functionality.
 */

const express = require('express');
const blockchainController = require('../controllers/blockchain.controller');
const authMiddleware = require('../../core/middleware/auth');

const router = express.Router();

/**
 * @route   POST /api/blockchain/agents
 * @desc    Register an agent on the blockchain
 * @access  Private
 */
router.post('/agents', authMiddleware.authenticate, blockchainController.registerAgent);

/**
 * @route   GET /api/blockchain/agents/:id
 * @desc    Get agent data from the blockchain
 * @access  Public
 */
router.get('/agents/:id', blockchainController.getAgent);

/**
 * @route   PUT /api/blockchain/agents/:id
 * @desc    Update agent data on the blockchain
 * @access  Private
 */
router.put('/agents/:id', authMiddleware.authenticate, blockchainController.updateAgent);

/**
 * @route   DELETE /api/blockchain/agents/:id
 * @desc    Deactivate an agent on the blockchain
 * @access  Private
 */
router.delete('/agents/:id', authMiddleware.authenticate, blockchainController.deactivateAgent);

/**
 * @route   GET /api/blockchain/owners/:ownerId/agents
 * @desc    Get all agents for an owner from the blockchain
 * @access  Public
 */
router.get('/owners/:ownerId/agents', blockchainController.getOwnerAgents);

/**
 * @route   POST /api/blockchain/metadata
 * @desc    Upload agent metadata to IPFS
 * @access  Private
 */
router.post('/metadata', authMiddleware.authenticate, blockchainController.uploadMetadata);

/**
 * @route   GET /api/blockchain/metadata
 * @desc    Get agent metadata from IPFS
 * @access  Public
 */
router.get('/metadata', blockchainController.getMetadata);

/**
 * @route   GET /api/blockchain/status
 * @desc    Get blockchain connection status
 * @access  Public
 */
router.get('/status', blockchainController.getBlockchainStatus);

/**
 * @route   GET /api/blockchain/verify/:agentId/:ownerId
 * @desc    Verify ownership of an agent
 * @access  Public
 */
router.get('/verify/:agentId/:ownerId', blockchainController.verifyOwnership);

/**
 * @route   GET /api/blockchain/transactions
 * @desc    Get recent transactions
 * @access  Public
 */
router.get('/transactions', blockchainController.getRecentTransactions);

module.exports = router; 