# Deployment Guide - Frontend Only

This guide will help you upload only the frontend to a new GitHub repository.

## Step 1: Create a New GitHub Repository

1. Go to [GitHub](https://github.com) and sign in
2. Click the "+" icon in the top right corner
3. Select "New repository"
4. Name your repository (e.g., `valorant-betting-frontend`)
5. Make it public or private (your choice)
6. **DO NOT** initialize with README, .gitignore, or license (we'll add these manually)
7. Click "Create repository"

## Step 2: Prepare the Frontend Directory

1. Open your terminal/command prompt
2. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

3. Initialize git repository:
   ```bash
   git init
   ```

4. Add all files to git:
   ```bash
   git add .
   ```

5. Make your first commit:
   ```bash
   git commit -m "Initial commit: Valorant betting frontend"
   ```

## Step 3: Connect to GitHub Repository

1. Add the remote origin (replace `YOUR_USERNAME` and `YOUR_REPO_NAME`):
   ```bash
   git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
   ```

2. Push to GitHub:
   ```bash
   git branch -M main
   git push -u origin main
   ```

## Step 4: Enable GitHub Pages (Optional)

If you want to deploy your frontend to GitHub Pages:

1. Go to your repository on GitHub
2. Click on "Settings" tab
3. Scroll down to "Pages" section
4. Under "Source", select "GitHub Actions"
5. The workflow we created will automatically deploy your site

## Step 5: Environment Setup

1. Create a `.env.local` file in the frontend directory:
   ```bash
   cp .env.example .env.local
   ```

2. Edit `.env.local` with your configuration:
   ```env
   REACT_APP_VALORANT_API_KEY=your_api_key_here
   REACT_APP_CONTRACT_ADDRESS=your_contract_address_here
   REACT_APP_NETWORK_ID=1337
   ```

## Step 6: Test Locally

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start development server:
   ```bash
   npm start
   ```

3. Open `http://localhost:3000` in your browser

## Step 7: Build and Deploy

1. Build for production:
   ```bash
   npm run build
   ```

2. The build folder will be created with optimized files

3. If using GitHub Pages, the workflow will automatically deploy when you push to main

## Alternative Deployment Options

### Vercel
1. Go to [Vercel](https://vercel.com)
2. Connect your GitHub repository
3. Vercel will automatically detect it's a React app
4. Deploy with one click

### Netlify
1. Go to [Netlify](https://netlify.com)
2. Drag and drop the `build` folder
3. Or connect your GitHub repository for automatic deployments

### Firebase Hosting
1. Install Firebase CLI: `npm install -g firebase-tools`
2. Login: `firebase login`
3. Initialize: `firebase init hosting`
4. Deploy: `firebase deploy`

## Troubleshooting

### Common Issues

1. **Build fails**: Check for missing dependencies in package.json
2. **Environment variables not working**: Ensure they start with `REACT_APP_`
3. **GitHub Pages 404**: Make sure the repository is public or you have GitHub Pro
4. **CORS issues**: Configure your API to allow requests from your domain

### Getting Help

- Check the main README.md for detailed setup instructions
- Open an issue in the repository for bugs
- Review the console for error messages

## Next Steps

After deployment:

1. Update the README.md with your actual repository URL
2. Configure your domain (if you have one)
3. Set up monitoring and analytics
4. Configure CI/CD for automatic testing

Your frontend is now successfully uploaded to GitHub! 🎉 