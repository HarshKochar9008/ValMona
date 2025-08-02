import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { ethers } from 'ethers';

const WalletContext = createContext();

const initialState = {
  account: null,
  provider: null,
  signer: null,
  walletType: null, // 'metamask', 'phantom', or null
  balance: '0',
  isConnected: false,
  isConnecting: false,
  error: null,
  chainId: null,
  networkName: null
};

const walletReducer = (state, action) => {
  switch (action.type) {
    case 'SET_ACCOUNT':
      return { ...state, account: action.payload, isConnected: !!action.payload };
    case 'SET_PROVIDER':
      return { ...state, provider: action.payload };
    case 'SET_SIGNER':
      return { ...state, signer: action.payload };
    case 'SET_WALLET_TYPE':
      return { ...state, walletType: action.payload };
    case 'SET_BALANCE':
      return { ...state, balance: action.payload };
    case 'SET_CONNECTING':
      return { ...state, isConnecting: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload };
    case 'SET_CHAIN_ID':
      return { ...state, chainId: action.payload };
    case 'SET_NETWORK_NAME':
      return { ...state, networkName: action.payload };
    case 'RESET_WALLET':
      return {
        ...state,
        account: null,
        provider: null,
        signer: null,
        walletType: null,
        balance: '0',
        isConnected: false,
        isConnecting: false,
        error: null,
        chainId: null,
        networkName: null
      };
    default:
      return state;
  }
};

// Wallet detection utilities
const detectWallets = () => {
  const wallets = {
    metamask: false,
    phantom: false
  };

  // Check for MetaMask
  if (typeof window.ethereum !== 'undefined') {
    wallets.metamask = true;
  }

  // Check for Phantom
  if (typeof window.solana !== 'undefined' && window.solana.isPhantom) {
    wallets.phantom = true;
  }

  return wallets;
};

// Network configuration
const NETWORKS = {
  1: { name: 'Ethereum Mainnet', rpc: 'https://mainnet.infura.io/v3/' },
  137: { name: 'Polygon', rpc: 'https://polygon-rpc.com' },
  1337: { name: 'Monad Testnet', rpc: 'https://rpc.testnet.monad.xyz' },
  10143: { name: 'Monad Testnet', rpc: 'https://testnet-rpc.monad.xyz' },
  80001: { name: 'Mumbai Testnet', rpc: 'https://rpc-mumbai.maticvigil.com' }
};

