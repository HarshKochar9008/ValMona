import axios from 'axios';

// Mock data for Valorant matches since we don't have real API access
// In a real implementation, you would use the official Valorant API or a third-party service

const MOCK_MATCHES = [
  {
    id: '1',
    team1: {
      name: 'Sentinels',
      logo: 'https://via.placeholder.com/60x60/FF4655/FFFFFF?text=SEN',
      score: 13,
      players: [
        { name: 'TenZ', agent: 'Jett', kills: 25, deaths: 12, assists: 8 },
        { name: 'ShahZaM', agent: 'Sova', kills: 18, deaths: 15, assists: 12 },
        { name: 'dapr', agent: 'Cypher', kills: 16, deaths: 14, assists: 10 },
        { name: 'SicK', agent: 'Raze', kills: 22, deaths: 13, assists: 9 },
        { name: 'zombs', agent: 'Omen', kills: 14, deaths: 16, assists: 15 }
      ]
    },
    team2: {
      name: '100 Thieves',
      logo: 'https://via.placeholder.com/60x60/7C3AED/FFFFFF?text=100T',
      score: 11,
      players: [
        { name: 'Asuna', agent: 'Reyna', kills: 28, deaths: 11, assists: 6 },
        { name: 'Hiko', agent: 'Sova', kills: 19, deaths: 14, assists: 11 },
        { name: 'nitr0', agent: 'Cypher', kills: 15, deaths: 15, assists: 13 },
        { name: 'steel', agent: 'Killjoy', kills: 17, deaths: 16, assists: 12 },
        { name: 'Ethan', agent: 'Omen', kills: 13, deaths: 17, assists: 16 }
      ]
    },
    map: 'Bind',
    status: 'live',
    startTime: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
    tournament: 'VCT Masters',
    round: 'Quarter Finals',
    currentRound: 24,
    totalRounds: 30
  },
  {
    id: '2',
    team1: {
      name: 'Fnatic',
      logo: 'https://via.placeholder.com/60x60/10B981/FFFFFF?text=FNC',
      score: 0,
      players: [
        { name: 'Derke', agent: 'Jett', kills: 0, deaths: 0, assists: 0 },
        { name: 'Boaster', agent: 'Sova', kills: 0, deaths: 0, assists: 0 },
        { name: 'Mistic', agent: 'Cypher', kills: 0, deaths: 0, assists: 0 },
        { name: 'Doma', agent: 'Raze', kills: 0, deaths: 0, assists: 0 },
        { name: 'Alfajer', agent: 'Omen', kills: 0, deaths: 0, assists: 0 }
      ]
    },
    team2: {
      name: 'Team Liquid',
      logo: 'https://via.placeholder.com/60x60/F59E0B/FFFFFF?text=TL',
      score: 0,
      players: [
        { name: 'ScreaM', agent: 'Reyna', kills: 0, deaths: 0, assists: 0 },
        { name: 'Jamppi', agent: 'Sova', kills: 0, deaths: 0, assists: 0 },
        { name: 'Soulcas', agent: 'Cypher', kills: 0, deaths: 0, assists: 0 },
        { name: 'L1NK', agent: 'Killjoy', kills: 0, deaths: 0, assists: 0 },
        { name: 'Kryptix', agent: 'Omen', kills: 0, deaths: 0, assists: 0 }
      ]
    },
    map: 'Haven',
    status: 'upcoming',
    startTime: new Date(Date.now() + 3 * 60 * 60 * 1000), // 3 hours from now
    tournament: 'VCT Masters',
    round: 'Semi Finals',
    currentRound: 0,
    totalRounds: 30
  },
  {
    id: '3',
    team1: {
      name: 'Cloud9',
      logo: 'https://via.placeholder.com/60x60/3B82F6/FFFFFF?text=C9',
      score: 13,
      players: [
        { name: 'leaf', agent: 'Jett', kills: 23, deaths: 10, assists: 9 },
        { name: 'Xeppaa', agent: 'Sova', kills: 20, deaths: 12, assists: 11 },
        { name: 'vanity', agent: 'Cypher', kills: 17, deaths: 13, assists: 14 },
        { name: 'poiz', agent: 'Raze', kills: 21, deaths: 11, assists: 8 },
        { name: 'mitch', agent: 'Omen', kills: 15, deaths: 14, assists: 16 }
      ]
    },
    team2: {
      name: 'NRG Esports',
      logo: 'https://via.placeholder.com/60x60/EF4444/FFFFFF?text=NRG',
      score: 7,
      players: [
        { name: 's0m', agent: 'Reyna', kills: 18, deaths: 15, assists: 7 },
        { name: 'eeiu', agent: 'Sova', kills: 16, deaths: 16, assists: 10 },
        { name: 'FNS', agent: 'Cypher', kills: 14, deaths: 17, assists: 12 },
        { name: 'Victor', agent: 'Killjoy', kills: 19, deaths: 14, assists: 9 },
        { name: 'crashies', agent: 'Omen', kills: 12, deaths: 18, assists: 15 }
      ]
    },
    map: 'Split',
    status: 'completed',
    startTime: new Date(Date.now() - 6 * 60 * 60 * 1000), // 6 hours ago
    tournament: 'VCT Masters',
    round: 'Group Stage',
    currentRound: 20,
    totalRounds: 20
  }
];

