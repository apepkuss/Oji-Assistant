#!/bin/bash

# Development script for Electron app

echo "🚀 Starting Oji in development mode..."

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
fi

# Start the development server
echo "🔧 Starting development server..."
npm run electron:dev
