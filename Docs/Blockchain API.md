# AGENTNEXUS Blockchain API

This document provides documentation for the blockchain-related API endpoints in the AGENTNEXUS platform.

## Base URL

```
https://api.agentnexus.io/api/blockchain
```

## Authentication

Most endpoints require authentication using a JWT token. Include the token in the `Authorization` header:

```
Authorization: Bearer <your_token>
```

## Endpoints

### Register Agent on Blockchain

Registers an agent on the blockchain and stores its metadata on IPFS.

**URL**: `/agents`  
**Method**: `POST`  
**Auth required**: Yes  
**Permissions required**: User must be the owner of the agent

**Request Body**:

```json
{
  "id": "agent-123",
  "did": "did:agentnexus:123456789abcdef",
  "metadata": {
    "name": "My Agent",
    "description": "A helpful AI assistant",
    "version": "1.0.0",
    "type": "assistant",
    "capabilities": {
      "text": {
        "description": "Text generation and conversation"
      },
      "search": {
        "description": "Web search capability"
      }
    },
    "models": [
      {
        "name": "gpt-4",
        "provider": "openai",
        "version": "latest"
      }
    ]
  },
  "ownerId": "user-123"
}
```

**Success Response**:

```json
{
  "success": true,
  "message": "Agent registered on blockchain",
  "data": {
    "id": "agent-123",
    "did": "did:agentnexus:123456789abcdef",
    "metadataUri": "ipfs://QmXyZ123456789",
    "ownerId": "user-123",
    "transactionHash": "0x1234567890abcdef"
  }
}
```

### Get Agent from Blockchain

Retrieves agent data from the blockchain and its metadata from IPFS.

**URL**: `/agents/:id`  
**Method**: `GET`  
**Auth required**: No  
**URL Parameters**: `id=[string]` where `id` is the agent ID on the blockchain

**Success Response**:

```json
{
  "success": true,
  "data": {
    "id": "agent-123",
    "did": "did:agentnexus:123456789abcdef",
    "metadataUri": "ipfs://QmXyZ123456789",
    "ownerId": "user-123",
    "registeredAt": "2023-06-15T10:30:00.000Z",
    "updatedAt": "2023-06-15T10:30:00.000Z",
    "metadata": {
      "name": "My Agent",
      "description": "A helpful AI assistant",
      "version": "1.0.0",
      "type": "assistant",
      "capabilities": {
        "text": {
          "description": "Text generation and conversation"
        },
        "search": {
          "description": "Web search capability"
        }
      },
      "models": [
        {
          "name": "gpt-4",
          "provider": "openai",
          "version": "latest"
        }
      ],
      "timestamp": "2023-06-15T10:30:00.000Z"
    }
  }
}
```

### Update Agent on Blockchain

Updates an agent's metadata on IPFS and the blockchain.

**URL**: `/agents/:id`  
**Method**: `PUT`  
**Auth required**: Yes  
**Permissions required**: User must be the owner of the agent  
**URL Parameters**: `id=[string]` where `id` is the agent ID on the blockchain

**Request Body**:

```json
{
  "metadata": {
    "name": "My Updated Agent",
    "description": "An improved AI assistant",
    "version": "1.1.0",
    "type": "assistant",
    "capabilities": {
      "text": {
        "description": "Enhanced text generation and conversation"
      },
      "search": {
        "description": "Web search capability"
      },
      "image": {
        "description": "Image generation capability"
      }
    }
  }
}
```

**Success Response**:

```json
{
  "success": true,
  "message": "Agent updated on blockchain",
  "data": {
    "id": "agent-123",
    "metadataUri": "ipfs://QmNewUri123456",
    "transactionHash": "0x1234567890abcdef"
  }
}
```

### Deactivate Agent on Blockchain

Deactivates an agent on the blockchain.

**URL**: `/agents/:id`  
**Method**: `DELETE`  
**Auth required**: Yes  
**Permissions required**: User must be the owner of the agent  
**URL Parameters**: `id=[string]` where `id` is the agent ID on the blockchain

**Success Response**:

```json
{
  "success": true,
  "message": "Agent deactivated on blockchain",
  "data": {
    "id": "agent-123",
    "transactionHash": "0x1234567890abcdef"
  }
}
```

### Get Owner Agents from Blockchain

Retrieves all agents for an owner from the blockchain.

**URL**: `/owners/:ownerId/agents`  
**Method**: `GET`  
**Auth required**: No  
**URL Parameters**: `ownerId=[string]` where `ownerId` is the owner ID on the blockchain

**Success Response**:

```json
{
  "success": true,
  "data": [
    {
      "id": "agent-1",
      "did": "did:agentnexus:1",
      "metadataUri": "ipfs://uri1",
      "ownerId": "user-123",
      "registeredAt": "2023-06-15T10:30:00.000Z",
      "updatedAt": "2023-06-15T10:30:00.000Z"
    },
    {
      "id": "agent-2",
      "did": "did:agentnexus:2",
      "metadataUri": "ipfs://uri2",
      "ownerId": "user-123",
      "registeredAt": "2023-06-15T11:30:00.000Z",
      "updatedAt": "2023-06-15T11:30:00.000Z"
    }
  ]
}
```

### Upload Metadata to IPFS

Uploads agent metadata to IPFS.

**URL**: `/metadata`  
**Method**: `POST`  
**Auth required**: Yes  

**Request Body**:

```json
{
  "metadata": {
    "name": "My Agent",
    "description": "A helpful AI assistant",
    "version": "1.0.0",
    "type": "assistant",
    "capabilities": {
      "text": {
        "description": "Text generation and conversation"
      }
    }
  }
}
```

**Success Response**:

```json
{
  "success": true,
  "message": "Metadata uploaded to IPFS",
  "data": {
    "metadataUri": "ipfs://QmXyZ123456789"
  }
}
```

### Get Metadata from IPFS

Retrieves metadata from IPFS.

**URL**: `/metadata`  
**Method**: `GET`  
**Auth required**: No  
**Query Parameters**: `uri=[string]` where `uri` is the IPFS URI (ipfs://CID)

**Success Response**:

```json
{
  "success": true,
  "data": {
    "name": "My Agent",
    "description": "A helpful AI assistant",
    "version": "1.0.0",
    "type": "assistant",
    "capabilities": {
      "text": {
        "description": "Text generation and conversation"
      }
    },
    "timestamp": "2023-06-15T10:30:00.000Z"
  }
}
```

### Get Blockchain Status

Retrieves the status of the blockchain connection.

**URL**: `/status`  
**Method**: `GET`  
**Auth required**: No  

**Success Response**:

```json
{
  "success": true,
  "data": {
    "isInitialized": true,
    "network": {
      "name": "mumbai",
      "chainId": 80001
    },
    "signer": {
      "address": "0x1234567890abcdef",
      "balance": "1.5"
    },
    "contract": "0xabcdef1234567890"
  }
}
```

## Error Responses

### 400 Bad Request

```json
{
  "error": "Validation Error",
  "message": "Agent ID is required",
  "details": []
}
```

### 401 Unauthorized

```json
{
  "error": "Authentication Error",
  "message": "Invalid token"
}
```

### 403 Forbidden

```json
{
  "error": "Authorization Error",
  "message": "You can only update your own agents"
}
```

### 404 Not Found

```json
{
  "error": "Not Found",
  "message": "Agent with ID agent-123 not found on blockchain"
}
```

### 500 Internal Server Error

```json
{
  "error": "Internal Server Error",
  "message": "An unexpected error occurred",
  "requestId": "req-123"
}
``` 