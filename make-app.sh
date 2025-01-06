#!/bin/bash

echo "Starting Make App Script"

# Go into the Backend Directory
cd ./backend

# Build the executable
echo "Building Executable"
source ./.venv/bin/activate
pyinstaller --onefile main.py
deactivate

# Copy the file into the frontend Directory
echo "Copying Executable"
cp ./dist/main ../frontend/resources/main

# Go into the Frontend Directory
cd ../frontend

# Build the Frontend
echo "Building Frontend"
npm run build
npm run make

# Copy file to the desktop
echo "Copying to Desktop"
cp -r ./out/make/zip/darwin/arm64 /Users/$(whoami)/Desktop
