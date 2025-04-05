#!/bin/bash
# Start MongoDB
mkdir -p /data/db
mongod --fork --logpath /var/log/mongodb.log

# Install dependencies and start the app
cd /app
npm install
npm run dev
