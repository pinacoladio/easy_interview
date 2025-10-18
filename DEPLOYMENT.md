# GitHub Pages Deployment Guide

## Quick Deployment Steps

Since Git is not installed on your local system, here's how to deploy the MockInterview Pro website to GitHub Pages:

### Method 1: Using GitHub Web Interface (Recommended)

1. **Create a new repository on GitHub:**
   - Go to [GitHub.com](https://github.com) and sign in
   - Click the "+" icon in the top right corner
   - Select "New repository"
   - Name it `mockinterview-pro` (or any name you prefer)
   - Make sure it's set to "Public"
   - Check "Add a README file"
   - Click "Create repository"

2. **Upload your files:**
   - In your new repository, click "uploading an existing file"
   - Drag and drop all these files from your `easy_interview` folder:
     - `index.html`
     - `pricing.html`
     - `about.html`
     - `reviews.html`
     - `styles.css`
     - `script.js`
     - `README.md`
     - `.gitignore`
   - Write a commit message like "Initial website upload"
   - Click "Commit changes"

3. **Enable GitHub Pages:**
   - Go to your repository's "Settings" tab
   - Scroll down to "Pages" in the left sidebar
   - Under "Source", select "Deploy from a branch"
   - Choose "main" branch and "/ (root)" folder
   - Click "Save"

4. **Access your website:**
   - GitHub will provide you with a URL like: `https://yourusername.github.io/mockinterview-pro`
   - It may take a few minutes to deploy

### Method 2: Using GitHub Desktop (Alternative)

1. **Install GitHub Desktop:**
   - Download from [desktop.github.com](https://desktop.github.com)
   - Install and sign in with your GitHub account

2. **Create repository:**
   - Click "Create a New Repository on your hard drive"
   - Name: `mockinterview-pro`
   - Local path: Choose your `easy_interview` folder
   - Click "Create repository"

3. **Publish to GitHub:**
   - Click "Publish repository"
   - Make sure "Keep this code private" is unchecked
   - Click "Publish repository"

4. **Enable GitHub Pages:**
   - Follow step 3 from Method 1 above

### Method 3: Install Git and Use Command Line

If you want to install Git:

1. **Install Git:**
   - Download from [git-scm.com](https://git-scm.com/download/win)
   - Install with default settings

2. **Open Command Prompt in your project folder and run:**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/yourusername/mockinterview-pro.git
   git push -u origin main
   ```

3. **Enable GitHub Pages as described in Method 1, step 3**

## Custom Domain (Optional)

If you want to use a custom domain:

1. Create a file named `CNAME` in your repository
2. Add your domain name (e.g., `mockinterview.com`)
3. Configure your domain's DNS to point to GitHub Pages

## Automatic Updates

Once set up, any changes you make to the files and push to the main branch will automatically update your live website.

## Troubleshooting

- **404 Error**: Make sure your main page is named `index.html`
- **CSS/JS not loading**: Check that file paths are relative (no leading slash)
- **Changes not showing**: GitHub Pages can take up to 10 minutes to update
- **Build failed**: Check the Actions tab in your repository for error details

## Your Website Files

All the following files are ready for deployment:

- ✅ `index.html` - Main landing page
- ✅ `pricing.html` - Pricing page
- ✅ `about.html` - About page  
- ✅ `reviews.html` - Reviews page
- ✅ `styles.css` - All styling
- ✅ `script.js` - Interactive functionality
- ✅ `README.md` - Documentation
- ✅ `.gitignore` - Git ignore file

The website is fully functional and ready to go live!