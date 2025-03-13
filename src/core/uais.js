/**
 * Universal Agent Interface Standard (UAIS) Implementation
 * 
 * This module provides the core functionality for implementing the UAIS,
 * enabling interoperability between different agent frameworks.
 */

const { v4: uuidv4 } = require('uuid');
const { ValidationError } = require('./errors');

/**
 * Message types for agent communication
 */
const MessageType = {
  REQUEST: 'Request',
  RESPONSE: 'Response',
  STREAM_CHUNK: 'StreamChunk',
  STREAM_COMPLETE: 'StreamComplete',
  ERROR: 'Error',
  NOTIFICATION: 'Notification',
  CAPABILITY_DECLARATION: 'CapabilityDeclaration',
  HEARTBEAT: 'Heartbeat'
};

/**
 * Interaction patterns supported by UAIS
 */
const InteractionPattern = {
  REQUEST_RESPONSE: 'request-response',
  STREAMING: 'streaming',
  PUBLISH_SUBSCRIBE: 'publish-subscribe',
  MULTI_AGENT: 'multi-agent'
};

/**
 * Create a UAIS-compliant message
 * 
 * @param {Object} options - Message options
 * @param {string} options.type - Message type (from MessageType enum)
 * @param {string} options.sender - Sender DID
 * @param {string} options.recipient - Recipient DID
 * @param {Object} options.content - Message content
 * @param {string} [options.id] - Message ID (generated if not provided)
 * @param {string} [options.inResponseTo] - ID of the message this is responding to
 * @param {string} [options.threadId] - Thread ID for conversation tracking
 * @param {Object} [options.metadata] - Additional metadata
 * @returns {Object} UAIS-compliant message
 */
function createMessage(options) {
  const {
    type,
    sender,
    recipient,
    content,
    id = `msg_${uuidv4()}`,
    inResponseTo,
    threadId,
    metadata = {}
  } = options;
  
  // Validate required fields
  if (!type || !sender || !recipient || !content) {
    throw new ValidationError('Missing required message fields');
  }
  
  // Create the message
  const message = {
    '@context': 'https://agentnexus.io/schemas/message/v1',
    id,
    type,
    sender,
    recipient,
    content,
    timestamp: new Date().toISOString()
  };
  
  // Add optional fields if provided
  if (inResponseTo) message.inResponseTo = inResponseTo;
  if (threadId) message.threadId = threadId;
  if (Object.keys(metadata).length > 0) message.metadata = metadata;
  
  return message;
}

/**
 * Create a capability declaration for an agent
 * 
 * @param {Object} options - Capability options
 * @param {string[]} options.tasks - Supported tasks
 * @param {string[]} options.models - Supported models
 * @param {string[]} options.interfaces - Supported interfaces
 * @param {Object} [options.performance] - Performance metrics
 * @param {Object} [options.constraints] - Agent constraints
 * @returns {Object} Capability declaration
 */
function createCapabilityDeclaration(options) {
  const {
    tasks = [],
    models = [],
    interfaces = [],
    performance = {},
    constraints = {}
  } = options;
  
  // Validate required fields
  if (!tasks.length) {
    throw new ValidationError('At least one task must be specified');
  }
  
  return {
    capabilities: {
      tasks,
      models,
      interfaces
    },
    performance,
    constraints
  };
}

/**
 * Create a detailed task capability
 * 
 * @param {Object} options - Task capability options
 * @param {string} options.id - Task ID
 * @param {string} options.description - Task description
 * @param {Object} options.parameters - Parameter schema
 * @param {Object} options.returns - Return value schema
 * @returns {Object} Task capability
 */
function createTaskCapability(options) {
  const {
    id,
    description,
    parameters,
    returns
  } = options;
  
  // Validate required fields
  if (!id || !description) {
    throw new ValidationError('Task ID and description are required');
  }
  
  return {
    id,
    description,
    parameters: parameters || { type: 'object', properties: {} },
    returns: returns || { type: 'object' }
  };
}

/**
 * Validate a message against the UAIS schema
 * 
 * @param {Object} message - Message to validate
 * @returns {Object} Validation result { valid: boolean, errors: array }
 */
function validateMessage(message) {
  const errors = [];
  
  // Check required fields
  if (!message['@context']) {
    errors.push('Missing @context field');
  }
  
  if (!message.id) {
    errors.push('Missing id field');
  }
  
  if (!message.type) {
    errors.push('Missing type field');
  } else if (!Object.values(MessageType).includes(message.type)) {
    errors.push(`Invalid message type: ${message.type}`);
  }
  
  if (!message.sender) {
    errors.push('Missing sender field');
  }
  
  if (!message.recipient) {
    errors.push('Missing recipient field');
  }
  
  if (!message.content) {
    errors.push('Missing content field');
  }
  
  if (!message.timestamp) {
    errors.push('Missing timestamp field');
  }
  
  // Check response-specific fields
  if (message.type === MessageType.RESPONSE && !message.inResponseTo) {
    errors.push('Response messages must include inResponseTo field');
  }
  
  return {
    valid: errors.length === 0,
    errors
  };
}

