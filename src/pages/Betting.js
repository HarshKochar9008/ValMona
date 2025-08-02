import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { 
  Target, 
  TrendingUp, 
  History, 
  DollarSign, 
  Trophy,
  Clock,
  CheckCircle,
  XCircle,
  ArrowRight,
  Plus,
  BarChart3,
  Users,
  Award
} from 'lucide-react';
import { useBetting } from '../context/BettingContext';
import valorantApi from '../services/valorantApi';

const Betting = () => {
  const [activeBets, setActiveBets] = useState([]);
  const [bettingHistory, setBettingHistory] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('active');
  const { isConnected, bets, userBets, balance } = useBetting();

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
        return <Clock className="h-5 w-5 text-blue-400" />;
    }
  };

  const getOutcomeColor = (outcome) => {
    switch (outcome) {
      case 'won':
        return 'text-green-400 bg-green-900/20 border-green-500/30';
      case 'lost':
        return 'text-red-400 bg-red-900/20 border-red-500/30';
      default:
        return 'text-blue-400 bg-blue-900/20 border-blue-500/30';
    }
  };

  const formatTime = (date) => {
    return new Date(date).toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const calculateTotalWinnings = () => {
    return bettingHistory.reduce((total, bet) => {
      return bet.outcome === 'won' ? total + bet.winnings : total;
    }, 0);
  };

  const calculateWinRate = () => {
    const wonBets = bettingHistory.filter(bet => bet.outcome === 'won').length;
    return bettingHistory.length > 0 ? (wonBets / bettingHistory.length) * 100 : 0;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-valorant-red"></div>
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
        <h1 className="text-4xl font-bold text-white mb-4">Betting Dashboard</h1>
        <p className="text-gray-300">Manage your bets and track your performance</p>
      </motion.div>

      {/* Stats Cards */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="grid grid-cols-1 md:grid-cols-4 gap-6"
      >
        <div className="stats-card">
          <div className="inline-flex p-3 rounded-lg bg-valorant-red/10 text-valorant-red mb-4">
            <DollarSign className="h-6 w-6" />
          </div>
          <h3 className="text-2xl font-bold text-white mb-1">{parseFloat(balance).toFixed(4)}</h3>
          <p className="text-gray-400 text-sm">Wallet Balance</p>
        </div>

        <div className="stats-card">
          <div className="inline-flex p-3 rounded-lg bg-valorant-secondary/10 text-valorant-secondary mb-4">
            <Target className="h-6 w-6" />
          </div>
          <h3 className="text-2xl font-bold text-white mb-1">{activeBets.length}</h3>
          <p className="text-gray-400 text-sm">Active Bets</p>
        </div>

        <div className="stats-card">
          <div className="inline-flex p-3 rounded-lg bg-valorant-success/10 text-valorant-success mb-4">
            <Trophy className="h-6 w-6" />
          </div>
          <h3 className="text-2xl font-bold text-white mb-1">{calculateTotalWinnings().toFixed(4)}</h3>
          <p className="text-gray-400 text-sm">Total Winnings</p>
        </div>

        <div className="stats-card">
          <div className="inline-flex p-3 rounded-lg bg-valorant-warning/10 text-valorant-warning mb-4">
            <TrendingUp className="h-6 w-6" />
          </div>
          <h3 className="text-2xl font-bold text-white mb-1">{calculateWinRate().toFixed(1)}%</h3>
          <p className="text-gray-400 text-sm">Win Rate</p>
        </div>
      </motion.div>

      {/* Tabs */}
      <div className="flex space-x-1 bg-gray-800 rounded-lg p-1">
        {[
          { id: 'active', label: 'Active Bets', icon: Target },
          { id: 'history', label: 'Betting History', icon: History },
          { id: 'stats', label: 'Statistics', icon: BarChart3 }
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
        {activeTab === 'active' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            {!isConnected ? (
              <div className="text-center py-12 valorant-card">
                <Target className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-white mb-2">Connect Your Wallet</h3>
                <p className="text-gray-400 mb-4">Connect your wallet to view and manage your bets</p>
                <button className="valorant-button">Connect Wallet</button>
              </div>
            ) : activeBets.length === 0 ? (
              <div className="text-center py-12 valorant-card">
                <Target className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-white mb-2">No Active Bets</h3>
                <p className="text-gray-400 mb-4">Start betting on matches to see them here</p>
                <Link to="/matches" className="valorant-button">
                  <Plus className="inline mr-2 h-4 w-4" />
                  Browse Matches
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {activeBets.map((bet) => (
                  <motion.div
                    key={bet.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="valorant-card p-6"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <Clock className="h-5 w-5 text-blue-400" />
                        <span className="text-sm text-blue-400 bg-blue-900/20 border border-blue-500/30 px-2 py-1 rounded">
                          ACTIVE
                        </span>
                      </div>
                      <div className="text-sm text-gray-400">
                        Deadline: {formatTime(bet.deadline)}
                      </div>
                    </div>

                    <h3 className="text-lg font-semibold text-white mb-4">{bet.question}</h3>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                      <div>
                        <p className="text-sm text-gray-400">Bet Amount</p>
                        <p className="text-lg font-bold text-white">{bet.betAmount} ETH</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-400">Your Pick</p>
                        <p className={`text-lg font-bold ${bet.side === 'yes' ? 'text-green-400' : 'text-red-400'}`}>
                          {bet.side === 'yes' ? 'YES' : 'NO'}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-400">Potential Win</p>
                        <p className="text-lg font-bold text-valorant-success">{bet.potentialWin} ETH</p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="text-sm text-gray-400">
                        Placed: {formatTime(bet.createdAt)}
                      </div>
                      <Link
                        to={`/match/${bet.matchId}`}
                        className="valorant-button-secondary text-sm flex items-center"
                      >
                        View Match
                        <ArrowRight className="ml-1 h-4 w-4" />
                      </Link>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </motion.div>
        )}

        {activeTab === 'history' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            {!isConnected ? (
              <div className="text-center py-12 valorant-card">
                <History className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-white mb-2">Connect Your Wallet</h3>
                <p className="text-gray-400 mb-4">Connect your wallet to view your betting history</p>
                <button className="valorant-button">Connect Wallet</button>
              </div>
            ) : bettingHistory.length === 0 ? (
              <div className="text-center py-12 valorant-card">
                <History className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-white mb-2">No Betting History</h3>
                <p className="text-gray-400 mb-4">Your completed bets will appear here</p>
                <Link to="/matches" className="valorant-button">
                  <Plus className="inline mr-2 h-4 w-4" />
                  Start Betting
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {bettingHistory.map((bet) => (
                  <motion.div
                    key={bet.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="valorant-card p-6"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        {getOutcomeIcon(bet.outcome)}
                        <span className={`text-sm px-2 py-1 rounded border ${getOutcomeColor(bet.outcome)}`}>
                          {bet.outcome.toUpperCase()}
                        </span>
                      </div>
                      <div className="text-sm text-gray-400">
                        Resolved: {formatTime(bet.resolvedAt)}
                      </div>
                    </div>

                    <h3 className="text-lg font-semibold text-white mb-4">{bet.question}</h3>

                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                      <div>
                        <p className="text-sm text-gray-400">Bet Amount</p>
                        <p className="text-lg font-bold text-white">{bet.betAmount} ETH</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-400">Your Pick</p>
                        <p className={`text-lg font-bold ${bet.side === 'yes' ? 'text-green-400' : 'text-red-400'}`}>
                          {bet.side === 'yes' ? 'YES' : 'NO'}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-400">Winnings</p>
                        <p className={`text-lg font-bold ${bet.outcome === 'won' ? 'text-valorant-success' : 'text-gray-400'}`}>
                          {bet.winnings} ETH
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-400">ROI</p>
                        <p className={`text-lg font-bold ${bet.outcome === 'won' ? 'text-valorant-success' : 'text-red-400'}`}>
                          {bet.outcome === 'won' ? '+' : '-'}{((Math.abs(bet.winnings - bet.betAmount) / bet.betAmount) * 100).toFixed(1)}%
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="text-sm text-gray-400">
                        Placed: {formatTime(bet.createdAt)}
                      </div>
                      <Link
                        to={`/match/${bet.matchId}`}
                        className="valorant-button-secondary text-sm flex items-center"
                      >
                        View Match
                        <ArrowRight className="ml-1 h-4 w-4" />
                      </Link>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </motion.div>
        )}

        {activeTab === 'stats' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="grid grid-cols-1 lg:grid-cols-2 gap-6"
          >
            {/* Personal Statistics */}
            <div className="valorant-card p-6">
              <h3 className="text-xl font-bold text-white mb-4 flex items-center">
                <BarChart3 className="mr-2 h-5 w-5 text-valorant-red" />
                Personal Statistics
              </h3>
              
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Total Bets Placed</span>
                  <span className="text-white font-semibold">{bettingHistory.length + activeBets.length}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Winning Bets</span>
                  <span className="text-valorant-success font-semibold">
                    {bettingHistory.filter(bet => bet.outcome === 'won').length}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Win Rate</span>
                  <span className="text-valorant-warning font-semibold">{calculateWinRate().toFixed(1)}%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Total Wagered</span>
                  <span className="text-white font-semibold">
                    {(bettingHistory.reduce((total, bet) => total + bet.betAmount, 0) + 
                      activeBets.reduce((total, bet) => total + bet.betAmount, 0)).toFixed(4)} ETH
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Total Winnings</span>
                  <span className="text-valorant-success font-semibold">{calculateTotalWinnings().toFixed(4)} ETH</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Net Profit</span>
                  <span className={`font-semibold ${
                    calculateTotalWinnings() > 0 ? 'text-valorant-success' : 'text-red-400'
                  }`}>
                    {(calculateTotalWinnings() - bettingHistory.reduce((total, bet) => total + bet.betAmount, 0)).toFixed(4)} ETH
                  </span>
                </div>
              </div>
            </div>

            {/* Platform Statistics */}
            <div className="valorant-card p-6">
              <h3 className="text-xl font-bold text-white mb-4 flex items-center">
                <Award className="mr-2 h-5 w-5 text-valorant-warning" />
                Platform Statistics
              </h3>
              
              {stats && (
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">Total Matches</span>
                    <span className="text-white font-semibold">{stats.totalMatches}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">Total Bets</span>
                    <span className="text-white font-semibold">{stats.totalBets.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">Total Volume</span>
                    <span className="text-white font-semibold">${stats.totalVolume.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">Active Users</span>
                    <span className="text-white font-semibold">{stats.activeUsers.toLocaleString()}</span>
                  </div>
                </div>
              )}

              {/* Top Teams */}
              {stats?.topTeams && (
                <div className="mt-6 pt-6 border-t border-gray-700">
                  <h4 className="text-lg font-semibold text-white mb-3">Top Teams</h4>
                  <div className="space-y-2">
                    {stats.topTeams.slice(0, 5).map((team, index) => (
                      <div key={team.name} className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <span className="text-sm text-gray-400">#{index + 1}</span>
                          <span className="text-white">{team.name}</span>
                        </div>
                        <span className="text-valorant-success font-semibold">{team.winRate}%</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default Betting; 