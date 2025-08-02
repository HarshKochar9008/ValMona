import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Home, 
  Trophy, 
  TrendingUp, 
  User, 
  Wallet,
  Menu,
  X,
  Zap,
  LogOut,
  Settings,
  ChevronDown
} from 'lucide-react';
import { useWallet } from '../context/WalletContext';
import { useBetting } from '../context/BettingContext';
import WalletConnect from './WalletConnect';
import NetworkSwitcher from './NetworkSwitcher';
import AddressDisplay from './AddressDisplay';

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isWalletModalOpen, setIsWalletModalOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const location = useLocation();
  const { account, balance, isConnected, walletType, disconnectWallet, getAddressName, saveAddressName } = useWallet();
  const { mUSDCBalance } = useBetting();

  const navItems = [
    { name: 'HOME', path: '/', icon: Home },
    { name: 'MATCHES', path: '/matches', icon: Trophy },
    { name: 'HISTORY', path: '/betting', icon: TrendingUp },
    { name: 'ABOUT', path: '/profile', icon: User },
  ];

  const isActive = (path) => location.pathname === path;

  const handleConnectWallet = () => {
    setIsWalletModalOpen(true);
  };

  // Get username/nickname for the account
  const getUsername = () => {
    if (!account) return 'PABLO'; // Default fallback
    const savedName = getAddressName(account);
    return savedName || account.slice(0, 6) + '...' + account.slice(-4);
  };

  const handleUserMenuToggle = () => {
    setIsUserMenuOpen(!isUserMenuOpen);
  };

  const handleDisconnect = () => {
    disconnectWallet();
    setIsUserMenuOpen(false);
  };

  const handleUsernameEdit = () => {
    const newName = prompt('Enter your nickname:', getUsername());
    if (newName && newName.trim() && account) {
      saveAddressName(account, newName.trim());
      // Force re-render
      setIsUserMenuOpen(false);
      setTimeout(() => setIsUserMenuOpen(true), 100);
    }
  };

  return (
    <nav className="bg-gradient-to-r from-gray-900 to-gray-800 border-b border-gray-600 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Left Navigation */}
          <div className="flex items-center space-x-8">
            {navItems.slice(0, 2).map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.name}
                  to={item.path}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 uppercase ${
                    isActive(item.path)
                      ? 'text-cyan-400 bg-cyan-900/20 border border-cyan-500/30'
                      : 'text-gray-300 hover:text-white hover:bg-gray-700/50'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </div>

          {/* Center Username/Logo */}
          <div className="flex-1 flex justify-center">
            {isConnected ? (
              <div className="relative">
                <button
                  onClick={handleUserMenuToggle}
                  className="flex items-center space-x-2 bg-white rounded-lg px-4 py-2 shadow-lg border border-gray-300 hover:shadow-xl transition-all duration-200"
                >
                  <div className="w-8 h-8 bg-gradient-to-br from-blue-400 to-purple-600 rounded-full flex items-center justify-center">
                    <span className="text-white font-bold text-sm">
                      {getUsername().charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <span className="font-bold text-gray-800 uppercase">{getUsername()}</span>
                  <ChevronDown className={`h-4 w-4 text-gray-600 transition-transform duration-200 ${isUserMenuOpen ? 'rotate-180' : ''}`} />
                </button>

                {/* User Menu Popup */}
                <AnimatePresence>
                  {isUserMenuOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -10, scale: 0.95 }}
                      transition={{ duration: 0.2 }}
                      className="absolute top-full mt-2 right-0 w-80 bg-white rounded-lg shadow-xl border border-gray-200 overflow-hidden z-50"
                    >
                      {/* User Info Section */}
                      <div className="p-4 border-b border-gray-100">
                        <div className="flex items-center space-x-3">
                          <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-purple-600 rounded-full flex items-center justify-center">
                            <span className="text-white font-bold text-lg">
                              {getUsername().charAt(0).toUpperCase()}
                            </span>
                          </div>
                          <div className="flex-1">
                            <h3 className="font-semibold text-gray-900">{getUsername()}</h3>
                            <p className="text-sm text-gray-500">
                              <AddressDisplay address={account} />
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Wallet Info */}
                      <div className="p-4 border-b border-gray-100 bg-gray-50">
                        <div className="space-y-2">
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-gray-600">Network:</span>
                            <span className="text-sm font-medium text-gray-900">
                              {walletType === 'metamask' ? 'MetaMask' : 'Phantom'}
                            </span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-gray-600">Balance:</span>
                            <span className="text-sm font-medium text-gray-900">
                              {parseFloat(balance).toFixed(4)} ETH
                            </span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-gray-600">mUSDC:</span>
                            <span className="text-sm font-medium text-gray-900">
                              {parseFloat(mUSDCBalance || '0').toFixed(2)}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="p-2">
                        <button
                          onClick={handleUsernameEdit}
                          className="w-full flex items-center space-x-3 px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md transition-colors duration-200"
                        >
                          <Settings className="h-4 w-4" />
                          <span>Edit Nickname</span>
                        </button>
                        <button
                          onClick={handleDisconnect}
                          className="w-full flex items-center space-x-3 px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-md transition-colors duration-200"
                        >
                          <LogOut className="h-4 w-4" />
                          <span>Disconnect Wallet</span>
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-400 to-purple-600 rounded-full flex items-center justify-center">
                  <Zap className="h-5 w-5 text-white" />
                </div>
                <span className="text-xl font-bold text-white">PABLO</span>
              </div>
            )}
          </div>

          {/* Right Navigation */}
          <div className="flex items-center space-x-8">
            {navItems.slice(2).map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.name}
                  to={item.path}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 uppercase ${
                    isActive(item.path)
                      ? 'text-cyan-400 bg-cyan-900/20 border border-cyan-500/30'
                      : 'text-gray-300 hover:text-white hover:bg-gray-700/50'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span>{item.name}</span>
                </Link>
              );
            })}

            {/* Wallet Connection for non-connected users */}
            {!isConnected && (
              <button
                onClick={handleConnectWallet}
                className="valorant-button text-sm"
              >
                Connect Wallet
              </button>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-gray-300 hover:text-white p-2"
            >
              {isMobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMobileMenuOpen && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="md:hidden bg-gray-800 border-t border-gray-700"
        >
          <div className="px-2 pt-2 pb-3 space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.name}
                  to={item.path}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`flex items-center space-x-3 px-3 py-2 rounded-md text-base font-medium transition-all duration-200 uppercase ${
                    isActive(item.path)
                      ? 'text-cyan-400 bg-cyan-900/20 border border-cyan-500/30'
                      : 'text-gray-300 hover:text-white hover:bg-gray-700/50'
                  }`}
                >
                  <Icon className="h-5 w-5" />
                  <span>{item.name}</span>
                </Link>
              );
            })}
            
            {/* Mobile Wallet Section */}
            <div className="pt-4 border-t border-gray-700">
              {isConnected && (
                <div className="space-y-2 px-3 py-2 text-sm text-gray-300">
                  <div className="flex items-center space-x-2">
                    <Wallet className="h-4 w-4" />
                    <span>{parseFloat(balance).toFixed(4)} ETH</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-xs text-gray-400">mUSDC:</span>
                    <span>{parseFloat(mUSDCBalance || '0').toFixed(2)}</span>
                  </div>
                  <div className="text-xs text-gray-400">
                    <AddressDisplay address={account} />
                  </div>
                  <button
                    onClick={() => {
                      handleDisconnect();
                      setIsMobileMenuOpen(false);
                    }}
                    className="w-full flex items-center space-x-2 px-3 py-2 text-red-400 hover:bg-red-900/20 rounded-md transition-colors duration-200"
                  >
                    <LogOut className="h-4 w-4" />
                    <span>Disconnect Wallet</span>
                  </button>
                </div>
              )}
              {!isConnected && (
                <button
                  onClick={() => {
                    handleConnectWallet();
                    setIsMobileMenuOpen(false);
                  }}
                  className="w-full valorant-button text-sm"
                >
                  Connect Wallet
                </button>
              )}
            </div>
          </div>
        </motion.div>
      )}

      {/* Wallet Connect Modal */}
      <WalletConnect 
        isOpen={isWalletModalOpen} 
        onClose={() => setIsWalletModalOpen(false)} 
      />

      {/* Click outside to close user menu */}
      {isUserMenuOpen && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setIsUserMenuOpen(false)}
        />
      )}
    </nav>
  );
};

export default Navbar; 