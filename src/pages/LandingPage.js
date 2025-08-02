import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Play, ArrowRight, Eye, Shield, Sword, Users } from 'lucide-react';
import MonadWalletConnect from '../components/MonadWalletConnect';
import SavedAddresses from '../components/SavedAddresses';

const LandingPage = () => {
  const [showWalletConnect, setShowWalletConnect] = useState(false);
  const [showSavedAddresses, setShowSavedAddresses] = useState(false);
  const [currentCharacterIndex, setCurrentCharacterIndex] = useState(0);
  const navigate = useNavigate();

  const characters = [
    {
      name: 'JETT',
      image: 'https://i.ibb.co/FNVMc0r/jett.png'
    },
    {
      name: 'OMEN',
      image: 'https://i.ibb.co/39p2JCT8/omen.png'
    },
    {
      name: 'RAZE',
      image: 'https://i.ibb.co/XxXcV0yQ/raze.png'
    }
  ];

  // Rotate characters every 3 seconds
  React.useEffect(() => {
    const interval = setInterval(() => {
      setCurrentCharacterIndex((prevIndex) => 
        prevIndex === characters.length - 1 ? 0 : prevIndex + 1
      );
    }, 3000);

    return () => clearInterval(interval);
  }, [characters.length]);

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
            <div className="flex items-center justify-center space-x-6">
              <button 
                onClick={() => setShowWalletConnect(true)}
                className="inline-block text-white hover:text-teal-400 transition-colors duration-300 font-medium tracking-wider"
              >
                LOGIN
              </button>
              <button 
                onClick={() => setShowSavedAddresses(true)}
                className="inline-block text-white hover:text-teal-400 transition-colors duration-300 font-medium tracking-wider flex items-center space-x-2"
              >
                <Users className="w-4 h-4" />
                <span>SAVED ADDRESSES</span>
              </button>
            </div>
          </div>

          {/* Main Title */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-8"
          >
            <h1 className="text-8xl md:text-9xl font-bold text-white opacity-30 tracking-wider mb-4">
              VALOMONA
            </h1>
            <div className="flex items-center justify-center space-x-4 text-2xl md:text-3xl font-bold text-white">
              <span>STATS</span>
              <div className="w-2 h-2 bg-red-500 rounded-full"></div>
              <span>PREDICT</span>
              <div className="w-2 h-2 bg-red-500 rounded-full"></div>
              <span>EARN</span>
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
              <div className="relative bottom-10 bg-gray-800 rounded-lg overflow-hidden shadow-2xl">
                {/* YouTube Video Embed */}
                <div className="relative h-80">
                  <iframe
                    className="w-full h-full"
                    src="https://www.youtube.com/embed/nKnIb04qUWY?autoplay=1&mute=1&controls=1&rel=0&modestbranding=1"
                    title="Valorant Live Stream"
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  ></iframe>
                  
                  {/* Overlay with game stats */}
                  <div className="absolute top-4 left-4 flex items-center space-x-4 text-white bg-black bg-opacity-50 px-3 py-2 rounded">
                    <span className="text-lg font-bold">LIVE</span>
                    <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                    <Eye className="w-5 h-5" />
                    <span className="text-sm">2.5K</span>
                  </div>
                  
                  {/* Xtrfy Brand */}

                </div>
              </div>
            </motion.div>

                         {/* Right Side - Rotating Character Display */}
             <motion.div
               initial={{ opacity: 0, x: 50 }}
               animate={{ opacity: 1, x: 0 }}
               transition={{ duration: 0.8, delay: 0.6 }}
               className="relative h-64 flex items-center justify-center"
             >
               <motion.div
                 key={characters[currentCharacterIndex].name}
                 initial={{ opacity: 0, scale: 0.8 }}
                 animate={{ opacity: 1, scale: 1 }}
                 exit={{ opacity: 0, scale: 0.8 }}
                 transition={{ duration: 0.5 }}
                 className="relative"
               >
                 <img 
                   src={characters[currentCharacterIndex].image} 
                   alt={characters[currentCharacterIndex].name}
                   className="w-90 h-120 object-cover"
                 />
                 <div className="absolute bottom-2 left-2  px-3 py-1 rounded">
                   <h3 className="text-lg font-bold text-white">
                     {characters[currentCharacterIndex].name}
                   </h3>
                 </div>
               </motion.div>
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

      {/* Saved Addresses Modal */}
      <SavedAddresses
        isOpen={showSavedAddresses}
        onClose={() => setShowSavedAddresses(false)}
      />
    </div>
  );
};

export default LandingPage; 