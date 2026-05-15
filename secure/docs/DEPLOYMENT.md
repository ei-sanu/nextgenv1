# Sentinel Security Backend Deployment Guide

This guide covers deploying the Sentinel Security Backend to a generic Ubuntu 22.04 VPS. It includes PM2 clustering, Nginx reverse proxy, WebSockets optimization, and automated CI/CD.

## 1. Initial Infrastructure Setup

1. **Create a VPS Instance:**
   - Choose a provider (DigitalOcean, AWS, Linode, etc.).
   - **Image:** Ubuntu 22.04 LTS.
   - **Recommended Specs:** 2+ CPUs, 4GB+ RAM.
   - **Networking:** Ensure a Public IPv4 Address is assigned.

2. **Configure Security Rules (Firewall):**
   - Open the following ports in your cloud console:
     - Source: `0.0.0.0/0`, Protocol: TCP, Destination Port: `80` (HTTP)
     - Source: `0.0.0.0/0`, Protocol: TCP, Destination Port: `443` (HTTPS)
     - Source: `0.0.0.0/0`, Protocol: TCP, Destination Port: `5001` (API)

## 2. Server Provisioning

1. **SSH into the Server:**
   ```bash
   ssh -i <your-private-key>.key ubuntu@<vps-ip>
   ```

2. **Clone the Repository:**
   ```bash
   git clone https://github.com/ei-sanu/nextgenv1.git
   cd nextgenv1/secure
   ```

3. **Run Install Script:**
   *(Installs Node, PM2, Docker, Nginx, scanners, and sets UFW rules)*
   ```bash
   sudo chmod +x scripts/install.sh
   sudo ./scripts/install.sh
   ```
   **Important:** Log out and log back into SSH to apply Docker user group changes.

## 3. Application Setup

1. **Environment Variables:**
   ```bash
   cp .env.example .env
   nano .env
   ```
   *Fill in your MongoDB Atlas URI, Redis URI (or use Docker), Clerk Keys, etc.*

2. **Run Setup Script:**
   *(Installs npm packages, builds TS, configures Nginx, and sets up PM2 startup)*
   ```bash
   chmod +x scripts/setup.sh
   ./scripts/setup.sh
   ```

3. **Start the Application:**
   *(Uses PM2 clustering to utilize all 4 ARM cores)*
   ```bash
   chmod +x scripts/start.sh
   ./scripts/start.sh
   ```

## 4. SSL Configuration (Certbot)

Run Certbot to secure your domain (assuming you pointed your DNS A record to the Oracle VM IP).
```bash
sudo certbot --nginx -d api.yourdomain.com
```

## 5. Automated CI/CD (GitHub Actions)

The deployment pipeline is fully automated.
1. Go to your GitHub Repository -> Settings -> Secrets and variables -> Actions.
2. Add the following Repository Secrets:
   - `ORACLE_VM_IP`: The public IP of your Oracle VM.
   - `ORACLE_VM_SSH_KEY`: The raw text of your private SSH key.
3. Push to the `main` branch to trigger a zero-downtime deployment.

## Monitoring and Maintenance

Use the built-in monitor script:
```bash
./scripts/monitor.sh
```

Or run manual PM2 commands:
- `pm2 status`: View running clustered instances and workers.
- `pm2 monit`: View real-time dashboard of CPU/Memory usage.
- `pm2 logs`: View consolidated application logs.
