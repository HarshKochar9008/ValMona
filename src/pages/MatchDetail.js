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
  const [matchData, setMatchData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [betAmount, setBetAmount] = useState('');
  const [selectedTeam, setSelectedTeam] = useState(null);
  const { isConnected, placeBet, loading: bettingLoading } = useBetting();

  useEffect(() => {
    let intervalId;

    const fetchMatchDetails = async () => {
      try {
        const response = await fetch('http://localhost:3001/api/score');
        const data = await response.json();
        console.log(data);
        setMatchData(data);
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

    fetchMatchDetails(); // Initial fetch
    intervalId = setInterval(fetchMatchDetails, 10000); // Fetch every 10 seconds

    return () => clearInterval(intervalId); // Cleanup on unmount
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
        Who will win this round?
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
              <div className="flex flex-col items-center space-y-2">
                {/* <img src={match.team1.logo} alt={matchData.teams[0].name} className="w-12 h-12 rounded mb-2" /> */}
                <h2 className="text-2xl font-bold text-white mb-2">{matchData.teams[0].name}</h2>
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
              <div className="flex flex-col items-center space-y-2">
                {/* <img src={match.team2.logo} alt={matchData.teams[1].name} className="w-12 h-12 rounded mb-2" /> */}
                <h2 className="text-2xl font-bold text-white mb-2">{matchData.teams[1].name}</h2>
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
    <div className="flex flex-col lg:flex-row gap-6">
      {/* Left: YouTube + Scoreboard */}
      <div className="w-full lg:w-2/3 flex flex-col space-y-6">
        {/* YouTube Stream */}
        <div style={{ position: "relative", paddingBottom: "56.25%", height: 0 }}>
          <iframe
            src="https://www.youtube.com/embed/nKnIb04qUWY?autoplay=1&mute=1"
            title="YouTube stream"
            frameBorder="0"
            allow="autoplay; encrypted-media"
            allowFullScreen
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
            }}
          />
        </div>
        {/* Match Overview (Scoreboard) */}
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
              {/* <img src={match.team1.logo} alt={matchData.teams[0].name} className="w-24 h-24 rounded-lg mx-auto mb-4" /> */}
              <h2 className="text-2xl font-bold text-white mb-2">{matchData.teams[0].name}</h2>
              <p className="text-4xl font-bold text-valorant-red">{matchData.teams[0].score}</p>
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
              {/* <img src={match.team2.logo} alt={match.team2.name} className="w-24 h-24 rounded-lg mx-auto mb-4" /> */}
              <h2 className="text-2xl font-bold text-white mb-2">{matchData.teams[1].name}</h2>
              <p className="text-4xl font-bold text-valorant-red">{matchData.teams[1].score}</p>
            </div>
          </div>
          {/* Match Details */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
            <div className="flex items-center justify-center space-x-2 text-gray-400">
              <MapPin className="h-5 w-5" />
              <span>{matchData.map.name}</span>
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
      </div>
      {/* Right: Betting */}
      <div className="w-full lg:w-1/3 flex flex-col space-y-6">
        <div>
          <BettingCard />
        </div>
      </div>
    </div>
  );
};

export default MatchDetail; 