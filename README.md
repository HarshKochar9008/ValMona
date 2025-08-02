# Valorant Betting Frontend

A modern React-based frontend for a Valorant betting platform built with blockchain technology.

## Features

- 🎮 Real-time Valorant match data integration
- 💰 Cryptocurrency betting with smart contracts
- 🔗 Wallet integration (MetaMask & Phantom support)
- 📝 Wallet address nickname management
- 📱 Responsive design with Tailwind CSS
- ⚡ Modern React with hooks and context
- 🎨 Beautiful UI with Framer Motion animations

## Tech Stack

- **React 18** - Modern React with hooks
- **React Router** - Client-side routing
- **Ethers.js** - Ethereum wallet integration
- **Tailwind CSS** - Utility-first CSS framework
- **Framer Motion** - Animation library
- **Axios** - HTTP client for API calls
- **Headless UI** - Accessible UI components

## Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- MetaMask browser extension
- Access to Valorant API

## Installation

1. Clone the repository:
```bash
git clone <your-repo-url>
cd valorant-betting-frontend
```

2. Install dependencies:
```bash
npm install
```

3. Create environment variables:
```bash
cp .env.example .env.local
```

4. Configure your environment variables in `.env.local`:
```
REACT_APP_VALORANT_API_KEY=your_api_key_here
REACT_APP_CONTRACT_ADDRESS=your_contract_address_here
REACT_APP_NETWORK_ID=1337
```

## Development

Start the development server:
```bash
npm start
```

The app will be available at `http://localhost:3000`

## Building for Production

Build the production version:
```bash
npm run build
```

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── Navbar.js       # Navigation component
│   ├── NetworkSwitcher.js # Network switching
│   ├── WalletConnect.js   # Wallet connection
│   ├── MonadWalletConnect.js # Enhanced wallet connection with nickname support
│   ├── SavedAddresses.js # Address nickname management
│   └── AddressDisplay.js # Display addresses with nicknames
├── context/            # React context providers
│   ├── BettingContext.js  # Betting state management
│   └── WalletContext.js   # Wallet state management
├── pages/              # Page components
│   ├── Home.js         # Home page
│   ├── Matches.js      # Matches listing
│   ├── MatchDetail.js  # Individual match details
│   ├── Betting.js      # Betting interface
│   ├── Profile.js      # User profile
│   └── LandingPage.js  # Landing page with wallet connection
├── services/           # API services
│   └── valorantApi.js  # Valorant API integration
└── App.js              # Main app component
```

## Wallet Address Management

The application includes a comprehensive wallet address management system:

### Features
- **Automatic Nickname Saving**: When you connect a wallet, you can assign a nickname to the address
- **Persistent Storage**: Address nicknames are saved locally in your browser
- **Easy Management**: View, edit, and delete saved addresses through the UI
- **Cross-Session Persistence**: Your saved addresses remain available across browser sessions

### How to Use
1. **Connect Wallet**: Click "LOGIN" or "Connect Wallet" to connect your MetaMask or Phantom wallet
2. **Add Nickname**: After connecting, enter a nickname for your address (e.g., "My Gaming Wallet")
3. **Manage Addresses**: Access saved addresses through:
   - Landing page: "SAVED ADDRESSES" button
   - Navbar: User menu → "Saved Addresses"
4. **Edit/Delete**: Use the management interface to edit nicknames or remove addresses

### Privacy & Security
- Address nicknames are stored locally in your browser's localStorage
- No personal data is sent to external servers
- You have full control over your saved addresses

## Available Scripts

- `npm start` - Start development server
- `npm run build` - Build for production
- `npm test` - Run tests
- `npm run eject` - Eject from Create React App
- `npm run setup` - Setup wallet configuration

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For support and questions, please open an issue in the repository. 