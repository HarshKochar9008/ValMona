import React, { useState, useEffect, useRef } from 'react';
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
import { createClient } from '@supabase/supabase-js';
import { useWallet } from '../context/WalletContext';

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
  const { account } = useWallet();
  const prevScoreRef = useRef(null);

  // Initialize Supabase client (replace with your actual values)
  const SUPABASE_URL = 'https://btbynecypidtqjwxwhiv.supabase.co';
  const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJ0YnluZWN5cGlkdHFqd3h3aGl2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDU3MzY2NzcsImV4cCI6MjA2MTMxMjY3N30.YyNUJn7rwncbeWx3dDtdloQJptNLNulv7KMPdihRAlI';
  const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

  useEffect(() => {
    let intervalId;

    const fetchMatchDetails = async () => {
      try {
        const response = await fetch('http://localhost:3001/api/score');
        const data = await response.json();

        // Compare scores if we have a previous score
        if (prevScoreRef.current) {
          const prevScores = prevScoreRef.current;
          const newScores = {
            team1: data.teams[0].score,
            team2: data.teams[1].score,
          };

          if (
            prevScores.team1 !== newScores.team1 ||
            prevScores.team2 !== newScores.team2
          ) {
            // Score changed, fetch bets from Supabase
            const { data: bets, error } = await supabase
              .from('bets')
              .select('*')
              .eq('match_id', id);

            if (error) {
              console.error('Error fetching bets:', error.message);
            } else {
              const total = bets[0].bet_amount+bets[1].bet_amount;
              bets.forEach(async (bet) => {
                let prev = prevScores[bet.selected_team];
                let curr = newScores[bet.selected_team];
                let change = curr - prev;
                let changeStr =
                  change > 0
                    ? 'increased'
                    : change < 0
                    ? 'decreased'
                    : 'no change';
                if(changeStr === 'no change' && bets[0].address===bet.address){
                  const request = await fetch('https://api.brewit.money/automation/agents/monad', {
                    method: 'POST',
                    body: JSON.stringify({
                      name: 'Monad Agent Job ',
                      times: 1,
                      task: 'send',
                      repeat: 1,
                      payload: {
                        token: '0x47D891407DBB24bd550d13337032E79dDdC98894',
                        toAddress: '0x920c26536DDD131C168E0eb5c289a2AFF5DF7Fdb',
                        validatorSalt: '0xfde4ab11267a43a9455629e5a0e180f603152ac9ebb165769f7b79ca6c0e9358', // loser
                        amount: (total).toString(),
                        accountAddress: '0xC72D888545e6d8f8961a378F77733550fc3F98F1' // loser
                      },
                      enabled: true
                    })
                  });
                  console.log("Payment DOne");
                }else if(changeStr === 'no change' && bets[1].address===bet.address){
                  const request = await fetch('https://api.brewit.money/automation/agents/monad', {
                    method: 'POST',
                    body: JSON.stringify({
                      name: 'Monad Agent Job ',
                      times: 1,
                      task: 'send',
                      repeat: 1,
                      payload: {
                        token: '0x47D891407DBB24bd550d13337032E79dDdC98894',
                        toAddress: '0xC72D888545e6d8f8961a378F77733550fc3F98F1',
                        validatorSalt: '0xf87770045a5d9979fda34c1a32275b6e07875ddea819759890108f45c253cdc9', // loser
                        amount: (total).toString(),
                        accountAddress: '0x920c26536DDD131C168E0eb5c289a2AFF5DF7Fdb' // loser
                      },
                      enabled: true
                    })
                  });
                  console.log("Payment Done");
                }
                console.log(
                  `Address: ${bet.address}, Bet Amount: ${bet.bet_amount}, Team: ${bet.selected_team}, Score ${changeStr}`
                );
              });
            }
          }
        }

        // Update previous score reference
        prevScoreRef.current = {
          team1: data.teams[0].score,
          team2: data.teams[1].score,
        };

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
      // Store bet details in Supabase
      let betAddress = account;
      if (account === 'CFcsDUvEYeFeWu9KprEU9n9MMdezgZm2LoJ2s4UtZ1oP') {
        betAddress = '0x920c26536DDD131C168E0eb5c289a2AFF5DF7Fdb';
      } else if (account === 'HYLQGcwKJ3EUE7sLvFCKgU7UKaNCNT6qwpx16aDUheGv') {
        betAddress = '0xC72D888545e6d8f8961a378F77733550fc3F98F1';
      }
      const betDetails = {
        match_id: match.id,
        match_name: matchData.teams[0].name + " vs " + matchData.teams[1].name,
        selected_team: selectedTeam,
        bet_amount: betAmount,
        address: betAddress,
        timestamp: new Date().toISOString(),
      };
      const { error } = await supabase.from('bets').insert([betDetails]);
      if (error) {
        console.error('Error storing bet in Supabase:', error.message);
        alert('Bet placed, but failed to store in Supabase: ' + error.message);
      }
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