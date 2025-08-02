import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { 
  Play, 
  Clock, 
  Trophy, 
  TrendingUp, 
  Users, 
  DollarSign,
  ArrowRight,
  Zap,
  Target,
  Award
} from 'lucide-react';
import valorantApi from '../services/valorantApi';
import { useBetting } from '../context/BettingContext';

const Home = () => {
  const [liveMatches, setLiveMatches] = useState([]);
  const [upcomingMatches, setUpcomingMatches] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const { isConnected } = useBetting();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [live, upcoming, platformStats] = await Promise.all([
          valorantApi.getLiveMatches(),
          valorantApi.getUpcomingMatches(),
          valorantApi.getPlatformStats()
        ]);
        
        setLiveMatches(live);
        setUpcomingMatches(upcoming);
        setStats(platformStats);
      } catch (error) {
        console.error('Error fetching home data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const StatCard = ({ icon: Icon, title, value, subtitle, color = 'valorant-red' }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="stats-card"
    >
      <div className={`inline-flex p-3 rounded-lg bg-${color}/10 text-${color} mb-4`}>
        <Icon className="h-6 w-6" />
      </div>
      <h3 className="text-2xl font-bold text-white mb-1">{value}</h3>
      <p className="text-gray-400 text-sm">{title}</p>
      {subtitle && <p className="text-gray-500 text-xs mt-1">{subtitle}</p>}
    </motion.div>
  );

  const MatchCard = ({ match, isLive = false }) => (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ scale: 1.02 }}
      className="match-card"
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          {isLive && (
            <div className="flex items-center space-x-1 text-red-400">
              <div className="w-2 h-2 bg-red-400 rounded-full animate-pulse"></div>
              <span className="text-sm font-medium">LIVE</span>
            </div>
          )}
          <span className="text-sm text-gray-400">{match.tournament}</span>
        </div>
        <div className="text-sm text-gray-400">{match.map}</div>
      </div>

      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <img src={match.team1.logo} alt={match.team1.name} className="w-12 h-12 rounded-lg" />
          <div>
            <h3 className="font-semibold text-white">{match.team1.name}</h3>
            <p className="text-sm text-gray-400">{match.team1.score}</p>
          </div>
        </div>
        
        <div className="text-center">
          <div className="text-lg font-bold text-valorant-red">VS</div>
          <div className="text-xs text-gray-400">Best of 3</div>
        </div>
        
        <div className="flex items-center space-x-3">
          <div className="text-right">
            <h3 className="font-semibold text-white">{match.team2.name}</h3>
            <p className="text-sm text-gray-400">{match.team2.score}</p>
          </div>
          <img src={match.team2.logo} alt={match.team2.name} className="w-12 h-12 rounded-lg" />
        </div>
      </div>

      <div className="flex items-center justify-between">
        <div className="text-sm text-gray-400">
          {isLive ? `Round ${match.currentRound}/${match.totalRounds}` : match.round}
        </div>
        <Link
          to={`/match/${match.id}`}
          className="valorant-button-secondary text-sm"
        >
          {isLive ? 'Watch Live' : 'View Details'}
        </Link>
      </div>
    </motion.div>
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-valorant-red"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center py-12"
      >
        <h1 className="text-5xl md:text-6xl font-bold mb-6">
          <span className="text-gradient">Valorant</span>
          <br />
          <span className="text-white">Betting Platform</span>
        </h1>
        <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
          Bet on your favorite Valorant teams and players. Real-time statistics, live matches, and instant payouts.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link to="/matches" className="valorant-button text-lg px-8 py-3">
            <Play className="inline mr-2 h-5 w-5" />
            View Matches
          </Link>
          {!isConnected && (
            <button className="valorant-button-secondary text-lg px-8 py-3">
              <Zap className="inline mr-2 h-5 w-5" />
              Start Betting
            </button>
          )}
        </div>
      </motion.div>

      {/* Stats Section */}
      {stats && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-6"
        >
          <StatCard
            icon={Trophy}
            title="Total Matches"
            value={stats.totalMatches}
            color="valorant-red"
          />
          <StatCard
            icon={TrendingUp}
            title="Total Bets"
            value={stats.totalBets.toLocaleString()}
            color="valorant-secondary"
          />
          <StatCard
            icon={DollarSign}
            title="Total Volume"
            value={`$${stats.totalVolume.toLocaleString()}`}
            color="valorant-success"
          />
          <StatCard
            icon={Users}
            title="Active Users"
            value={stats.activeUsers.toLocaleString()}
            color="valorant-warning"
          />
        </motion.div>
      )}

      {/* Live Matches Section */}
      {liveMatches.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-white flex items-center">
              <Play className="mr-2 h-6 w-6 text-valorant-red" />
              Live Matches
            </h2>
            <Link to="/matches" className="text-valorant-red hover:text-red-400 flex items-center">
              View All <ArrowRight className="ml-1 h-4 w-4" />
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {liveMatches.map((match) => (
              <MatchCard key={match.id} match={match} isLive={true} />
            ))}
          </div>
        </motion.div>
      )}

      {/* Upcoming Matches Section */}
      {upcomingMatches.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-white flex items-center">
              <Clock className="mr-2 h-6 w-6 text-valorant-secondary" />
              Upcoming Matches
            </h2>
            <Link to="/matches" className="text-valorant-red hover:text-red-400 flex items-center">
              View All <ArrowRight className="ml-1 h-4 w-4" />
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {upcomingMatches.slice(0, 3).map((match) => (
              <MatchCard key={match.id} match={match} />
            ))}
          </div>
        </motion.div>
      )}

      {/* Top Teams Section */}
      {stats?.topTeams && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          <h2 className="text-2xl font-bold text-white flex items-center">
            <Award className="mr-2 h-6 w-6 text-valorant-warning" />
            Top Teams
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {stats.topTeams.slice(0, 6).map((team, index) => (
              <motion.div
                key={team.name}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="team-card"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-valorant-red rounded-full flex items-center justify-center text-white font-bold text-sm">
                      {index + 1}
                    </div>
                    <div>
                      <h3 className="font-semibold text-white">{team.name}</h3>
                      <p className="text-sm text-gray-400">{team.wins}W - {team.losses}L</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold text-valorant-success">{team.winRate}%</p>
                    <p className="text-xs text-gray-400">Win Rate</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}

      {/* CTA Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center py-12 valorant-card"
      >
        <h2 className="text-3xl font-bold text-white mb-4">
          Ready to Start Betting?
        </h2>
        <p className="text-gray-300 mb-8 max-w-2xl mx-auto">
          Join thousands of players betting on Valorant matches. Get real-time odds, live statistics, and instant payouts.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link to="/betting" className="valorant-button text-lg px-8 py-3">
            <Target className="inline mr-2 h-5 w-5" />
            Start Betting Now
          </Link>
          <Link to="/matches" className="valorant-button-secondary text-lg px-8 py-3">
            <Trophy className="inline mr-2 h-5 w-5" />
            Browse Matches
          </Link>
        </div>
      </motion.div>
    </div>
  );
};

export default Home; 