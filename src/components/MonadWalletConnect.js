import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Wallet, 
  X, 
  ExternalLink, 
  AlertCircle, 
  CheckCircle, 
  Loader2,
  Shield,
  User
} from 'lucide-react';
import { useWallet } from '../context/WalletContext';

const MonadWalletConnect = ({ isOpen, onClose, onSuccess }) => {
  const [selectedWallet, setSelectedWallet] = useState(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState(null);
  const [showAddressName, setShowAddressName] = useState(false);
  const [addressName, setAddressName] = useState('');
  const [isSavingName, setIsSavingName] = useState(false);
  
  const {
    account,
    walletType,
    isConnected,
    error: walletError,
    networkName,
    connectMetaMask,
    connectPhantom,
    disconnectWallet,
    getAvailableWallets
  } = useWallet();

  const availableWallets = getAvailableWallets();

  const handleConnect = async (walletType) => {
    try {
      setIsConnecting(true);
      setError(null);
      setSelectedWallet(walletType);

      if (walletType === 'metamask') {
        await connectMetaMask();
      } else if (walletType === 'phantom') {
        await connectPhantom();
      }

      // Show address name input after successful connection
      setShowAddressName(true);

    } catch (error) {
      setError(error.message);
    } finally {
      setIsConnecting(false);
    }
  };

  const handleSaveAddressName = async () => {
    if (!addressName.trim()) {
      setError('Please enter a name for your address');
      return;
    }

    try {
      setIsSavingName(true);
      setError(null);

      // Save address name to localStorage
      const savedAddresses = JSON.parse(localStorage.getItem('addressNames') || '{}');
      savedAddresses[account] = addressName.trim();
      localStorage.setItem('addressNames', JSON.stringify(savedAddresses));

      // Close modal and call success callback
      setTimeout(() => {
        onClose();
        setShowAddressName(false);
        setAddressName('');
        setSelectedWallet(null);
        if (onSuccess) {
          onSuccess({ account, addressName: addressName.trim() });
        }
      }, 1000);

    } catch (error) {
      setError('Failed to save address name. Please try again.');
    } finally {
      setIsSavingName(false);
    }
  };

  const handleDisconnect = () => {
    disconnectWallet();
    setShowAddressName(false);
    setAddressName('');
    onClose();
  };

  const getWalletIcon = (type) => {
    switch (type) {
      case 'metamask':
        return (
          <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
            <path d="M21.49 1L13.5 8.99L15.09 4.3L21.49 1Z"/>
            <path d="M2.51 1L10.41 9.09L8.91 4.3L2.51 1Z"/>
            <path d="M18.59 16.5L16.5 18.59L21.49 23L23 21.49L18.59 16.5Z"/>
            <path d="M1 21.49L2.51 23L7.5 18.59L5.41 16.5L1 21.49Z"/>
            <path d="M8.91 19.7L10.41 14.91L2.51 23L8.91 19.7Z"/>
            <path d="M15.09 19.7L21.49 23L13.5 15.09L15.09 19.7Z"/>
          </svg>
        );
      case 'phantom':
        return (
          <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2L2 7L12 12L22 7L12 2Z"/>
            <path d="M2 17L12 22L22 17"/>
            <path d="M2 12L12 17L22 12"/>
          </svg>
        );
      default:
        return <Wallet className="w-6 h-6" />;
    }
  };

  const getWalletName = (type) => {
    switch (type) {
      case 'metamask':
        return 'MetaMask';
      case 'phantom':
        return 'Phantom';
      default:
        return 'Wallet';
    }
  };

  const formatAddress = (address) => {
    if (!address) return '';
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="bg-gray-900 rounded-xl border border-gray-700 max-w-md w-full p-6"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg">
                <Wallet className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-white">Connect Monad Wallet</h2>
                <p className="text-sm text-gray-400">
                  {showAddressName ? 'Add a name for your address' : 'Choose your preferred wallet'}
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
            >
              <X className="w-5 h-5 text-gray-400" />
            </button>
          </div>

          {/* Error Display */}
          {(error || walletError) && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-4 p-3 bg-red-900/20 border border-red-500/30 rounded-lg flex items-center space-x-2"
            >
              <AlertCircle className="w-5 h-5 text-red-400" />
              <span className="text-red-400 text-sm">{error || walletError}</span>
            </motion.div>
          )}

          {/* Address Name Input */}
          {showAddressName && isConnected && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6"
            >
              <div className="p-4 bg-green-900/20 border border-green-500/30 rounded-lg mb-4">
                <div className="flex items-center space-x-3 mb-3">
                  <CheckCircle className="w-5 h-5 text-green-400" />
                  <span className="text-green-400 font-medium">Connected Successfully!</span>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Wallet:</span>
                    <span className="text-white">{getWalletName(walletType)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Address:</span>
                    <span className="text-white font-mono">{formatAddress(account)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Network:</span>
                    <span className="text-white">{networkName}</span>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    <User className="w-4 h-4 inline mr-2" />
                    Address Name
                  </label>
                  <input
                    type="text"
                    value={addressName}
                    onChange={(e) => setAddressName(e.target.value)}
                    placeholder="Enter a name for this address (e.g., My Gaming Wallet)"
                    className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 transition-colors"
                    maxLength={50}
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    This name will help you identify this address in the future
                  </p>
                </div>

                <div className="flex space-x-3">
                  <button
                    onClick={handleSaveAddressName}
                    disabled={isSavingName || !addressName.trim()}
                    className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 text-white py-3 px-4 rounded-lg transition-colors flex items-center justify-center space-x-2"
                  >
                    {isSavingName ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Saving...</span>
                      </>
                    ) : (
                      <>
                        <CheckCircle className="w-4 h-4" />
                        <span>Save & Continue</span>
                      </>
                    )}
                  </button>
                  <button
                    onClick={handleDisconnect}
                    className="px-4 py-3 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </motion.div>
          )}

          {/* Wallet Options */}
          {!showAddressName && (
            <div className="space-y-3">
              {/* MetaMask */}
              {availableWallets.metamask && (
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleConnect('metamask')}
                  disabled={isConnecting}
                  className={`w-full p-4 rounded-lg border transition-all duration-200 flex items-center space-x-4 ${
                    isConnecting && selectedWallet === 'metamask'
                      ? 'bg-blue-600/20 border-blue-500/50'
                      : 'bg-gray-800/50 border-gray-600 hover:bg-gray-700/50 hover:border-gray-500'
                  }`}
                >
                  <div className="text-orange-500">
                    {getWalletIcon('metamask')}
                  </div>
                  <div className="flex-1 text-left">
                    <div className="font-medium text-white">MetaMask</div>
                    <div className="text-sm text-gray-400">Connect to Monad Network</div>
                  </div>
                  {isConnecting && selectedWallet === 'metamask' && (
                    <Loader2 className="w-5 h-5 text-blue-400 animate-spin" />
                  )}
                </motion.button>
              )}

              {/* Phantom */}
              {availableWallets.phantom && (
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleConnect('phantom')}
                  disabled={isConnecting}
                  className={`w-full p-4 rounded-lg border transition-all duration-200 flex items-center space-x-4 ${
                    isConnecting && selectedWallet === 'phantom'
                      ? 'bg-purple-600/20 border-purple-500/50'
                      : 'bg-gray-800/50 border-gray-600 hover:bg-gray-700/50 hover:border-gray-500'
                  }`}
                >
                  <div className="text-purple-500">
                    {getWalletIcon('phantom')}
                  </div>
                  <div className="flex-1 text-left">
                    <div className="font-medium text-white">Phantom</div>
                    <div className="text-sm text-gray-400">Solana & Monad Support</div>
                  </div>
                  {isConnecting && selectedWallet === 'phantom' && (
                    <Loader2 className="w-5 h-5 text-purple-400 animate-spin" />
                  )}
                </motion.button>
              )}

              {/* No Wallets Available */}
              {!availableWallets.metamask && !availableWallets.phantom && (
                <div className="p-4 bg-gray-800/50 border border-gray-600 rounded-lg">
                  <div className="flex items-center space-x-3 mb-3">
                    <AlertCircle className="w-5 h-5 text-yellow-400" />
                    <span className="text-yellow-400 font-medium">No Wallets Found</span>
                  </div>
                  <p className="text-sm text-gray-400 mb-3">
                    Please install a supported wallet extension to connect to Monad Network.
                  </p>
                  <div className="space-y-2">
                    <a
                      href="https://metamask.io/download/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center space-x-2 text-blue-400 hover:text-blue-300 text-sm"
                    >
                      <ExternalLink className="w-4 h-4" />
                      <span>Install MetaMask</span>
                    </a>
                    <a
                      href="https://phantom.app/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center space-x-2 text-purple-400 hover:text-purple-300 text-sm"
                    >
                      <ExternalLink className="w-4 h-4" />
                      <span>Install Phantom</span>
                    </a>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Footer */}
          <div className="mt-6 pt-4 border-t border-gray-700">
            <div className="flex items-center space-x-2 text-xs text-gray-500">
              <Shield className="w-4 h-4" />
              <span>Your private keys are never shared with this application</span>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default MonadWalletConnect; 