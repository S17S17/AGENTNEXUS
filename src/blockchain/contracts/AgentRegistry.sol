// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Strings.sol";

/**
 * @title AgentRegistry
 * @dev A registry for AI agents on the AGENTNEXUS platform
 */
contract AgentRegistry is Ownable {
    // Agent structure
    struct Agent {
        string id;
        string did;
        string metadataUri;
        string ownerId;
        uint256 registeredAt;
        uint256 updatedAt;
        bool active;
        bool exists;
    }
    
    // Mapping from agent ID to Agent
    mapping(string => Agent) private agents;
    
    // Mapping from owner ID to array of agent IDs
    mapping(string => string[]) private ownerAgents;
    
    // Events
    event AgentRegistered(string indexed agentId, string did, string metadataUri, string ownerId);
    event AgentUpdated(string indexed agentId, string metadataUri);
    event AgentDeactivated(string indexed agentId);
    event AgentReactivated(string indexed agentId);
    
    /**
     * @dev Constructor
     * @param initialOwner The initial owner of the contract
     */
    constructor(address initialOwner) Ownable(initialOwner) {}
    
    /**
     * @dev Register a new agent
     * @param id The agent ID
     * @param did The agent DID
     * @param metadataUri The IPFS URI of the agent metadata
     * @param ownerId The ID of the agent owner
     */
    function registerAgent(
        string memory id,
        string memory did,
        string memory metadataUri,
        string memory ownerId
    ) public {
        // Check if agent already exists
        require(!agents[id].exists, "Agent already exists");
        
        // Create agent
        Agent memory agent = Agent({
            id: id,
            did: did,
            metadataUri: metadataUri,
            ownerId: ownerId,
            registeredAt: block.timestamp,
            updatedAt: block.timestamp,
            active: true,
            exists: true
        });
        
        // Store agent
        agents[id] = agent;
        
        // Add agent to owner's list
        ownerAgents[ownerId].push(id);
        
        // Emit event
        emit AgentRegistered(id, did, metadataUri, ownerId);
    }
    
    /**
     * @dev Get agent data
     * @param id The agent ID
     * @return The agent data
     */
    function getAgent(string memory id) public view returns (Agent memory) {
        return agents[id];
    }
    
    /**
     * @dev Update agent metadata
     * @param id The agent ID
     * @param metadataUri The new IPFS URI of the agent metadata
     */
    function updateAgent(string memory id, string memory metadataUri) public {
        // Check if agent exists
        require(agents[id].exists, "Agent does not exist");
        
        // Check if caller is the owner of the agent
        require(
            keccak256(abi.encodePacked(agents[id].ownerId)) == keccak256(abi.encodePacked(msg.sender.toString())),
            "Only the owner can update the agent"
        );
        
        // Update agent
        agents[id].metadataUri = metadataUri;
        agents[id].updatedAt = block.timestamp;
        
        // Emit event
        emit AgentUpdated(id, metadataUri);
    }
    
    /**
     * @dev Deactivate an agent
     * @param id The agent ID
     */
    function deactivateAgent(string memory id) public {
        // Check if agent exists
        require(agents[id].exists, "Agent does not exist");
        
        // Check if agent is active
        require(agents[id].active, "Agent is already inactive");
        
        // Check if caller is the owner of the agent
        require(
            keccak256(abi.encodePacked(agents[id].ownerId)) == keccak256(abi.encodePacked(msg.sender.toString())),
            "Only the owner can deactivate the agent"
        );
        
        // Deactivate agent
        agents[id].active = false;
        agents[id].updatedAt = block.timestamp;
        
        // Emit event
        emit AgentDeactivated(id);
    }
    
    /**
     * @dev Reactivate an agent
     * @param id The agent ID
     */
    function reactivateAgent(string memory id) public {
        // Check if agent exists
        require(agents[id].exists, "Agent does not exist");
        
        // Check if agent is inactive
        require(!agents[id].active, "Agent is already active");
        
        // Check if caller is the owner of the agent
        require(
            keccak256(abi.encodePacked(agents[id].ownerId)) == keccak256(abi.encodePacked(msg.sender.toString())),
            "Only the owner can reactivate the agent"
        );
        
        // Reactivate agent
        agents[id].active = true;
        agents[id].updatedAt = block.timestamp;
        
        // Emit event
        emit AgentReactivated(id);
    }
    
    /**
     * @dev Get all agents for an owner
     * @param ownerId The owner ID
     * @return The agent IDs
     */
    function getOwnerAgents(string memory ownerId) public view returns (string[] memory) {
        return ownerAgents[ownerId];
    }
    
    /**
     * @dev Check if an agent exists
     * @param id The agent ID
     * @return Whether the agent exists
     */
    function agentExists(string memory id) public view returns (bool) {
        return agents[id].exists;
    }
    
    /**
     * @dev Check if an agent is active
     * @param id The agent ID
     * @return Whether the agent is active
     */
    function isAgentActive(string memory id) public view returns (bool) {
        return agents[id].exists && agents[id].active;
    }
    
    /**
     * @dev Check if an owner owns an agent
     * @param id The agent ID
     * @param ownerId The owner ID
     * @return Whether the owner owns the agent
     */
    function isOwner(string memory id, string memory ownerId) public view returns (bool) {
        return agents[id].exists && 
               keccak256(abi.encodePacked(agents[id].ownerId)) == keccak256(abi.encodePacked(ownerId));
    }
} 