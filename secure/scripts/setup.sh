#!/bin/bash
# setup.sh - App specific setup (Run as standard user 'ubuntu')

set -e

echo "Setting up Sentinel Security Application..."

# Navigate to secure folder
cd "$(dirname "$0")/.."

# Install NPM packages
echo "Installing Node modules..."
npm ci

# Build TypeScript
echo "Building TypeScript code..."
npm run build

# Create Logs directory
mkdir -p logs

# Link Nginx config
echo "Configuring Nginx..."
sudo ln -sf $(pwd)/nginx/secure-scanner.conf /etc/nginx/sites-available/secure-scanner.conf
sudo ln -sf /etc/nginx/sites-available/secure-scanner.conf /etc/nginx/sites-enabled/
sudo rm -f /etc/nginx/sites-enabled/default
sudo nginx -t
sudo systemctl restart nginx

# Setup PM2 Startup script
echo "Configuring PM2 to start on boot..."
pm2 startup systemd -u ubuntu --hp /home/ubuntu
pm2 save

echo "Setup complete! Run start.sh to launch the application."
