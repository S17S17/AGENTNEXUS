/**
 * Agent Metadata Schema
 * 
 * This module defines the schema for agent metadata and provides
 * validation and creation functions.
 */

const { ValidationError } = require('../core/errors');

/**
 * Agent metadata schema
 */
const metadataSchema = {
  name: { type: 'string', required: true },
  description: { type: 'string', required: true },
  version: { type: 'string', required: true },
  type: { type: 'string', required: true },
  capabilities: { type: 'object', required: false },
  interfaces: { type: 'object', required: false },
  provider: { type: 'object', required: false },
  repository: { type: 'string', required: false },
  license: { type: 'string', required: false },
  tags: { type: 'array', required: false },
  image: { type: 'string', required: false },
  models: { type: 'array', required: false },
  parameters: { type: 'object', required: false },
  endpoints: { type: 'object', required: false },
  documentation: { type: 'string', required: false },
  created: { type: 'string', required: false },
  updated: { type: 'string', required: false }
};

/**
 * Validate agent metadata against schema
 * 
 * @param {Object} metadata - The metadata to validate
 * @returns {boolean} Whether the metadata is valid
 * @throws {ValidationError} If the metadata is invalid
 */
function validateMetadata(metadata) {
  if (!metadata || typeof metadata !== 'object') {
    throw new ValidationError('Metadata must be an object');
  }
  
  // Check required fields
  for (const [field, schema] of Object.entries(metadataSchema)) {
    if (schema.required && (metadata[field] === undefined || metadata[field] === null)) {
      throw new ValidationError(`Metadata field '${field}' is required`);
    }
    
    // Check type if field is present
    if (metadata[field] !== undefined && metadata[field] !== null) {
      if (schema.type === 'string' && typeof metadata[field] !== 'string') {
        throw new ValidationError(`Metadata field '${field}' must be a string`);
      } else if (schema.type === 'object' && typeof metadata[field] !== 'object') {
        throw new ValidationError(`Metadata field '${field}' must be an object`);
      } else if (schema.type === 'array' && !Array.isArray(metadata[field])) {
        throw new ValidationError(`Metadata field '${field}' must be an array`);
      }
    }
  }
  
  return true;
}

/**
 * Create agent metadata object
 * 
 * @param {Object} data - The metadata data
 * @returns {Object} The validated metadata object
 */
function createMetadata(data) {
  // Add timestamps
  const now = new Date().toISOString();
  const metadata = {
    ...data,
    created: data.created || now,
    updated: now
  };
  
  // Validate metadata
  validateMetadata(metadata);
  
  return metadata;
}

/**
 * Create agent capability metadata
 * 
 * @param {string} name - The capability name
 * @param {string} description - The capability description
 * @param {Object} parameters - The capability parameters
 * @returns {Object} The capability metadata
 */
function createCapability(name, description, parameters = {}) {
  if (!name) throw new ValidationError('Capability name is required');
  if (!description) throw new ValidationError('Capability description is required');
  
  return {
    name,
    description,
    parameters
  };
}

/**
 * Create agent interface metadata
 * 
 * @param {string} type - The interface type
 * @param {string} version - The interface version
 * @param {Object} spec - The interface specification
 * @returns {Object} The interface metadata
 */
function createInterface(type, version, spec = {}) {
  if (!type) throw new ValidationError('Interface type is required');
  if (!version) throw new ValidationError('Interface version is required');
  
  return {
    type,
    version,
    spec
  };
}

/**
 * Create agent provider metadata
 * 
 * @param {string} name - The provider name
 * @param {string} url - The provider URL
 * @param {Object} contact - The provider contact information
 * @returns {Object} The provider metadata
 */
function createProvider(name, url, contact = {}) {
  if (!name) throw new ValidationError('Provider name is required');
  
  return {
    name,
    url,
    contact
  };
}

/**
 * Create agent model metadata
 * 
 * @param {string} name - The model name
 * @param {string} provider - The model provider
 * @param {string} version - The model version
 * @returns {Object} The model metadata
 */
function createModel(name, provider, version) {
  if (!name) throw new ValidationError('Model name is required');
  if (!provider) throw new ValidationError('Model provider is required');
  
  return {
    name,
    provider,
    version
  };
}

/**
 * Create agent endpoint metadata
 * 
 * @param {string} name - The endpoint name
 * @param {string} url - The endpoint URL
 * @param {string} type - The endpoint type
 * @param {Object} auth - The endpoint authentication information
 * @returns {Object} The endpoint metadata
 */
function createEndpoint(name, url, type, auth = {}) {
  if (!name) throw new ValidationError('Endpoint name is required');
  if (!url) throw new ValidationError('Endpoint URL is required');
  if (!type) throw new ValidationError('Endpoint type is required');
  
  return {
    name,
    url,
    type,
    auth
  };
}

module.exports = {
  metadataSchema,
  validateMetadata,
  createMetadata,
  createCapability,
  createInterface,
  createProvider,
  createModel,
  createEndpoint
}; 