#!/bin/bash
# start.sh - Start the application in production mode

set -e

cd "$(dirname "$0")/.."

echo "Starting Sentinel Security Backend via PM2..."

# Check if .env exists
if [ ! -f .env ]; then
    echo "Error: .env file not found. Please copy .env.example to .env and configure it."
    exit 1
fi

# Start via ecosystem config
pm2 start ecosystem/ecosystem.config.js
pm2 save

echo "Application started successfully!"
pm2 status
