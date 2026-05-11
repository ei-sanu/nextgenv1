#!/bin/bash
echo "Installing CLI Security Tools for native host execution..."

# Warning: This script is intended for Debian/Ubuntu or Alpine based systems.
# For macOS, use brew. For production, Docker is recommended (already set up in docker/Dockerfile).

OS=$(uname -s)

if [ "$OS" = "Linux" ]; then
    if [ -f /etc/debian_version ]; then
        echo "Detected Debian/Ubuntu..."
        sudo apt-get update
        sudo apt-get install -y nmap wget unzip
        
        # Install Nuclei
        wget https://github.com/projectdiscovery/nuclei/releases/download/v3.1.6/nuclei_3.1.6_linux_amd64.zip -O nuclei.zip
        unzip nuclei.zip
        sudo mv nuclei /usr/local/bin/
        rm nuclei.zip
        nuclei -update-templates
    fi
elif [ "$OS" = "Darwin" ]; then
    echo "Detected macOS..."
    if command -v brew &> /dev/null; then
        brew install nmap
        brew install projectdiscovery/tap/nuclei
    else
        echo "Homebrew not found. Please install Homebrew first."
    fi
else
    echo "Unsupported OS for automated tool installation. Please install Nmap and Nuclei manually or use Docker."
fi

echo "Tool installation process finished."
