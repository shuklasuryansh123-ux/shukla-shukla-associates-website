# Railway Deployment Guide

Follow these detailed steps to deploy your website to Railway:

## Prerequisites

1. Create a free account at [Railway](https://railway.app/)
2. Install Git if you haven't already: https://git-scm.com/book/en/v2/Getting-Started-Installing-Git
3. Make sure your project files are in a Git repository

## Step-by-Step Deployment

### Step 1: Prepare Your Project

1. Open your terminal/command prompt
2. Navigate to your project directory:
   ```bash
   cd /path/to/your/project
   ```

3. Make sure all your files are committed to Git:
   ```bash
   git init  # Only if not already a Git repository
   git add .
   git commit -m "Prepare for Railway deployment"
   ```

### Step 2: Deploy Using Railway CLI

1. Install the Railway CLI:
   - On macOS/Linux: `curl -fsSL https://railway.app/install.sh | sh`
   - On Windows: Download from https://
railway.app/cli

2. Login to Railway:
   ```bash
   railway login
   ```
   This will open a browser window for you to authenticate.

3. Initialize a new Railway project:
   ```bash
   railway init
   ```
   - Give your project a name (e.g., "shukla-shukla-associates")
   - Select "Empty Project"

4. Deploy your application:
   ```bash
   railway up
   ```
   This will:
   - Build your application using Nixpacks
   - Deploy it to Railway
   - Provide you with a URL when deployment is complete

### Step 3: Access Your Deployed Application

1. Get your application URL:
   ```bash
   railway open
   ```
   Or find it in your Railway dashboard.

2. Your website will be accessible at the provided URL.

### Step 4: Configure Environment Variables (If Needed)

If you need to set any environment variables:

1. In your Railway project dashboard, go to "Variables"
2. Add any required environment variables
3. Or use the CLI:
   ```bash
   railway variables set VARIABLE_NAME=value
   ```

## Alternative: Deploy from GitHub

1. Push your code to a GitHub repository:
   ```bash
   git remote add origin https://github.com/yourusername/your-repo.git
   git branch -M main
   git push -u origin main
   ```

2. Go to your Railway dashboard
3. Click "New Project" → "Deploy from GitHub repo"
4. Select your repository
5. Railway will automatically detect it's a Node.js project and deploy it

## Accessing the Admin Panel

Once deployed, you can access the admin panel at:
`https://your-railway-app-url/admin`

Default credentials:
- Username: shukla.suryansh123@gmail.com
- Password: 12032003

Remember to change these credentials after first login for security.

## Updating Your Application

To deploy updates:

1. Make your changes to the code
2. Commit your changes:
   ```bash
   git add .
   git commit -m "Description of changes"
   ```
3. Deploy the updates:
   ```bash
   railway up
   ```

## Troubleshooting

If you encounter issues:

1. Check deployment logs:
   ```bash
   railway logs
   ```

2. Make sure your `package.json` has the correct start script:
   ```json
   "scripts": {
     "start": "node server.js"
   }
   ```

3. Verify your `railway.toml` file exists and is correctly formatted:
   ```toml
   [build]
   builder = "nixpacks"

   [deploy]
   startCommand = "node server.js"
   ```

Your application should now be successfully deployed to Railway with full functionality including:
- Responsive website with all pages
- Admin panel for content management
- Blog functionality
- Contact form with email notifications
- All static assets (images, CSS, JavaScript)