# 🎯 Wallet Integration Guide - Sidebets Frontend

This document outlines the comprehensive wallet integration system implemented for the Sidebets frontend, supporting both MetaMask and Phantom wallets.

## 🚀 Features

### ✅ Multi-Wallet Support
- **MetaMask**: Full Ethereum/EVM chain support
- **Phantom**: Solana blockchain support
- **Auto-detection**: Automatically detects available wallets
- **Fallback handling**: Graceful handling when wallets aren't available

### ✅ Network Management
- **Multi-network support**: Ethereum, Polygon, Monad Testnet, Mumbai Testnet
- **Network switching**: Seamless network switching within MetaMask
- **Auto-network addition**: Automatically adds networks if not present
- **Network validation**: Validates current network for transactions

### ✅ User Experience
- **Modern UI**: Beautiful, responsive wallet connection modal
- **Real-time updates**: Live balance and network information
- **Error handling**: Comprehensive error messages and recovery
- **Loading states**: Smooth loading animations and feedback
- **Mobile responsive**: Works perfectly on all device sizes

## 🏗️ Architecture

### Context Structure
```
WalletContext (Wallet Management)
├── Account management
├── Provider/signer handling
├── Network switching
├── Balance tracking
└── Event listeners

BettingContext (Betting Logic)
├── Contract interactions
├── Bet management
├── Token balances
└── Transaction handling
```

### Component Hierarchy
```
App
├── WalletProvider
│   └── BettingProvider
│       └── Router
│           └── Navbar
│               ├── WalletConnect (Modal)
│               └── NetworkSwitcher
```

## 📱 Components

### 1. WalletConnect Modal
**File**: `src/components/WalletConnect.js`

**Features**:
- Multi-wallet selection interface
- Connection status display
- Error handling and recovery
- Wallet installation links
- Security information

**Usage**:
```jsx
<WalletConnect 
  isOpen={isWalletModalOpen} 
  onClose={() => setIsWalletModalOpen(false)} 
/>
```

### 2. NetworkSwitcher
**File**: `src/components/NetworkSwitcher.js`

**Features**:
- Network selection dropdown
- Current network display
- Network switching with validation
- Auto-network addition
- Visual network indicators

**Usage**:
```jsx
<NetworkSwitcher />
```

### 3. WalletContext
**File**: `src/context/WalletContext.js`

**Features**:
- Wallet connection management
- Provider and signer handling
- Network state management
- Event listener management
- Error handling

**Usage**:
```jsx
const { 
  account, 
  balance, 
  isConnected, 
  connectMetaMask, 
  connectPhantom 
} = useWallet();
```

## 🔧 Configuration

### Environment Variables
```env
# Optional: Override default RPC URLs
REACT_APP_MONAD_RPC_URL=https://rpc.testnet.monad.xyz
REACT_APP_ETHEREUM_RPC_URL=https://mainnet.infura.io/v3/YOUR_KEY
REACT_APP_POLYGON_RPC_URL=https://polygon-rpc.com
```

### Contract Deployment
Update `public/deployment-info.json` with your deployed contract addresses:
```json
{
  "mockUSDC": "0x...",
  "sidebetFactory": "0x...",
  "network": "monad-testnet",
  "chainId": 1337,
  "rpcUrl": "https://rpc.testnet.monad.xyz",
  "explorer": "https://explorer.testnet.monad.xyz"
}
```

## 🎮 Usage Examples

### Basic Wallet Connection
```jsx
import { useWallet } from '../context/WalletContext';

function MyComponent() {
  const { 
    account, 
    isConnected, 
    connectMetaMask, 
    connectPhantom 
  } = useWallet();

  const handleConnect = async (walletType) => {
    try {
      if (walletType === 'metamask') {
        await connectMetaMask();
      } else if (walletType === 'phantom') {
        await connectPhantom();
      }
    } catch (error) {
      console.error('Connection failed:', error);
    }
  };

  return (
    <div>
      {isConnected ? (
        <p>Connected: {account}</p>
      ) : (
        <button onClick={() => handleConnect('metamask')}>
          Connect MetaMask
        </button>
      )}
    </div>
  );
}
```

### Network Switching
```jsx
import { useWallet } from '../context/WalletContext';

function NetworkComponent() {
  const { 
    chainId, 
    networkName, 
    switchNetwork 
  } = useWallet();

  const handleSwitchToMonad = async () => {
    try {
      await switchNetwork(1337); // Monad Testnet
    } catch (error) {
      console.error('Network switch failed:', error);
    }
  };

  return (
    <div>
      <p>Current Network: {networkName}</p>
      <button onClick={handleSwitchToMonad}>
        Switch to Monad Testnet
      </button>
    </div>
  );
}
```

