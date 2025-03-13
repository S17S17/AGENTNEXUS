/**
 * Blockchain Events
 * 
 * This module provides functionality for listening to and processing
 * events from the blockchain.
 */

const { getBlockchainComponents } = require('./setup');
const { BlockchainError } = require('../core/errors');

// Event handlers registry
const eventHandlers = {
  AgentRegistered: [],
  AgentUpdated: [],
  AgentDeactivated: [],
  AgentReactivated: [],
  OwnershipTransferred: []
};

// Active listeners
let activeListeners = [];
let isListening = false;

/**
 * Register an event handler
 * 
 * @param {string} eventName - The name of the event to handle
 * @param {Function} handler - The handler function
 * @returns {boolean} Whether the handler was registered
 */
function registerEventHandler(eventName, handler) {
  if (!eventHandlers[eventName]) {
    console.warn(`Unknown event: ${eventName}`);
    return false;
  }
  
  if (typeof handler !== 'function') {
    console.warn('Handler must be a function');
    return false;
  }
  
  eventHandlers[eventName].push(handler);
  console.log(`Registered handler for ${eventName} event`);
  return true;
}

/**
 * Unregister an event handler
 * 
 * @param {string} eventName - The name of the event
 * @param {Function} handler - The handler function to remove
 * @returns {boolean} Whether the handler was unregistered
 */
function unregisterEventHandler(eventName, handler) {
  if (!eventHandlers[eventName]) {
    console.warn(`Unknown event: ${eventName}`);
    return false;
  }
  
  const initialLength = eventHandlers[eventName].length;
  eventHandlers[eventName] = eventHandlers[eventName].filter(h => h !== handler);
  
  const removed = initialLength > eventHandlers[eventName].length;
  if (removed) {
    console.log(`Unregistered handler for ${eventName} event`);
  }
  
  return removed;
}

/**
 * Start listening for blockchain events
 * 
 * @param {Object} options - Options for event listening
 * @param {number} options.fromBlock - The block to start listening from (default: 'latest')
 * @param {boolean} options.historical - Whether to process historical events (default: false)
 * @returns {Promise<boolean>} Whether the listener was started
 */
async function startEventListener(options = {}) {
  try {
    if (isListening) {
      console.warn('Event listener is already running');
      return false;
    }
    
    const { registryContract } = getBlockchainComponents();
    
    if (!registryContract) {
      throw new BlockchainError('Registry contract not initialized');
    }
    
    const fromBlock = options.historical ? 0 : 'latest';
    console.log(`Starting event listener from block ${fromBlock}`);
    
    // Set up event listeners for each event type
    for (const eventName of Object.keys(eventHandlers)) {
      console.log(`Setting up listener for ${eventName} events`);
      
      // Create event listener
      const listener = (...args) => {
        const event = args[args.length - 1];
        console.log(`Received ${eventName} event in block ${event.blockNumber}`);
        
        // Process event with all registered handlers
        processEvent(eventName, ...args);
      };
      
      // Register listener with contract
      registryContract.on(eventName, listener);
      
      // Store listener reference for later removal
      activeListeners.push({
        eventName,
        listener
      });
    }
    
    isListening = true;
    console.log('Blockchain event listener started');
    
    // Process historical events if requested
    if (options.historical) {
      await processHistoricalEvents(fromBlock);
    }
    
    return true;
  } catch (error) {
    throw new BlockchainError(`Failed to start event listener: ${error.message}`);
  }
}

/**
 * Stop listening for blockchain events
 * 
 * @returns {boolean} Whether the listener was stopped
 */
function stopEventListener() {
  try {
    if (!isListening) {
      console.warn('Event listener is not running');
      return false;
    }
    
    const { registryContract } = getBlockchainComponents();
    
    if (!registryContract) {
      throw new BlockchainError('Registry contract not initialized');
    }
    
    // Remove all listeners
    for (const { eventName, listener } of activeListeners) {
      registryContract.off(eventName, listener);
      console.log(`Removed listener for ${eventName} events`);
    }
    
    // Clear active listeners
    activeListeners = [];
    isListening = false;
    
    console.log('Blockchain event listener stopped');
    return true;
  } catch (error) {
    throw new BlockchainError(`Failed to stop event listener: ${error.message}`);
  }
}

/**
 * Process an event with all registered handlers
 * 
 * @param {string} eventName - The name of the event
 * @param {...any} args - The event arguments
 */
async function processEvent(eventName, ...args) {
  if (!eventHandlers[eventName] || eventHandlers[eventName].length === 0) {
    console.log(`No handlers registered for ${eventName} events`);
    return;
  }
  
  // Process event with all registered handlers
  for (const handler of eventHandlers[eventName]) {
    try {
      await handler(...args);
    } catch (error) {
      console.error(`Error in ${eventName} event handler:`, error);
    }
  }
}

/**
 * Process historical events
 * 
 * @param {number|string} fromBlock - The block to start from
 */
async function processHistoricalEvents(fromBlock) {
  try {
    const { registryContract } = getBlockchainComponents();
    
    if (!registryContract) {
      throw new BlockchainError('Registry contract not initialized');
    }
    
    console.log(`Processing historical events from block ${fromBlock}`);
    
    // Process historical events for each event type
    for (const eventName of Object.keys(eventHandlers)) {
      console.log(`Querying ${eventName} events...`);
      
      // Get historical events
      const events = await registryContract.queryFilter(
        registryContract.filters[eventName](),
        fromBlock,
        'latest'
      );
      
      console.log(`Found ${events.length} historical ${eventName} events`);
      
      // Process each event
      for (const event of events) {
        await processEvent(eventName, ...event.args, event);
      }
    }
    
    console.log('Historical event processing complete');
  } catch (error) {
    throw new BlockchainError(`Failed to process historical events: ${error.message}`);
  }
}

/**
 * Check if the event listener is running
 * 
 * @returns {boolean} Whether the listener is running
 */
function isEventListenerRunning() {
  return isListening;
}

/**
 * Get the number of registered handlers for an event
 * 
 * @param {string} eventName - The name of the event
 * @returns {number} The number of handlers
 */
function getHandlerCount(eventName) {
  if (!eventHandlers[eventName]) {
    return 0;
  }
  
  return eventHandlers[eventName].length;
}

module.exports = {
  registerEventHandler,
  unregisterEventHandler,
  startEventListener,
  stopEventListener,
  isEventListenerRunning,
  getHandlerCount
}; 