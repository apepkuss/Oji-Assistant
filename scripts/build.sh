#!/bin/bash

# Build script for all platforms

echo "🔨 Building Oji for all platforms..."

# Clean previous builds
echo "🧹 Cleaning previous builds..."
rm -rf release/
rm -rf dist/

# Install dependencies
echo "📦 Installing dependencies..."
npm ci

# Build the React app
echo "⚛️  Building React app..."
npm run build

# Build for all platforms
echo "🖥️  Building for macOS..."
npm run build:mac

echo "🪟 Building for Windows..."
npm run build:win

echo "🐧 Building for Linux..."
npm run build:linux

echo "✅ Build completed! Check the 'release' folder for distribution files."