### Contract Interaction
```jsx
import { useWallet } from '../context/WalletContext';
import { useBetting } from '../context/BettingContext';

function BettingComponent() {
  const { isConnected, account } = useWallet();
  const { contracts, createBet, placeBet } = useBetting();

  const handleCreateBet = async () => {
    if (!isConnected) {
      alert('Please connect your wallet first');
      return;
    }

    try {
      await createBet(
        "Will Bitcoin reach $100k?", 
        Math.floor(Date.now() / 1000) + 86400, // 24 hours
        100 // 100 mUSDC
      );
    } catch (error) {
      console.error('Bet creation failed:', error);
    }
  };

  return (
    <button onClick={handleCreateBet}>
      Create New Bet
    </button>
  );
}
```

## 🔒 Security Features

### Private Key Protection
- **No key storage**: Private keys never leave the wallet
- **Secure communication**: All wallet interactions use secure APIs
- **Permission-based**: Users must explicitly approve transactions

### Network Validation
- **Chain ID verification**: Validates correct network before transactions
- **Contract address validation**: Ensures contracts exist on current network
- **Transaction confirmation**: Users must confirm all transactions

### Error Handling
- **Graceful failures**: Handles wallet connection failures gracefully
- **User feedback**: Clear error messages for all failure scenarios
- **Recovery options**: Provides recovery paths for common issues

## 🧪 Testing

### Manual Testing Checklist
- [ ] MetaMask connection
- [ ] Phantom connection
- [ ] Network switching
- [ ] Balance display
- [ ] Error handling
- [ ] Mobile responsiveness
- [ ] Transaction signing
- [ ] Contract interactions

### Automated Testing
```bash
# Run tests
npm test

# Test specific components
npm test WalletConnect
npm test NetworkSwitcher
npm test WalletContext
```

## 🚀 Deployment

### Production Setup
1. **Update contract addresses** in `public/deployment-info.json`
2. **Configure environment variables** for production networks
3. **Test wallet connections** on production networks
4. **Verify contract interactions** work correctly

### Build Process
```bash
# Install dependencies
npm install

# Build for production
npm run build

# Serve production build
npm run serve
```

## 🔧 Troubleshooting

### Common Issues

#### Wallet Not Detected
**Problem**: "MetaMask not found" error
**Solution**: 
- Ensure MetaMask extension is installed
- Check if MetaMask is enabled
- Refresh the page after installing

#### Network Switch Fails
**Problem**: Network switching doesn't work
**Solution**:
- Ensure you're using MetaMask (Phantom doesn't support network switching)
- Check if the network is already added to MetaMask
- Try adding the network manually

#### Contract Interaction Fails
**Problem**: Transactions fail or contracts not found
**Solution**:
- Verify you're on the correct network
- Check contract addresses in `deployment-info.json`
- Ensure you have sufficient gas fees
- Verify contract deployment status

#### Balance Not Updating
**Problem**: Balance doesn't reflect recent transactions
**Solution**:
- Refresh the page
- Check network connection
- Verify transaction confirmation
- Check for pending transactions

### Debug Mode
Enable debug logging by adding to your browser console:
```javascript
localStorage.setItem('debug', 'wallet:*');
```

## 📈 Performance Optimization

### Best Practices
- **Lazy loading**: Load wallet components only when needed
- **Caching**: Cache contract ABIs and addresses
- **Debouncing**: Debounce frequent balance checks
- **Error boundaries**: Wrap wallet components in error boundaries

### Monitoring
- **Connection metrics**: Track wallet connection success rates
- **Transaction metrics**: Monitor transaction success/failure rates
- **User analytics**: Track wallet type preferences
- **Error tracking**: Monitor and alert on wallet errors

## 🔮 Future Enhancements

### Planned Features
- [ ] **WalletConnect v2**: Support for WalletConnect protocol
- [ ] **Hardware wallets**: Ledger and Trezor support
- [ ] **Multi-chain**: Support for more blockchain networks
- [ ] **Batch transactions**: Optimize multiple transactions
- [ ] **Gas optimization**: Smart gas estimation
- [ ] **Transaction history**: Built-in transaction tracking

### Integration Opportunities
- [ ] **DeFi protocols**: Integration with lending and yield protocols
- [ ] **NFT support**: NFT betting and rewards
- [ ] **Cross-chain**: Cross-chain betting capabilities
- [ ] **Social features**: Social betting and leaderboards

---

## 📞 Support

For questions or issues with wallet integration:

1. **Check this documentation** for common solutions
2. **Review the code** in the component files
3. **Test with different wallets** and networks
4. **Check browser console** for error messages
5. **Verify contract deployment** and addresses

**Happy betting! 🎲** 