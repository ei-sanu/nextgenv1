#!/bin/bash
echo "Setting up Secure Unified Cybersecurity Backend..."

# Check if Node is installed
if ! command -v node &> /dev/null
then
    echo "Node.js is not installed. Please install Node.js v20+"
    exit 1
fi

echo "Installing npm dependencies..."
npm install

echo "Checking if .env exists..."
if [ ! -f .env ]; then
    echo "Creating .env from .env.example..."
    cp .env.example .env
fi

echo "Creating log and report directories..."
mkdir -p logs reports_output

echo "Building TypeScript code..."
npm run build

echo "Setup complete! Make sure Redis and MongoDB are running."
echo "Run 'npm run dev' to start the server and 'npm run worker' in another terminal."
