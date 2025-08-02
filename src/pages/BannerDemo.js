import React from 'react';
import HexagonalBanner from '../components/HexagonalBanner';

const BannerDemo = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-100 via-blue-900 to-gray-100">
      {/* Top gray section */}
      <div className="h-20 bg-gray-200"></div>
      
      {/* Main dark blue section */}
      <div className="relative bg-blue-900 py-20 px-4">
        {/* Background overlay pattern (optional) */}
        <div className="absolute inset-0 opacity-10 bg-gradient-to-br from-gray-400 to-transparent"></div>
        
        {/* Centered banner */}
        <div className="relative z-10 flex justify-center items-center">
          <HexagonalBanner 
            text="LOGIN"
            onClick={() => alert('Login clicked!')}
            className="transform hover:scale-110"
          />
        </div>
        
        {/* Separator line */}
        <div className="relative z-10 mt-8 border-t border-gray-300 max-w-4xl mx-auto"></div>
      </div>
      
      {/* Bottom gray section */}
      <div className="h-20 bg-gray-200"></div>
      
      {/* Additional examples */}
      <div className="bg-white py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-800">
            Hexagonal Banner Examples
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="flex justify-center">
              <HexagonalBanner 
                text="SIGN UP"
                backgroundColor="bg-blue-500"
                textColor="text-white"
                borderColor="border-blue-600"
              />
            </div>
            
            <div className="flex justify-center">
              <HexagonalBanner 
                text="PLAY NOW"
                backgroundColor="bg-green-500"
                textColor="text-white"
                borderColor="border-green-600"
              />
            </div>
            
            <div className="flex justify-center">
              <HexagonalBanner 
                text="SETTINGS"
                backgroundColor="bg-purple-500"
                textColor="text-white"
                borderColor="border-purple-600"
              />
            </div>
            
            <div className="flex justify-center">
              <HexagonalBanner 
                text="PROFILE"
                backgroundColor="bg-orange-500"
                textColor="text-white"
                borderColor="border-orange-600"
              />
            </div>
            
            <div className="flex justify-center">
              <HexagonalBanner 
                text="HELP"
                backgroundColor="bg-red-500"
                textColor="text-white"
                borderColor="border-red-600"
              />
            </div>
            
            <div className="flex justify-center">
              <HexagonalBanner 
                text="EXIT"
                backgroundColor="bg-gray-800"
                textColor="text-white"
                borderColor="border-gray-900"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BannerDemo; 