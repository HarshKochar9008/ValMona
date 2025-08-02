import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  User, 
  Edit, 
  Trash2, 
  Copy, 
  CheckCircle, 
  X,
  Wallet,
  Users
} from 'lucide-react';
import { useWallet } from '../context/WalletContext';

const SavedAddresses = ({ isOpen, onClose }) => {
  const [savedAddresses, setSavedAddresses] = useState({});
  const [editingAddress, setEditingAddress] = useState(null);
  const [editName, setEditName] = useState('');
  const [copiedAddress, setCopiedAddress] = useState(null);
  const { getAddressName, saveAddressName, getAllAddressNames } = useWallet();

  useEffect(() => {
    if (isOpen) {
      loadSavedAddresses();
    }
  }, [isOpen]);

  const loadSavedAddresses = () => {
    const addresses = getAllAddressNames();
    setSavedAddresses(addresses);
  };

  const handleEdit = (address, currentName) => {
    setEditingAddress(address);
    setEditName(currentName);
  };

  const handleSaveEdit = () => {
    if (editName.trim()) {
      saveAddressName(editingAddress, editName.trim());
      setSavedAddresses(prev => ({
        ...prev,
        [editingAddress]: editName.trim()
      }));
      setEditingAddress(null);
      setEditName('');
    }
  };

  const handleDelete = (address) => {
    const updatedAddresses = { ...savedAddresses };
    delete updatedAddresses[address];
    localStorage.setItem('addressNames', JSON.stringify(updatedAddresses));
    setSavedAddresses(updatedAddresses);
  };

  const handleCopyAddress = async (address) => {
    try {
      await navigator.clipboard.writeText(address);
      setCopiedAddress(address);
      setTimeout(() => setCopiedAddress(null), 2000);
    } catch (error) {
      console.error('Failed to copy address:', error);
    }
  };

  const formatAddress = (address) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  const addressEntries = Object.entries(savedAddresses);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="bg-gray-900 rounded-xl border border-gray-700 max-w-2xl w-full max-h-[80vh] overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-700">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg">
                <Users className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-white">Saved Addresses</h2>
                <p className="text-sm text-gray-400">
                  Manage your wallet address nicknames
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
            >
              <X className="w-5 h-5 text-gray-400" />
            </button>
          </div>

          {/* Content */}
          <div className="p-6 overflow-y-auto max-h-[60vh]">
            {addressEntries.length === 0 ? (
              <div className="text-center py-12">
                <Wallet className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-300 mb-2">No Saved Addresses</h3>
                <p className="text-gray-500">
                  Connect your wallet to save addresses with nicknames
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {addressEntries.map(([address, name]) => (
                  <motion.div
                    key={address}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-gray-800 rounded-lg p-4 border border-gray-700"
                  >
                    {editingAddress === address ? (
                      <div className="space-y-3">
                        <div>
                          <label className="block text-sm font-medium text-gray-300 mb-2">
                            <User className="w-4 h-4 inline mr-2" />
                            Address Name
                          </label>
                          <input
                            type="text"
                            value={editName}
                            onChange={(e) => setEditName(e.target.value)}
                            placeholder="Enter a name for this address"
                            className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 transition-colors"
                            maxLength={50}
                          />
                        </div>
                        <div className="flex space-x-2">
                          <button
                            onClick={handleSaveEdit}
                            disabled={!editName.trim()}
                            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 text-white rounded-lg transition-colors flex items-center space-x-2"
                          >
                            <CheckCircle className="w-4 h-4" />
                            <span>Save</span>
                          </button>
                          <button
                            onClick={() => {
                              setEditingAddress(null);
                              setEditName('');
                            }}
                            className="px-4 py-2 bg-gray-600 hover:bg-gray-500 text-white rounded-lg transition-colors"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-2">
                            <User className="w-5 h-5 text-blue-400" />
                            <h3 className="font-medium text-white">{name}</h3>
                          </div>
                          <div className="flex items-center space-x-2">
                            <code className="text-sm text-gray-400 font-mono">
                              {formatAddress(address)}
                            </code>
                            <button
                              onClick={() => handleCopyAddress(address)}
                              className="p-1 hover:bg-gray-700 rounded transition-colors"
                              title="Copy address"
                            >
                              {copiedAddress === address ? (
                                <CheckCircle className="w-4 h-4 text-green-400" />
                              ) : (
                                <Copy className="w-4 h-4 text-gray-400" />
                              )}
                            </button>
                          </div>
                        </div>
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleEdit(address, name)}
                            className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
                            title="Edit name"
                          >
                            <Edit className="w-4 h-4 text-blue-400" />
                          </button>
                          <button
                            onClick={() => handleDelete(address)}
                            className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
                            title="Delete address"
                          >
                            <Trash2 className="w-4 h-4 text-red-400" />
                          </button>
                        </div>
                      </div>
                    )}
                  </motion.div>
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="p-6 border-t border-gray-700 bg-gray-800/50">
            <div className="flex items-center justify-between text-sm text-gray-500">
              <span>{addressEntries.length} saved address{addressEntries.length !== 1 ? 'es' : ''}</span>
              <span>Addresses are stored locally in your browser</span>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default SavedAddresses; 