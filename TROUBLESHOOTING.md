# Troubleshooting Guide

## MetaMask Connection Issues

### Issue: "MetaMask not found"
**Solution:**
1. Install MetaMask browser extension from [metamask.io](https://metamask.io)
2. Create or import a wallet
3. Refresh the page and try connecting again

### Issue: "No accounts found"
**Solution:**
1. Unlock MetaMask by entering your password
2. Make sure you have at least one account created
3. Try connecting again

### Issue: "Failed to create provider"
**Solution:**
1. Refresh the page completely (Ctrl+F5 or Cmd+Shift+R)
2. Clear browser cache and cookies
3. Try connecting again

### Issue: "Failed to get signer"
**Solution:**
1. Check if MetaMask is unlocked
2. Make sure you're on the correct network (Monad Testnet)
3. Try disconnecting and reconnecting

## Monad Token Betting Issues

### Issue: "Contracts not deployed"
**Solution:**
1. Deploy contracts to Monad testnet:
   ```bash
   npm run deploy:monad
   ```
2. Make sure you have a `.env` file with your private key:
   ```
   PRIVATE_KEY=your_private_key_here
   ```
3. Get testnet ETH from Monad faucet if needed

### Issue: "Failed to connect to contracts"
**Solution:**
1. Check if contracts are deployed correctly
2. Verify the `deployment-info.json` file has correct addresses
3. Make sure you're connected to Monad testnet in MetaMask

### Issue: "Insufficient mUSDC balance"
**Solution:**
1. The deployer gets 10,000 mUSDC tokens automatically
2. Import the deployer's private key to MetaMask for testing
3. Or transfer mUSDC from the deployer to your account

## Network Configuration

### Adding Monad Testnet to MetaMask
1. Open MetaMask
2. Click on the network dropdown
3. Click "Add network"
4. Add manually with these details:
   - Network Name: Monad Testnet
   - RPC URL: https://rpc.testnet.monad.xyz
   - Chain ID: 1337
   - Currency Symbol: ETH
   - Block Explorer: https://explorer.testnet.monad.xyz

### Getting Testnet ETH
1. Visit the Monad testnet faucet
2. Request testnet ETH for your address
3. Wait for the transaction to confirm

## Common Error Messages

### "User rejected the request"
- User clicked "Reject" in MetaMask
- Try connecting again and click "Connect"

### "Already processing eth_requestAccounts"
- MetaMask is already processing a connection request
- Wait a few seconds and try again

### "Nonce too high"
- Clear MetaMask transaction history
- Reset account in MetaMask settings

### "Gas estimation failed"
- Check if you have enough ETH for gas fees
- Try increasing gas limit in MetaMask

## Development Setup

### Prerequisites
1. Node.js 16+ installed
2. MetaMask extension installed
3. Private key for deployment

### Setup Steps
1. Install dependencies:
   ```bash
   npm install
   cd frontend && npm install
   ```

2. Create `.env` file:
   ```
   PRIVATE_KEY=your_private_key_here
   ```

3. Deploy contracts:
   ```bash
   npm run deploy:monad
   ```

4. Start frontend:
   ```bash
   cd frontend && npm start
   ```

5. Connect MetaMask to Monad testnet

6. Import deployer private key to MetaMask for testing

## Testing the Application

### Creating a Bet
1. Connect MetaMask wallet
2. Navigate to "Create Bet" page
3. Fill in bet details
4. Submit transaction

### Placing a Bet
1. Browse available bets
2. Click on a bet
3. Choose Yes/No
4. Confirm transaction

### Resolving a Bet
1. Only the oracle can resolve bets
2. Use the deployer account (oracle)
3. Navigate to bet details
4. Click "Resolve" and choose outcome

## Getting Help

If you're still experiencing issues:

1. Check the browser console for error messages
2. Verify MetaMask is connected to the correct network
3. Ensure contracts are deployed with correct addresses
4. Check if you have sufficient ETH and mUSDC balances

For additional support, check the project documentation or create an issue in the repository. 