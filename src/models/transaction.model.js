/**
 * Transaction Model
 * 
 * This module defines the schema for blockchain transactions.
 */

const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
  // Blockchain transaction details
  transactionHash: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  blockNumber: {
    type: Number,
    required: true,
    index: true
  },
  eventType: {
    type: String,
    required: true,
    enum: ['AgentRegistered', 'AgentUpdated', 'AgentDeactivated', 'AgentReactivated', 'OwnershipTransferred'],
    index: true
  },
  data: {
    type: mongoose.Schema.Types.Mixed,
    required: true
  },
  
  // Metadata
  timestamp: {
    type: Date,
    default: Date.now,
    index: true
  },
  processed: {
    type: Boolean,
    default: true,
    index: true
  },
  processingErrors: [{
    message: String,
    timestamp: Date
  }]
}, {
  timestamps: true
});

// Indexes
transactionSchema.index({ eventType: 1, 'data.agentId': 1 });
transactionSchema.index({ eventType: 1, 'data.ownerId': 1 });

// Virtual for transaction URL
transactionSchema.virtual('explorerUrl').get(function() {
  const networkPrefix = process.env.NODE_ENV === 'production' 
    ? 'polygonscan.com' 
    : 'mumbai.polygonscan.com';
  
  return `https://${networkPrefix}/tx/${this.transactionHash}`;
});

// Methods
transactionSchema.methods.markAsProcessed = async function() {
  this.processed = true;
  return this.save();
};

transactionSchema.methods.markAsUnprocessed = async function() {
  this.processed = false;
  return this.save();
};

transactionSchema.methods.addProcessingError = async function(errorMessage) {
  this.processingErrors.push({
    message: errorMessage,
    timestamp: new Date()
  });
  
  return this.save();
};

// Statics
transactionSchema.statics.findByEventType = function(eventType) {
  return this.find({ eventType });
};

transactionSchema.statics.findByAgentId = function(agentId) {
  return this.find({ 'data.agentId': agentId });
};

transactionSchema.statics.findByOwnerId = function(ownerId) {
  return this.find({ 'data.ownerId': ownerId });
};

transactionSchema.statics.findUnprocessed = function() {
  return this.find({ processed: false }).sort({ blockNumber: 1 });
};

// Create model
const Transaction = mongoose.model('Transaction', transactionSchema);

module.exports = Transaction; 