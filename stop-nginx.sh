#!/bin/bash

# Stop the Nginx container
echo "Stopping Nginx..."
docker-compose down

# Check if the container stopped successfully
if [ $? -eq 0 ]; then
  echo "Nginx stopped successfully!"
else
  echo "Failed to stop Nginx. Please check the logs."
  docker-compose logs
fi 