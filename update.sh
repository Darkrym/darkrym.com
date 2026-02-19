#!/bin/bash

# Clean Hugo cache first to avoid git conflicts
echo "Cleaning Hugo cache and build artifacts..."
rm -rf public/ resources/

# Reset any local changes and pull latest changes from GitHub
echo "Pulling latest changes from GitHub..."
git fetch origin blowfish-lite
git reset --hard origin/blowfish-lite

echo "Building site with Hugo..."
hugo --gc --cleanDestinationDir

# Kill any existing Python web servers
echo "Stopping existing web servers..."
pkill -f "python.*http.server" || true
pkill -f "python.*SimpleHTTPServer" || true

# Start Python web server in the background
echo "Starting Python web server..."
cd public
nohup python3 -m http.server 1313 > ../server.log 2>&1 &

echo "Done! Server running on port 1313"
echo "View logs: tail -f server.log"