export const WalletProvider = ({ children }) => {
  const [state, dispatch] = useReducer(walletReducer, initialState);

  // Check for existing connection on mount
  useEffect(() => {
    checkExistingConnection();
  }, []);

  const checkExistingConnection = async () => {
    try {
      // Check MetaMask
      if (typeof window.ethereum !== 'undefined') {
        const accounts = await window.ethereum.request({ method: 'eth_accounts' });
        if (accounts.length > 0) {
          await connectMetaMask();
        }
      }
    } catch (error) {
      console.error('Error checking existing connection:', error);
    }
  };

  const connectMetaMask = async () => {
    try {
      dispatch({ type: 'SET_CONNECTING', payload: true });
      dispatch({ type: 'SET_ERROR', payload: null });

      if (typeof window.ethereum === 'undefined') {
        throw new Error('MetaMask not found. Please install MetaMask extension.');
      }

      // Check if MetaMask is locked
      const accounts = await window.ethereum.request({ method: 'eth_accounts' });
      if (accounts.length === 0) {
        // Request account access
        const requestedAccounts = await window.ethereum.request({
          method: 'eth_requestAccounts'
        });
        
        if (requestedAccounts.length === 0) {
          throw new Error('No accounts found. Please unlock MetaMask and try again.');
        }
      }

      const account = accounts[0] || (await window.ethereum.request({ method: 'eth_requestAccounts' }))[0];
      
      // Create provider and signer with better error handling
      let provider;
      try {
        provider = new ethers.BrowserProvider(window.ethereum);
      } catch (error) {
        throw new Error('Failed to create provider. Please refresh the page and try again.');
      }

      let signer;
      try {
        signer = await provider.getSigner();
      } catch (error) {
        throw new Error('Failed to get signer. Please check your MetaMask connection.');
      }
      
      // Get network info with better error handling
      let network, chainId, networkName;
      try {
        network = await provider.getNetwork();
        chainId = Number(network.chainId);
        networkName = NETWORKS[chainId]?.name || `Chain ID: ${chainId}`;
      } catch (error) {
        console.warn('Failed to get network info:', error);
        chainId = null;
        networkName = 'Unknown Network';
      }
      
      // Get balance with better error handling
      let formattedBalance = '0';
      try {
        const balance = await provider.getBalance(account);
        formattedBalance = ethers.formatEther(balance);
      } catch (error) {
        console.warn('Failed to get balance:', error);
      }

      // Update state
      dispatch({ type: 'SET_ACCOUNT', payload: account });
      dispatch({ type: 'SET_PROVIDER', payload: provider });
      dispatch({ type: 'SET_SIGNER', payload: signer });
      dispatch({ type: 'SET_WALLET_TYPE', payload: 'metamask' });
      dispatch({ type: 'SET_BALANCE', payload: formattedBalance });
      dispatch({ type: 'SET_CHAIN_ID', payload: chainId });
      dispatch({ type: 'SET_NETWORK_NAME', payload: networkName });

      // Listen for account changes
      window.ethereum.on('accountsChanged', handleAccountChange);
      window.ethereum.on('chainChanged', handleChainChange);

      console.log('MetaMask connected successfully:', { account, chainId, networkName });

    } catch (error) {
      console.error('MetaMask connection error:', error);
      dispatch({ type: 'SET_ERROR', payload: error.message });
      throw error;
    } finally {
      dispatch({ type: 'SET_CONNECTING', payload: false });
    }
  };

  const connectPhantom = async () => {
    try {
      dispatch({ type: 'SET_CONNECTING', payload: true });
      dispatch({ type: 'SET_ERROR', payload: null });

      if (typeof window.solana === 'undefined' || !window.solana.isPhantom) {
        throw new Error('Phantom wallet not found. Please install Phantom extension.');
      }

      // Connect to Phantom
      const response = await window.solana.connect();
      const account = response.publicKey.toString();
      
      // For Solana, we'll use a different approach since ethers.js is primarily for Ethereum
      // You might want to use @solana/web3.js for full Solana support
      const provider = {
        type: 'phantom',
        account: account,
        publicKey: response.publicKey
      };

      // Update state
      dispatch({ type: 'SET_ACCOUNT', payload: account });
      dispatch({ type: 'SET_PROVIDER', payload: provider });
      dispatch({ type: 'SET_SIGNER', payload: provider });
      dispatch({ type: 'SET_WALLET_TYPE', payload: 'phantom' });
      dispatch({ type: 'SET_BALANCE', payload: '0' }); // You'll need to implement Solana balance fetching
      dispatch({ type: 'SET_CHAIN_ID', payload: 'solana' });
      dispatch({ type: 'SET_NETWORK_NAME', payload: 'Solana' });

      // Listen for account changes
      window.solana.on('accountChanged', handlePhantomAccountChange);

    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error.message });
      throw error;
    } finally {
      dispatch({ type: 'SET_CONNECTING', payload: false });
    }
  };

  const handleAccountChange = async (accounts) => {
    if (accounts.length === 0) {
      // User disconnected
      disconnectWallet();
    } else {
      // Account changed
      const account = accounts[0];
      dispatch({ type: 'SET_ACCOUNT', payload: account });
      
      if (state.provider) {
        const balance = await state.provider.getBalance(account);
        const formattedBalance = ethers.formatEther(balance);
        dispatch({ type: 'SET_BALANCE', payload: formattedBalance });
      }
    }
  };

  const handleChainChange = async (chainId) => {
    // Reload the page when chain changes
    window.location.reload();
  };

  const handlePhantomAccountChange = (publicKey) => {
    if (publicKey) {
      dispatch({ type: 'SET_ACCOUNT', payload: publicKey.toString() });
    } else {
      disconnectWallet();
    }
  };

  const disconnectWallet = () => {
    // Remove event listeners
    if (typeof window.ethereum !== 'undefined') {
      window.ethereum.removeListener('accountsChanged', handleAccountChange);
      window.ethereum.removeListener('chainChanged', handleChainChange);
    }
    
    if (typeof window.solana !== 'undefined') {
      window.solana.removeListener('accountChanged', handlePhantomAccountChange);
    }

    dispatch({ type: 'RESET_WALLET' });
  };

  const switchNetwork = async (chainId) => {
    try {
      if (state.walletType === 'metamask' && typeof window.ethereum !== 'undefined') {
        await window.ethereum.request({
          method: 'wallet_switchEthereumChain',
          params: [{ chainId: `0x${chainId.toString(16)}` }],
        });
      }
    } catch (error) {
      // If the network doesn't exist, add it
      if (error.code === 4902) {
        await addNetwork(chainId);
      } else {
        throw error;
      }
    }
  };

  const addNetwork = async (chainId) => {
    const network = NETWORKS[chainId];
    if (!network) {
      throw new Error(`Network ${chainId} not supported`);
    }

    await window.ethereum.request({
      method: 'wallet_addEthereumChain',
      params: [{
        chainId: `0x${chainId.toString(16)}`,
        chainName: network.name,
        nativeCurrency: {
          name: 'ETH',
          symbol: 'ETH',
          decimals: 18
        },
        rpcUrls: [network.rpc],
        blockExplorerUrls: chainId === 1337 ? ['https://explorer.testnet.monad.xyz'] : []
      }],
    });
  };

  const getAvailableWallets = () => {
    return detectWallets();
  };

  // Address name management functions
  const saveAddressName = (address, name) => {
    try {
      const savedAddresses = JSON.parse(localStorage.getItem('addressNames') || '{}');
      savedAddresses[address] = name;
      localStorage.setItem('addressNames', JSON.stringify(savedAddresses));
      return true;
    } catch (error) {
      console.error('Failed to save address name:', error);
      return false;
    }
  };

  const getAddressName = (address) => {
    try {
      const savedAddresses = JSON.parse(localStorage.getItem('addressNames') || '{}');
      return savedAddresses[address] || null;
    } catch (error) {
      console.error('Failed to get address name:', error);
      return null;
    }
  };

  const getAllAddressNames = () => {
    try {
      return JSON.parse(localStorage.getItem('addressNames') || '{}');
    } catch (error) {
      console.error('Failed to get address names:', error);
      return {};
    }
  };

  const value = {
    ...state,
    connectMetaMask,
    connectPhantom,
    disconnectWallet,
    switchNetwork,
    addNetwork,
    getAvailableWallets,
    saveAddressName,
    getAddressName,
    getAllAddressNames
  };

  return (
    <WalletContext.Provider value={value}>
      {children}
    </WalletContext.Provider>
  );
};

export const useWallet = () => {
  const context = useContext(WalletContext);
  if (!context) {
    throw new Error('useWallet must be used within a WalletProvider');
  }
  return context;
}; 