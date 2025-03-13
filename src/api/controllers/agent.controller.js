const { v4: uuidv4 } = require('uuid');
const { getDatabaseClients } = require('../../core/database');
const { NotFoundError, ValidationError, AuthorizationError } = require('../../core/errors');
const { createDID, verifyDID } = require('../../core/identity');
const { publishToBlockchain } = require('../../blockchain/registry');
const { validateAgentMetadata } = require('../../validation/metadata');
const { storeMetadataOnIPFS } = require('../../core/ipfs');

/**
 * Get all agents with optional filtering
 */
exports.getAllAgents = async (req, res, next) => {
  try {
    const { 
      capabilities, 
      owner, 
      minTrustScore, 
      page = 1, 
      limit = 20,
      sort = 'trustScore',
      order = 'desc'
    } = req.query;
    
    // Build query filters
    const filters = {};
    
    if (capabilities) {
      filters.capabilities = { $all: capabilities.split(',') };
    }
    
    if (owner) {
      filters.owner = owner;
    }
    
    if (minTrustScore) {
      filters['trustScore.overall'] = { $gte: parseFloat(minTrustScore) };
    }
    
    // Get database client
    const { mongoClient } = getDatabaseClients();
    
    // Calculate pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    // Build sort options
    const sortOptions = {};
    sortOptions[sort] = order === 'desc' ? -1 : 1;
    
    // Query database
    const agents = await mongoClient.models.Agent
      .find(filters)
      .sort(sortOptions)
      .skip(skip)
      .limit(parseInt(limit))
      .lean();
    
    // Get total count for pagination
    const total = await mongoClient.models.Agent.countDocuments(filters);
    
    res.json({
      agents,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(total / parseInt(limit))
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get a specific agent by ID
 */
exports.getAgentById = async (req, res, next) => {
  try {
    const { id } = req.params;
    
    // Get database client
    const { mongoClient } = getDatabaseClients();
    
    // Query database
    const agent = await mongoClient.models.Agent.findOne({ id }).lean();
    
    if (!agent) {
      throw new NotFoundError(`Agent with ID ${id} not found`);
    }
    
    res.json(agent);
  } catch (error) {
    next(error);
  }
};

/**
 * Register a new agent
 */
exports.registerAgent = async (req, res, next) => {
  try {
    const { 
      name, 
      description, 
      version, 
      capabilities, 
      interfaces, 
      endpoints,
      metadata 
    } = req.body;
    
    // Validate required fields
    if (!name || !description || !version || !capabilities || !interfaces) {
      throw new ValidationError('Missing required fields');
    }
    
    // Validate agent metadata
    const validationResult = await validateAgentMetadata(req.body);
    if (!validationResult.valid) {
      throw new ValidationError('Invalid agent metadata', validationResult.errors);
    }
    
    // Create a DID for the agent
    const did = await createDID(req.user.id);
    
    // Store extended metadata on IPFS
    const metadataUri = await storeMetadataOnIPFS(metadata);
    
    // Create agent record
    const agentRecord = {
      id: did,
      name,
      description,
      version,
      owner: req.user.id,
      capabilities,
      interfaces,
      endpoints: endpoints || {},
      metadataUri,
      trustScore: {
        overall: 0,
        dimensions: {
          functionality: 0,
          security: 0,
          performance: 0,
          ethical: 0,
          interoperability: 0
        },
        confidence: 0
      },
      created: new Date(),
      updated: new Date()
    };
    
    // Get database client
    const { mongoClient } = getDatabaseClients();
    
    // Save to database
    const agent = new mongoClient.models.Agent(agentRecord);
    await agent.save();
    
    // Publish to blockchain if enabled
    if (process.env.ENABLE_BLOCKCHAIN === 'true') {
      await publishToBlockchain('registerAgent', agentRecord);
    }
    
    res.status(201).json(agent);
  } catch (error) {
    next(error);
  }
};

/**
 * Update an existing agent
 */
exports.updateAgent = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { 
      name, 
      description, 
      version, 
      capabilities, 
      interfaces, 
      endpoints,
      metadata 
    } = req.body;
    
    // Get database client
    const { mongoClient } = getDatabaseClients();
    
    // Find the agent
    const agent = await mongoClient.models.Agent.findOne({ id });
    
    if (!agent) {
      throw new NotFoundError(`Agent with ID ${id} not found`);
    }
    
    // Check ownership
    if (agent.owner !== req.user.id) {
      throw new AuthorizationError('You do not have permission to update this agent');
    }
    
    // Update fields if provided
    if (name) agent.name = name;
    if (description) agent.description = description;
    if (version) agent.version = version;
    if (capabilities) agent.capabilities = capabilities;
    if (interfaces) agent.interfaces = interfaces;
    if (endpoints) agent.endpoints = endpoints;
    
    // Store updated metadata on IPFS if provided
    if (metadata) {
      agent.metadataUri = await storeMetadataOnIPFS(metadata);
    }
    
    agent.updated = new Date();
    
    // Save changes
    await agent.save();
    
    // Publish to blockchain if enabled
    if (process.env.ENABLE_BLOCKCHAIN === 'true') {
      await publishToBlockchain('updateAgent', agent);
    }
    
    res.json(agent);
  } catch (error) {
    next(error);
  }
};

/**
 * Deactivate an agent
 */
exports.deactivateAgent = async (req, res, next) => {
  try {
    const { id } = req.params;
    
    // Get database client
    const { mongoClient } = getDatabaseClients();
    
    // Find the agent
    const agent = await mongoClient.models.Agent.findOne({ id });
    
    if (!agent) {
      throw new NotFoundError(`Agent with ID ${id} not found`);
    }
    
    // Check ownership
    if (agent.owner !== req.user.id) {
      throw new AuthorizationError('You do not have permission to deactivate this agent');
    }
    
    // Mark as inactive
    agent.active = false;
    agent.updated = new Date();
    
    // Save changes
    await agent.save();
    
    // Publish to blockchain if enabled
    if (process.env.ENABLE_BLOCKCHAIN === 'true') {
      await publishToBlockchain('deactivateAgent', { id });
    }
    
    res.json({ message: 'Agent deactivated successfully', id });
  } catch (error) {
    next(error);
  }
};

/**
 * Get the capabilities of a specific agent
 */
exports.getAgentCapabilities = async (req, res, next) => {
  try {
    const { id } = req.params;
    
    // Get database client
    const { mongoClient } = getDatabaseClients();
    
    // Find the agent
    const agent = await mongoClient.models.Agent.findOne({ id }).lean();
    
    if (!agent) {
      throw new NotFoundError(`Agent with ID ${id} not found`);
    }
    
    // Get detailed capabilities from metadata
    const capabilities = agent.capabilities;
    
    // If the agent has a metadata URI, fetch the detailed capabilities
    let detailedCapabilities = [];
    if (agent.metadataUri) {
      // Fetch metadata from IPFS or other storage
      // This is a placeholder for the actual implementation
      const metadata = { capabilities: [] }; // Placeholder
      detailedCapabilities = metadata.capabilities;
    }
    
    res.json({
      capabilities,
      detailedCapabilities
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Submit a task to an agent
 */
exports.submitTask = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { task, input, parameters, callback } = req.body;
    
    // Validate required fields
    if (!task || !input) {
      throw new ValidationError('Missing required fields: task and input are required');
    }
    
    // Get database client
    const { mongoClient, redisClient } = getDatabaseClients();
    
    // Find the agent
    const agent = await mongoClient.models.Agent.findOne({ id }).lean();
    
    if (!agent) {
      throw new NotFoundError(`Agent with ID ${id} not found`);
    }
    
    // Check if the agent supports the requested task
    if (!agent.capabilities.includes(task)) {
      throw new ValidationError(`Agent does not support the '${task}' capability`);
    }
    
    // Create a task record
    const taskId = `task_${uuidv4()}`;
    const taskRecord = {
      id: taskId,
      agentId: id,
      task,
      input,
      parameters: parameters || {},
      callback,
      status: 'accepted',
      created: new Date(),
      updated: new Date()
    };
    
    // Store task in database
    const taskDoc = new mongoClient.models.Task(taskRecord);
    await taskDoc.save();
    
    // Add task to processing queue
    await redisClient.rPush('agent:tasks', JSON.stringify({
      taskId,
      agentId: id,
      priority: 1
    }));
    
    res.status(202).json({
      taskId,
      status: 'accepted',
      estimatedCompletionTime: new Date(Date.now() + 30000) // Placeholder: 30 seconds
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get the status or result of a task
 */
exports.getTaskStatus = async (req, res, next) => {
  try {
    const { id, taskId } = req.params;
    
    // Get database client
    const { mongoClient } = getDatabaseClients();
    
    // Find the task
    const task = await mongoClient.models.Task.findOne({ 
      id: taskId,
      agentId: id
    }).lean();
    
    if (!task) {
      throw new NotFoundError(`Task with ID ${taskId} not found for agent ${id}`);
    }
    
    res.json(task);
  } catch (error) {
    next(error);
  }
};

/**
 * Start a new conversation with an agent
 */
exports.startConversation = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { initialMessage } = req.body;
    
    // Validate required fields
    if (!initialMessage) {
      throw new ValidationError('Missing required field: initialMessage');
    }
    
    // Get database client
    const { mongoClient } = getDatabaseClients();
    
    // Find the agent
    const agent = await mongoClient.models.Agent.findOne({ id }).lean();
    
    if (!agent) {
      throw new NotFoundError(`Agent with ID ${id} not found`);
    }
    
    // Create a conversation record
    const conversationId = `conv_${uuidv4()}`;
    const userId = req.user ? req.user.id : 'anonymous';
    
    const conversationRecord = {
      id: conversationId,
      agentId: id,
      userId,
      status: 'active',
      created: new Date(),
      updated: new Date(),
      messages: [
        {
          id: `msg_${uuidv4()}`,
          sender: userId,
          content: initialMessage,
          timestamp: new Date()
        }
      ]
    };
    
    // Store conversation in database
    const conversationDoc = new mongoClient.models.Conversation(conversationRecord);
    await conversationDoc.save();
    
    // Generate a token for this conversation
    const token = 'conversation_token_placeholder'; // Placeholder
    
    res.status(201).json({
      conversationId,
      token,
      agent: {
        id: agent.id,
        name: agent.name
      },
      messages: conversationRecord.messages
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Send a message in an existing conversation
 */
exports.sendMessage = async (req, res, next) => {
  try {
    const { id, conversationId } = req.params;
    const { message } = req.body;
    
    // Validate required fields
    if (!message) {
      throw new ValidationError('Missing required field: message');
    }
    
    // Get database client
    const { mongoClient, redisClient } = getDatabaseClients();
    
    // Find the conversation
    const conversation = await mongoClient.models.Conversation.findOne({ 
      id: conversationId,
      agentId: id
    });
    
    if (!conversation) {
      throw new NotFoundError(`Conversation with ID ${conversationId} not found for agent ${id}`);
    }
    
    // Add the message to the conversation
    const messageId = `msg_${uuidv4()}`;
    const userId = req.user ? req.user.id : 'anonymous';
    
    conversation.messages.push({
      id: messageId,
      sender: userId,
      content: message,
      timestamp: new Date()
    });
    
    conversation.updated = new Date();
    
    // Save the updated conversation
    await conversation.save();
    
    // Add message to processing queue for agent response
    await redisClient.rPush('agent:messages', JSON.stringify({
      conversationId,
      agentId: id,
      messageId,
      priority: 1
    }));
    
    res.status(202).json({
      messageId,
      status: 'accepted',
      conversationId
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get the history of a conversation
 */
exports.getConversationHistory = async (req, res, next) => {
  try {
    const { id, conversationId } = req.params;
    
    // Get database client
    const { mongoClient } = getDatabaseClients();
    
    // Find the conversation
    const conversation = await mongoClient.models.Conversation.findOne({ 
      id: conversationId,
      agentId: id
    }).lean();
    
    if (!conversation) {
      throw new NotFoundError(`Conversation with ID ${conversationId} not found for agent ${id}`);
    }
    
    res.json({
      id: conversation.id,
      agentId: conversation.agentId,
      status: conversation.status,
      created: conversation.created,
      updated: conversation.updated,
      messages: conversation.messages
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get the relationships of an agent with other agents
 */
exports.getAgentRelationships = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { type } = req.query;
    
    // Get database client
    const { mongoClient } = getDatabaseClients();
    
    // Build query
    const query = { 
      $or: [
        { sourceAgent: id },
        { targetAgent: id }
      ]
    };
    
    if (type) {
      query.relationshipType = type;
    }
    
    // Find relationships
    const relationships = await mongoClient.models.AgentRelationship.find(query).lean();
    
    res.json(relationships);
  } catch (error) {
    next(error);
  }
};

/**
 * Create a relationship between agents
 */
exports.createAgentRelationship = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { targetAgent, relationshipType, description } = req.body;
    
    // Validate required fields
    if (!targetAgent || !relationshipType) {
      throw new ValidationError('Missing required fields: targetAgent and relationshipType are required');
    }
    
    // Get database client
    const { mongoClient } = getDatabaseClients();
    
    // Find the source agent
    const sourceAgent = await mongoClient.models.Agent.findOne({ id }).lean();
    
    if (!sourceAgent) {
      throw new NotFoundError(`Agent with ID ${id} not found`);
    }
    
    // Check ownership
    if (sourceAgent.owner !== req.user.id) {
      throw new AuthorizationError('You do not have permission to create relationships for this agent');
    }
    
    // Find the target agent
    const targetAgentDoc = await mongoClient.models.Agent.findOne({ id: targetAgent }).lean();
    
    if (!targetAgentDoc) {
      throw new NotFoundError(`Target agent with ID ${targetAgent} not found`);
    }
    
    // Create relationship record
    const relationshipRecord = {
      id: `rel_${uuidv4()}`,
      sourceAgent: id,
      targetAgent,
      relationshipType,
      description: description || '',
      created: new Date()
    };
    
    // Store relationship in database
    const relationshipDoc = new mongoClient.models.AgentRelationship(relationshipRecord);
    await relationshipDoc.save();
    
    // Publish to blockchain if enabled
    if (process.env.ENABLE_BLOCKCHAIN === 'true') {
      await publishToBlockchain('createRelationship', relationshipRecord);
    }
    
    res.status(201).json(relationshipRecord);
  } catch (error) {
    next(error);
  }
};

/**
 * Get performance metrics for an agent
 */
exports.getAgentMetrics = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { timeframe = '7d' } = req.query;
    
    // Get database client
    const { mongoClient } = getDatabaseClients();
    
    // Find the agent
    const agent = await mongoClient.models.Agent.findOne({ id }).lean();
    
    if (!agent) {
      throw new NotFoundError(`Agent with ID ${id} not found`);
    }
    
    // Calculate date range based on timeframe
    const now = new Date();
    let startDate;
    
    switch (timeframe) {
      case '24h':
        startDate = new Date(now.getTime() - 24 * 60 * 60 * 1000);
        break;
      case '7d':
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        break;
      case '30d':
        startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        break;
      default:
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    }
    
    // Get task metrics
    const tasks = await mongoClient.models.Task.find({
      agentId: id,
      created: { $gte: startDate }
    }).lean();
    
    // Calculate metrics
    const totalTasks = tasks.length;
    const completedTasks = tasks.filter(task => task.status === 'completed').length;
    const failedTasks = tasks.filter(task => task.status === 'failed').length;
    
    // Calculate average execution time
    let totalExecutionTime = 0;
    let tasksWithExecutionTime = 0;
    
    tasks.forEach(task => {
      if (task.completedAt && task.status === 'completed') {
        const executionTime = new Date(task.completedAt) - new Date(task.created);
        totalExecutionTime += executionTime;
        tasksWithExecutionTime++;
      }
    });
    
    const avgExecutionTime = tasksWithExecutionTime > 0 
      ? totalExecutionTime / tasksWithExecutionTime 
      : 0;
    
    res.json({
      agentId: id,
      timeframe,
      metrics: {
        totalTasks,
        completedTasks,
        failedTasks,
        successRate: totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0,
        avgExecutionTime,
        trustScore: agent.trustScore
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get version history of an agent
 */
exports.getAgentVersions = async (req, res, next) => {
  try {
    const { id } = req.params;
    
    // Get database client
    const { mongoClient } = getDatabaseClients();
    
    // Find the agent
    const agent = await mongoClient.models.Agent.findOne({ id }).lean();
    
    if (!agent) {
      throw new NotFoundError(`Agent with ID ${id} not found`);
    }
    
    // Get version history
    const versions = await mongoClient.models.AgentVersion.find({ agentId: id })
      .sort({ created: -1 })
      .lean();
    
    res.json(versions);
  } catch (error) {
    next(error);
  }
};

/**
 * Create a new version of an agent
 */
exports.createAgentVersion = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { 
      version, 
      description, 
      capabilities, 
      interfaces, 
      endpoints,
      metadata,
      changeLog
    } = req.body;
    
    // Validate required fields
    if (!version) {
      throw new ValidationError('Missing required field: version');
    }
    
    // Get database client
    const { mongoClient } = getDatabaseClients();
    
    // Find the agent
    const agent = await mongoClient.models.Agent.findOne({ id });
    
    if (!agent) {
      throw new NotFoundError(`Agent with ID ${id} not found`);
    }
    
    // Check ownership
    if (agent.owner !== req.user.id) {
      throw new AuthorizationError('You do not have permission to create versions for this agent');
    }
    
    // Store previous version
    const previousVersion = {
      id: `ver_${uuidv4()}`,
      agentId: id,
      version: agent.version,
      description: agent.description,
      capabilities: agent.capabilities,
      interfaces: agent.interfaces,
      endpoints: agent.endpoints,
      metadataUri: agent.metadataUri,
      created: new Date(),
      changeLog: changeLog || `Update to version ${version}`
    };
    
    const versionDoc = new mongoClient.models.AgentVersion(previousVersion);
    await versionDoc.save();
    
    // Update agent with new version
    agent.version = version;
    if (description) agent.description = description;
    if (capabilities) agent.capabilities = capabilities;
    if (interfaces) agent.interfaces = interfaces;
    if (endpoints) agent.endpoints = endpoints;
    
    // Store updated metadata on IPFS if provided
    if (metadata) {
      agent.metadataUri = await storeMetadataOnIPFS(metadata);
    }
    
    agent.updated = new Date();
    
    // Save changes
    await agent.save();
    
    // Publish to blockchain if enabled
    if (process.env.ENABLE_BLOCKCHAIN === 'true') {
      await publishToBlockchain('updateAgent', agent);
    }
    
    res.status(201).json({
      message: 'Agent version created successfully',
      previousVersion,
      currentVersion: {
        version: agent.version,
        description: agent.description,
        capabilities: agent.capabilities,
        interfaces: agent.interfaces,
        updated: agent.updated
      }
    });
  } catch (error) {
    next(error);
  }
}; 