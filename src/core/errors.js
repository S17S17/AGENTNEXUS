/**
 * Base error class for all application errors
 */
class AppError extends Error {
  constructor(message, statusCode = 500) {
    super(message);
    this.name = this.constructor.name;
    this.statusCode = statusCode;
    Error.captureStackTrace(this, this.constructor);
  }
}

/**
 * Error for validation failures
 */
class ValidationError extends AppError {
  constructor(message, details = []) {
    super(message, 400);
    this.details = details;
  }
}

/**
 * Error for authentication failures
 */
class AuthenticationError extends AppError {
  constructor(message) {
    super(message, 401);
  }
}

/**
 * Error for authorization failures
 */
class AuthorizationError extends AppError {
  constructor(message) {
    super(message, 403);
  }
}

/**
 * Error for resource not found
 */
class NotFoundError extends AppError {
  constructor(message) {
    super(message, 404);
  }
}

/**
 * Error for conflict situations (e.g., duplicate resources)
 */
class ConflictError extends AppError {
  constructor(message) {
    super(message, 409);
  }
}

/**
 * Error for rate limiting
 */
class RateLimitError extends AppError {
  constructor(message, retryAfter) {
    super(message, 429);
    this.retryAfter = retryAfter;
  }
}

/**
 * Error for blockchain operations
 */
class BlockchainError extends AppError {
  constructor(message, txHash = null) {
    super(message, 500);
    this.txHash = txHash;
  }
}

/**
 * Error for external service failures
 */
class ExternalServiceError extends AppError {
  constructor(message, service, statusCode = 502) {
    super(message, statusCode);
    this.service = service;
  }
}

/**
 * Error for validation pipeline failures
 */
class ValidationPipelineError extends AppError {
  constructor(message, validationResults = {}) {
    super(message, 500);
    this.validationResults = validationResults;
  }
}

/**
 * Error for sandbox environment failures
 */
class SandboxError extends AppError {
  constructor(message, sandboxId = null) {
    super(message, 500);
    this.sandboxId = sandboxId;
  }
}

/**
 * Error for agent communication failures
 */
class AgentCommunicationError extends AppError {
  constructor(message, agentId = null) {
    super(message, 502);
    this.agentId = agentId;
  }
}

/**
 * Error for IPFS operations
 */
class IPFSError extends AppError {
  constructor(message) {
    super(message, 500);
  }
}

/**
 * Error for database operations
 */
class DatabaseError extends AppError {
  constructor(message, operation = null) {
    super(message, 500);
    this.operation = operation;
  }
}

/**
 * Error for orchestration operations
 */
class OrchestrationError extends AppError {
  constructor(message, workflowId = null, taskId = null) {
    super(message, 500);
    this.workflowId = workflowId;
    this.taskId = taskId;
  }
}

module.exports = {
  AppError,
  ValidationError,
  AuthenticationError,
  AuthorizationError,
  NotFoundError,
  ConflictError,
  RateLimitError,
  BlockchainError,
  ExternalServiceError,
  ValidationPipelineError,
  SandboxError,
  AgentCommunicationError,
  IPFSError,
  DatabaseError,
  OrchestrationError
}; 