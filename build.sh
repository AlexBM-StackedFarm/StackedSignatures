#!/bin/bash

# Create dist directory if it doesn't exist
mkdir -p dist

# Copy all files from public to dist
cp -r public/* dist/

# Create functions directory in dist
mkdir -p dist/functions

echo "Build completed successfully!"