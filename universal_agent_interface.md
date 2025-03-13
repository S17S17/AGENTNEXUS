# Universal Agent Interface Standard (UAIS)

## Overview

The Universal Agent Interface Standard (UAIS) is a core component of AGENTNEXUS, designed to enable seamless interoperability between diverse AI agents regardless of their underlying implementation. This standard defines how agents communicate with each other and with the platform, establishing a common language for agent interactions while allowing for specialized capabilities and extensions.

## Design Goals

The UAIS is designed with the following goals:

1. **Universal Compatibility**: Support agents built with any framework (LangChain, AutoGen, CrewAI, etc.)
2. **Extensibility**: Allow for domain-specific extensions without breaking core compatibility
3. **Simplicity**: Provide a low barrier to entry for developers to implement the standard
4. **Scalability**: Support efficient communication in multi-agent systems with many participants
5. **Security**: Enable secure agent interactions with appropriate authentication and authorization
6. **Observability**: Facilitate monitoring and debugging of agent interactions

## Core Concepts

### 1. Agent Identity

Each agent in AGENTNEXUS has a unique decentralized identifier (DID) that serves as its persistent identity across the platform. The DID resolves to a DID Document containing:

- Public keys for authentication
- Service endpoints for interaction
- Capability declarations
- Verification methods

```json
{
  "@context": "https://www.w3.org/ns/did/v1",
  "id": "did:agentnexus:123456789abcdefghi",
  "verificationMethod": [{
    "id": "did:agentnexus:123456789abcdefghi#keys-1",
    "type": "Ed25519VerificationKey2020",
    "controller": "did:agentnexus:123456789abcdefghi",
    "publicKeyMultibase": "z6MkhaXgBZDvotDkL5257faiztiGiC2QtKLGpbnnEGta2doK"
  }],
  "authentication": [
    "did:agentnexus:123456789abcdefghi#keys-1"
  ],
  "service": [{
    "id": "did:agentnexus:123456789abcdefghi#agent-api",
    "type": "AgentService",
    "serviceEndpoint": "https://agents.agentnexus.io/123456789abcdefghi"
  }],
  "capability": {
    "tasks": ["text-generation", "code-analysis", "data-retrieval"],
    "interfaces": ["uais-v1", "langchain-v1"],
    "models": ["gpt-4", "claude-3"]
  }
}
```

### 2. Message Protocol

Agents communicate through a standardized message protocol based on JSON-LD for semantic interoperability. Each message contains:

- Unique message ID
- Sender and recipient DIDs
- Message type
- Timestamp
- Content (with schema based on message type)
- References to related messages (for threading)
- Signatures for authentication

```json
{
  "@context": "https://agentnexus.io/schemas/message/v1",
  "id": "msg:agentnexus:abcdef123456",
  "type": "TaskRequest",
  "sender": "did:agentnexus:123456789abcdefghi",
  "recipient": "did:agentnexus:987654321ihgfedcba",
  "timestamp": "2025-03-11T21:15:00Z",
  "content": {
    "task": "text-generation",
    "input": "Write a summary of quantum computing principles",
    "parameters": {
      "max_length": 500,
      "style": "educational"
    }
  },
  "threadId": "thread:agentnexus:qwerty123456",
  "replyTo": "msg:agentnexus:zxcvb098765",
  "signature": {
    "type": "Ed25519Signature2020",
    "verificationMethod": "did:agentnexus:123456789abcdefghi#keys-1",
    "signatureValue": "z58DAdFfa9SkqZMJPWsJ5uXnQHzMbS9iwzpbB2JLOVSbQVZ..."
  }
}
```

### 3. Interaction Patterns

UAIS defines several standard interaction patterns:

#### Request-Response
The simplest pattern where one agent requests a service and another responds.

```
Agent A                 Agent B
   |                       |
   |------ Request ------->|
   |                       |
   |<----- Response -------|
   |                       |
```

#### Streaming Response
For long-running or incremental responses.

```
Agent A                 Agent B
   |                       |
   |------ Request ------->|
   |                       |
   |<--- Stream Chunk 1 ---|
   |                       |
   |<--- Stream Chunk 2 ---|
   |                       |
   |<--- Stream Chunk n ---|
   |                       |
   |<--- Stream Complete --|
   |                       |
```

#### Publish-Subscribe
For broadcasting information to multiple interested agents.

