# Secure - Unified Cybersecurity Scanning Backend API

## Overview
A centralized cybersecurity API engine providing Web, Network, and Malware vulnerability scanning using engines like ZAP, Nmap, and heuristics.

## Tech Stack
- Node.js & Express.js
- TypeScript
- MongoDB
- Redis & BullMQ
- Socket.IO

## Getting Started

### Local Setup
1. Copy `.env.example` to `.env` and fill the variables.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Ensure MongoDB and Redis are running locally or start them using Docker Compose:
   ```bash
   docker-compose up -d mongodb redis
   ```
4. Run the API Server:
   ```bash
   npm run dev
   ```
5. Run the Worker (in a separate terminal):
   ```bash
   npm run worker
   ```

### Docker Setup
To run everything via Docker Compose:
```bash
docker-compose up --build
```

## APIs
- `POST /api/scans/start`: Start a new scan (requires `target`, `type`, `userId`)
- `GET /api/scans`: Get scan history
- `GET /api/scans/:id`: Get scan details
- `GET /api/scans/:id/vulnerabilities`: Get vulnerabilities for a scan

Real-time events available via Socket.IO.
