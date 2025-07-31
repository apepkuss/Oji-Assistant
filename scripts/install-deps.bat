@echo off
echo Cleaning npm environment...
call npm cache clean --force

echo Removing existing node_modules and lock file...
if exist node_modules rmdir /s /q node_modules
if exist package-lock.json del package-lock.json

echo Installing dependencies...
call npm install --legacy-peer-deps

echo Dependencies installed successfully!
