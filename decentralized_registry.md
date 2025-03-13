# Decentralized Registry Specification

## Overview

The Decentralized Registry is a foundational component of AGENTNEXUS, serving as the distributed database for AI agents, their capabilities, metadata, and relationships. Unlike traditional centralized registries, this system distributes control and governance across the network, eliminating single points of failure while ensuring data integrity, availability, and censorship resistance.

This specification details the architecture, data models, smart contracts, and interaction patterns that comprise the Decentralized Registry system.

## Design Goals

The Decentralized Registry is designed with the following goals:

1. **Decentralization**: Distribute control and storage across the network to eliminate central points of failure
2. **Immutability**: Ensure that agent records cannot be tampered with once published
3. **Discoverability**: Enable efficient search and discovery of agents based on capabilities and metadata
4. **Scalability**: Support millions of agents with efficient query performance
5. **Interoperability**: Integrate with existing blockchain and decentralized systems
6. **Privacy**: Allow selective disclosure of agent information when appropriate
7. **Governance**: Enable community-driven evolution of the registry

## System Architecture

The Decentralized Registry employs a hybrid architecture combining on-chain and off-chain components:

```
┌─────────────────────────────────────────────────────────────┐
│                  Decentralized Registry                      │
├─────────────────┬─────────────────────┬─────────────────────┤
│   Blockchain    │    Distributed      │    Indexing &       │
│   Layer         │    Storage          │    Query Layer      │
│   (Polygon)     │    (IPFS)           │                     │
├─────────────────┴─────────────────────┴─────────────────────┤
│                  Access & Integration Layer                  │
└─────────────────────────────────────────────────────────────┘
```

### Blockchain Layer (Polygon)

The blockchain layer provides:
- Immutable record of agent registrations and updates
- Verifiable ownership and provenance
- Smart contracts for registry operations
- Decentralized governance mechanisms

Polygon was selected for its:
- Low transaction costs
- High throughput (>7,000 TPS)
- EVM compatibility
- Strong developer ecosystem
- Sustainability (Proof of Stake)

### Distributed Storage (IPFS)

IPFS stores larger agent metadata including:
- Detailed capability descriptions
- Documentation
- Sample inputs/outputs
- Performance benchmarks
- Historical versions

Content addressing ensures data integrity and enables efficient content distribution.

### Indexing & Query Layer

This layer provides:
- Fast, multi-dimensional queries across the registry
- Real-time updates from blockchain events
- Advanced filtering and sorting capabilities
- Semantic search functionality

### Access & Integration Layer

This layer offers:
- RESTful APIs for registry access
- GraphQL interface for complex queries
- WebSocket subscriptions for real-time updates
- SDK libraries for major programming languages

## Data Models

### Agent Record

The core data structure in the registry is the Agent Record:

```json
{
  "id": "did:agentnexus:123456789abcdefghi",
  "version": "1.2.0",
  "name": "CodeAnalyzer",
  "description": "AI agent specialized in code analysis and refactoring",
  "owner": "did:agentnexus:owner987654321",
  "created": "2025-01-15T08:30:00Z",
  "updated": "2025-03-10T14:22:15Z",
  "status": "active",
  "interfaces": ["uais-v1", "langchain-v1"],
  "capabilities": {
    "tasks": ["code-analysis", "refactoring", "documentation"],
    "languages": ["python", "javascript", "rust", "go"],
    "models": ["gpt-4", "claude-3"]
  },
  "endpoints": {
    "primary": "https://agents.agentnexus.io/123456789abcdefghi",
    "websocket": "wss://agents.agentnexus.io/123456789abcdefghi/ws"
  },
  "metadata": {
    "contentUri": "ipfs://bafybeigdyrzt5sfp7udm7hu76uh7y26nf3efuylqabf3oclgtqy55fbzdi",
    "contentHash": "sha256:7d865e959b2466918c9863afca942d0fb89d7c9ac0c99bafc3749504ded97730"
  },
  "metrics": {
    "reliability": 0.995,
    "averageResponseTime": 1200,
    "successRate": 0.98
  },
  "reputation": {
    "overallScore": 4.8,
    "totalReviews": 342,
    "verifiedByCount": 28
  },
  "license": "apache-2.0",
  "tags": ["development", "code-quality", "automation"],
  "signature": {
    "type": "Ed25519Signature2020",
    "verificationMethod": "did:agentnexus:owner987654321#keys-1",
    "signatureValue": "z58DAdFfa9SkqZMJPWsJ5uXnQHzMbS9iwzpbB2JLOVSbQVZ..."
  }
}
```

