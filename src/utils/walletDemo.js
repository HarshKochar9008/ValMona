// Demo utility for testing wallet connection functionality

export const testWalletConnection = () => {
  console.log('🧪 Testing Wallet Connection Features...');
  
  // Test localStorage functionality
  const testAddress = '0x1234567890abcdef1234567890abcdef12345678';
  const testName = 'Test Gaming Wallet';
  
  try {
    // Test saving address name
    const savedAddresses = JSON.parse(localStorage.getItem('addressNames') || '{}');
    savedAddresses[testAddress] = testName;
    localStorage.setItem('addressNames', JSON.stringify(savedAddresses));
    console.log('✅ Address name saved successfully');
    
    // Test retrieving address name
    const retrievedName = savedAddresses[testAddress];
    console.log('✅ Address name retrieved:', retrievedName);
    
    // Test wallet detection
    const wallets = {
      metamask: typeof window.ethereum !== 'undefined',
      phantom: typeof window.solana !== 'undefined' && window.solana?.isPhantom
    };
    console.log('🔍 Available wallets:', wallets);
    
    return {
      success: true,
      addressName: retrievedName,
      availableWallets: wallets
    };
  } catch (error) {
    console.error('❌ Test failed:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

export const clearTestData = () => {
  try {
    localStorage.removeItem('addressNames');
    console.log('🧹 Test data cleared');
  } catch (error) {
    console.error('❌ Failed to clear test data:', error);
  }
};

// Add to window for easy testing in browser console
if (typeof window !== 'undefined') {
  window.testWalletConnection = testWalletConnection;
  window.clearTestData = clearTestData;
} 