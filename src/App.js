import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { motion } from 'framer-motion';
import Navbar from './components/Navbar';
import LandingPage from './pages/LandingPage';
import Home from './pages/Home';
import Matches from './pages/Matches';
import MatchDetail from './pages/MatchDetail';
import Betting from './pages/Betting';
import Profile from './pages/Profile';
import { WalletProvider } from './context/WalletContext';
import { BettingProvider } from './context/BettingContext';

function App() {
  return (
    <WalletProvider>
      <BettingProvider>
        <Router>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/home" element={
              <div className="min-h-screen bg-gradient-to-br from-valorant-blue via-gray-900 to-valorant-dark">
                <Navbar />
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5 }}
                  className="container mx-auto px-4 py-8"
                >
                  <Home />
                </motion.div>
              </div>
            } />
            <Route path="/matches" element={
              <div className="min-h-screen bg-gradient-to-br from-valorant-blue via-gray-900 to-valorant-dark">
                <Navbar />
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5 }}
                  className="container mx-auto px-4 py-8"
                >
                  <Matches />
                </motion.div>
              </div>
            } />
            <Route path="/match/:id" element={
              <div className="min-h-screen bg-gradient-to-br from-valorant-blue via-gray-900 to-valorant-dark">
                <Navbar />
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5 }}
                  className="container mx-auto px-4 py-8"
                >
                  <MatchDetail />
                </motion.div>
              </div>
            } />
            <Route path="/betting" element={
              <div className="min-h-screen bg-gradient-to-br from-valorant-blue via-gray-900 to-valorant-dark">
                <Navbar />
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5 }}
                  className="container mx-auto px-4 py-8"
                >
                  <Betting />
                </motion.div>
              </div>
            } />
            <Route path="/profile" element={
              <div className="min-h-screen bg-gradient-to-br from-valorant-blue via-gray-900 to-valorant-dark">
                <Navbar />
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5 }}
                  className="container mx-auto px-4 py-8"
                >
                  <Profile />
                </motion.div>
              </div>
            } />
          </Routes>
        </Router>
      </BettingProvider>
    </WalletProvider>
  );
}

export default App; 