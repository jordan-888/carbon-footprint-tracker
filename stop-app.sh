#!/bin/bash

echo "Stopping Carbon Footprint Tracker..."
docker-compose down

# Stop the Nginx service if it's running
if [ "$(docker ps -q -f name=nginx-server-nginx-1)" ]; then
  echo "Stopping Nginx service..."
  cd nginx-server
  docker-compose down
  cd ..
fi

echo "Cleaning up Docker resources..."
docker system prune -f

echo "Application stopped successfully!" 