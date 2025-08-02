#!/usr/bin/env node

/**
 * Wallet Integration Setup Script
 * 
 * This script helps set up the wallet integration for the Sidebets frontend.
 * It checks for required dependencies, validates configuration, and provides
 * helpful setup instructions.
 */

const fs = require('fs');
const path = require('path');

console.log('🎯 Sidebets Wallet Integration Setup\n');

// Check if we're in the frontend directory
const packageJsonPath = path.join(process.cwd(), 'package.json');
if (!fs.existsSync(packageJsonPath)) {
  console.error('❌ Error: Please run this script from the frontend directory');
  process.exit(1);
}

// Read package.json
const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));

console.log('📋 Checking dependencies...');

// Check required dependencies
const requiredDeps = [
  'ethers',
  'framer-motion',
  'lucide-react',
  'react',
  'react-dom'
];

const missingDeps = requiredDeps.filter(dep => !packageJson.dependencies[dep]);

if (missingDeps.length > 0) {
  console.log('⚠️  Missing dependencies:');
  missingDeps.forEach(dep => console.log(`   - ${dep}`));
  console.log('\n💡 Run: npm install');
} else {
  console.log('✅ All required dependencies found');
}

// Check deployment info
const deploymentInfoPath = path.join(process.cwd(), 'public', 'deployment-info.json');
if (!fs.existsSync(deploymentInfoPath)) {
  console.log('\n⚠️  deployment-info.json not found');
  console.log('💡 Creating template...');
  
  const template = {
    "mockUSDC": "0x0000000000000000000000000000000000000000",
    "sidebetFactory": "0x0000000000000000000000000000000000000000",
    "network": "monad-testnet",
    "chainId": 1337,
    "rpcUrl": "https://rpc.testnet.monad.xyz",
    "explorer": "https://explorer.testnet.monad.xyz"
  };
  
  fs.writeFileSync(deploymentInfoPath, JSON.stringify(template, null, 2));
  console.log('✅ Created deployment-info.json template');
} else {
  console.log('✅ deployment-info.json found');
  
  // Validate deployment info
  try {
    const deploymentInfo = JSON.parse(fs.readFileSync(deploymentInfoPath, 'utf8'));
    const requiredFields = ['mockUSDC', 'sidebetFactory', 'network', 'chainId'];
    const missingFields = requiredFields.filter(field => !deploymentInfo[field]);
    
    if (missingFields.length > 0) {
      console.log('⚠️  Missing fields in deployment-info.json:');
      missingFields.forEach(field => console.log(`   - ${field}`));
    } else {
      console.log('✅ deployment-info.json is properly configured');
    }
  } catch (error) {
    console.log('❌ Error reading deployment-info.json:', error.message);
  }
}

// Check for environment file
const envPath = path.join(process.cwd(), '.env');
if (!fs.existsSync(envPath)) {
  console.log('\n⚠️  .env file not found');
  console.log('💡 Creating .env template...');
  
  const envTemplate = `# Wallet Integration Environment Variables
# Optional: Override default RPC URLs
REACT_APP_MONAD_RPC_URL=https://rpc.testnet.monad.xyz
REACT_APP_ETHEREUM_RPC_URL=https://mainnet.infura.io/v3/YOUR_KEY
REACT_APP_POLYGON_RPC_URL=https://polygon-rpc.com

# Development settings
REACT_APP_DEBUG=true
REACT_APP_LOG_LEVEL=info
`;
  
  fs.writeFileSync(envPath, envTemplate);
  console.log('✅ Created .env template');
} else {
  console.log('✅ .env file found');
}

console.log('\n🚀 Setup Instructions:');
console.log('1. Deploy your smart contracts and update deployment-info.json');
console.log('2. Install MetaMask and/or Phantom wallet extensions');
console.log('3. Run: npm start');
console.log('4. Click "Connect Wallet" in the navbar');
console.log('5. Select your preferred wallet and network');

console.log('\n📚 Documentation:');
console.log('- Wallet Integration Guide: WALLET_INTEGRATION.md');
console.log('- Component Documentation: src/components/');
console.log('- Context Documentation: src/context/');

console.log('\n🧪 Testing:');
console.log('- Test wallet connections on different networks');
console.log('- Verify contract interactions work correctly');
console.log('- Check mobile responsiveness');

console.log('\n✅ Setup complete! Happy betting! 🎲\n'); 