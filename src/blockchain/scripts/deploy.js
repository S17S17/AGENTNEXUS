/**
 * Deployment script for the AgentRegistry smart contract
 */

const { ethers } = require('hardhat');
const fs = require('fs');
const path = require('path');

async function main() {
  console.log('Deploying AgentRegistry contract...');
  
  // Get the deployer account
  const [deployer] = await ethers.getSigners();
  console.log(`Deploying with account: ${deployer.address}`);
  
  // Deploy the contract
  const AgentRegistry = await ethers.getContractFactory('AgentRegistry');
  const registry = await AgentRegistry.deploy(deployer.address);
  
  // Wait for deployment to complete
  await registry.deployed();
  
  console.log(`AgentRegistry deployed to: ${registry.address}`);
  
  // Update the .env file with the contract address
  updateEnvFile(registry.address);
  
  // Export the ABI
  exportABI();
  
  console.log('Deployment completed successfully!');
}

/**
 * Update the .env file with the contract address
 * 
 * @param {string} contractAddress - The deployed contract address
 */
function updateEnvFile(contractAddress) {
  try {
    const envPath = path.resolve(__dirname, '../../../.env');
    let envContent = '';
    
    // Read existing .env file if it exists
    if (fs.existsSync(envPath)) {
      envContent = fs.readFileSync(envPath, 'utf8');
    }
    
    // Check if REGISTRY_CONTRACT_ADDRESS already exists
    if (envContent.includes('REGISTRY_CONTRACT_ADDRESS=')) {
      // Replace existing value
      envContent = envContent.replace(
        /REGISTRY_CONTRACT_ADDRESS=.*/,
        `REGISTRY_CONTRACT_ADDRESS=${contractAddress}`
      );
    } else {
      // Add new value
      envContent += `\nREGISTRY_CONTRACT_ADDRESS=${contractAddress}`;
    }
    
    // Write updated content back to .env file
    fs.writeFileSync(envPath, envContent);
    
    console.log(`Updated .env file with contract address: ${contractAddress}`);
  } catch (error) {
    console.error('Failed to update .env file:', error);
  }
}

/**
 * Export the ABI to the abi directory
 */
function exportABI() {
  try {
    const contractPath = path.resolve(__dirname, '../contracts/AgentRegistry.sol');
    const abiPath = path.resolve(__dirname, '../abi/Registry.json');
    
    // Get the ABI from the compiled contract
    const artifact = require(`../../../artifacts/contracts/AgentRegistry.sol/AgentRegistry.json`);
    
    // Create the abi directory if it doesn't exist
    const abiDir = path.dirname(abiPath);
    if (!fs.existsSync(abiDir)) {
      fs.mkdirSync(abiDir, { recursive: true });
    }
    
    // Write the ABI to the file
    fs.writeFileSync(
      abiPath,
      JSON.stringify({ abi: artifact.abi }, null, 2)
    );
    
    console.log(`Exported ABI to: ${abiPath}`);
  } catch (error) {
    console.error('Failed to export ABI:', error);
  }
}

// Execute the deployment
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error('Deployment failed:', error);
    process.exit(1);
  }); 