import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  User, 
  Trophy, 
  TrendingUp, 
  DollarSign, 
  Clock,
  CheckCircle,
  XCircle,
  BarChart3,
  Users,
  Award,
  Target,
  History,
  Wallet,
  Shield
} from 'lucide-react';
import { useBetting } from '../context/BettingContext';
import { useWallet } from '../context/WalletContext';
import valorantApi from '../services/valorantApi';

const About = () => {
  const [activeBets, setActiveBets] = useState([]);
  const [bettingHistory, setBettingHistory] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const { isConnected, bets, userBets, balance, mUSDCBalance } = useBetting();
  const { account, walletType } = useWallet();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [platformStats] = await Promise.all([
          valorantApi.getPlatformStats()
        ]);
        setStats(platformStats);
        
        // Mock active bets and history
        setActiveBets([
          {
            id: '1',
            matchId: '1',
            question: 'Will Sentinels win against 100 Thieves?',
            betAmount: 0.05,
            side: 'yes',
            potentialWin: 0.08,
            status: 'active',
            createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
            deadline: new Date(Date.now() + 4 * 60 * 60 * 1000)
          },
          {
            id: '2',
            matchId: '2',
            question: 'Will Fnatic win against Team Liquid?',
            betAmount: 0.03,
            side: 'no',
            potentialWin: 0.045,
            status: 'active',
            createdAt: new Date(Date.now() - 1 * 60 * 60 * 1000),
            deadline: new Date(Date.now() + 6 * 60 * 60 * 1000)
          }
        ]);

        setBettingHistory([
          {
            id: '3',
            matchId: '3',
            question: 'Will Cloud9 win against NRG Esports?',
            betAmount: 0.02,
            side: 'yes',
            outcome: 'won',
            winnings: 0.035,
            createdAt: new Date(Date.now() - 8 * 60 * 60 * 1000),
            resolvedAt: new Date(Date.now() - 6 * 60 * 60 * 1000)
          },
          {
            id: '4',
            matchId: '4',
            question: 'Will TSM win against Envy?',
            betAmount: 0.04,
            side: 'no',
            outcome: 'lost',
            winnings: 0,
            createdAt: new Date(Date.now() - 12 * 60 * 60 * 1000),
            resolvedAt: new Date(Date.now() - 10 * 60 * 60 * 1000)
          }
        ]);
      } catch (error) {
        console.error('Error fetching betting data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const getOutcomeIcon = (outcome) => {
    switch (outcome) {
      case 'won':
        return <CheckCircle className="h-5 w-5 text-green-400" />;
      case 'lost':
        return <XCircle className="h-5 w-5 text-red-400" />;
      default:
        return <Clock className="h-5 w-5 text-yellow-400" />;
    }
  };

  const getOutcomeColor = (outcome) => {
    switch (outcome) {
      case 'won':
        return 'text-green-400';
      case 'lost':
        return 'text-red-400';
      default:
        return 'text-yellow-400';
    }
  };

  const formatTime = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const calculateTotalWinnings = () => {
    return bettingHistory.reduce((total, bet) => total + bet.winnings, 0);
  };

  const calculateWinRate = () => {
    const wonBets = bettingHistory.filter(bet => bet.outcome === 'won').length;
    return bettingHistory.length > 0 ? (wonBets / bettingHistory.length * 100).toFixed(1) : 0;
  };

  const formatAddress = (address) => {
    if (!address) return '';
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  if (!isConnected) {
    return (
      <div className="text-center py-12">
        <User className="h-16 w-16 text-gray-400 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-white mb-4">About Valorant Stats</h2>
        <p className="text-gray-400 mb-6">Welcome to the ultimate Valorant betting platform</p>
        <div className="max-w-2xl mx-auto text-left space-y-4">
          <div className="valorant-card p-6">
            <h3 className="text-xl font-bold text-white mb-4">Platform Features</h3>
            <ul className="space-y-2 text-gray-300">
              <li>• Real-time match statistics and insights</li>
              <li>• Decentralized betting on Valorant matches</li>
              <li>• Secure wallet integration</li>
              <li>• Comprehensive betting history and analytics</li>
              <li>• Professional-grade data and predictions</li>
            </ul>
          </div>
          <div className="valorant-card p-6">
            <h3 className="text-xl font-bold text-white mb-4">How It Works</h3>
            <ul className="space-y-2 text-gray-300">
              <li>• Connect your wallet to start betting</li>
              <li>• Browse available matches and betting options</li>
              <li>• Place bets using ETH or mUSDC</li>
              <li>• Track your bets and view results</li>
              <li>• Withdraw winnings to your wallet</li>
            </ul>
          </div>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-valorant-red"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <h1 className="text-4xl font-bold text-white mb-4">About & Profile</h1>
        <p className="text-gray-300">Your betting profile and account overview</p>
      </motion.div>

      {/* Profile Overview */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="valorant-card p-6"
      >
        <div className="flex items-center space-x-6">
          <div className="w-20 h-20 bg-gradient-to-br from-valorant-red to-red-600 rounded-full flex items-center justify-center">
            <User className="h-10 w-10 text-white" />
          </div>
          <div className="flex-1">
            <h2 className="text-2xl font-bold text-white">Valorant Player</h2>
            <p className="text-gray-400">Professional Betting Enthusiast</p>
            <p className="text-sm text-gray-500 mt-1">
              Wallet: {formatAddress(account)}
            </p>
            <p className="text-sm text-gray-500">
              Network: {walletType === 'metamask' ? 'MetaMask' : 'Phantom'}
            </p>
          </div>
          <div className="text-right space-y-2">
            <div>
              <p className="text-2xl font-bold text-valorant-red">{parseFloat(balance).toFixed(4)} ETH</p>
              <p className="text-sm text-gray-400">Balance</p>
            </div>
            <div>
              <p className="text-lg font-bold text-green-400">{parseFloat(mUSDCBalance || '0').toFixed(2)} mUSDC</p>
              <p className="text-sm text-gray-400">Betting Balance</p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Stats Overview */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="grid grid-cols-1 md:grid-cols-4 gap-4"
      >
        <div className="valorant-card p-4 text-center">
          <div className="flex items-center justify-center mb-2">
            <Trophy className="h-8 w-8 text-yellow-400" />
          </div>
          <h3 className="text-2xl font-bold text-white">{calculateWinRate()}%</h3>
          <p className="text-sm text-gray-400">Win Rate</p>
        </div>
        
        <div className="valorant-card p-4 text-center">
          <div className="flex items-center justify-center mb-2">
            <DollarSign className="h-8 w-8 text-green-400" />
          </div>
          <h3 className="text-2xl font-bold text-white">{calculateTotalWinnings().toFixed(4)}</h3>
          <p className="text-sm text-gray-400">Total Winnings</p>
        </div>
        
        <div className="valorant-card p-4 text-center">
          <div className="flex items-center justify-center mb-2">
            <Target className="h-8 w-8 text-blue-400" />
          </div>
          <h3 className="text-2xl font-bold text-white">{activeBets.length}</h3>
          <p className="text-sm text-gray-400">Active Bets</p>
        </div>
        
        <div className="valorant-card p-4 text-center">
          <div className="flex items-center justify-center mb-2">
            <History className="h-8 w-8 text-purple-400" />
          </div>
          <h3 className="text-2xl font-bold text-white">{bettingHistory.length}</h3>
          <p className="text-sm text-gray-400">Total Bets</p>
        </div>
      </motion.div>

      {/* Tabs */}
      <div className="flex space-x-1 bg-gray-800 rounded-lg p-1">
        {[
          { id: 'overview', label: 'Overview', icon: BarChart3 },
          { id: 'active', label: 'Active Bets', icon: Target },
          { id: 'history', label: 'History', icon: History },
          { id: 'profile', label: 'Profile', icon: User }
        ].map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-md text-sm font-medium transition-all ${
                activeTab === tab.id
                  ? 'bg-valorant-red text-white'
                  : 'text-gray-400 hover:text-white hover:bg-gray-700'
              }`}
            >
              <Icon className="h-4 w-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Tab Content */}
      <div className="space-y-6">
        {activeTab === 'overview' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="valorant-card p-6"
          >
            <h3 className="text-xl font-bold text-white mb-6">Betting Overview</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h4 className="text-lg font-semibold text-white">Recent Activity</h4>
                <div className="space-y-3">
                  {bettingHistory.slice(0, 3).map((bet) => (
                    <div key={bet.id} className="flex items-center justify-between p-3 bg-gray-800 rounded-lg">
                      <div className="flex items-center space-x-3">
                        {getOutcomeIcon(bet.outcome)}
                        <div>
                          <p className="text-sm text-white font-medium">{bet.question}</p>
                          <p className="text-xs text-gray-400">{formatTime(bet.createdAt)}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className={`text-sm font-medium ${getOutcomeColor(bet.outcome)}`}>
                          {bet.outcome === 'won' ? '+' : ''}{bet.winnings.toFixed(4)} ETH
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="space-y-4">
                <h4 className="text-lg font-semibold text-white">Platform Stats</h4>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-gray-800 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <Users className="h-5 w-5 text-blue-400" />
                      <span className="text-white">Total Users</span>
                    </div>
                    <span className="text-white font-medium">{stats?.totalUsers || '1,234'}</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-gray-800 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <Award className="h-5 w-5 text-yellow-400" />
                      <span className="text-white">Total Volume</span>
                    </div>
                    <span className="text-white font-medium">{stats?.totalVolume || '45.67'} ETH</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-gray-800 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <Shield className="h-5 w-5 text-green-400" />
                      <span className="text-white">Active Matches</span>
                    </div>
                    <span className="text-white font-medium">{stats?.activeMatches || '12'}</span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {activeTab === 'active' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="valorant-card p-6"
          >
            <h3 className="text-xl font-bold text-white mb-6">Active Bets</h3>
            
            {activeBets.length === 0 ? (
              <div className="text-center py-8">
                <Target className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-400">No active bets</p>
              </div>
            ) : (
              <div className="space-y-4">
                {activeBets.map((bet) => (
                  <div key={bet.id} className="p-4 bg-gray-800 rounded-lg">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-semibold text-white">{bet.question}</h4>
                      <span className="text-sm text-yellow-400">Active</span>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <p className="text-gray-400">Bet Amount</p>
                        <p className="text-white font-medium">{bet.betAmount} ETH</p>
                      </div>
                      <div>
                        <p className="text-gray-400">Side</p>
                        <p className={`font-medium ${bet.side === 'yes' ? 'text-green-400' : 'text-red-400'}`}>
                          {bet.side.toUpperCase()}
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-400">Potential Win</p>
                        <p className="text-white font-medium">{bet.potentialWin} ETH</p>
                      </div>
                      <div>
                        <p className="text-gray-400">Deadline</p>
                        <p className="text-white font-medium">{formatTime(bet.deadline)}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </motion.div>
        )}

        {activeTab === 'history' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="valorant-card p-6"
          >
            <h3 className="text-xl font-bold text-white mb-6">Betting History</h3>
            
            {bettingHistory.length === 0 ? (
              <div className="text-center py-8">
                <History className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-400">No betting history</p>
              </div>
            ) : (
              <div className="space-y-4">
                {bettingHistory.map((bet) => (
                  <div key={bet.id} className="p-4 bg-gray-800 rounded-lg">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-semibold text-white">{bet.question}</h4>
                      <div className="flex items-center space-x-2">
                        {getOutcomeIcon(bet.outcome)}
                        <span className={`text-sm font-medium ${getOutcomeColor(bet.outcome)}`}>
                          {bet.outcome.toUpperCase()}
                        </span>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <p className="text-gray-400">Bet Amount</p>
                        <p className="text-white font-medium">{bet.betAmount} ETH</p>
                      </div>
                      <div>
                        <p className="text-gray-400">Side</p>
                        <p className={`font-medium ${bet.side === 'yes' ? 'text-green-400' : 'text-red-400'}`}>
                          {bet.side.toUpperCase()}
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-400">Winnings</p>
                        <p className={`font-medium ${getOutcomeColor(bet.outcome)}`}>
                          {bet.outcome === 'won' ? '+' : ''}{bet.winnings.toFixed(4)} ETH
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-400">Resolved</p>
                        <p className="text-white font-medium">{formatTime(bet.resolvedAt)}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </motion.div>
        )}

        {activeTab === 'profile' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="valorant-card p-6"
          >
            <h3 className="text-xl font-bold text-white mb-6">Profile Information</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Username
                  </label>
                  <input
                    type="text"
                    value="ValorantPlayer123"
                    disabled
                    className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white opacity-50"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    value="player@example.com"
                    disabled
                    className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white opacity-50"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Bio
                  </label>
                  <textarea
                    value="Passionate Valorant player and betting enthusiast"
                    disabled
                    rows={3}
                    className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white opacity-50 resize-none"
                  />
                </div>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Wallet Address
                  </label>
                  <input
                    type="text"
                    value={formatAddress(account)}
                    disabled
                    className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white opacity-50"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Network
                  </label>
                  <input
                    type="text"
                    value={walletType === 'metamask' ? 'MetaMask' : 'Phantom'}
                    disabled
                    className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white opacity-50"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Member Since
                  </label>
                  <input
                    type="text"
                    value="January 2024"
                    disabled
                    className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white opacity-50"
                  />
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default About; 