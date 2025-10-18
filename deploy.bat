@echo off
echo MockInterview Pro - GitHub Pages Deployment Script
echo ================================================

REM Check if git is installed
git --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ERROR: Git is not installed or not in PATH
    echo Please install Git from https://git-scm.com/download/win
    echo Or follow the manual deployment guide in DEPLOYMENT.md
    pause
    exit /b 1
)

echo Git is installed. Proceeding with deployment...

REM Initialize git repository if not already initialized
if not exist .git (
    echo Initializing Git repository...
    git init
    git branch -M main
)

REM Add all files
echo Adding files to Git...
git add .

REM Commit changes
echo Committing changes...
set /p commit_message="Enter commit message (or press Enter for default): "
if "%commit_message%"=="" set commit_message=Update website

git commit -m "%commit_message%"

REM Check if remote origin exists
git remote get-url origin >nul 2>&1
if %errorlevel% neq 0 (
    echo No remote repository configured.
    echo Please create a repository on GitHub first, then run:
    echo git remote add origin https://github.com/yourusername/your-repo-name.git
    echo git push -u origin main
    pause
    exit /b 1
)

REM Push to GitHub
echo Pushing to GitHub...
git push origin main

echo.
echo ================================================
echo Deployment complete!
echo Your website should be available at:
echo https://yourusername.github.io/your-repo-name
echo.
echo Don't forget to enable GitHub Pages in your repository settings!
echo ================================================
pause