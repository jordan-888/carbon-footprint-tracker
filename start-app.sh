#!/bin/bash

# Start the containers in the background
docker-compose up --build -d

# Wait for services to be ready (10 seconds should be enough)
echo "Starting services..."
sleep 10

# Start the Nginx service if it's not already running
if [ ! "$(docker ps -q -f name=nginx-server-nginx-1)" ]; then
  echo "Starting Nginx service..."
  cd nginx-server
  docker-compose up -d
  cd ..
fi

# Open the application in the default browser
echo "Opening application in browser..."
open http://localhost

# Show the logs
docker-compose logs -f 