### Agent Metadata (IPFS)

Extended metadata stored on IPFS includes:

```json
{
  "id": "did:agentnexus:123456789abcdefghi",
  "version": "1.2.0",
  "detailedDescription": "CodeAnalyzer is an AI agent that specializes in analyzing code for bugs, security vulnerabilities, and performance issues. It can also suggest refactoring strategies and generate documentation.",
  "documentation": {
    "overview": "# CodeAnalyzer\n\nCodeAnalyzer helps developers improve their code quality...",
    "apiReference": "## API Reference\n\n### Code Analysis Endpoint\n...",
    "examples": [
      {
        "title": "Basic Code Review",
        "input": "def add(a, b):\n    return a + b",
        "output": "Function 'add' is simple and correct. Consider adding type hints: def add(a: int, b: int) -> int"
      }
    ]
  },
  "performance": {
    "benchmarks": [
      {
        "name": "Python Code Analysis",
        "score": 92.5,
        "comparisonGroup": "code-analysis-agents",
        "date": "2025-02-20T00:00:00Z"
      }
    ],
    "resourceRequirements": {
      "memory": "2GB",
      "cpu": "1 vCPU",
      "gpu": "None"
    }
  },
  "developmentHistory": {
    "initialRelease": "2024-11-05T00:00:00Z",
    "latestRelease": "2025-03-10T00:00:00Z",
    "changeLog": [
      {
        "version": "1.2.0",
        "date": "2025-03-10T00:00:00Z",
        "changes": [
          "Added support for Rust language",
          "Improved security vulnerability detection",
          "Reduced average response time by 15%"
        ]
      }
    ]
  },
  "detailedCapabilities": {
    "codeAnalysis": {
      "supportedAnalysisTypes": ["syntax", "semantics", "security", "performance", "style"],
      "maxCodeSizeBytes": 500000,
      "languageSpecificFeatures": {
        "python": ["type-checking", "pep8-compliance", "import-optimization"],
        "javascript": ["es6-modernization", "react-best-practices", "bundle-size-analysis"]
      }
    }
  }
}
```

### Agent Relationships

The registry also tracks relationships between agents:

```json
{
  "id": "relationship:agentnexus:abcdef123456",
  "type": "dependency",
  "source": "did:agentnexus:123456789abcdefghi",
  "target": "did:agentnexus:987654321ihgfedcba",
  "description": "CodeAnalyzer uses SecurityScanner for in-depth security analysis",
  "created": "2025-02-10T12:00:00Z",
  "metadata": {
    "optional": false,
    "minimumVersion": "2.1.0"
  },
  "signature": {
    "type": "Ed25519Signature2020",
    "verificationMethod": "did:agentnexus:owner987654321#keys-1",
    "signatureValue": "z58DAdFfa9SkqZMJPWsJ5uXnQHzMbS9iwzpbB2JLOVSbQVZ..."
  }
}
```

## Smart Contracts

The Decentralized Registry is governed by a set of smart contracts deployed on the Polygon blockchain:

### RegistryCore Contract

The main contract managing agent records:

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

