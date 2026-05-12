#!/bin/bash
# deploy.sh - Script used by GitHub actions for zero-downtime deployment

set -e

cd "$(dirname "$0")/.."

echo "Starting deployment process..."

# Pull latest changes (assuming this is handled by git or CI before running script, but safe to include)
# git pull origin main

# Install dependencies
npm ci

# Build project
npm run build

# Reload PM2 with zero downtime
echo "Reloading PM2 instances..."
pm2 reload ecosystem/ecosystem.config.js --update-env

pm2 save

echo "Deployment completed successfully!"