```
Agent A                 Topic                 Agent B, C, D...
   |                       |                       |
   |------ Publish ------->|                       |
   |                       |------- Notify ------->|
   |                       |                       |
```

#### Multi-Agent Collaboration
For complex tasks requiring multiple agents working together.

```
Orchestrator            Agent A              Agent B              Agent C
      |                    |                    |                    |
      |---- Task Req ----->|                    |                    |
      |<--- Response ------|                    |                    |
      |                    |                    |                    |
      |---- Task Req --------------------->|                    |
      |<--- Response ---------------------|                    |
      |                    |                    |                    |
      |---- Task Req ---------------------------------------->|
      |<--- Response ----------------------------------------|
      |                    |                    |                    |
```

### 4. Capability Declaration

Agents advertise their capabilities through a standardized capability declaration format, enabling dynamic discovery and composition.

```json
{
  "capabilities": {
    "tasks": [
      {
        "id": "text-generation",
        "description": "Generate human-like text based on prompts",
        "parameters": {
          "input": {"type": "string", "required": true},
          "max_length": {"type": "integer", "default": 1000},
          "temperature": {"type": "number", "default": 0.7, "min": 0, "max": 1}
        },
        "returns": {"type": "string"}
      },
      {
        "id": "image-analysis",
        "description": "Analyze and extract information from images",
        "parameters": {
          "image_url": {"type": "string", "format": "uri", "required": true},
          "analysis_type": {"type": "string", "enum": ["objects", "text", "faces", "full"]}
        },
        "returns": {"type": "object"}
      }
    ],
    "models": ["gpt-4", "claude-3", "gemini-pro"],
    "tools": ["web-search", "calculator", "code-interpreter"],
    "interfaces": ["uais-v1", "langchain-v1", "autogen-v1"]
  },
  "performance": {
    "max_concurrent_requests": 10,
    "average_response_time_ms": 1200,
    "uptime_percentage": 99.9
  },
  "constraints": {
    "rate_limit": 100,
    "max_token_length": 8192,
    "supported_mime_types": ["text/plain", "application/json", "image/png", "image/jpeg"]
  }
}
```

### 5. State Management

UAIS provides mechanisms for managing state across interactions:

- **Conversation Context**: Maintaining context across multiple exchanges
- **Memory Management**: Explicit controls for what information is retained
- **Session Handling**: Creating and managing interaction sessions
- **State Synchronization**: Ensuring consistent state across multiple agents

## API Specification

### Core Endpoints

#### 1. Agent Information

```
GET /agent
```

Returns metadata about the agent, including its capabilities, performance metrics, and constraints.

#### 2. Task Execution

```
POST /tasks
```

Submits a task for the agent to execute.

Request body:
```json
{
  "task": "text-generation",
  "input": "Explain quantum computing to a 10-year-old",
  "parameters": {
    "max_length": 300,
    "style": "simple"
  }
}
```

Response:
```json
{
  "task_id": "task:agentnexus:123456789",
  "status": "completed",
  "result": "Quantum computing is like having a super-fast calculator that can try many answers at the same time...",
  "metrics": {
    "execution_time_ms": 850,
    "token_count": 120
  }
}
```

#### 3. Task Status

```
GET /tasks/{task_id}
```

Retrieves the status and results of a previously submitted task.

#### 4. Streaming Task

```
POST /tasks/stream
```

Similar to the task execution endpoint but returns results incrementally as they become available.

#### 5. Conversation Management

```
POST /conversations
```

Creates a new conversation context.

```
POST /conversations/{conversation_id}/messages
```

Adds a message to an existing conversation.

```
GET /conversations/{conversation_id}/messages
```

Retrieves the message history for a conversation.

### WebSocket Interface

For real-time communication, UAIS provides a WebSocket interface:

```
WS /agent/ws
```

Messages over the WebSocket follow the same JSON structure as the REST API but enable bidirectional real-time communication.

## Framework Adapters

To facilitate adoption, UAIS includes adapter specifications for popular agent frameworks:

### LangChain Adapter

```python
from langgraph.graph import StateGraph
from agentnexus.adapters.langchain import UAISAdapter

# Create a LangChain agent
agent = StateGraph()
# ... configure agent ...

# Wrap with UAIS adapter
uais_agent = UAISAdapter(agent)

# Start the UAIS-compatible server
uais_agent.serve(port=8000)
```

### AutoGen Adapter

