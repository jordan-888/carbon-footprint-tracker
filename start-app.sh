#!/bin/bash

# Start the containers in the background
docker-compose up --build -d

# Wait for services to be ready (10 seconds should be enough)
echo "Starting services..."
sleep 10

# Open the application in the default browser
echo "Opening application in browser..."
open http://localhost:3000

# Show the logs
docker-compose logs -f 