const MOCK_STATS = {
  totalMatches: 156,
  totalBets: 2847,
  totalVolume: 125000,
  activeUsers: 892,
  topTeams: [
    { name: 'Sentinels', wins: 45, losses: 12, winRate: 78.9 },
    { name: '100 Thieves', wins: 42, losses: 15, winRate: 73.7 },
    { name: 'Fnatic', wins: 38, losses: 18, winRate: 67.9 },
    { name: 'Team Liquid', wins: 35, losses: 22, winRate: 61.4 },
    { name: 'Cloud9', wins: 32, losses: 25, winRate: 56.1 }
  ],
  topPlayers: [
    { name: 'TenZ', team: 'Sentinels', avgKills: 24.5, avgDeaths: 12.3, avgAssists: 8.7 },
    { name: 'Asuna', team: '100 Thieves', avgKills: 23.8, avgDeaths: 13.1, avgAssists: 7.9 },
    { name: 'Derke', team: 'Fnatic', avgKills: 22.1, avgDeaths: 14.2, avgAssists: 9.3 },
    { name: 'ScreaM', team: 'Team Liquid', avgKills: 21.9, avgDeaths: 13.8, avgAssists: 8.1 },
    { name: 'leaf', team: 'Cloud9', avgKills: 20.7, avgDeaths: 14.5, avgAssists: 9.8 }
  ]
};

class ValorantApiService {
  constructor() {
    this.baseURL = process.env.REACT_APP_VALORANT_API_URL || 'https://api.henrik.dev/valorant/v1';
  }

  // Get all matches
  async getMatches() {
    try {
      // In a real implementation, you would fetch from the actual API
      // const response = await axios.get(`${this.baseURL}/matches`);
      // return response.data;
      
      // For now, return mock data
      return MOCK_MATCHES;
    } catch (error) {
      console.error('Error fetching matches:', error);
      return MOCK_MATCHES; // Fallback to mock data
    }
  }

  // Get match by ID
  async getMatch(id) {
    try {
      // const response = await axios.get(`${this.baseURL}/matches/${id}`);
      // return response.data;
      
      const match = MOCK_MATCHES.find(m => m.id === id);
      if (!match) {
        throw new Error('Match not found');
      }
      return match;
    } catch (error) {
      console.error('Error fetching match:', error);
      throw error;
    }
  }

  // Get live matches
  async getLiveMatches() {
    try {
      // const response = await axios.get(`${this.baseURL}/matches/live`);
      // return response.data;
      
      return MOCK_MATCHES.filter(match => match.status === 'live');
    } catch (error) {
      console.error('Error fetching live matches:', error);
      return [];
    }
  }

  // Get upcoming matches
  async getUpcomingMatches() {
    try {
      // const response = await axios.get(`${this.baseURL}/matches/upcoming`);
      // return response.data;
      
      return MOCK_MATCHES.filter(match => match.status === 'upcoming');
    } catch (error) {
      console.error('Error fetching upcoming matches:', error);
      return [];
    }
  }

  // Get match statistics
  async getMatchStats(matchId) {
    try {
      // const response = await axios.get(`${this.baseURL}/matches/${matchId}/stats`);
      // return response.data;
      
      const match = MOCK_MATCHES.find(m => m.id === matchId);
      if (!match) {
        throw new Error('Match not found');
      }

      // Calculate additional stats
      const team1Stats = this.calculateTeamStats(match.team1.players);
      const team2Stats = this.calculateTeamStats(match.team2.players);

      return {
        match,
        team1Stats,
        team2Stats,
        headToHead: this.calculateHeadToHead(match.team1, match.team2)
      };
    } catch (error) {
      console.error('Error fetching match stats:', error);
      throw error;
    }
  }

  // Get platform statistics
  async getPlatformStats() {
    try {
      // const response = await axios.get(`${this.baseURL}/stats`);
      // return response.data;
      
      return MOCK_STATS;
    } catch (error) {
      console.error('Error fetching platform stats:', error);
      return MOCK_STATS;
    }
  }

  // Helper methods
  calculateTeamStats(players) {
    const totalKills = players.reduce((sum, player) => sum + player.kills, 0);
    const totalDeaths = players.reduce((sum, player) => sum + player.deaths, 0);
    const totalAssists = players.reduce((sum, player) => sum + player.assists, 0);
    
    return {
      totalKills,
      totalDeaths,
      totalAssists,
      kdRatio: totalDeaths > 0 ? (totalKills / totalDeaths).toFixed(2) : totalKills.toFixed(2),
      avgKills: (totalKills / players.length).toFixed(1),
      avgDeaths: (totalDeaths / players.length).toFixed(1),
      avgAssists: (totalAssists / players.length).toFixed(1)
    };
  }

  calculateHeadToHead(team1, team2) {
    // Mock head-to-head data
    return {
      totalMatches: 8,
      team1Wins: 5,
      team2Wins: 3,
      lastMatch: '2024-01-15',
      lastWinner: team1.name
    };
  }

  // Get player statistics
  async getPlayerStats(playerName) {
    try {
      // const response = await axios.get(`${this.baseURL}/players/${playerName}/stats`);
      // return response.data;
      
      // Mock player stats
      const allPlayers = MOCK_MATCHES.flatMap(match => [
        ...match.team1.players,
        ...match.team2.players
      ]);
      
      const player = allPlayers.find(p => p.name === playerName);
      if (!player) {
        throw new Error('Player not found');
      }

      return {
        name: player.name,
        agent: player.agent,
        kills: player.kills,
        deaths: player.deaths,
        assists: player.assists,
        kdRatio: player.deaths > 0 ? (player.kills / player.deaths).toFixed(2) : player.kills.toFixed(2),
        avgKills: (player.kills / 1).toFixed(1), // Assuming 1 match for simplicity
        avgDeaths: (player.deaths / 1).toFixed(1),
        avgAssists: (player.assists / 1).toFixed(1)
      };
    } catch (error) {
      console.error('Error fetching player stats:', error);
      throw error;
    }
  }
}

export default new ValorantApiService(); 