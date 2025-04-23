#!/bin/bash

# Test SSH connection
echo "Testing SSH connection..."
ssh -i ~/.ssh/github_actions_deploy $SERVER_USERNAME@$SERVER_HOST "echo 'SSH connection successful!'"

# Test Docker installation
echo "Testing Docker installation..."
ssh -i ~/.ssh/github_actions_deploy $SERVER_USERNAME@$SERVER_HOST "docker --version"

# Test Docker Compose installation
echo "Testing Docker Compose installation..."
ssh -i ~/.ssh/github_actions_deploy $SERVER_USERNAME@$SERVER_HOST "docker-compose --version"

# Test deployment directory
echo "Testing deployment directory..."
ssh -i ~/.ssh/github_actions_deploy $SERVER_USERNAME@$SERVER_HOST "ls -la /opt/carbon-tracker" 