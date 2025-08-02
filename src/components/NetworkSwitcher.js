import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Globe, 
  CheckCircle, 
  AlertCircle, 
  Loader2,
  ChevronDown
} from 'lucide-react';
import { useWallet } from '../context/WalletContext';

const NetworkSwitcher = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isSwitching, setIsSwitching] = useState(false);
  const [error, setError] = useState(null);
  
  const { 
    chainId, 
    networkName, 
    walletType, 
    isConnected, 
    switchNetwork, 
    addNetwork 
  } = useWallet();

  const networks = [
    {
      id: 1,
      name: 'Ethereum Mainnet',
      icon: '🔵',
      color: 'blue'
    },
    {
      id: 137,
      name: 'Polygon',
      icon: '🟣',
      color: 'purple'
    },
    {
      id: 1337,
      name: 'Monad Testnet',
      icon: '🟡',
      color: 'yellow'
    },
    {
      id: 80001,
      name: 'Mumbai Testnet',
      icon: '🟢',
      color: 'green'
    }
  ];

  const currentNetwork = networks.find(net => net.id === chainId);

  const handleNetworkSwitch = async (networkId) => {
    if (!isConnected || walletType !== 'metamask') {
      setError('Please connect MetaMask wallet to switch networks');
      return;
    }

    try {
      setIsSwitching(true);
      setError(null);
      await switchNetwork(networkId);
      setIsOpen(false);
    } catch (error) {
      setError(error.message);
    } finally {
      setIsSwitching(false);
    }
  };

  if (!isConnected) {
    return null;
  }

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center space-x-2 px-3 py-2 rounded-lg border transition-all duration-200 ${
          currentNetwork 
            ? `bg-${currentNetwork.color}-900/20 border-${currentNetwork.color}-500/30 text-${currentNetwork.color}-400`
            : 'bg-gray-800/50 border-gray-600 text-gray-300 hover:bg-gray-700/50'
        }`}
      >
        <Globe className="w-4 h-4" />
        <span className="text-sm font-medium">
          {currentNetwork ? currentNetwork.name : 'Unknown Network'}
        </span>
        <ChevronDown className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            className="absolute top-full mt-2 right-0 w-64 bg-gray-900 border border-gray-700 rounded-lg shadow-xl z-50"
          >
            <div className="p-3 border-b border-gray-700">
              <h3 className="text-sm font-medium text-white">Select Network</h3>
              <p className="text-xs text-gray-400">Choose your preferred network</p>
            </div>

            {error && (
              <div className="p-3 bg-red-900/20 border-b border-red-500/30">
                <div className="flex items-center space-x-2">
                  <AlertCircle className="w-4 h-4 text-red-400" />
                  <span className="text-xs text-red-400">{error}</span>
                </div>
              </div>
            )}

            <div className="p-2">
              {networks.map((network) => (
                <button
                  key={network.id}
                  onClick={() => handleNetworkSwitch(network.id)}
                  disabled={isSwitching || chainId === network.id}
                  className={`w-full flex items-center justify-between p-3 rounded-lg transition-all duration-200 ${
                    chainId === network.id
                      ? `bg-${network.color}-900/20 border border-${network.color}-500/30`
                      : 'hover:bg-gray-800/50'
                  } ${isSwitching ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  <div className="flex items-center space-x-3">
                    <span className="text-lg">{network.icon}</span>
                    <div className="text-left">
                      <div className={`text-sm font-medium ${
                        chainId === network.id ? `text-${network.color}-400` : 'text-white'
                      }`}>
                        {network.name}
                      </div>
                      <div className="text-xs text-gray-400">
                        Chain ID: {network.id}
                      </div>
                    </div>
                  </div>
                  
                  {chainId === network.id && (
                    <CheckCircle className={`w-5 h-5 text-${network.color}-400`} />
                  )}
                  
                  {isSwitching && (
                    <Loader2 className="w-5 h-5 text-gray-400 animate-spin" />
                  )}
                </button>
              ))}
            </div>

            <div className="p-3 border-t border-gray-700">
              <div className="text-xs text-gray-400">
                <div className="flex items-center space-x-2">
                  <Globe className="w-3 h-3" />
                  <span>Current: {networkName || 'Unknown'}</span>
                </div>
                <div className="mt-1 text-gray-500">
                  Chain ID: {chainId || 'Unknown'}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default NetworkSwitcher; 