#!/bin/bash

# Build and start all services
docker-compose up --build -d

# Wait for services to be ready
echo "Waiting for services to start..."
sleep 5

# Show logs
echo "Showing logs (Ctrl+C to exit logs, services will keep running)"
docker-compose logs -f

# Note: To stop services, run: docker-compose down
