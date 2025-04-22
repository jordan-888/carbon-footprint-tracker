#!/bin/bash

echo "Stopping Carbon Footprint Tracker..."
docker-compose down

echo "Cleaning up Docker resources..."
docker system prune -f

echo "Application stopped successfully!" 