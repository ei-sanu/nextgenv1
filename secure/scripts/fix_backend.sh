#!/bin/bash
# fix_backend.sh - Diagnostic and fix script for Oracle Cloud Backend

set -e

echo "--- Sentinel Backend Fix Tool ---"

# 1. Check if Node.js is running on 5001
echo "[1/4] Checking backend service..."
if lsof -i :5001 > /dev/null; then
    echo "✅ Backend is running on port 5001."
else
    echo "❌ Backend is NOT running on port 5001!"
    echo "Attempting to start backend with PM2..."
    cd secure && npm install && npm run build
    pm2 start backend/server.ts --name "sentinel-backend" || npx ts-node backend/server.ts &
fi

# 2. Check Nginx status
echo "[2/4] Checking Nginx..."
if systemctl is-active --quiet nginx; then
    echo "✅ Nginx is active."
else
    echo "❌ Nginx is NOT active! Starting Nginx..."
    sudo systemctl start nginx
fi

# 3. Check Firewall (Oracle Linux / Ubuntu)
echo "[3/4] Checking Firewall ports (80, 443)..."
if command -v ufw > /dev/null; then
    sudo ufw allow 80/tcp
    sudo ufw allow 443/tcp
    echo "✅ UFW ports 80/443 allowed."
elif command -v firewall-cmd > /dev/null; then
    sudo firewall-cmd --permanent --add-service=http
    sudo firewall-cmd --permanent --add-service=https
    sudo firewall-cmd --reload
    echo "✅ Firewall-cmd ports 80/443 allowed."
else
    echo "⚠️  Could not determine firewall manager. Please ensure ports 80 and 443 are open."
fi

# 4. SSL (Certbot)
echo "[4/4] SSL Check..."
if [ -f "/etc/letsencrypt/live/nextgen-api.duckdns.org/fullchain.pem" ]; then
    echo "✅ SSL certificate found."
else
    echo "⚠️  SSL certificate NOT found! Cloudflare (HTTPS) will block HTTP requests."
    echo "Run the following to get a free SSL cert:"
    echo "sudo apt install certbot python3-certbot-nginx -y"
    echo "sudo certbot --nginx -d nextgen-api.duckdns.org"
fi

echo "--- Fix attempt complete ---"
