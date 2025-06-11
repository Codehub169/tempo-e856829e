#!/bin/bash

# Exit immediately if a command exits with a non-zero status.
set -e

# Set Python to be unbuffered, and encoding to UTF-8
export PYTHONUNBUFFERED=1
export PYTHONIOENCODING=UTF-8

# Create a virtual environment if it doesn't exist
if [ ! -d "venv" ]; then
  echo "Creating Python virtual environment..."
  python3 -m venv venv
fi

# Activate the virtual environment
# shellcheck disable=SC1091
source venv/bin/activate

echo "Installing Python dependencies..."
pip install -r backend/requirements.txt

# Navigate to frontend directory, install dependencies, and build
# This assumes frontend/package.json and a build script are present
if [ -d "frontend" ] && [ -f "frontend/package.json" ]; then
  echo "Setting up frontend..."
  cd frontend
  # Check for Node.js and npm
  if ! command -v node &> /dev/null
  then
      echo "Node.js could not be found, please install Node.js."
      # exit 1 # Optionally exit if Node.js is critical and not found
  elif ! command -v npm &> /dev/null
  then
      echo "npm could not be found, please install npm (usually comes with Node.js)."
      # exit 1 # Optionally exit if npm is critical and not found
  else 
      echo "Installing frontend dependencies..."
      npm install
      echo "Building frontend assets..."
      npm run build
  fi
  cd ..
else
  echo "Frontend directory or package.json not found, skipping frontend build."
  echo "Ensure frontend is set up with a 'build' script in package.json for full functionality."
fi

# Run database migrations (Alembic) - Kept commented as per original intent for now.
# The application itself will handle initial table creation if Alembic is not used.
# echo "Running database migrations..."
# alembic upgrade head

echo "Starting FastAPI application on port 9000..."
# Run Uvicorn server, accessible on the network
# --reload flag removed for production suitability.
uvicorn backend.app.main:app --host 0.0.0.0 --port 9000
