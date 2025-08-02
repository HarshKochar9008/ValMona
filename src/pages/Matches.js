import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { 
  Search, 
  Filter, 
  Play, 
  Clock, 
  CheckCircle,
  MapPin,
  Calendar,
  Users,
  ArrowRight
} from 'lucide-react';
import valorantApi from '../services/valorantApi';

const Matches = () => {
  const [matches, setMatches] = useState([]);
  const [filteredMatches, setFilteredMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [tournamentFilter, setTournamentFilter] = useState('all');

  useEffect(() => {
    const fetchMatches = async () => {
      try {
        const allMatches = await valorantApi.getMatches();
        setMatches(allMatches);
        setFilteredMatches(allMatches);
      } catch (error) {
        console.error('Error fetching matches:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchMatches();
  }, []);

  useEffect(() => {
    let filtered = matches;

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(match => 
        match.team1.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        match.team2.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        match.tournament.toLowerCase().includes(searchTerm.toLowerCase()) ||
        match.map.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by status
    if (statusFilter !== 'all') {
      filtered = filtered.filter(match => match.status === statusFilter);
    }

    // Filter by tournament
    if (tournamentFilter !== 'all') {
      filtered = filtered.filter(match => match.tournament === tournamentFilter);
    }

    setFilteredMatches(filtered);
  }, [matches, searchTerm, statusFilter, tournamentFilter]);

  const getStatusIcon = (status) => {
    switch (status) {
      case 'live':
        return <Play className="h-4 w-4 text-red-400" />;
      case 'upcoming':
        return <Clock className="h-4 w-4 text-blue-400" />;
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-green-400" />;
      default:
        return <Clock className="h-4 w-4 text-gray-400" />;
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
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getTournaments = () => {
    const tournaments = [...new Set(matches.map(match => match.tournament))];
    return tournaments;
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
        <h1 className="text-4xl font-bold text-white mb-4">Valorant Matches</h1>
        <p className="text-gray-300">Browse and bet on upcoming, live, and completed matches</p>
      </motion.div>

      {/* Filters */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="valorant-card p-6"
      >
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search matches..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-valorant-red"
            />
          </div>

          {/* Status Filter */}
          <div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-valorant-red"
            >
              <option value="all">All Status</option>
              <option value="live">Live</option>
              <option value="upcoming">Upcoming</option>
              <option value="completed">Completed</option>
            </select>
          </div>

          {/* Tournament Filter */}
          <div>
            <select
              value={tournamentFilter}
              onChange={(e) => setTournamentFilter(e.target.value)}
              className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-valorant-red"
            >
              <option value="all">All Tournaments</option>
              {getTournaments().map(tournament => (
                <option key={tournament} value={tournament}>{tournament}</option>
              ))}
            </select>
          </div>

          {/* Results Count */}
          <div className="flex items-center justify-center">
            <span className="text-gray-400">
              {filteredMatches.length} match{filteredMatches.length !== 1 ? 'es' : ''} found
            </span>
          </div>
        </div>
      </motion.div>

      {/* Matches Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredMatches.map((match, index) => (
          <motion.div
            key={match.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="match-card"
          >
            {/* Match Header */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                {getStatusIcon(match.status)}
                <span className={`text-sm font-medium px-2 py-1 rounded border ${getStatusColor(match.status)}`}>
                  {getStatusText(match.status)}
                </span>
              </div>
              <div className="text-sm text-gray-400">
                {formatTime(match.startTime)}
              </div>
            </div>

            {/* Teams */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-4">
                <img src={match.team1.logo} alt={match.team1.name} className="w-16 h-16 rounded-lg" />
                <div>
                  <h3 className="font-bold text-white text-lg">{match.team1.name}</h3>
                  <p className="text-2xl font-bold text-valorant-red">{match.team1.score}</p>
                </div>
              </div>

              <div className="text-center">
                <div className="text-xl font-bold text-gray-400 mb-1">VS</div>
                <div className="text-xs text-gray-500">Best of 3</div>
              </div>

              <div className="flex items-center space-x-4">
                <div className="text-right">
                  <h3 className="font-bold text-white text-lg">{match.team2.name}</h3>
                  <p className="text-2xl font-bold text-valorant-red">{match.team2.score}</p>
                </div>
                <img src={match.team2.logo} alt={match.team2.name} className="w-16 h-16 rounded-lg" />
              </div>
            </div>

            {/* Match Details */}
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="flex items-center space-x-2 text-sm text-gray-400">
                <MapPin className="h-4 w-4" />
                <span>{match.map}</span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-gray-400">
                <Calendar className="h-4 w-4" />
                <span>{match.round}</span>
              </div>
            </div>

            {/* Live Match Progress */}
            {match.status === 'live' && (
              <div className="mb-6">
                <div className="flex items-center justify-between text-sm text-gray-400 mb-2">
                  <span>Round Progress</span>
                  <span>{match.currentRound}/{match.totalRounds}</span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-2">
                  <div 
                    className="bg-valorant-red h-2 rounded-full transition-all duration-300"
                    style={{ width: `${(match.currentRound / match.totalRounds) * 100}%` }}
                  ></div>
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2 text-sm text-gray-400">
                <Users className="h-4 w-4" />
                <span>{match.team1.players.length + match.team2.players.length} Players</span>
              </div>
              <Link
                to={`/match/${match.id}`}
                className="valorant-button-secondary text-sm flex items-center"
              >
                View Details
                <ArrowRight className="ml-1 h-4 w-4" />
              </Link>
            </div>
          </motion.div>
        ))}
      </div>

      {/* No Results */}
      {filteredMatches.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-12 valorant-card"
        >
          <div className="text-6xl mb-4">🎮</div>
          <h3 className="text-xl font-bold text-white mb-2">No matches found</h3>
          <p className="text-gray-400 mb-4">
            Try adjusting your search criteria or filters
          </p>
          <button
            onClick={() => {
              setSearchTerm('');
              setStatusFilter('all');
              setTournamentFilter('all');
            }}
            className="valorant-button"
          >
            Clear Filters
          </button>
        </motion.div>
      )}
    </div>
  );
};

export default Matches; 