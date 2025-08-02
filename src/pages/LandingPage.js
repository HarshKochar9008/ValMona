import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { Play, ArrowRight, Eye, Shield, Sword } from 'lucide-react';
import MonadWalletConnect from '../components/MonadWalletConnect';

const LandingPage = () => {
  const [showWalletConnect, setShowWalletConnect] = useState(false);
  const navigate = useNavigate();

  const characters = [
    {
      name: 'JETT',
      description: 'Lorem Ipsum Dolor Sit Amet, Consectetur Adipiscing Elit, Sed Ex Ea Commodo Consequat.',
      color: 'from-blue-400 to-blue-600',
      abilities: ['dash', 'updraft', 'tailwind']
    },
    {
      name: 'SOVA',
      description: 'Lorem Ipsum Dolor Sit Amet, Consectetur Adipiscing Elit, Sed Ex Ea Commodo Consequat.',
      color: 'from-green-400 to-green-600',
      abilities: ['shock', 'recon', 'hunter']
    },
    {
      name: 'SAGE',
      description: 'Lorem Ipsum Dolor Sit Amet, Consectetur Adipiscing Elit, Sed Ex Ea Commodo Consequat.',
      color: 'from-purple-400 to-purple-600',
      abilities: ['heal', 'barrier', 'resurrection']
    }
  ];

  return (
    <div className="min-h-screen landing-gradient relative overflow-hidden">
      {/* Geometric Background Patterns */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-20 left-10 w-32 h-32 border border-teal-400 transform rotate-45"></div>
        <div className="absolute top-40 right-20 w-16 h-16 bg-teal-400 transform rotate-12"></div>
        <div className="absolute bottom-40 left-20 w-24 h-24 border border-teal-400 transform -rotate-45"></div>
        <div className="absolute bottom-20 right-10 w-20 h-20 bg-teal-400 transform rotate-90"></div>
      </div>

      {/* Header Section */}
      <header className="relative z-10 pt-8 pb-16">
        <div className="container mx-auto px-6">
          {/* Login Button */}
          <div className="text-center mb-8">
            <button 
              onClick={() => setShowWalletConnect(true)}
              className="inline-block text-white hover:text-teal-400 transition-colors duration-300 font-medium tracking-wider"
            >
              LOGIN
            </button>
          </div>

          {/* Main Title */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-8"
          >
            <h1 className="text-8xl md:text-9xl font-bold text-white opacity-30 tracking-wider mb-4">
              VALORANT
            </h1>
            <div className="flex items-center justify-center space-x-4 text-2xl md:text-3xl font-bold text-white">
              <span>STATS</span>
              <div className="w-2 h-2 bg-red-500 rounded-full"></div>
              <span>INFO</span>
              <div className="w-2 h-2 bg-red-500 rounded-full"></div>
              <span>INSIGHTS</span>
            </div>
          </motion.div>

          {/* Explore Button */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-center"
          >
            <button 
              onClick={() => setShowWalletConnect(true)}
              className="inline-block bg-teal-500 hover:bg-teal-600 text-white font-bold py-4 px-12 rounded-none transition-all duration-300 transform hover:scale-105"
            >
              EXPLORE
            </button>
          </motion.div>
        </div>
      </header>

      {/* Main Content Section */}
      <main className="relative z-10 pb-16">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
            {/* Left Side - Video Player */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="relative"
            >
              <div className="relative bg-gray-800 rounded-lg overflow-hidden shadow-2xl">
                {/* Video Thumbnail */}
                                 <div className="relative h-80 bg-gradient-to-br from-gray-700 to-gray-900">
                   <div className="absolute inset-0 video-overlay"></div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-20 h-20 bg-white bg-opacity-20 rounded-full flex items-center justify-center backdrop-blur-sm">
                      <Play className="w-8 h-8 text-white ml-1" />
                    </div>
                  </div>
                  
                  {/* Game UI Elements */}
                  <div className="absolute bottom-4 left-4 flex items-center space-x-4 text-white">
                    <span className="text-2xl font-bold">100</span>
                    <Eye className="w-6 h-6" />
                    <Shield className="w-6 h-6" />
                    <Sword className="w-6 h-6" />
                    <span className="text-lg font-semibold">5+</span>
                  </div>
                  
                  {/* Xtrfy Brand */}
                  <div className="absolute bottom-4 right-4">
                    <div className="bg-blue-600 px-3 py-1 rounded text-white text-sm font-medium">
                      Use Code TARBY
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Right Side - Character Cards */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="space-y-6"
            >
              {characters.map((character, index) => (
                <motion.div
                  key={character.name}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.8 + index * 0.2 }}
                  className="relative"
                >
                  {/* Character Card */}
                  <div className="bg-gray-800 border border-gray-700 rounded-lg p-6 relative overflow-hidden">
                                         {/* Character Image */}
                     <div className="absolute -top-20 -right-4 w-32 h-40">
                       <div className={`w-full h-full bg-gradient-to-b ${character.color} rounded-lg transform rotate-12 shadow-lg character-glow`}></div>
                     </div>
                    
                    {/* Card Content */}
                    <div className="relative z-10">
                      <h3 className="text-2xl font-bold text-white mb-3">{character.name}</h3>
                      <p className="text-gray-300 text-sm mb-4 leading-relaxed">
                        {character.description}
                      </p>
                      
                      {/* Ability Icons */}
                      <div className="flex space-x-3 mb-4">
                        {character.abilities.map((ability, idx) => (
                          <div key={idx} className="w-8 h-8 bg-gray-700 rounded-full flex items-center justify-center">
                            <div className="w-3 h-3 bg-teal-400 rounded-full"></div>
                          </div>
                        ))}
                      </div>
                      
                      {/* Full View Button */}
                      <button className="flex items-center text-white hover:text-teal-400 transition-colors duration-300">
                        <span className="font-medium">FULL VIEW</span>
                        <ArrowRight className="ml-2 w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      </main>

      {/* Diagonal Red Section */}
      <div className="absolute bottom-0 left-0 w-full h-64 bg-red-600 transform skew-y-6 origin-bottom-left opacity-80"></div>

      {/* Monad Wallet Connect Modal */}
      <MonadWalletConnect
        isOpen={showWalletConnect}
        onClose={() => setShowWalletConnect(false)}
        onSuccess={({ account, addressName }) => {
          console.log('Wallet connected successfully:', { account, addressName });
          // Navigate to home page after successful connection
          navigate('/home');
        }}
      />
    </div>
  );
};

export default LandingPage; 