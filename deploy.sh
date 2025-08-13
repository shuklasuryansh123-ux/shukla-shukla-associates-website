#!/bin/bash

# Deploy script for Shukla & Shukla Associates website to Vercel

# Check if vercel CLI is installed
if ! command -v vercel &> /dev/null
then
    echo "Vercel CLI could not be found. Please install it by running: npm install -g vercel"
    exit 1
fi

# Login to Vercel (if not already logged in)
echo "Logging in to Vercel..."
vercel login

# Deploy the project
echo "Deploying to Vercel..."
vercel --prod

echo "Deployment completed!"