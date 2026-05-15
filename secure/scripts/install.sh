#!/bin/bash
# install.sh - Initial setup for Ubuntu 22.04 VPS
# Run as root or with sudo

set -e

echo "Starting Production Setup for Sentinel Security..."

# Update system
apt update && apt upgrade -y

# Install essential dependencies
apt install -y curl wget git ufw nginx software-properties-common certbot python3-certbot-nginx

# Install required security scanning tools
apt install -y nmap nikto python3 build-essential

# Ensure Docker is installed
if ! command -v docker &> /dev/null; then
    echo "Installing Docker..."
    curl -fsSL https://get.docker.com -o get-docker.sh
    sh get-docker.sh
    usermod -aG docker ubuntu
fi

# Ensure Docker Compose is installed
if ! command -v docker-compose &> /dev/null; then
    echo "Installing Docker Compose..."
    apt install -y docker-compose
fi

# Install Node.js 20 (LTS)
if ! command -v node &> /dev/null; then
    echo "Installing Node.js 20..."
    curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
    apt install -y nodejs
fi

# Install PM2 globally
npm install -g pm2 typescript ts-node

# Configure Firewall (UFW)
echo "Configuring UFW..."
ufw allow OpenSSH
ufw allow 'Nginx Full'
ufw allow 5001/tcp
ufw --force enable

# Iptables rules for cloud providers
iptables -I INPUT 6 -m state --state NEW -p tcp --dport 80 -j ACCEPT
iptables -I INPUT 6 -m state --state NEW -p tcp --dport 443 -j ACCEPT
iptables -I INPUT 6 -m state --state NEW -p tcp --dport 5001 -j ACCEPT
netfilter-persistent save

echo "System dependencies installed successfully."
echo "Please re-login to apply Docker group changes, then run setup.sh"
