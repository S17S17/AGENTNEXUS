const express = require('express');
const router = express.Router();
const { authenticateJWT } = require('../../core/middleware/auth');
const agentController = require('../controllers/agent.controller');

/**
 * @route GET /api/v1/agents
 * @description Get a list of all agents with optional filtering
 * @access Public
 */
router.get('/', agentController.getAllAgents);

/**
 * @route GET /api/v1/agents/:id
 * @description Get a specific agent by ID
 * @access Public
 */
router.get('/:id', agentController.getAgentById);

/**
 * @route POST /api/v1/agents
 * @description Register a new agent
 * @access Private
 */
router.post('/', authenticateJWT, agentController.registerAgent);

/**
 * @route PUT /api/v1/agents/:id
 * @description Update an existing agent
 * @access Private
 */
router.put('/:id', authenticateJWT, agentController.updateAgent);

/**
 * @route DELETE /api/v1/agents/:id
 * @description Deactivate an agent
 * @access Private
 */
router.delete('/:id', authenticateJWT, agentController.deactivateAgent);

/**
 * @route GET /api/v1/agents/:id/capabilities
 * @description Get the capabilities of a specific agent
 * @access Public
 */
router.get('/:id/capabilities', agentController.getAgentCapabilities);

/**
 * @route POST /api/v1/agents/:id/tasks
 * @description Submit a task to an agent
 * @access Public (with optional authentication)
 */
router.post('/:id/tasks', agentController.submitTask);

/**
 * @route GET /api/v1/agents/:id/tasks/:taskId
 * @description Get the status or result of a task
 * @access Public (with task token)
 */
router.get('/:id/tasks/:taskId', agentController.getTaskStatus);

/**
 * @route POST /api/v1/agents/:id/conversations
 * @description Start a new conversation with an agent
 * @access Public (with optional authentication)
 */
router.post('/:id/conversations', agentController.startConversation);

/**
 * @route POST /api/v1/agents/:id/conversations/:conversationId/messages
 * @description Send a message in an existing conversation
 * @access Public (with conversation token)
 */
router.post('/:id/conversations/:conversationId/messages', agentController.sendMessage);

/**
 * @route GET /api/v1/agents/:id/conversations/:conversationId
 * @description Get the history of a conversation
 * @access Public (with conversation token)
 */
router.get('/:id/conversations/:conversationId', agentController.getConversationHistory);

/**
 * @route GET /api/v1/agents/:id/relationships
 * @description Get the relationships of an agent with other agents
 * @access Public
 */
router.get('/:id/relationships', agentController.getAgentRelationships);

/**
 * @route POST /api/v1/agents/:id/relationships
 * @description Create a relationship between agents
 * @access Private
 */
router.post('/:id/relationships', authenticateJWT, agentController.createAgentRelationship);

/**
 * @route GET /api/v1/agents/:id/metrics
 * @description Get performance metrics for an agent
 * @access Public
 */
router.get('/:id/metrics', agentController.getAgentMetrics);

/**
 * @route GET /api/v1/agents/:id/versions
 * @description Get version history of an agent
 * @access Public
 */
router.get('/:id/versions', agentController.getAgentVersions);

/**
 * @route POST /api/v1/agents/:id/versions
 * @description Create a new version of an agent
 * @access Private
 */
router.post('/:id/versions', authenticateJWT, agentController.createAgentVersion);

module.exports = router; 