#!/bin/bash

# Check if server information is provided
if [ -z "$SERVER_HOST" ] || [ -z "$SERVER_USERNAME" ]; then
    echo "Please set SERVER_HOST and SERVER_USERNAME environment variables"
    echo "Example: SERVER_HOST=your-server-ip SERVER_USERNAME=your-username ./setup-server.sh"
    exit 1
fi

echo "Setting up deployment directory on server..."

# Create deployment directory
ssh -i ~/.ssh/github_actions_deploy $SERVER_USERNAME@$SERVER_HOST "sudo mkdir -p /opt/carbon-tracker"

# Copy deployment files
echo "Copying deployment files..."
scp -i ~/.ssh/github_actions_deploy -r carbon-tracker-nginx/* $SERVER_USERNAME@$SERVER_HOST:/opt/carbon-tracker/

# Set permissions
ssh -i ~/.ssh/github_actions_deploy $SERVER_USERNAME@$SERVER_HOST "sudo chmod +x /opt/carbon-tracker/*.sh"

# Run server setup
echo "Running server setup..."
ssh -i ~/.ssh/github_actions_deploy $SERVER_USERNAME@$SERVER_HOST "cd /opt/carbon-tracker && sudo ./server-setup.sh"

echo "Server setup completed!"
echo "Please log out and log back in to your server for group changes to take effect." 