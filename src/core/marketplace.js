/**
 * Agent Marketplace
 * 
 * This module provides functionality for publishing, discovering,
 * and monetizing agents in the AGENTNEXUS marketplace.
 */

const { v4: uuidv4 } = require('uuid');
const { ValidationError, NotFoundError, AuthorizationError } = require('./errors');
const { getAgentById, updateAgent } = require('./registry');
const { storeMetadataOnIPFS } = require('./ipfs');
const db = require('./database');

// Collection names
const LISTING_COLLECTION = 'marketplace_listings';
const TRANSACTION_COLLECTION = 'marketplace_transactions';
const REVIEW_COLLECTION = 'marketplace_reviews';

/**
 * Create a marketplace listing for an agent
 * 
 * @param {Object} listingData - The listing data
 * @param {string} listingData.agentId - The agent ID
 * @param {string} listingData.title - The listing title
 * @param {string} listingData.description - The listing description
 * @param {number} listingData.price - The listing price
 * @param {string} listingData.currency - The listing currency
 * @param {Array<string>} listingData.tags - The listing tags
 * @param {Object} listingData.metadata - Additional listing metadata
 * @param {string} requesterId - The ID of the requester
 * @returns {Promise<Object>} The created listing
 */
async function createListing(listingData, requesterId) {
  // Validate required fields
  if (!listingData.agentId) throw new ValidationError('Agent ID is required');
  if (!listingData.title) throw new ValidationError('Listing title is required');
  if (!listingData.description) throw new ValidationError('Listing description is required');
  if (listingData.price === undefined) throw new ValidationError('Listing price is required');
  if (!listingData.currency) throw new ValidationError('Listing currency is required');
  
  try {
    // Get the agent
    const agent = await getAgentById(listingData.agentId);
    
    // Check if requester is the agent owner
    if (agent.ownerId !== requesterId) {
      throw new AuthorizationError('Only the agent owner can create a marketplace listing');
    }
    
    // Check if a listing already exists for this agent
    const collection = await db.getCollection(LISTING_COLLECTION);
    const existingListing = await collection.findOne({ agentId: listingData.agentId, status: 'active' });
    
    if (existingListing) {
      throw new ValidationError(`A listing already exists for agent ${listingData.agentId}`);
    }
    
    // Store metadata on IPFS if provided
    let metadataUri = null;
    if (listingData.metadata) {
      metadataUri = await storeMetadataOnIPFS(listingData.metadata);
    }
    
    // Generate listing ID
    const listingId = uuidv4();
    
    // Create listing record
    const listing = {
      id: listingId,
      agentId: listingData.agentId,
      title: listingData.title,
      description: listingData.description,
      price: listingData.price,
      currency: listingData.currency,
      tags: listingData.tags || [],
      metadataUri,
      status: 'active',
      featured: false,
      salesCount: 0,
      totalRevenue: 0,
      averageRating: 0,
      reviewCount: 0,
      ownerId: agent.ownerId,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    // Store listing in database
    await collection.insertOne(listing);
    
    // Update agent with marketplace status
    await updateAgent(
      listingData.agentId,
      { marketplaceStatus: 'listed' },
      requesterId
    );
    
    return listing;
  } catch (error) {
    if (error instanceof ValidationError || error instanceof AuthorizationError || error instanceof NotFoundError) throw error;
    throw new Error(`Failed to create listing: ${error.message}`);
  }
}

/**
 * Get a marketplace listing by ID
 * 
 * @param {string} listingId - The listing ID
 * @returns {Promise<Object>} The listing
 */
async function getListingById(listingId) {
  try {
    const collection = await db.getCollection(LISTING_COLLECTION);
    const listing = await collection.findOne({ id: listingId });
    
    if (!listing) {
      throw new NotFoundError(`Listing with ID ${listingId} not found`);
    }
    
    return listing;
  } catch (error) {
    if (error instanceof NotFoundError) throw error;
    throw new Error(`Failed to get listing: ${error.message}`);
  }
}

/**
 * Update a marketplace listing
 * 
 * @param {string} listingId - The listing ID
 * @param {Object} updateData - The data to update
 * @param {string} requesterId - The ID of the requester
 * @returns {Promise<Object>} The updated listing
 */
async function updateListing(listingId, updateData, requesterId) {
  try {
    // Get the listing
    const listing = await getListingById(listingId);
    
    // Check if requester is the listing owner
    if (listing.ownerId !== requesterId) {
      throw new AuthorizationError('Only the listing owner can update the listing');
    }
    
    // Prepare update object
    const update = {
      ...updateData,
      updatedAt: new Date()
    };
    
    // Remove fields that cannot be updated
    delete update.id;
    delete update.agentId;
    delete update.ownerId;
    delete update.salesCount;
    delete update.totalRevenue;
    delete update.averageRating;
    delete update.reviewCount;
    delete update.createdAt;
    
    // Update metadata on IPFS if provided
    if (update.metadata) {
      update.metadataUri = await storeMetadataOnIPFS(update.metadata);
      delete update.metadata;
    }
    
    // Update listing in database
    const collection = await db.getCollection(LISTING_COLLECTION);
    await collection.updateOne(
      { id: listingId },
      { $set: update }
    );
    
    // Get updated listing
    return await getListingById(listingId);
  } catch (error) {
    if (error instanceof NotFoundError || error instanceof AuthorizationError) throw error;
    throw new Error(`Failed to update listing: ${error.message}`);
  }
}

/**
 * Deactivate a marketplace listing
 * 
 * @param {string} listingId - The listing ID
 * @param {string} requesterId - The ID of the requester
 * @returns {Promise<Object>} The deactivated listing
 */
async function deactivateListing(listingId, requesterId) {
  try {
    // Get the listing
    const listing = await getListingById(listingId);
    
    // Check if requester is the listing owner
    if (listing.ownerId !== requesterId) {
      throw new AuthorizationError('Only the listing owner can deactivate the listing');
    }
    
    // Update listing status in database
    const collection = await db.getCollection(LISTING_COLLECTION);
    await collection.updateOne(
      { id: listingId },
      { $set: { status: 'inactive', updatedAt: new Date() } }
    );
    
    // Update agent with marketplace status
    await updateAgent(
      listing.agentId,
      { marketplaceStatus: 'unlisted' },
      requesterId
    );
    
    // Get updated listing
    return await getListingById(listingId);
  } catch (error) {
    if (error instanceof NotFoundError || error instanceof AuthorizationError) throw error;
    throw new Error(`Failed to deactivate listing: ${error.message}`);
  }
}

/**
 * Search for marketplace listings
 * 
 * @param {Object} query - The search query
 * @param {Object} options - Search options
 * @returns {Promise<Object>} The search results
 */
async function searchListings(query = {}, options = {}) {
  try {
    // Prepare database query
    const dbQuery = { status: 'active' };
    
    // Add search criteria
    if (query.title) {
      dbQuery.title = { $regex: query.title, $options: 'i' };
    }
    
    if (query.ownerId) {
      dbQuery.ownerId = query.ownerId;
    }
    
    if (query.tags && query.tags.length > 0) {
      dbQuery.tags = { $all: query.tags };
    }
    
    if (query.minPrice !== undefined) {
      dbQuery.price = { $gte: query.minPrice };
    }
    
    if (query.maxPrice !== undefined) {
      if (dbQuery.price) {
        dbQuery.price.$lte = query.maxPrice;
      } else {
        dbQuery.price = { $lte: query.maxPrice };
      }
    }
    
    if (query.currency) {
      dbQuery.currency = query.currency;
    }
    
    // Prepare pagination options
    const limit = options.limit || 20;
    const skip = options.skip || 0;
    
    // Prepare sort options
    const sort = {};
    if (options.sortBy) {
      sort[options.sortBy] = options.sortOrder === 'asc' ? 1 : -1;
    } else {
      // Default sort by featured status and then by creation date
      sort.featured = -1;
      sort.createdAt = -1;
    }
    
    // Execute query
    const collection = await db.getCollection(LISTING_COLLECTION);
    const listings = await collection.find(dbQuery)
      .sort(sort)
      .skip(skip)
      .limit(limit)
      .toArray();
    
    // Get total count
    const total = await collection.countDocuments(dbQuery);
    
    return {
      listings,
      pagination: {
        total,
        limit,
        skip,
        hasMore: skip + listings.length < total
      }
    };
  } catch (error) {
    throw new Error(`Failed to search listings: ${error.message}`);
  }
}

/**
 * Purchase an agent from the marketplace
 * 
 * @param {string} listingId - The listing ID
 * @param {string} buyerId - The ID of the buyer
 * @param {Object} paymentDetails - The payment details
 * @returns {Promise<Object>} The transaction record
 */
async function purchaseAgent(listingId, buyerId, paymentDetails) {
  try {
    // Get the listing
    const listing = await getListingById(listingId);
    
    // Check if listing is active
    if (listing.status !== 'active') {
      throw new ValidationError('Listing is not active');
    }
    
    // Check if buyer is not the owner
    if (listing.ownerId === buyerId) {
      throw new ValidationError('You cannot purchase your own agent');
    }
    
    // TODO: Process payment
    // This is a placeholder for payment processing logic
    const paymentSuccessful = true;
    const paymentId = uuidv4();
    
    if (!paymentSuccessful) {
      throw new Error('Payment failed');
    }
    
    // Generate transaction ID
    const transactionId = uuidv4();
    
    // Create transaction record
    const transaction = {
      id: transactionId,
      listingId,
      agentId: listing.agentId,
      buyerId,
      sellerId: listing.ownerId,
      price: listing.price,
      currency: listing.currency,
      paymentId,
      status: 'completed',
      createdAt: new Date()
    };
    
    // Store transaction in database
    const transactionCollection = await db.getCollection(TRANSACTION_COLLECTION);
    await transactionCollection.insertOne(transaction);
    
    // Update listing sales count and revenue
    const listingCollection = await db.getCollection(LISTING_COLLECTION);
    await listingCollection.updateOne(
      { id: listingId },
      { 
        $inc: { 
          salesCount: 1,
          totalRevenue: listing.price
        },
        $set: { updatedAt: new Date() }
      }
    );
    
    // TODO: Grant access to the agent for the buyer
    // This is a placeholder for access control logic
    
    return transaction;
  } catch (error) {
    if (error instanceof NotFoundError || error instanceof ValidationError) throw error;
    throw new Error(`Failed to purchase agent: ${error.message}`);
  }
}

/**
 * Create a review for a purchased agent
 * 
 * @param {string} transactionId - The transaction ID
 * @param {Object} reviewData - The review data
 * @param {number} reviewData.rating - The rating (1-5)
 * @param {string} reviewData.comment - The review comment
 * @param {string} requesterId - The ID of the requester
 * @returns {Promise<Object>} The created review
 */
async function createReview(transactionId, reviewData, requesterId) {
  try {
    // Validate required fields
    if (!reviewData.rating) throw new ValidationError('Rating is required');
    if (reviewData.rating < 1 || reviewData.rating > 5) {
      throw new ValidationError('Rating must be between 1 and 5');
    }
    
    // Get the transaction
    const transactionCollection = await db.getCollection(TRANSACTION_COLLECTION);
    const transaction = await transactionCollection.findOne({ id: transactionId });
    
    if (!transaction) {
      throw new NotFoundError(`Transaction with ID ${transactionId} not found`);
    }
    
    // Check if requester is the buyer
    if (transaction.buyerId !== requesterId) {
      throw new AuthorizationError('Only the buyer can create a review');
    }
    
    // Check if a review already exists for this transaction
    const reviewCollection = await db.getCollection(REVIEW_COLLECTION);
    const existingReview = await reviewCollection.findOne({ transactionId });
    
    if (existingReview) {
      throw new ValidationError(`A review already exists for transaction ${transactionId}`);
    }
    
    // Generate review ID
    const reviewId = uuidv4();
    
    // Create review record
    const review = {
      id: reviewId,
      transactionId,
      listingId: transaction.listingId,
      agentId: transaction.agentId,
      buyerId: transaction.buyerId,
      sellerId: transaction.sellerId,
      rating: reviewData.rating,
      comment: reviewData.comment || '',
      createdAt: new Date()
    };
    
    // Store review in database
    await reviewCollection.insertOne(review);
    
    // Update listing average rating and review count
    const listingCollection = await db.getCollection(LISTING_COLLECTION);
    const listing = await listingCollection.findOne({ id: transaction.listingId });
    
    if (listing) {
      const newReviewCount = listing.reviewCount + 1;
      const newAverageRating = (listing.averageRating * listing.reviewCount + reviewData.rating) / newReviewCount;
      
      await listingCollection.updateOne(
        { id: transaction.listingId },
        { 
          $set: { 
            averageRating: newAverageRating,
            reviewCount: newReviewCount,
            updatedAt: new Date()
          }
        }
      );
    }
    
    return review;
  } catch (error) {
    if (error instanceof NotFoundError || error instanceof ValidationError || error instanceof AuthorizationError) throw error;
    throw new Error(`Failed to create review: ${error.message}`);
  }
}

/**
 * Get reviews for a listing
 * 
 * @param {string} listingId - The listing ID
 * @param {Object} options - Search options
 * @returns {Promise<Array<Object>>} The reviews
 */
async function getReviewsByListingId(listingId, options = {}) {
  try {
    // Prepare pagination options
    const limit = options.limit || 20;
    const skip = options.skip || 0;
    
    // Prepare sort options
    const sort = {};
    if (options.sortBy) {
      sort[options.sortBy] = options.sortOrder === 'asc' ? 1 : -1;
    } else {
      sort.createdAt = -1; // Default sort by creation date, newest first
    }
    
    // Execute query
    const collection = await db.getCollection(REVIEW_COLLECTION);
    const reviews = await collection.find({ listingId })
      .sort(sort)
      .skip(skip)
      .limit(limit)
      .toArray();
    
    // Get total count
    const total = await collection.countDocuments({ listingId });
    
    return {
      reviews,
      pagination: {
        total,
        limit,
        skip,
        hasMore: skip + reviews.length < total
      }
    };
  } catch (error) {
    throw new Error(`Failed to get reviews: ${error.message}`);
  }
}

/**
 * Get transactions for a user
 * 
 * @param {string} userId - The user ID
 * @param {string} role - The user role ('buyer' or 'seller')
 * @param {Object} options - Search options
 * @returns {Promise<Array<Object>>} The transactions
 */
async function getTransactionsByUserId(userId, role = 'buyer', options = {}) {
  try {
    // Prepare query based on role
    const query = role === 'seller' ? { sellerId: userId } : { buyerId: userId };
    
    // Prepare pagination options
    const limit = options.limit || 20;
    const skip = options.skip || 0;
    
    // Prepare sort options
    const sort = {};
    if (options.sortBy) {
      sort[options.sortBy] = options.sortOrder === 'asc' ? 1 : -1;
    } else {
      sort.createdAt = -1; // Default sort by creation date, newest first
    }
    
    // Execute query
    const collection = await db.getCollection(TRANSACTION_COLLECTION);
    const transactions = await collection.find(query)
      .sort(sort)
      .skip(skip)
      .limit(limit)
      .toArray();
    
    // Get total count
    const total = await collection.countDocuments(query);
    
    return {
      transactions,
      pagination: {
        total,
        limit,
        skip,
        hasMore: skip + transactions.length < total
      }
    };
  } catch (error) {
    throw new Error(`Failed to get transactions: ${error.message}`);
  }
}

/**
 * Feature a listing in the marketplace
 * 
 * @param {string} listingId - The listing ID
 * @param {boolean} featured - Whether to feature the listing
 * @param {string} requesterId - The ID of the requester (admin)
 * @returns {Promise<Object>} The updated listing
 */
async function featureListing(listingId, featured, requesterId) {
  try {
    // Get the listing
    const listing = await getListingById(listingId);
    
    // TODO: Check if requester is an admin
    // This is a placeholder for admin authorization logic
    const isAdmin = true;
    
    if (!isAdmin) {
      throw new AuthorizationError('Only administrators can feature listings');
    }
    
    // Update listing featured status in database
    const collection = await db.getCollection(LISTING_COLLECTION);
    await collection.updateOne(
      { id: listingId },
      { $set: { featured, updatedAt: new Date() } }
    );
    
    // Get updated listing
    return await getListingById(listingId);
  } catch (error) {
    if (error instanceof NotFoundError || error instanceof AuthorizationError) throw error;
    throw new Error(`Failed to feature listing: ${error.message}`);
  }
}

module.exports = {
  createListing,
  getListingById,
  updateListing,
  deactivateListing,
  searchListings,
  purchaseAgent,
  createReview,
  getReviewsByListingId,
  getTransactionsByUserId,
  featureListing
}; 