contract RegistryCore {
    // Events
    event AgentRegistered(string did, address owner, uint256 timestamp);
    event AgentUpdated(string did, address owner, uint256 timestamp);
    event AgentDeactivated(string did, address owner, uint256 timestamp);
    event AgentReactivated(string did, address owner, uint256 timestamp);
    event OwnershipTransferred(string did, address previousOwner, address newOwner);
    
    // Agent status enum
    enum AgentStatus { Inactive, Active, Deprecated }
    
    // Agent record struct (on-chain data only)
    struct AgentRecord {
        string did;
        address owner;
        AgentStatus status;
        string version;
        uint256 createdAt;
        uint256 updatedAt;
        string metadataURI;
        bytes32 metadataHash;
    }
    
    // Mapping from DID to AgentRecord
    mapping(string => AgentRecord) private agents;
    
    // Mapping from owner address to array of owned DIDs
    mapping(address => string[]) private ownerAgents;
    
    // Register a new agent
    function registerAgent(
        string calldata did,
        string calldata version,
        string calldata metadataURI,
        bytes32 metadataHash
    ) external returns (bool) {
        require(bytes(agents[did].did).length == 0, "Agent already registered");
        
        agents[did] = AgentRecord({
            did: did,
            owner: msg.sender,
            status: AgentStatus.Active,
            version: version,
            createdAt: block.timestamp,
            updatedAt: block.timestamp,
            metadataURI: metadataURI,
            metadataHash: metadataHash
        });
        
        ownerAgents[msg.sender].push(did);
        
        emit AgentRegistered(did, msg.sender, block.timestamp);
        return true;
    }
    
    // Update an existing agent
    function updateAgent(
        string calldata did,
        string calldata version,
        string calldata metadataURI,
        bytes32 metadataHash
    ) external returns (bool) {
        require(bytes(agents[did].did).length > 0, "Agent not registered");
        require(agents[did].owner == msg.sender, "Not the agent owner");
        
        agents[did].version = version;
        agents[did].updatedAt = block.timestamp;
        agents[did].metadataURI = metadataURI;
        agents[did].metadataHash = metadataHash;
        
        emit AgentUpdated(did, msg.sender, block.timestamp);
        return true;
    }
    
    // Deactivate an agent
    function deactivateAgent(string calldata did) external returns (bool) {
        require(bytes(agents[did].did).length > 0, "Agent not registered");
        require(agents[did].owner == msg.sender, "Not the agent owner");
        require(agents[did].status == AgentStatus.Active, "Agent not active");
        
        agents[did].status = AgentStatus.Inactive;
        agents[did].updatedAt = block.timestamp;
        
        emit AgentDeactivated(did, msg.sender, block.timestamp);
        return true;
    }
    
    // Reactivate an agent
    function reactivateAgent(string calldata did) external returns (bool) {
        require(bytes(agents[did].did).length > 0, "Agent not registered");
        require(agents[did].owner == msg.sender, "Not the agent owner");
        require(agents[did].status == AgentStatus.Inactive, "Agent not inactive");
        
        agents[did].status = AgentStatus.Active;
        agents[did].updatedAt = block.timestamp;
        
        emit AgentReactivated(did, msg.sender, block.timestamp);
        return true;
    }
    
    // Transfer ownership of an agent
    function transferOwnership(string calldata did, address newOwner) external returns (bool) {
        require(bytes(agents[did].did).length > 0, "Agent not registered");
        require(agents[did].owner == msg.sender, "Not the agent owner");
        require(newOwner != address(0), "New owner cannot be zero address");
        
        address previousOwner = agents[did].owner;
        agents[did].owner = newOwner;
        agents[did].updatedAt = block.timestamp;
        
        // Remove from previous owner's list
        for (uint i = 0; i < ownerAgents[previousOwner].length; i++) {
            if (keccak256(bytes(ownerAgents[previousOwner][i])) == keccak256(bytes(did))) {
                ownerAgents[previousOwner][i] = ownerAgents[previousOwner][ownerAgents[previousOwner].length - 1];
                ownerAgents[previousOwner].pop();
                break;
            }
        }
        
        // Add to new owner's list
        ownerAgents[newOwner].push(did);
        
        emit OwnershipTransferred(did, previousOwner, newOwner);
        return true;
    }
    
    // Get agent record
    function getAgent(string calldata did) external view returns (AgentRecord memory) {
        require(bytes(agents[did].did).length > 0, "Agent not registered");
        return agents[did];
    }
    
    // Get agents owned by an address
    function getAgentsByOwner(address owner) external view returns (string[] memory) {
        return ownerAgents[owner];
    }
}
```

### RelationshipRegistry Contract

Manages relationships between agents:

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import "./RegistryCore.sol";

contract RelationshipRegistry {
    // Reference to the main registry
    RegistryCore private registryCore;
    
    // Events
    event RelationshipCreated(string id, string sourceAgent, string targetAgent, string relationshipType);
    event RelationshipUpdated(string id, string sourceAgent, string targetAgent);
    event RelationshipRemoved(string id);
    
    // Relationship struct
    struct Relationship {
        string id;
        string sourceAgent;
        string targetAgent;
        string relationshipType;
        string description;
        string metadataURI;
        uint256 createdAt;
        uint256 updatedAt;
    }
    
    // Mapping from relationship ID to Relationship
    mapping(string => Relationship) private relationships;
    
    // Mapping from agent DID to outgoing relationships
    mapping(string => string[]) private outgoingRelationships;
    
    // Mapping from agent DID to incoming relationships
    mapping(string => string[]) private incomingRelationships;
    
    constructor(address registryCoreAddress) {
        registryCore = RegistryCore(registryCoreAddress);
    }
    
    // Create a new relationship
    function createRelationship(
        string calldata id,
        string calldata sourceAgent,
        string calldata targetAgent,
        string calldata relationshipType,
        string calldata description,
        string calldata metadataURI
    ) external returns (bool) {
        // Verify source agent ownership
        RegistryCore.AgentRecord memory sourceRecord = registryCore.getAgent(sourceAgent);
        require(sourceRecord.owner == msg.sender, "Not the source agent owner");
        
        // Verify target agent exists
        registryCore.getAgent(targetAgent);
        
        // Create relationship
        relationships[id] = Relationship({
            id: id,
            sourceAgent: sourceAgent,
            targetAgent: targetAgent,
            relationshipType: relationshipType,
            description: description,
            metadataURI: metadataURI,
            createdAt: block.timestamp,
            updatedAt: block.timestamp
        });
        
        // Update relationship mappings
        outgoingRelationships[sourceAgent].push(id);
        incomingRelationships[targetAgent].push(id);
        
        emit RelationshipCreated(id, sourceAgent, targetAgent, relationshipType);
        return true;
    }
    
    // Update an existing relationship
    function updateRelationship(
        string calldata id,
        string calldata description,
        string calldata metadataURI
    ) external returns (bool) {
        require(bytes(relationships[id].id).length > 0, "Relationship not found");
        
        // Verify source agent ownership
        RegistryCore.AgentRecord memory sourceRecord = registryCore.getAgent(relationships[id].sourceAgent);
        require(sourceRecord.owner == msg.sender, "Not the source agent owner");
        
        // Update relationship
        relationships[id].description = description;
        relationships[id].metadataURI = metadataURI;
        relationships[id].updatedAt = block.timestamp;
        
        emit RelationshipUpdated(id, relationships[id].sourceAgent, relationships[id].targetAgent);
        return true;
    }
    
    // Remove a relationship
    function removeRelationship(string calldata id) external returns (bool) {
        require(bytes(relationships[id].id).length > 0, "Relationship not found");
        
        // Verify source agent ownership
        RegistryCore.AgentRecord memory sourceRecord = registryCore.getAgent(relationships[id].sourceAgent);
        require(sourceRecord.owner == msg.sender, "Not the source agent owner");
        
        string memory sourceAgent = relationships[id].sourceAgent;
        string memory targetAgent = relationships[id].targetAgent;
        
        // Remove from outgoing relationships
        for (uint i = 0; i < outgoingRelationships[sourceAgent].length; i++) {
            if (keccak256(bytes(outgoingRelationships[sourceAgent][i])) == keccak256(bytes(id))) {
                outgoingRelationships[sourceAgent][i] = outgoingRelationships[sourceAgent][outgoingRelationships[sourceAgent].length - 1];
                outgoingRelationships[sourceAgent].pop();
                break;
            }
        }
        
        // Remove from incoming relationships
        for (uint i = 0; i < incomingRelationships[targetAgent].length; i++) {
            if (keccak256(bytes(incomingRelationships[targetAgent][i])) == keccak256(bytes(id))) {
                incomingRelationships[targetAgent][i] = incomingRelationships[targetAgent][incomingRelationships[targetAgent].length - 1];
                incomingRelationships[targetAgent].pop();
                break;
            }
        }
        
        // Delete relationship
        delete relationships[id];
        
        emit RelationshipRemoved(id);
        return true;
    }
    
    // Get relationship by ID
    function getRelationship(string calldata id) external view returns (Relationship memory) {
        require(bytes(relationships[id].id).length > 0, "Relationship not found");
        return relationships[id];
    }
    
    // Get outgoing relationships for an agent
    function getOutgoingRelationships(string calldata agentDid) external view returns (string[] memory) {
        return outgoingRelationships[agentDid];
    }
    
    // Get incoming relationships for an agent
    function getIncomingRelationships(string calldata agentDid) external view returns (string[] memory) {
        return incomingRelationships[agentDid];
    }
}
```