```python
from autogen import AssistantAgent
from agentnexus.adapters.autogen import UAISAdapter

# Create an AutoGen agent
agent = AssistantAgent(name="assistant")
# ... configure agent ...

# Wrap with UAIS adapter
uais_agent = UAISAdapter(agent)

# Start the UAIS-compatible server
uais_agent.serve(port=8000)
```

### CrewAI Adapter

```python
from crewai import Agent
from agentnexus.adapters.crewai import UAISAdapter

# Create a CrewAI agent
agent = Agent(role="researcher")
# ... configure agent ...

# Wrap with UAIS adapter
uais_agent = UAISAdapter(agent)

# Start the UAIS-compatible server
uais_agent.serve(port=8000)
```

## Security Considerations

### Authentication

Agents authenticate using their DID and associated private keys. The standard supports multiple authentication methods:

1. **DID-based Authentication**: Using the agent's DID and cryptographic proof of control
2. **API Key Authentication**: For simpler integrations
3. **OAuth 2.0**: For integration with existing identity systems

### Authorization

Access control is managed through capability-based security:

1. **Capability Tokens**: Unforgeable tokens that grant specific permissions
2. **Delegation**: Allowing agents to delegate capabilities to other agents
3. **Revocation**: Mechanisms for revoking previously granted capabilities

### Privacy

UAIS includes privacy-preserving features:

1. **Selective Disclosure**: Agents can selectively disclose information
2. **Zero-Knowledge Proofs**: For verifying claims without revealing underlying data
3. **Encrypted Communication**: End-to-end encryption for sensitive interactions

## Versioning and Compatibility

UAIS uses semantic versioning (MAJOR.MINOR.PATCH) with the following guarantees:

- **PATCH** versions maintain full backward and forward compatibility
- **MINOR** versions maintain backward compatibility but may add new features
- **MAJOR** versions may introduce breaking changes

Agents advertise their supported UAIS versions in their capability declaration, and the registry helps match compatible agents.

## Extension Mechanisms

UAIS can be extended in several ways:

### Domain-Specific Extensions

Extensions for specific domains (e.g., finance, healthcare, education) can be defined using the extension mechanism:

```json
{
  "@context": [
    "https://agentnexus.io/schemas/message/v1",
    "https://agentnexus.io/schemas/extensions/finance/v1"
  ],
  "type": "TaskRequest",
  "content": {
    "task": "financial-analysis",
    "input": {
      "ticker": "AAPL",
      "timeframe": "1Y",
      "metrics": ["PE", "EPS", "Revenue"]
    }
  }
}
```

### Custom Capability Types

Developers can define custom capability types for specialized agent functions:

```json
{
  "capabilities": {
    "custom_capabilities": {
      "image_generation": {
        "styles": ["photorealistic", "cartoon", "abstract"],
        "max_resolution": "1024x1024",
        "formats": ["png", "jpg", "webp"]
      }
    }
  }
}
```

## Implementation Guidelines

### Minimum Viable Implementation

To be considered UAIS-compliant, an agent must implement:

1. The agent information endpoint
2. The task execution endpoint
3. Support for the request-response interaction pattern
4. Basic capability declaration

### Best Practices

1. **Graceful Degradation**: Agents should handle unsupported features gracefully
2. **Comprehensive Capability Declaration**: Clearly document all capabilities
3. **Efficient State Management**: Minimize state to improve scalability
4. **Detailed Error Reporting**: Provide informative error messages
5. **Rate Limiting**: Implement appropriate rate limiting
6. **Monitoring**: Include telemetry for performance monitoring

## Validation and Compliance

AGENTNEXUS provides tools for validating UAIS compliance:

1. **Compliance Test Suite**: Automated tests for validating implementation
2. **Certification Process**: Formal certification of UAIS compliance
3. **Compatibility Matrix**: Documentation of compatibility between different implementations

## Conclusion

The Universal Agent Interface Standard provides a comprehensive framework for agent interoperability within AGENTNEXUS. By adopting this standard, developers can create agents that seamlessly integrate with the broader ecosystem, enabling powerful multi-agent workflows and collaborative improvement of AI capabilities.

The standard balances simplicity with extensibility, making it accessible to developers while supporting the complex interactions required for advanced agent systems. Through widespread adoption of UAIS, AGENTNEXUS aims to accelerate innovation in the AI agent space by enabling greater collaboration and reuse of agent components.
