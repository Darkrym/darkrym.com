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

# Kill any existing servers
echo "Stopping existing web servers..."
pkill -f "python.*http.server" || true
pkill -f "python.*SimpleHTTPServer" || true
pkill -f "hugo server" || true

# Start Hugo server in the background (supports custom 404)
echo "Starting Hugo server..."
nohup hugo server --bind 0.0.0.0 -p 1313 -b "http://staging.darkrym.cc" --appendPort=false > server.log 2>&1 &

echo "Done! Server running on port 1313"
echo "View logs: tail -f server.log"