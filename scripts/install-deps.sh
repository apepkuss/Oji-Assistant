#!/bin/bash

# CI build script to handle rollup dependency issues
echo "Cleaning npm environment..."
npm cache clean --force

echo "Removing existing node_modules and lock file..."
rm -rf node_modules package-lock.json

echo "Installing dependencies..."
npm install --no-optional --legacy-peer-deps

# Check if we're on Linux and install the specific rollup dependency
if [[ "$OSTYPE" == "linux-gnu"* ]] || [[ "$RUNNER_OS" == "Linux" ]]; then
    echo "Installing Linux-specific rollup dependency..."
    npm install @rollup/rollup-linux-x64-gnu --save-optional
fi

echo "Dependencies installed successfully!"