/**
 * Create an adapter for a LangChain agent
 * 
 * @param {Object} agent - LangChain agent
 * @param {Object} options - Adapter options
 * @returns {Object} UAIS-compatible adapter
 */
function createLangChainAdapter(agent, options = {}) {
  // Implementation details would go here
  return {
    agent,
    options,
    
    // Convert UAIS messages to LangChain format
    async handleMessage(message) {
      // Validate the message
      const validation = validateMessage(message);
      if (!validation.valid) {
        throw new ValidationError(`Invalid message: ${validation.errors.join(', ')}`);
      }
      
      // Process the message based on type
      if (message.type === MessageType.REQUEST) {
        // Convert to LangChain format and invoke agent
        // This is a simplified placeholder
        const result = await agent.invoke(message.content);
        
        // Create response message
        return createMessage({
          type: MessageType.RESPONSE,
          sender: message.recipient,
          recipient: message.sender,
          content: result,
          inResponseTo: message.id,
          threadId: message.threadId
        });
      }
      
      // Handle other message types...
      
      throw new ValidationError(`Unsupported message type: ${message.type}`);
    },
    
    // Get capabilities
    getCapabilities() {
      // Extract capabilities from the LangChain agent
      // This is a simplified placeholder
      return createCapabilityDeclaration({
        tasks: ['text-generation'],
        models: ['gpt-4'],
        interfaces: ['uais-v1', 'langchain-v1']
      });
    }
  };
}

/**
 * Create an adapter for an AutoGen agent
 * 
 * @param {Object} agent - AutoGen agent
 * @param {Object} options - Adapter options
 * @returns {Object} UAIS-compatible adapter
 */
function createAutoGenAdapter(agent, options = {}) {
  // Implementation details would go here
  return {
    agent,
    options,
    
    // Convert UAIS messages to AutoGen format
    async handleMessage(message) {
      // Similar to LangChain adapter but for AutoGen
      // This is a simplified placeholder
    },
    
    // Get capabilities
    getCapabilities() {
      // Extract capabilities from the AutoGen agent
      // This is a simplified placeholder
      return createCapabilityDeclaration({
        tasks: ['text-generation', 'code-generation'],
        models: ['gpt-4'],
        interfaces: ['uais-v1', 'autogen-v1']
      });
    }
  };
}

/**
 * Create an adapter for a CrewAI agent
 * 
 * @param {Object} agent - CrewAI agent
 * @param {Object} options - Adapter options
 * @returns {Object} UAIS-compatible adapter
 */
function createCrewAIAdapter(agent, options = {}) {
  // Implementation details would go here
  return {
    agent,
    options,
    
    // Convert UAIS messages to CrewAI format
    async handleMessage(message) {
      // Similar to other adapters but for CrewAI
      // This is a simplified placeholder
    },
    
    // Get capabilities
    getCapabilities() {
      // Extract capabilities from the CrewAI agent
      // This is a simplified placeholder
      return createCapabilityDeclaration({
        tasks: ['text-generation', 'task-execution'],
        models: ['gpt-4'],
        interfaces: ['uais-v1', 'crewai-v1']
      });
    }
  };
}

/**
 * Create a generic UAIS-compatible agent
 * 
 * @param {Object} options - Agent options
 * @param {Function} options.handleRequest - Function to handle requests
 * @param {Object} options.capabilities - Agent capabilities
 * @returns {Object} UAIS-compatible agent
 */
function createGenericAgent(options) {
  const {
    handleRequest,
    capabilities
  } = options;
  
  if (!handleRequest || !capabilities) {
    throw new ValidationError('handleRequest function and capabilities are required');
  }
  
  return {
    async handleMessage(message) {
      // Validate the message
      const validation = validateMessage(message);
      if (!validation.valid) {
        throw new ValidationError(`Invalid message: ${validation.errors.join(', ')}`);
      }
      
      // Process the message based on type
      if (message.type === MessageType.REQUEST) {
        try {
          const result = await handleRequest(message.content);
          
          // Create response message
          return createMessage({
            type: MessageType.RESPONSE,
            sender: message.recipient,
            recipient: message.sender,
            content: result,
            inResponseTo: message.id,
            threadId: message.threadId
          });
        } catch (error) {
          // Create error message
          return createMessage({
            type: MessageType.ERROR,
            sender: message.recipient,
            recipient: message.sender,
            content: {
              error: error.message,
              stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
            },
            inResponseTo: message.id,
            threadId: message.threadId
          });
        }
      }
      
      throw new ValidationError(`Unsupported message type: ${message.type}`);
    },
    
    getCapabilities() {
      return capabilities;
    }
  };
}

module.exports = {
  MessageType,
  InteractionPattern,
  createMessage,
  createCapabilityDeclaration,
  createTaskCapability,
  validateMessage,
  createLangChainAdapter,
  createAutoGenAdapter,
  createCrewAIAdapter,
  createGenericAgent
}; 