### RegistryGovernance Contract

Manages governance of the registry:

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import "./RegistryCore.sol";

contract RegistryGovernance {
    // Reference to the main registry
    RegistryCore private registryCore;
    
    // Events
    event ProposalCreated(uint256 proposalId, address proposer, string description);
    event VoteCast(uint256 proposalId, address voter, bool support);
    event ProposalExecuted(uint256 proposalId);
    
    // Proposal status enum
    enum ProposalStatus { Pending, Active, Executed, Rejected, Expired }
    
    // Proposal struct
    struct Proposal {
        uint256 id;
        address proposer;
        string description;
        bytes callData;
        address targetContract;
        uint256 createdAt;
        uint256 votingEndsAt;
        uint256 yesVotes;
        uint256 noVotes;
        ProposalStatus status;
    }
    
    // Governance parameters
    uint256 public votingPeriod = 7 days;
    uint256 public executionThreshold = 100; // Simplified for example
    
    // Mapping from proposal ID to Proposal
    mapping(uint256 => Proposal) private proposals;
    
    // Mapping from proposal ID to voter address to whether they have voted
    mapping(uint256 => mapping(address => bool)) private hasVoted;
    
    // Current proposal count
    uint256 private proposalCount;
    
    constructor(address registryCoreAddress) {
        registryCore = RegistryCore(registryCoreAddress);
    }
    
    // Create a new governance proposal
    function createProposal(
        string calldata description,
        address targetContract,
        bytes calldata callData
    ) external returns (uint256) {
        // Simplified: In a real implementation, would check if proposer has enough reputation/tokens
        
        uint256 proposalId = proposalCount++;
        
        proposals[proposalId] = Proposal({
            id: proposalId,
            proposer: msg.sender,
            description: description,
            callData: callData,
            targetContract: targetContract,
            createdAt: block.timestamp,
            votingEndsAt: block.timestamp + votingPeriod,
            yesVotes: 0,
            noVotes: 0,
            status: ProposalStatus.Active
        });
        
        emit ProposalCreated(proposalId, msg.sender, description);
        return proposalId;
    }
    
    // Cast a vote on a proposal
    function castVote(uint256 proposalId, bool support) external returns (bool) {
        Proposal storage proposal = proposals[proposalId];
        
        require(proposal.status == ProposalStatus.Active, "Proposal not active");
        require(block.timestamp < proposal.votingEndsAt, "Voting period ended");
        require(!hasVoted[proposalId][msg.sender], "Already voted");
        
        // Simplified: In a real implementation, would weigh votes by reputation/tokens
        if (support) {
            proposal.yesVotes += 1;
        } else {
            proposal.noVotes += 1;
        }
        
        hasVoted[proposalId][msg.sender] = true;
        
        emit VoteCast(proposalId, msg.sender, support);
        return true;
    }
    
    // Execute a successful proposal
    function executeProposal(uint256 proposalId) external returns (bool) {
        Proposal storage proposal = proposals[proposalId];
        
        require(proposal.status == ProposalStatus.Active, "Proposal not active");
        require(block.timestamp >= proposal.votingEndsAt, "Voting period not ended");
        
        if (proposal.yesVotes > proposal.noVotes && proposal.yesVotes >= executionThreshold) {
            proposal.status = ProposalStatus.Executed;
            
            // Execute the proposal
            (bool success, ) = proposal.targetContract.call(proposal.callData);
            require(success, "Proposal execution failed");
            
            emit ProposalExecuted(proposalId);
        } else {
            proposal.status = ProposalStatus.Rejected;
        }
        
        return true;
    }
    
    // Get proposal details
    function getProposal(uint256 proposalId) external view returns (Proposal memory) {
        require(proposalId < proposalCount, "Proposal does not exist");
        return proposals[proposalId];
    }
    
    // Update governance parameters (would be controlled by governance itself)
    function updateGovernanceParameters(uint256 newVotingPeriod, uint256 newExecutionThreshold) external {
        // Simplified: In a real implementation, only governance itself could call this
        votingPeriod = newVotingPeriod;
        executionThreshold = newExecutionThreshold;
    }
}
```

## API Specification

The Decentralized Registry exposes the following APIs:

### RESTful API

#### Agent Registration and Management

```
POST /agents
```

Register a new agent in the registry.

Request body:
```json
{
  "name": "CodeAnalyzer",
  "description": "AI agent specialized in code analysis and refactoring",
  "version": "1.0.0",
  "interfaces": ["uais-v1", "langchain-v1"],
  "capabilities": {
    "tasks": ["code-analysis", "refactoring", "documentation"],
    "languages": ["python", "javascript"]
  },
  "endpoints": {
    "primary": "https://agents.agentnexus.io/123456789abcdefghi",
    "websocket": "wss://agents.agentnexus.io/123456789abcdefghi/ws"
  },
  "metadata": {
    "detailedDescription": "CodeAnalyzer is an AI agent that specializes in...",
    "documentation": {
      "overview": "# CodeAnalyzer\n\nCodeAnalyzer helps developers...",
      "apiReference": "## API Reference\n\n### Code Analysis Endpoint\n..."
    }
  },
  "license": "apache-2.0",
  "tags": ["development", "code-quality", "automation"]
}
```

```
GET /agents/{did}
```

Retrieve an agent by its DID.

```
PUT /agents/{did}
```

Update an existing agent.

```
DELETE /agents/{did}
```

Deactivate an agent (not permanently deleted).

#### Agent Discovery

```
GET /agents
```

List agents with optional filtering.

Query parameters:
- `capabilities`: Filter by capabilities (comma-separated)
- `interfaces`: Filter by supported interfaces (comma-separated)
- `tags`: Filter by tags (comma-separated)
- `owner`: Filter by owner DID
- `status`: Filter by status (active, inactive, deprecated)
- `sort`: Sort field (created, updated, reputation)
- `order`: Sort order (asc, desc)
- `limit`: Maximum number of results
- `offset`: Pagination offset

```
GET /agents/search
```

Search agents by keyword.

Query parameters:
- `q`: Search query
- `fields`: Fields to search (name, description, tags)
- Other parameters same as GET /agents

#### Relationship Management

```
POST /relationships
```

Create a relationship between agents.

```
GET /relationships/{id}
```

Retrieve a relationship by ID.

```
PUT /relationships/{id}
```

Update an existing relationship.

```
DELETE /relationships/{id}
```

Remove a relationship.

```
GET /agents/{did}/relationships
```

Get relationships for an agent.

Query parameters:
- `direction`: Filter by direction (incoming, outgoing, both)
- `type`: Filter by relationship type

### GraphQL API

For more complex queries, a GraphQL API is provided:

```graphql
type Agent {
  id: ID!
  version: String!
  name: String!
  description: String!
  owner: String!
  created: DateTime!
  updated: DateTime!
  status: AgentStatus!
  interfaces: [String!]!
  capabilities: Capabilities!
  endpoints: Endpoints!
  metadata: Metadata!
  metrics: Metrics
  reputation: Reputation
  license: String
  tags: [String!]
  outgoingRelationships: [Relationship!]
  incomingRelationships: [Relationship!]
}

