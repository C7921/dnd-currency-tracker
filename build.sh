#!/bin/bash
# This is a simple build script for DigitalOcean App Platform

# Generate a fresh package-lock.json
rm -f package-lock.json
npm install

# Install production dependencies
npm ci --only=production

echo "Build completed successfully!"