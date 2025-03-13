/**
 * Hardhat configuration for AGENTNEXUS blockchain development
 */

require('dotenv').config();
require('@nomiclabs/hardhat-waffle');
require('@nomiclabs/hardhat-ethers');

// Load environment variables
const POLYGON_PRIVATE_KEY = process.env.POLYGON_PRIVATE_KEY || '';
const POLYGON_RPC_URL = process.env.POLYGON_RPC_URL || 'https://rpc-mumbai.maticvigil.com';

// Hardhat configuration
module.exports = {
  solidity: {
    version: '0.8.20',
    settings: {
      optimizer: {
        enabled: true,
        runs: 200
      }
    }
  },
  networks: {
    // Local development network
    hardhat: {
      chainId: 1337
    },
    // Polygon Mumbai testnet
    polygon_mumbai: {
      url: POLYGON_RPC_URL,
      accounts: POLYGON_PRIVATE_KEY ? [POLYGON_PRIVATE_KEY] : [],
      gasPrice: 8000000000 // 8 Gwei
    },
    // Polygon mainnet (for production)
    polygon_mainnet: {
      url: process.env.POLYGON_MAINNET_RPC_URL || 'https://polygon-rpc.com',
      accounts: POLYGON_PRIVATE_KEY ? [POLYGON_PRIVATE_KEY] : [],
      gasPrice: 30000000000 // 30 Gwei
    }
  },
  paths: {
    sources: './src/blockchain/contracts',
    tests: './src/blockchain/test',
    cache: './cache',
    artifacts: './artifacts'
  },
  mocha: {
    timeout: 40000
  }
}; 