type Relationship {
  id: ID!
  type: String!
  source: Agent!
  target: Agent!
  description: String
  created: DateTime!
  updated: DateTime!
  metadata: JSON
}

type Query {
  agent(id: ID!): Agent
  agents(
    capabilities: [String!],
    interfaces: [String!],
    tags: [String!],
    owner: String,
    status: AgentStatus,
    sort: String,
    order: SortOrder,
    limit: Int,
    offset: Int
  ): [Agent!]!
  
  searchAgents(
    query: String!,
    fields: [String!],
    limit: Int,
    offset: Int
  ): [Agent!]!
  
  relationship(id: ID!): Relationship
  
  agentRelationships(
    agentId: ID!,
    direction: RelationshipDirection,
    type: String
  ): [Relationship!]!
}

type Mutation {
  registerAgent(input: AgentInput!): Agent!
  updateAgent(id: ID!, input: AgentUpdateInput!): Agent!
  deactivateAgent(id: ID!): Boolean!
  reactivateAgent(id: ID!): Boolean!
  
  createRelationship(input: RelationshipInput!): Relationship!
  updateRelationship(id: ID!, input: RelationshipUpdateInput!): Relationship!
  removeRelationship(id: ID!): Boolean!
}

type Subscription {
  agentUpdated(id: ID!): Agent!
  newAgentRegistered(
    capabilities: [String!],
    interfaces: [String!],
    tags: [String!]
  ): Agent!
}
```

## Implementation Guidelines

### Agent Registration Process

1. **Generate DID**: Create a decentralized identifier for the agent
2. **Prepare Metadata**: Compile agent metadata including capabilities and documentation
3. **Upload to IPFS**: Store extended metadata on IPFS and obtain content URI and hash
4. **Submit Transaction**: Call the `registerAgent` function on the RegistryCore contract
5. **Index Creation**: The indexing service detects the blockchain event and creates search indices
6. **Verification**: Optional verification process to enhance agent trust score

### Agent Discovery Process

1. **Query Formulation**: User specifies search criteria (capabilities, interfaces, etc.)
2. **Index Search**: Query is executed against the indexing layer for fast results
3. **Result Filtering**: Results are filtered based on user permissions and preferences
4. **Metadata Enrichment**: Basic results are enriched with metadata from IPFS
5. **Presentation**: Results are formatted and presented to the user

### Relationship Management Process

1. **Identify Agents**: Determine source and target agents for the relationship
2. **Define Relationship**: Specify relationship type and metadata
3. **Submit Transaction**: Call the `createRelationship` function on the RelationshipRegistry contract
4. **Index Update**: The indexing service updates relationship indices
5. **Notification**: Optional notification to the target agent owner

## Security Considerations

### Authentication and Authorization

- **Blockchain Authentication**: Transactions are authenticated using blockchain wallet signatures
- **API Authentication**: APIs require authentication using JWT tokens or DID-based authentication
- **Authorization**: Access control based on ownership and delegation

### Data Integrity

- **Content Addressing**: IPFS content addressing ensures data integrity
- **Blockchain Immutability**: Registry records on the blockchain cannot be tampered with
- **Digital Signatures**: All registry entries are digitally signed by their owners

### Privacy

- **Selective Disclosure**: Agents can choose what information to make public
- **Private Metadata**: Sensitive metadata can be encrypted and shared selectively
- **Zero-Knowledge Proofs**: For verifying claims without revealing underlying data

## Scalability Strategy

### Sharding

The registry can be sharded based on:
- Agent capabilities
- Geographic regions
- Application domains

### Caching

- **Edge Caching**: Frequently accessed agent metadata cached at edge locations
- **Query Caching**: Common queries cached for faster response
- **Blockchain State Caching**: Recent blockchain state cached for quick access

### Indexing Optimization

- **Specialized Indices**: Custom indices for common query patterns
- **Incremental Updates**: Only changed data is re-indexed
- **Distributed Indexing**: Index computation distributed across nodes

## Governance Model

The Decentralized Registry is governed through:

### On-Chain Governance

- **Proposal System**: Community members can submit improvement proposals
- **Voting**: Reputation-weighted voting on proposals
- **Execution**: Automatic execution of approved proposals

### Registry Parameters

Governable parameters include:
- Registration fees
- Verification requirements
- Indexing priorities
- API rate limits

### Dispute Resolution

- **Flagging System**: Community can flag problematic agents
- **Review Process**: Flagged agents undergo review
- **Appeals**: Agent owners can appeal decisions

## Migration and Versioning

### Registry Versioning

- **Semantic Versioning**: Registry follows semantic versioning
- **Backward Compatibility**: New versions maintain backward compatibility
- **Migration Path**: Clear migration path for agents between versions

### Schema Evolution

- **Schema Versioning**: Data schemas are versioned
- **Compatibility Layer**: Translation between schema versions
- **Deprecation Policy**: Clear policy for deprecating old schemas

## Conclusion

The Decentralized Registry specification provides a robust foundation for the AGENTNEXUS platform, enabling efficient discovery, verification, and management of AI agents in a decentralized manner. By leveraging blockchain technology, distributed storage, and advanced indexing, the registry ensures data integrity, availability, and censorship resistance while supporting the scale and complexity required for a thriving AI agent ecosystem.

The hybrid architecture balances on-chain security with off-chain scalability, providing a flexible and future-proof solution that can evolve with the needs of the community. Through its comprehensive governance model, the registry can adapt to changing requirements while maintaining its core principles of decentralization and interoperability.
