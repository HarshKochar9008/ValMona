import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Home, 
  Trophy, 
  TrendingUp, 
  User, 
  Wallet,
  Menu,
  X,
  Zap
} from 'lucide-react';
import { useWallet } from '../context/WalletContext';
import { useBetting } from '../context/BettingContext';
import WalletConnect from './WalletConnect';
import NetworkSwitcher from './NetworkSwitcher';
import AddressDisplay from './AddressDisplay';

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isWalletModalOpen, setIsWalletModalOpen] = useState(false);
  const location = useLocation();
  const { account, balance, isConnected, walletType } = useWallet();
  const { mUSDCBalance } = useBetting();

  const navItems = [
    { name: 'Home', path: '/', icon: Home },
    { name: 'Matches', path: '/matches', icon: Trophy },
    { name: 'Betting', path: '/betting', icon: TrendingUp },
    { name: 'Profile', path: '/profile', icon: User },
  ];

  const isActive = (path) => location.pathname === path;

  const handleConnectWallet = () => {
    setIsWalletModalOpen(true);
  };



  return (
    <nav className="bg-gradient-to-r from-valorant-blue to-gray-900 border-b border-gray-700 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center space-x-3"
          >
            <div className="flex items-center space-x-2">
              <Zap className="h-8 w-8 text-valorant-red" />
              <span className="text-xl font-bold text-gradient">Valorant Betting</span>
            </div>
          </motion.div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.name}
                  to={item.path}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                    isActive(item.path)
                      ? 'text-valorant-red bg-red-900/20 border border-red-500/30'
                      : 'text-gray-300 hover:text-white hover:bg-gray-700/50'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </div>

          {/* Wallet Connection */}
          <div className="hidden md:flex items-center space-x-4">
            {isConnected && (
              <div className="flex items-center space-x-4 text-sm text-gray-300">
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
              </div>
            )}
            <NetworkSwitcher />
            <button
              onClick={handleConnectWallet}
              className={`valorant-button text-sm ${
                isConnected ? 'bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800' : ''
              }`}
            >
              {isConnected ? `${walletType === 'metamask' ? 'MetaMask' : 'Phantom'} Connected` : 'Connect Wallet'}
            </button>
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
                  className={`flex items-center space-x-3 px-3 py-2 rounded-md text-base font-medium transition-all duration-200 ${
                    isActive(item.path)
                      ? 'text-valorant-red bg-red-900/20 border border-red-500/30'
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
                </div>
              )}
              <button
                onClick={() => {
                  handleConnectWallet();
                  setIsMobileMenuOpen(false);
                }}
                className={`w-full valorant-button text-sm ${
                  isConnected ? 'bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800' : ''
                }`}
              >
                {isConnected ? `${walletType === 'metamask' ? 'MetaMask' : 'Phantom'} Connected` : 'Connect Wallet'}
              </button>
            </div>
          </div>
        </motion.div>
      )}

      {/* Wallet Connect Modal */}
      <WalletConnect 
        isOpen={isWalletModalOpen} 
        onClose={() => setIsWalletModalOpen(false)} 
      />
    </nav>
  );
};

export default Navbar; 