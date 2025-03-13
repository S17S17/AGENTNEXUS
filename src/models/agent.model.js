/**
 * Agent Model
 * 
 * This module defines the schema for AI agents in the AGENTNEXUS platform.
 */

const mongoose = require('mongoose');
const { isValidIpfsUri } = require('../blockchain/ipfs');

const agentSchema = new mongoose.Schema({
  // Basic information
  name: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  version: {
    type: String,
    required: true,
    default: '1.0.0'
  },
  type: {
    type: String,
    required: true,
    enum: ['assistant', 'autonomous', 'multi-agent', 'tool', 'custom'],
    default: 'assistant'
  },
  
  // Blockchain information
  blockchainId: {
    type: String,
    sparse: true,
    index: true
  },
  did: {
    type: String,
    sparse: true,
    index: true,
    validate: {
      validator: function(v) {
        return !v || v.startsWith('did:agentnexus:');
      },
      message: props => `${props.value} is not a valid AGENTNEXUS DID!`
    }
  },
  metadataUri: {
    type: String,
    validate: {
      validator: function(v) {
        return !v || isValidIpfsUri(v);
      },
      message: props => `${props.value} is not a valid IPFS URI!`
    }
  },
  lastSyncedBlock: {
    type: Number,
    default: 0
  },
  
  // Ownership and status
  ownerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  active: {
    type: Boolean,
    default: true,
    index: true
  },
  visibility: {
    type: String,
    enum: ['public', 'private', 'unlisted'],
    default: 'private',
    index: true
  },
  
  // Capabilities and configuration
  capabilities: {
    type: [String],
    default: []
  },
  models: [{
    name: String,
    provider: String,
    version: String
  }],
  parameters: {
    type: mongoose.Schema.Types.Mixed,
    default: {}
  },
  
  // Integration endpoints
  endpoints: {
    type: Map,
    of: {
      url: String,
      type: String,
      auth: mongoose.Schema.Types.Mixed
    }
  },
  
  // Metadata
  metadata: {
    type: mongoose.Schema.Types.Mixed
  },
  tags: {
    type: [String],
    index: true
  },
  
  // Metrics and reputation
  usageCount: {
    type: Number,
    default: 0
  },
  rating: {
    type: Number,
    min: 0,
    max: 5,
    default: 0
  },
  reviewCount: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

// Indexes
agentSchema.index({ name: 'text', description: 'text', tags: 'text' });
agentSchema.index({ type: 1, active: 1, visibility: 1 });

// Virtual for full agent URL
agentSchema.virtual('url').get(function() {
  return `/agents/${this._id}`;
});

// Methods
agentSchema.methods.incrementUsage = async function() {
  this.usageCount += 1;
  return this.save();
};

agentSchema.methods.updateRating = async function(newRating) {
  const totalRating = this.rating * this.reviewCount;
  this.reviewCount += 1;
  this.rating = (totalRating + newRating) / this.reviewCount;
  return this.save();
};

agentSchema.methods.isVerifiedOnBlockchain = function() {
  return !!this.blockchainId && !!this.did;
};

// Statics
agentSchema.statics.findPublic = function() {
  return this.find({ active: true, visibility: 'public' });
};

agentSchema.statics.findByOwner = function(ownerId) {
  return this.find({ ownerId });
};

agentSchema.statics.findByType = function(type) {
  return this.find({ type, active: true });
};

agentSchema.statics.findByBlockchainId = function(blockchainId) {
  return this.findOne({ blockchainId });
};

agentSchema.statics.findByDid = function(did) {
  return this.findOne({ did });
};

// Create model
const Agent = mongoose.model('Agent', agentSchema);

module.exports = Agent; 