# Deploying to Render

This guide will help you deploy the Shukla & Shukla Associates website to Render.

## Prerequisites

1. A GitHub account
2. A Render account (free tier available at https://render.com)

## Deployment Steps

### 1. Push Your Code to GitHub

First, you need to push your code to a GitHub repository:

```bash
# Initialize git repository (if not already done)
git init

# Add all files
git add .

# Commit changes
git commit -m "Initial commit for Render deployment"

# Create a new repository on GitHub and push
# Replace 'username' with your GitHub username and 'repository-name' with your repo name
git remote add origin https://github.com/username/repository-name.git
git branch -M main
git push -u origin main
```

### 2. Connect Render to Your GitHub Repository

1. Go to https://dashboard.render.com
2. Click "New" and select "Web Service"
3. Connect your GitHub account when prompted
4. Select the repository you just created
5. Configure the service:
   - Name: shukla-shukla-associates
   - Region: Choose the region closest to your users
   - Branch: main
   - Root Directory: Leave empty (or set to the directory containing your app if it's in a subdirectory)
   - Environment: Node
   - Build Command: `npm install`
   - Start Command: `node server.js`
   - Plan: Free (or choose a paid plan for production)

### 3. Configure Environment Variables

Render will automatically use the configuration from your `render.yaml` file, but you can also set environment variables in the Render dashboard:

1. In your Render dashboard, go to your web service
2. Click on "Environment" in the sidebar
3. Add any environment variables you need (though this app doesn't require any special ones)

### GitHub Integration for Content Persistence

To ensure that content changes persist across server restarts:

1. Create a GitHub personal access token:
   - Go to https://github.com/settings/tokens
   - Click "Generate new token"
   - Select "repo" scope
   - Click "Generate token"
   - Copy the generated token

2. In your Render dashboard, go to your web service
3. Click on "Environment" in the sidebar
4. Add the following environment variables:
   - GITHUB_TOKEN: Your GitHub personal access token (keep this secret)
   - GITHUB_REPO: The repository name in the format "username/repository"
   - GITHUB_BRANCH: The branch name (default: main)

### 4. Deploy

1. Click "Create Web Service"
2. Render will automatically start building and deploying your application
3. Wait for the deployment to complete (this usually takes a few minutes)
4. Once deployed, you'll see a URL where your application is accessible

## Configuration Details

The `render.yaml` file in your project already contains the necessary configuration:

```yaml
services:
  - type: web
    name: shukla-shukla-associates
    env: node
    plan: free
    buildCommand: npm install
    startCommand: node server.js
    envVars:
      - key: NODE_ENV
        value: production
      - key: PORT
        value: 8080
```

This configuration tells Render to:
- Create a web service named "shukla-shukla-associates"
- Use the Node.js environment
- Use the free plan
- Run `npm install` during the build phase
- Run `node server.js` to start the application
- Set the NODE_ENV to "production" and PORT to 8080

## Custom Domain (Optional)

If you want to use a custom domain:

1. In your Render dashboard, go to your web service
2. Click on "Settings" in the sidebar
3. Scroll down to "Custom Domains"
4. Click "Add Custom Domain"
5. Enter your domain name and follow the instructions to configure DNS

## Troubleshooting

If you encounter issues during deployment:

1. Check the build logs in the Render dashboard
2. Ensure all dependencies are listed in `package.json`
3. Make sure your `server.js` file is correctly configured to use the PORT environment variable
4. Verify that your application starts locally with `npm start`

## Updating Your Application

To update your deployed application:

1. Make changes to your code
2. Commit and push to GitHub
3. Render will automatically detect the changes and redeploy

You can also manually trigger a deployment from the Render dashboard by clicking "Manual Deploy" and selecting "Deploy latest commit".