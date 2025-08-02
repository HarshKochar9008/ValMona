@echo off
echo ========================================
echo Valorant Betting Frontend - GitHub Upload
echo ========================================
echo.

echo Step 1: Initializing Git repository...
git init

echo.
echo Step 2: Adding all files to Git...
git add .

echo.
echo Step 3: Making initial commit...
git commit -m "Initial commit: Valorant betting frontend"

echo.
echo ========================================
echo IMPORTANT: Next Steps Required
echo ========================================
echo.
echo 1. Create a new repository on GitHub:
echo    - Go to https://github.com
echo    - Click "+" and select "New repository"
echo    - Name it (e.g., valorant-betting-frontend)
echo    - DO NOT initialize with README, .gitignore, or license
echo    - Click "Create repository"
echo.
echo 2. Copy the repository URL from GitHub
echo.
echo 3. Run these commands (replace with your actual URL):
echo    git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
echo    git branch -M main
echo    git push -u origin main
echo.
echo 4. Optional: Enable GitHub Pages in repository settings
echo.
echo ========================================
echo Setup complete! Follow the steps above.
echo ========================================
pause 