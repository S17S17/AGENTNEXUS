/**
 * Agent Orchestration
 * 
 * This module provides functionality for orchestrating agent workflows,
 * managing agent interactions, and coordinating multi-agent systems.
 */

const { v4: uuidv4 } = require('uuid');
const { ValidationError, NotFoundError, OrchestrationError } = require('./errors');
const { getAgentById, getAgentsByCapability, createAgentMessage, validateAgentMessage } = require('./registry');
const { createUAISMessage, validateUAISMessage, MESSAGE_TYPES } = require('./uais');
const db = require('./database');

// Collection names
const WORKFLOW_COLLECTION = 'workflows';
const TASK_COLLECTION = 'tasks';
const INTERACTION_COLLECTION = 'interactions';

/**
 * Create a new workflow
 * 
 * @param {Object} workflowData - The workflow data
 * @param {string} workflowData.name - The workflow name
 * @param {string} workflowData.description - The workflow description
 * @param {Array<Object>} workflowData.steps - The workflow steps
 * @param {string} workflowData.ownerId - The ID of the workflow owner
 * @param {Object} options - Additional options
 * @returns {Promise<Object>} The created workflow
 */
async function createWorkflow(workflowData, options = {}) {
  // Validate required fields
  if (!workflowData.name) throw new ValidationError('Workflow name is required');
  if (!workflowData.description) throw new ValidationError('Workflow description is required');
  if (!workflowData.steps || !Array.isArray(workflowData.steps) || workflowData.steps.length === 0) {
    throw new ValidationError('Workflow steps are required and must be a non-empty array');
  }
  if (!workflowData.ownerId) throw new ValidationError('Owner ID is required');
  
  try {
    // Validate steps
    for (let i = 0; i < workflowData.steps.length; i++) {
      const step = workflowData.steps[i];
      
      if (!step.name) throw new ValidationError(`Step ${i + 1} name is required`);
      if (!step.agentId && !step.capability) {
        throw new ValidationError(`Step ${i + 1} must specify either an agentId or a capability`);
      }
      
      // If agentId is provided, verify that the agent exists
      if (step.agentId) {
        try {
          await getAgentById(step.agentId);
        } catch (error) {
          throw new ValidationError(`Agent with ID ${step.agentId} not found for step ${i + 1}`);
        }
      }
    }
    
    // Generate workflow ID
    const workflowId = uuidv4();
    
    // Create workflow record
    const workflow = {
      id: workflowId,
      name: workflowData.name,
      description: workflowData.description,
      steps: workflowData.steps,
      ownerId: workflowData.ownerId,
      status: 'active',
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    // Store workflow in database
    const collection = await db.getCollection(WORKFLOW_COLLECTION);
    await collection.insertOne(workflow);
    
    return workflow;
  } catch (error) {
    if (error instanceof ValidationError) throw error;
    throw new Error(`Failed to create workflow: ${error.message}`);
  }
}

/**
 * Get a workflow by ID
 * 
 * @param {string} workflowId - The workflow ID
 * @returns {Promise<Object>} The workflow
 */
async function getWorkflowById(workflowId) {
  try {
    const collection = await db.getCollection(WORKFLOW_COLLECTION);
    const workflow = await collection.findOne({ id: workflowId });
    
    if (!workflow) {
      throw new NotFoundError(`Workflow with ID ${workflowId} not found`);
    }
    
    return workflow;
  } catch (error) {
    if (error instanceof NotFoundError) throw error;
    throw new Error(`Failed to get workflow: ${error.message}`);
  }
}

/**
 * Update a workflow
 * 
 * @param {string} workflowId - The workflow ID
 * @param {Object} updateData - The data to update
 * @param {string} requesterId - The ID of the requester
 * @returns {Promise<Object>} The updated workflow
 */
async function updateWorkflow(workflowId, updateData, requesterId) {
  try {
    // Get the workflow
    const workflow = await getWorkflowById(workflowId);
    
    // Check if requester is the owner
    if (workflow.ownerId !== requesterId) {
      throw new ValidationError('Only the workflow owner can update the workflow');
    }
    
    // Validate steps if provided
    if (updateData.steps) {
      if (!Array.isArray(updateData.steps) || updateData.steps.length === 0) {
        throw new ValidationError('Workflow steps must be a non-empty array');
      }
      
      for (let i = 0; i < updateData.steps.length; i++) {
        const step = updateData.steps[i];
        
        if (!step.name) throw new ValidationError(`Step ${i + 1} name is required`);
        if (!step.agentId && !step.capability) {
          throw new ValidationError(`Step ${i + 1} must specify either an agentId or a capability`);
        }
        
        // If agentId is provided, verify that the agent exists
        if (step.agentId) {
          try {
            await getAgentById(step.agentId);
          } catch (error) {
            throw new ValidationError(`Agent with ID ${step.agentId} not found for step ${i + 1}`);
          }
        }
      }
    }
    
    // Prepare update object
    const update = {
      ...updateData,
      updatedAt: new Date()
    };
    
    // Remove fields that cannot be updated
    delete update.id;
    delete update.ownerId;
    delete update.createdAt;
    
    // Update workflow in database
    const collection = await db.getCollection(WORKFLOW_COLLECTION);
    await collection.updateOne(
      { id: workflowId },
      { $set: update }
    );
    
    // Get updated workflow
    return await getWorkflowById(workflowId);
  } catch (error) {
    if (error instanceof NotFoundError || error instanceof ValidationError) throw error;
    throw new Error(`Failed to update workflow: ${error.message}`);
  }
}

/**
 * Delete a workflow
 * 
 * @param {string} workflowId - The workflow ID
 * @param {string} requesterId - The ID of the requester
 * @returns {Promise<boolean>} Whether the workflow was deleted
 */
async function deleteWorkflow(workflowId, requesterId) {
  try {
    // Get the workflow
    const workflow = await getWorkflowById(workflowId);
    
    // Check if requester is the owner
    if (workflow.ownerId !== requesterId) {
      throw new ValidationError('Only the workflow owner can delete the workflow');
    }
    
    // Delete workflow from database
    const collection = await db.getCollection(WORKFLOW_COLLECTION);
    const result = await collection.deleteOne({ id: workflowId });
    
    return result.deletedCount > 0;
  } catch (error) {
    if (error instanceof NotFoundError || error instanceof ValidationError) throw error;
    throw new Error(`Failed to delete workflow: ${error.message}`);
  }
}

/**
 * Execute a workflow
 * 
 * @param {string} workflowId - The workflow ID
 * @param {Object} input - The input data for the workflow
 * @param {Object} options - Additional options
 * @returns {Promise<Object>} The execution result
 */
async function executeWorkflow(workflowId, input = {}, options = {}) {
  try {
    // Get the workflow
    const workflow = await getWorkflowById(workflowId);
    
    // Generate task ID
    const taskId = uuidv4();
    
    // Create task record
    const task = {
      id: taskId,
      workflowId,
      input,
      status: 'running',
      currentStep: 0,
      results: [],
      startedAt: new Date(),
      updatedAt: new Date()
    };
    
    // Store task in database
    const taskCollection = await db.getCollection(TASK_COLLECTION);
    await taskCollection.insertOne(task);
    
    // Execute workflow steps
    let currentInput = input;
    let currentStep = 0;
    
    try {
      for (currentStep = 0; currentStep < workflow.steps.length; currentStep++) {
        const step = workflow.steps[currentStep];
        
        // Update task status
        await taskCollection.updateOne(
          { id: taskId },
          { 
            $set: { 
              currentStep,
              updatedAt: new Date()
            }
          }
        );
        
        // Determine agent to use for this step
        let agentId = step.agentId;
        
        // If no specific agent is specified, find an agent with the required capability
        if (!agentId && step.capability) {
          const result = await getAgentsByCapability(step.capability, { limit: 1 });
          
          if (result.agents.length === 0) {
            throw new OrchestrationError(`No agent found with capability: ${step.capability}`);
          }
          
          agentId = result.agents[0].id;
        }
        
        // Execute step with the selected agent
        const stepResult = await executeStep(agentId, step, currentInput, taskId);
        
        // Store step result
        await taskCollection.updateOne(
          { id: taskId },
          { 
            $push: { 
              results: {
                stepIndex: currentStep,
                stepName: step.name,
                agentId,
                result: stepResult,
                completedAt: new Date()
              }
            },
            $set: { updatedAt: new Date() }
          }
        );
        
        // Use this step's output as input for the next step
        currentInput = stepResult;
      }
      
      // Update task status to completed
      await taskCollection.updateOne(
        { id: taskId },
        { 
          $set: { 
            status: 'completed',
            completedAt: new Date(),
            updatedAt: new Date()
          }
        }
      );
      
      // Get the completed task
      const completedTask = await taskCollection.findOne({ id: taskId });
      
      return {
        taskId,
        status: 'completed',
        results: completedTask.results,
        finalResult: currentInput
      };
    } catch (error) {
      // Update task status to failed
      await taskCollection.updateOne(
        { id: taskId },
        { 
          $set: { 
            status: 'failed',
            error: error.message,
            failedAt: new Date(),
            updatedAt: new Date()
          }
        }
      );
      
      throw error;
    }
  } catch (error) {
    if (error instanceof NotFoundError || error instanceof OrchestrationError) throw error;
    throw new OrchestrationError(`Failed to execute workflow: ${error.message}`);
  }
}

/**
 * Execute a single workflow step
 * 
 * @param {string} agentId - The agent ID
 * @param {Object} step - The step configuration
 * @param {Object} input - The input data for the step
 * @param {string} taskId - The task ID
 * @returns {Promise<Object>} The step result
 */
async function executeStep(agentId, step, input, taskId) {
  try {
    // Get the agent
    const agent = await getAgentById(agentId);
    
    // Create interaction record
    const interactionId = uuidv4();
    const interaction = {
      id: interactionId,
      taskId,
      agentId,
      stepName: step.name,
      input,
      status: 'pending',
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    // Store interaction in database
    const interactionCollection = await db.getCollection(INTERACTION_COLLECTION);
    await interactionCollection.insertOne(interaction);
    
    // Create task message for the agent
    const taskMessage = await createAgentMessage(agentId, MESSAGE_TYPES.TASK, {
      taskId,
      interactionId,
      input,
      parameters: step.parameters || {}
    });
    
    // Update interaction with task message
    await interactionCollection.updateOne(
      { id: interactionId },
      { 
        $set: { 
          taskMessage,
          status: 'sent',
          sentAt: new Date(),
          updatedAt: new Date()
        }
      }
    );
    
    // TODO: In a real implementation, this would send the message to the agent
    // and wait for a response. For now, we'll simulate a response.
    
    // Simulate agent processing time
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Simulate agent response
    const responseMessage = createUAISMessage({
      sender: agent.did,
      messageType: MESSAGE_TYPES.RESULT,
      content: {
        taskId,
        interactionId,
        result: {
          // This is a placeholder. In a real implementation, the agent would
          // process the task and return a result.
          processed: true,
          input,
          output: {
            ...input,
            processedBy: agent.name,
            stepName: step.name
          }
        }
      }
    });
    
    // Validate response message
    const validation = validateUAISMessage(responseMessage);
    if (!validation.valid) {
      throw new OrchestrationError(`Invalid response message: ${validation.reason}`);
    }
    
    // Update interaction with response
    await interactionCollection.updateOne(
      { id: interactionId },
      { 
        $set: { 
          responseMessage,
          status: 'completed',
          completedAt: new Date(),
          updatedAt: new Date()
        }
      }
    );
    
    return responseMessage.content.result;
  } catch (error) {
    throw new OrchestrationError(`Failed to execute step: ${error.message}`);
  }
}

/**
 * Get a task by ID
 * 
 * @param {string} taskId - The task ID
 * @returns {Promise<Object>} The task
 */
async function getTaskById(taskId) {
  try {
    const collection = await db.getCollection(TASK_COLLECTION);
    const task = await collection.findOne({ id: taskId });
    
    if (!task) {
      throw new NotFoundError(`Task with ID ${taskId} not found`);
    }
    
    return task;
  } catch (error) {
    if (error instanceof NotFoundError) throw error;
    throw new Error(`Failed to get task: ${error.message}`);
  }
}

/**
 * Get tasks by workflow ID
 * 
 * @param {string} workflowId - The workflow ID
 * @param {Object} options - Search options
 * @returns {Promise<Array<Object>>} The tasks
 */
async function getTasksByWorkflowId(workflowId, options = {}) {
  try {
    // Prepare pagination options
    const limit = options.limit || 20;
    const skip = options.skip || 0;
    
    // Prepare sort options
    const sort = {};
    if (options.sortBy) {
      sort[options.sortBy] = options.sortOrder === 'asc' ? 1 : -1;
    } else {
      sort.startedAt = -1; // Default sort by start date, newest first
    }
    
    // Execute query
    const collection = await db.getCollection(TASK_COLLECTION);
    const tasks = await collection.find({ workflowId })
      .sort(sort)
      .skip(skip)
      .limit(limit)
      .toArray();
    
    // Get total count
    const total = await collection.countDocuments({ workflowId });
    
    return {
      tasks,
      pagination: {
        total,
        limit,
        skip,
        hasMore: skip + tasks.length < total
      }
    };
  } catch (error) {
    throw new Error(`Failed to get tasks: ${error.message}`);
  }
}

/**
 * Get interactions by task ID
 * 
 * @param {string} taskId - The task ID
 * @returns {Promise<Array<Object>>} The interactions
 */
async function getInteractionsByTaskId(taskId) {
  try {
    const collection = await db.getCollection(INTERACTION_COLLECTION);
    const interactions = await collection.find({ taskId })
      .sort({ createdAt: 1 })
      .toArray();
    
    return interactions;
  } catch (error) {
    throw new Error(`Failed to get interactions: ${error.message}`);
  }
}

/**
 * Create a multi-agent system
 * 
 * @param {Object} systemData - The system data
 * @param {string} systemData.name - The system name
 * @param {string} systemData.description - The system description
 * @param {Array<string>} systemData.agentIds - The agent IDs
 * @param {Object} systemData.configuration - The system configuration
 * @param {string} systemData.ownerId - The ID of the system owner
 * @returns {Promise<Object>} The created system
 */
async function createMultiAgentSystem(systemData) {
  // This is a placeholder for future implementation
  // Multi-agent systems would be a more complex orchestration mechanism
  // that allows agents to interact with each other in a more dynamic way
  throw new Error('Multi-agent system creation is not yet implemented');
}

module.exports = {
  createWorkflow,
  getWorkflowById,
  updateWorkflow,
  deleteWorkflow,
  executeWorkflow,
  getTaskById,
  getTasksByWorkflowId,
  getInteractionsByTaskId,
  createMultiAgentSystem
}; 