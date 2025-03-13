/**
 * Tests for the AgentRegistry smart contract
 */

const { expect } = require('chai');
const { ethers } = require('hardhat');

describe('AgentRegistry', function () {
  let AgentRegistry;
  let registry;
  let owner;
  let user1;
  let user2;
  
  // Test agent data
  const agentId = 'agent-123';
  const agentDid = 'did:agentnexus:123456789abcdef';
  const metadataUri = 'ipfs://QmXyZ123456789';
  const ownerId = 'user-123';
  
  // Deploy the contract before each test
  beforeEach(async function () {
    // Get signers
    [owner, user1, user2] = await ethers.getSigners();
    
    // Deploy the contract
    AgentRegistry = await ethers.getContractFactory('AgentRegistry');
    registry = await AgentRegistry.deploy(owner.address);
    await registry.deployed();
  });
  
  describe('Deployment', function () {
    it('Should set the right owner', async function () {
      expect(await registry.owner()).to.equal(owner.address);
    });
  });
  
  describe('Agent Registration', function () {
    it('Should register a new agent', async function () {
      // Register agent
      await registry.registerAgent(agentId, agentDid, metadataUri, ownerId);
      
      // Check if agent exists
      expect(await registry.agentExists(agentId)).to.equal(true);
      
      // Get agent data
      const agent = await registry.getAgent(agentId);
      
      // Verify agent data
      expect(agent.id).to.equal(agentId);
      expect(agent.did).to.equal(agentDid);
      expect(agent.metadataUri).to.equal(metadataUri);
      expect(agent.ownerId).to.equal(ownerId);
      expect(agent.active).to.equal(true);
      expect(agent.exists).to.equal(true);
    });
    
    it('Should fail to register an agent with an existing ID', async function () {
      // Register agent
      await registry.registerAgent(agentId, agentDid, metadataUri, ownerId);
      
      // Try to register again with the same ID
      await expect(
        registry.registerAgent(agentId, agentDid, metadataUri, ownerId)
      ).to.be.revertedWith('Agent already exists');
    });
  });
  
  describe('Agent Updates', function () {
    beforeEach(async function () {
      // Register agent
      await registry.registerAgent(agentId, agentDid, metadataUri, ownerId);
    });
    
    it('Should update agent metadata', async function () {
      // New metadata URI
      const newMetadataUri = 'ipfs://QmNewUri123456';
      
      // Update agent
      await registry.updateAgent(agentId, newMetadataUri);
      
      // Get updated agent
      const agent = await registry.getAgent(agentId);
      
      // Verify updated metadata
      expect(agent.metadataUri).to.equal(newMetadataUri);
    });
    
    it('Should fail to update a non-existent agent', async function () {
      await expect(
        registry.updateAgent('non-existent-agent', 'ipfs://QmNewUri')
      ).to.be.revertedWith('Agent does not exist');
    });
  });
  
  describe('Agent Deactivation', function () {
    beforeEach(async function () {
      // Register agent
      await registry.registerAgent(agentId, agentDid, metadataUri, ownerId);
    });
    
    it('Should deactivate an agent', async function () {
      // Deactivate agent
      await registry.deactivateAgent(agentId);
      
      // Get agent
      const agent = await registry.getAgent(agentId);
      
      // Verify agent is inactive
      expect(agent.active).to.equal(false);
      
      // Check isAgentActive function
      expect(await registry.isAgentActive(agentId)).to.equal(false);
    });
    
    it('Should reactivate a deactivated agent', async function () {
      // Deactivate agent
      await registry.deactivateAgent(agentId);
      
      // Reactivate agent
      await registry.reactivateAgent(agentId);
      
      // Get agent
      const agent = await registry.getAgent(agentId);
      
      // Verify agent is active
      expect(agent.active).to.equal(true);
      
      // Check isAgentActive function
      expect(await registry.isAgentActive(agentId)).to.equal(true);
    });
    
    it('Should fail to deactivate a non-existent agent', async function () {
      await expect(
        registry.deactivateAgent('non-existent-agent')
      ).to.be.revertedWith('Agent does not exist');
    });
    
    it('Should fail to deactivate an already inactive agent', async function () {
      // Deactivate agent
      await registry.deactivateAgent(agentId);
      
      // Try to deactivate again
      await expect(
        registry.deactivateAgent(agentId)
      ).to.be.revertedWith('Agent is already inactive');
    });
  });
  
  describe('Owner Agents', function () {
    it('Should get all agents for an owner', async function () {
      // Register multiple agents for the same owner
      await registry.registerAgent('agent-1', 'did:agentnexus:1', 'ipfs://uri1', ownerId);
      await registry.registerAgent('agent-2', 'did:agentnexus:2', 'ipfs://uri2', ownerId);
      await registry.registerAgent('agent-3', 'did:agentnexus:3', 'ipfs://uri3', ownerId);
      
      // Register an agent for a different owner
      await registry.registerAgent('agent-4', 'did:agentnexus:4', 'ipfs://uri4', 'other-owner');
      
      // Get owner agents
      const ownerAgents = await registry.getOwnerAgents(ownerId);
      
      // Verify owner has 3 agents
      expect(ownerAgents.length).to.equal(3);
      expect(ownerAgents).to.include('agent-1');
      expect(ownerAgents).to.include('agent-2');
      expect(ownerAgents).to.include('agent-3');
      expect(ownerAgents).to.not.include('agent-4');
    });
    
    it('Should verify ownership correctly', async function () {
      // Register agent
      await registry.registerAgent(agentId, agentDid, metadataUri, ownerId);
      
      // Check ownership
      expect(await registry.isOwner(agentId, ownerId)).to.equal(true);
      expect(await registry.isOwner(agentId, 'other-owner')).to.equal(false);
      expect(await registry.isOwner('non-existent-agent', ownerId)).to.equal(false);
    });
  });
}); 