# Blockchain Caching System

## Overview

The AGENTNEXUS platform implements a Redis-based caching system to improve performance and reduce the load on the blockchain and IPFS networks. This document describes the caching architecture, configuration, and usage.

## Architecture

The caching system is built on Redis, a high-performance in-memory data store. The system caches:

1. **Agent Data**: Information retrieved from the blockchain registry
2. **Metadata**: Agent metadata retrieved from IPFS
3. **Transactions**: Recent blockchain transactions
4. **Blockchain Status**: Current status of the blockchain connection

## Configuration

The caching system can be configured through environment variables:

```
REDIS_URL=redis://localhost:6379
REDIS_PASSWORD=your_redis_password
REDIS_CACHE_TTL=3600
ENABLE_CACHE=true
```

- `REDIS_URL`: The URL of the Redis server
- `REDIS_PASSWORD`: The password for the Redis server (if required)
- `REDIS_CACHE_TTL`: The default time-to-live for cached items in seconds
- `ENABLE_CACHE`: Whether to enable the caching system

## Cache Keys

The caching system uses the following key patterns:

- `agent:{id}`: Agent data from the blockchain
- `owner:{ownerId}:agents`: List of agents owned by a specific owner
- `metadata:{uri}`: Agent metadata from IPFS
- `transactions`: List of recent transactions
- `blockchain:status`: Current blockchain status

## Cache Operations

### Initialization

The cache is initialized when the blockchain service starts. If Redis is not available, the system will continue to operate without caching.

```javascript
const cacheInitialized = await initializeCache();
if (!cacheInitialized) {
  logger.warn('Failed to initialize blockchain cache service');
  // Continue without cache
}
```

### Reading from Cache

The system always checks the cache first before making blockchain or IPFS requests:

```javascript
// Example: Getting agent data
const cachedAgent = await getCachedAgentData(agentId);
if (cachedAgent) {
  return cachedAgent;
}

// If not in cache, get from blockchain and then cache
const agentData = await registryContract.getAgent(agentId);
await cacheAgentData(agentId, formattedData);
```

### Writing to Cache

Data is cached after being retrieved from the blockchain or IPFS:

```javascript
// Example: Caching agent data
await cacheAgentData(agentId, formattedData);

// Example: Caching metadata
await cacheMetadata(ipfsUri, metadata);
```

### Cache Invalidation

The cache is invalidated when data is updated:

```javascript
// Example: Invalidating agent cache after update
await invalidateAgentCache(agentId);

// Example: Invalidating owner agents cache after registration
await invalidateOwnerAgentsCache(ownerId);
```

## Performance Benefits

The caching system provides several performance benefits:

1. **Reduced Blockchain Queries**: Minimizes the number of RPC calls to the blockchain
2. **Faster IPFS Access**: Avoids repeated IPFS retrievals for the same metadata
3. **Lower Latency**: Provides near-instant responses for frequently accessed data
4. **Reduced Costs**: Decreases the number of paid API calls to infrastructure providers

## Monitoring

The caching system logs cache hits and misses, which can be used to monitor performance:

```
[INFO] Retrieved agent 123 from cache
[INFO] Retrieved metadata from IPFS: ipfs://Qm...
```

## Failure Handling

If the cache is unavailable or returns an error, the system will fall back to direct blockchain and IPFS queries:

```javascript
try {
  const cachedData = await getCachedData(key);
  if (cachedData) return cachedData;
} catch (error) {
  logger.warn(`Cache error: ${error.message}`);
  // Continue with direct query
}
```

## Future Enhancements

Planned enhancements to the caching system include:

1. **Cache Preloading**: Proactively caching frequently accessed data
2. **Cache Warming**: Periodically refreshing cache entries before expiration
3. **Distributed Caching**: Supporting multiple Redis instances for high availability
4. **Cache Analytics**: Detailed metrics on cache performance and hit rates 