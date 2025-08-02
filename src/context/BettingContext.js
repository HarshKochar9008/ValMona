import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { ethers } from 'ethers';
import { useWallet } from './WalletContext';

const BettingContext = createContext();

const initialState = {
  contracts: {},
  bets: [],
  userBets: [],
  loading: false,
  error: null,
  mUSDCBalance: '0'
};

const bettingReducer = (state, action) => {
  switch (action.type) {
    case 'SET_CONTRACTS':
      return { ...state, contracts: action.payload };
    case 'SET_BETS':
      return { ...state, bets: action.payload };
    case 'SET_USER_BETS':
      return { ...state, userBets: action.payload };
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload };
    case 'SET_MUSDC_BALANCE':
      return { ...state, mUSDCBalance: action.payload };
    case 'ADD_BET':
      return { ...state, bets: [...state.bets, action.payload] };
    case 'UPDATE_BET':
      return {
        ...state,
        bets: state.bets.map(bet => 
          bet.id === action.payload.id ? action.payload : bet
        )
      };
    default:
      return state;
  }
};

export const BettingProvider = ({ children }) => {
  const [state, dispatch] = useReducer(bettingReducer, initialState);
  const { account, provider, signer, isConnected, walletType } = useWallet();

  // Initialize contracts when wallet connects
  useEffect(() => {
    if (isConnected && signer && walletType === 'metamask') {
      initializeContracts();
    }
  }, [isConnected, signer, walletType]);

  const initializeContracts = async () => {
    try {
      // Load deployment info
      let deploymentInfo = {};
      try {
        const response = await fetch('/deployment-info.json');
        if (!response.ok) {
          throw new Error('Failed to fetch deployment info');
        }
        deploymentInfo = await response.json();
      } catch (error) {
        console.error('No deployment info found. Please deploy contracts first.');
        dispatch({ type: 'SET_ERROR', payload: 'Contracts not deployed. Please deploy contracts first or check deployment-info.json' });
        return;
      }

      // Check if contracts are actually deployed (not placeholder addresses)
      if (deploymentInfo.mockUSDC === '0x0000000000000000000000000000000000000000' || 
          deploymentInfo.sidebetFactory === '0x0000000000000000000000000000000000000000') {
        console.error('Contracts not deployed yet. Please run deployment script first.');
        dispatch({ type: 'SET_ERROR', payload: 'Contracts not deployed yet. Please deploy contracts first using: npm run deploy' });
        return;
      }

      // Contract ABIs (simplified for frontend)
      const MOCK_USDC_ABI = [
        "function balanceOf(address owner) view returns (uint256)",
        "function approve(address spender, uint256 amount) returns (bool)",
        "function transfer(address to, uint256 amount) returns (bool)",
        "function decimals() view returns (uint8)"
      ];

      const SIDEBET_FACTORY_ABI = [
        "function getAllSidebets() view returns (address[])",
        "function getSidebetCount() view returns (uint256)",
        "function getActiveSidebets() view returns (address[])",
        "function getResolvedSidebets() view returns (address[])",
        "function createSidebet(string question, uint256 deadline, address oracle, uint256 fixedAmount) returns (address)"
      ];

      const SIDEBET_ABI = [
        "function getBetInfo() view returns (string question, uint256 deadline, address oracle, uint256 fixedAmount, bool resolved, bool outcome, uint256 yesTotal, uint256 noTotal)",
        "function getUserShares(address user) view returns (uint256 yesShares, uint256 noShares, bool hasClaimed)",
        "function getTotalPot() view returns (uint256)",
        "function isActive() view returns (bool)",
        "function joinYes()",
        "function joinNo()",
        "function resolve(bool outcome)",
        "function claim()"
      ];

      // Initialize contracts with error handling
      let mockUSDC, sidebetFactory;
      try {
        mockUSDC = new ethers.Contract(deploymentInfo.mockUSDC, MOCK_USDC_ABI, signer);
        sidebetFactory = new ethers.Contract(deploymentInfo.sidebetFactory, SIDEBET_FACTORY_ABI, signer);
        
        // Test contract connectivity
        await mockUSDC.decimals();
        await sidebetFactory.getSidebetCount();
      } catch (error) {
        console.error('Failed to initialize contracts:', error);
        dispatch({ type: 'SET_ERROR', payload: 'Failed to connect to contracts. Please check if they are deployed correctly.' });
        return;
      }

      dispatch({ type: 'SET_CONTRACTS', payload: { mockUSDC, sidebetFactory } });

      // Get mUSDC balance
      if (account) {
        try {
          const balance = await mockUSDC.balanceOf(account);
          const decimals = await mockUSDC.decimals();
          const formattedBalance = ethers.formatUnits(balance, decimals);
          dispatch({ type: 'SET_MUSDC_BALANCE', payload: formattedBalance });
          console.log('mUSDC balance loaded:', formattedBalance);
        } catch (error) {
          console.error('Failed to get mUSDC balance:', error);
          dispatch({ type: 'SET_MUSDC_BALANCE', payload: '0' });
        }
      }

      console.log('Contracts initialized successfully');

    } catch (error) {
      console.error('Error initializing contracts:', error);
      dispatch({ type: 'SET_ERROR', payload: error.message });
    }
  };

  const createBet = async (question, deadline, fixedAmount) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      
      if (!state.contracts.sidebetFactory) {
        throw new Error('Contracts not initialized. Please connect your wallet first.');
      }
      
      // This would interact with your smart contract
      // const tx = await state.contracts.sidebetFactory.createSidebet(question, deadline, account, fixedAmount);
      // await tx.wait();
      
      // For now, just add to local state
      const newBet = {
        id: Date.now().toString(),
        question,
        deadline,
        fixedAmount,
        yesTotal: 0,
        noTotal: 0,
        resolved: false,
        createdBy: account
      };
      
      dispatch({ type: 'ADD_BET', payload: newBet });
      
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error.message });
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const placeBet = async (betId, side, amount) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      
      if (!state.contracts.sidebetFactory) {
        throw new Error('Contracts not initialized. Please connect your wallet first.');
      }
      
      // This would interact with your smart contract
      // const tx = await state.contracts.sidebet.joinYes() or joinNo();
      // await tx.wait();
      
      // Update local state
      const updatedBets = state.bets.map(bet => {
        if (bet.id === betId) {
          return {
            ...bet,
            [side === 'yes' ? 'yesTotal' : 'noTotal']: 
              (side === 'yes' ? bet.yesTotal : bet.noTotal) + parseFloat(amount)
          };
        }
        return bet;
      });
      
      dispatch({ type: 'SET_BETS', payload: updatedBets });
      
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error.message });
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const resolveBet = async (betId, outcome) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      
      if (!state.contracts.sidebetFactory) {
        throw new Error('Contracts not initialized. Please connect your wallet first.');
      }
      
      // This would interact with your smart contract
      // const tx = await state.contracts.sidebet.resolve(outcome);
      // await tx.wait();
      
      // Update local state
      const updatedBets = state.bets.map(bet => {
        if (bet.id === betId) {
          return { ...bet, resolved: true, outcome };
        }
        return bet;
      });
      
      dispatch({ type: 'SET_BETS', payload: updatedBets });
      
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error.message });
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const value = {
    ...state,
    createBet,
    placeBet,
    resolveBet
  };

  return (
    <BettingContext.Provider value={value}>
      {children}
    </BettingContext.Provider>
  );
};

export const useBetting = () => {
  const context = useContext(BettingContext);
  if (!context) {
    throw new Error('useBetting must be used within a BettingProvider');
  }
  return context;
}; 