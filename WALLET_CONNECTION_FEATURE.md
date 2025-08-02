# Monad Wallet Connection Feature

## Overview

This feature implements a comprehensive wallet connection system for the Valorant betting application, specifically designed to work with Monad Network. Users can connect their wallets (MetaMask or Phantom) and add custom names for their addresses.

## Features

### 1. Monad Wallet Connection Popup
- **Location**: Triggered from the landing page LOGIN and EXPLORE buttons
- **Component**: `MonadWalletConnect.js`
- **Functionality**:
  - Supports MetaMask and Phantom wallet connections
  - Automatically detects available wallets
  - Provides installation links for missing wallets
  - Shows connection status and network information

### 2. Address Name Management
- **Storage**: Local storage for address names
- **Component**: `AddressDisplay.js`
- **Functionality**:
  - Save custom names for wallet addresses
  - Display addresses with their saved names throughout the app
  - Fallback to truncated address if no name is saved

### 3. Enhanced Wallet Context
- **File**: `WalletContext.js`
- **New Functions**:
  - `saveAddressName(address, name)`: Save a name for an address
  - `getAddressName(address)`: Retrieve saved name for an address
  - `getAllAddressNames()`: Get all saved address names
- **Network Support**: Enhanced Monad network configuration

## Usage

### Connecting a Wallet

1. **From Landing Page**:
   - Click "LOGIN" or "EXPLORE" button
   - Select your preferred wallet (MetaMask or Phantom)
   - Approve the connection in your wallet
   - Enter a custom name for your address
   - Click "Save & Continue"

2. **From Navbar**:
   - Click "Connect Wallet" button
   - Follow the same process as above

### Managing Address Names

- Address names are automatically saved to localStorage
- Names are displayed throughout the app using the `AddressDisplay` component
- Users can see their saved names in the navbar and other components

## Components

### MonadWalletConnect
```jsx
<MonadWalletConnect
  isOpen={showWalletConnect}
  onClose={() => setShowWalletConnect(false)}
  onSuccess={({ account, addressName }) => {
    // Handle successful connection
    navigate('/home');
  }}
/>
```

### AddressDisplay
```jsx
<AddressDisplay 
  address="0x1234..." 
  showFull={false} 
  className="custom-class" 
/>
```

## Network Configuration

The wallet context supports multiple networks including:
- **Monad Testnet**: Chain ID 10143
- **Local Monad**: Chain ID 1337
- **Ethereum Mainnet**: Chain ID 1
- **Polygon**: Chain ID 137

## Security Features

- Private keys are never shared with the application
- All wallet interactions are handled by the user's wallet extension
- Address names are stored locally in the browser
- No sensitive data is transmitted to external servers

## Error Handling

The system includes comprehensive error handling for:
- Wallet not found/installed
- Connection failures
- Network switching issues
- Invalid address names
- Storage errors

## Future Enhancements

- Support for additional wallet types
- Cloud storage for address names (optional)
- Address book management
- Multi-wallet support
- Transaction history integration 