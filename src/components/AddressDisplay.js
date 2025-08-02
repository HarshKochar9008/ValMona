import React from 'react';
import { useWallet } from '../context/WalletContext';

const AddressDisplay = ({ address, showFull = false, className = '' }) => {
  const { getAddressName } = useWallet();
  
  if (!address) return null;

  const addressName = getAddressName(address);
  const formattedAddress = showFull ? address : `${address.slice(0, 6)}...${address.slice(-4)}`;

  return (
    <div className={`flex items-center space-x-2 ${className}`}>
      {addressName && (
        <span className="text-sm font-medium text-blue-400 bg-blue-900/20 px-2 py-1 rounded">
          {addressName}
        </span>
      )}
      <span className="font-mono text-sm text-gray-300">
        {formattedAddress}
      </span>
    </div>
  );
};

export default AddressDisplay; 