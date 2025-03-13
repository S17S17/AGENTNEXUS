const jwt = require('jsonwebtoken');
const { AuthenticationError } = require('../errors');

/**
 * Middleware to authenticate JWT tokens
 */
exports.authenticateJWT = (req, res, next) => {
  try {
    // Get the authorization header
    const authHeader = req.headers.authorization;
    
    if (!authHeader) {
      throw new AuthenticationError('No authorization header provided');
    }
    
    // Extract the token
    const parts = authHeader.split(' ');
    
    if (parts.length !== 2 || parts[0] !== 'Bearer') {
      throw new AuthenticationError('Invalid authorization format. Use: Bearer <token>');
    }
    
    const token = parts[1];
    
    // Verify the token
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (err) {
        if (err.name === 'TokenExpiredError') {
          throw new AuthenticationError('Token expired');
        } else {
          throw new AuthenticationError('Invalid token');
        }
      }
      
      // Attach the decoded user to the request
      req.user = decoded;
      next();
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Middleware to authenticate optional JWT tokens
 * If a token is provided, it will be verified and the user attached to the request
 * If no token is provided, the request will continue without authentication
 */
exports.authenticateOptionalJWT = (req, res, next) => {
  try {
    // Get the authorization header
    const authHeader = req.headers.authorization;
    
    // If no header, continue without authentication
    if (!authHeader) {
      return next();
    }
    
    // Extract the token
    const parts = authHeader.split(' ');
    
    if (parts.length !== 2 || parts[0] !== 'Bearer') {
      return next();
    }
    
    const token = parts[1];
    
    // Verify the token
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (!err) {
        // Attach the decoded user to the request
        req.user = decoded;
      }
      next();
    });
  } catch (error) {
    // Continue without authentication on error
    next();
  }
};

/**
 * Middleware to check if the user has the required role
 * @param {string|string[]} roles - Required role(s)
 */
exports.requireRole = (roles) => {
  return (req, res, next) => {
    try {
      // Check if user exists and has roles
      if (!req.user || !req.user.roles) {
        throw new AuthenticationError('User not authenticated or missing roles');
      }
      
      // Convert single role to array
      const requiredRoles = Array.isArray(roles) ? roles : [roles];
      
      // Check if user has any of the required roles
      const hasRole = requiredRoles.some(role => req.user.roles.includes(role));
      
      if (!hasRole) {
        throw new AuthenticationError('Insufficient permissions');
      }
      
      next();
    } catch (error) {
      next(error);
    }
  };
};

/**
 * Generate a JWT token for a user
 * @param {Object} user - User object
 * @param {string} expiresIn - Token expiration time (default: from env or 24h)
 * @returns {string} JWT token
 */
exports.generateToken = (user, expiresIn = process.env.JWT_EXPIRATION || '24h') => {
  const payload = {
    id: user.id,
    email: user.email,
    roles: user.roles || ['user'],
  };
  
  return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn });
};

/**
 * Verify a JWT token
 * @param {string} token - JWT token
 * @returns {Object} Decoded token payload
 */
exports.verifyToken = (token) => {
  try {
    return jwt.verify(token, process.env.JWT_SECRET);
  } catch (error) {
    throw new AuthenticationError(`Token verification failed: ${error.message}`);
  }
}; 