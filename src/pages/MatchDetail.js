import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  ArrowLeft, 
  Play, 
  Clock, 
  CheckCircle,
  MapPin,
  Calendar,
  Users,
  Target,
  TrendingUp,
  Award,
  Zap,
  DollarSign,
  BarChart3
} from 'lucide-react';
import valorantApi from '../services/valorantApi';
import { useBetting } from '../context/BettingContext';

const MatchDetail = () => {
  const { id } = useParams();
  const [match, setMatch] = useState(null);
  const [matchStats, setMatchStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [betAmount, setBetAmount] = useState('');
  const [selectedTeam, setSelectedTeam] = useState(null);
  const { isConnected, placeBet, loading: bettingLoading } = useBetting();

  useEffect(() => {
    const fetchMatchDetails = async () => {
      try {
        const [matchData, statsData] = await Promise.all([
          valorantApi.getMatch(id),
          valorantApi.getMatchStats(id)
        ]);
        setMatch(matchData);
        setMatchStats(statsData);
      } catch (error) {
        console.error('Error fetching match details:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchMatchDetails();
  }, [id]);

  const getStatusIcon = (status) => {
    switch (status) {
      case 'live':
        return <Play className="h-5 w-5 text-red-400" />;
      case 'upcoming':
        return <Clock className="h-5 w-5 text-blue-400" />;
      case 'completed':
        return <CheckCircle className="h-5 w-5 text-green-400" />;
      default:
        return <Clock className="h-5 w-5 text-gray-400" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'live':
        return 'text-red-400 bg-red-900/20 border-red-500/30';
      case 'upcoming':
        return 'text-blue-400 bg-blue-900/20 border-blue-500/30';
      case 'completed':
        return 'text-green-400 bg-green-900/20 border-green-500/30';
      default:
        return 'text-gray-400 bg-gray-900/20 border-gray-500/30';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'live':
        return 'LIVE';
      case 'upcoming':
        return 'UPCOMING';
      case 'completed':
        return 'COMPLETED';
      default:
        return 'UNKNOWN';
    }
  };

  const formatTime = (date) => {
    return new Date(date).toLocaleString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleBet = async () => {
    if (!isConnected) {
      alert('Please connect your wallet first');
      return;
    }

    if (!selectedTeam || !betAmount) {
      alert('Please select a team and enter bet amount');
      return;
    }

    try {
      await placeBet(match.id, selectedTeam, betAmount);
      setBetAmount('');
      setSelectedTeam(null);
      alert('Bet placed successfully!');
    } catch (error) {
      alert('Error placing bet: ' + error.message);
    }
  };

  const PlayerCard = ({ player, teamColor = 'valorant-red' }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="valorant-card p-4"
    >
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-3">
          <div className={`w-3 h-3 rounded-full bg-${teamColor}`}></div>
          <h4 className="font-semibold text-white">{player.name}</h4>
        </div>
        <span className="text-sm text-gray-400">{player.agent}</span>
      </div>
      
      <div className="grid grid-cols-3 gap-4 text-center">
        <div>
          <p className="text-lg font-bold text-valorant-red">{player.kills}</p>
          <p className="text-xs text-gray-400">Kills</p>
        </div>
        <div>
          <p className="text-lg font-bold text-gray-300">{player.deaths}</p>
          <p className="text-xs text-gray-400">Deaths</p>
        </div>
        <div>
          <p className="text-lg font-bold text-valorant-secondary">{player.assists}</p>
          <p className="text-xs text-gray-400">Assists</p>
        </div>
      </div>
      
      <div className="mt-3 pt-3 border-t border-gray-700">
        <p className="text-sm text-gray-400">
          K/D: {player.deaths > 0 ? (player.kills / player.deaths).toFixed(2) : player.kills.toFixed(2)}
        </p>
      </div>
    </motion.div>
  );

  const BettingCard = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="betting-card"
    >
      <h3 className="text-xl font-bold text-white mb-4 flex items-center">
        <Target className="mr-2 h-5 w-5 text-valorant-red" />
        Place Your Bet
      </h3>

      {!isConnected ? (
        <div className="text-center py-8">
          <Zap className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-400 mb-4">Connect your wallet to start betting</p>
          <button className="valorant-button">Connect Wallet</button>
        </div>
      ) : (
        <div className="space-y-4">
          {/* Team Selection */}
          <div className="grid grid-cols-2 gap-4">
            <button
              onClick={() => setSelectedTeam('team1')}
              className={`p-4 rounded-lg border-2 transition-all ${
                selectedTeam === 'team1'
                  ? 'border-valorant-red bg-red-900/20'
                  : 'border-gray-700 hover:border-gray-600'
              }`}
            >
              <div className="flex items-center space-x-3">
                <img src={match.team1.logo} alt={match.team1.name} className="w-8 h-8 rounded" />
                <span className="font-semibold text-white">{match.team1.name}</span>
              </div>
            </button>
            
            <button
              onClick={() => setSelectedTeam('team2')}
              className={`p-4 rounded-lg border-2 transition-all ${
                selectedTeam === 'team2'
                  ? 'border-valorant-red bg-red-900/20'
                  : 'border-gray-700 hover:border-gray-600'
              }`}
            >
              <div className="flex items-center space-x-3">
                <img src={match.team2.logo} alt={match.team2.name} className="w-8 h-8 rounded" />
                <span className="font-semibold text-white">{match.team2.name}</span>
              </div>
            </button>
          </div>

          {/* Bet Amount */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Bet Amount (ETH)
            </label>
            <input
              type="number"
              value={betAmount}
              onChange={(e) => setBetAmount(e.target.value)}
              placeholder="0.01"
              step="0.01"
              min="0.01"
              className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-valorant-red"
            />
          </div>

          {/* Bet Button */}
          <button
            onClick={handleBet}
            disabled={!selectedTeam || !betAmount || bettingLoading}
            className="w-full valorant-button disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {bettingLoading ? 'Processing...' : 'Place Bet'}
          </button>

          {/* Betting Info */}
          <div className="text-sm text-gray-400 space-y-2">
            <p>• Minimum bet: 0.01 ETH</p>
            <p>• Odds will be calculated based on total pool</p>
            <p>• Payouts are automatic after match resolution</p>
          </div>
        </div>
      )}
    </motion.div>
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-valorant-red"></div>
      </div>
    );
  }

  if (!match) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-white mb-4">Match not found</h2>
        <Link to="/matches" className="valorant-button">
          <ArrowLeft className="inline mr-2 h-4 w-4" />
          Back to Matches
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <Link to="/matches" className="valorant-button-secondary text-sm">
          <ArrowLeft className="inline mr-2 h-4 w-4" />
          Back to Matches
        </Link>
        <div className="flex items-center space-x-3">
          {getStatusIcon(match.status)}
          <span className={`text-sm font-medium px-3 py-1 rounded-full border ${getStatusColor(match.status)}`}>
            {getStatusText(match.status)}
          </span>
        </div>
      </div>

      {/* Match Overview */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="valorant-card p-8"
      >
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">{match.tournament}</h1>
          <p className="text-gray-400">{match.round}</p>
        </div>

        {/* Teams */}
        <div className="flex items-center justify-between mb-8">
          <div className="text-center flex-1">
            <img src={match.team1.logo} alt={match.team1.name} className="w-24 h-24 rounded-lg mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-white mb-2">{match.team1.name}</h2>
            <p className="text-4xl font-bold text-valorant-red">{match.team1.score}</p>
          </div>

          <div className="text-center mx-8">
            <div className="text-3xl font-bold text-gray-400 mb-2">VS</div>
            <div className="text-sm text-gray-500">Best of 3</div>
            {match.status === 'live' && (
              <div className="mt-4">
                <div className="text-sm text-red-400 mb-2">Round {match.currentRound}/{match.totalRounds}</div>
                <div className="w-32 bg-gray-700 rounded-full h-2">
                  <div 
                    className="bg-valorant-red h-2 rounded-full transition-all duration-300"
                    style={{ width: `${(match.currentRound / match.totalRounds) * 100}%` }}
                  ></div>
                </div>
              </div>
            )}
          </div>

          <div className="text-center flex-1">
            <img src={match.team2.logo} alt={match.team2.name} className="w-24 h-24 rounded-lg mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-white mb-2">{match.team2.name}</h2>
            <p className="text-4xl font-bold text-valorant-red">{match.team2.score}</p>
          </div>
        </div>

        {/* Match Details */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
          <div className="flex items-center justify-center space-x-2 text-gray-400">
            <MapPin className="h-5 w-5" />
            <span>{match.map}</span>
          </div>
          <div className="flex items-center justify-center space-x-2 text-gray-400">
            <Calendar className="h-5 w-5" />
            <span>{formatTime(match.startTime)}</span>
          </div>
          <div className="flex items-center justify-center space-x-2 text-gray-400">
            <Users className="h-5 w-5" />
            <span>{match.team1.players.length + match.team2.players.length} Players</span>
          </div>
        </div>
      </motion.div>

      {/* Tabs */}
      <div className="flex space-x-1 bg-gray-800 rounded-lg p-1">
        {[
          { id: 'overview', label: 'Overview', icon: BarChart3 },
          { id: 'players', label: 'Players', icon: Users },
          { id: 'betting', label: 'Betting', icon: Target }
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
        {activeTab === 'overview' && matchStats && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="grid grid-cols-1 lg:grid-cols-2 gap-6"
          >
            {/* Team Statistics */}
            <div className="valorant-card p-6">
              <h3 className="text-xl font-bold text-white mb-4 flex items-center">
                <TrendingUp className="mr-2 h-5 w-5 text-valorant-red" />
                Team Statistics
              </h3>
              
              <div className="space-y-6">
                {/* Team 1 Stats */}
                <div>
                  <h4 className="font-semibold text-white mb-3">{match.team1.name}</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center">
                      <p className="text-2xl font-bold text-valorant-red">{matchStats.team1Stats.totalKills}</p>
                      <p className="text-sm text-gray-400">Total Kills</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold text-gray-300">{matchStats.team1Stats.totalDeaths}</p>
                      <p className="text-sm text-gray-400">Total Deaths</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold text-valorant-secondary">{matchStats.team1Stats.totalAssists}</p>
                      <p className="text-sm text-gray-400">Total Assists</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold text-valorant-success">{matchStats.team1Stats.kdRatio}</p>
                      <p className="text-sm text-gray-400">K/D Ratio</p>
                    </div>
                  </div>
                </div>

                {/* Team 2 Stats */}
                <div>
                  <h4 className="font-semibold text-white mb-3">{match.team2.name}</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center">
                      <p className="text-2xl font-bold text-valorant-red">{matchStats.team2Stats.totalKills}</p>
                      <p className="text-sm text-gray-400">Total Kills</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold text-gray-300">{matchStats.team2Stats.totalDeaths}</p>
                      <p className="text-sm text-gray-400">Total Deaths</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold text-valorant-secondary">{matchStats.team2Stats.totalAssists}</p>
                      <p className="text-sm text-gray-400">Total Assists</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold text-valorant-success">{matchStats.team2Stats.kdRatio}</p>
                      <p className="text-sm text-gray-400">K/D Ratio</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Head to Head */}
            <div className="valorant-card p-6">
              <h3 className="text-xl font-bold text-white mb-4 flex items-center">
                <Award className="mr-2 h-5 w-5 text-valorant-warning" />
                Head to Head
              </h3>
              
              <div className="space-y-4">
                <div className="text-center">
                  <p className="text-3xl font-bold text-white mb-2">{matchStats.headToHead.totalMatches}</p>
                  <p className="text-gray-400">Total Matches</p>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-valorant-red">{matchStats.headToHead.team1Wins}</p>
                    <p className="text-sm text-gray-400">{match.team1.name} Wins</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-valorant-red">{matchStats.headToHead.team2Wins}</p>
                    <p className="text-sm text-gray-400">{match.team2.name} Wins</p>
                  </div>
                </div>
                
                <div className="text-center pt-4 border-t border-gray-700">
                  <p className="text-sm text-gray-400">Last Match</p>
                  <p className="text-white">{matchStats.headToHead.lastMatch}</p>
                  <p className="text-sm text-valorant-success">Winner: {matchStats.headToHead.lastWinner}</p>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {activeTab === 'players' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Team 1 Players */}
              <div>
                <h3 className="text-xl font-bold text-white mb-4">{match.team1.name} Players</h3>
                <div className="space-y-4">
                  {match.team1.players.map((player, index) => (
                    <PlayerCard key={index} player={player} teamColor="valorant-red" />
                  ))}
                </div>
              </div>

              {/* Team 2 Players */}
              <div>
                <h3 className="text-xl font-bold text-white mb-4">{match.team2.name} Players</h3>
                <div className="space-y-4">
                  {match.team2.players.map((player, index) => (
                    <PlayerCard key={index} player={player} teamColor="valorant-secondary" />
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {activeTab === 'betting' && (
          <BettingCard />
        )}
      </div>
    </div>
  );
};

export default MatchDetail; 