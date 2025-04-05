#!/bin/bash
echo "Starting application..."
echo "Node Version: $(node -v)"
echo "NPM Version: $(npm -v)"
echo "Current directory: $(pwd)"
echo "Directory contents: $(ls -la)"
echo "PORT environment variable: $PORT"

# Start the application
node app.js