#!/bin/bash

# Get server information
read -p "Enter your server IP address or hostname: " SERVER_HOST
read -p "Enter your server SSH username: " SERVER_USERNAME

# Get the private key
PRIVATE_KEY=$(cat ~/.ssh/github_actions_deploy)

echo "====================================================="
echo "GitHub Secrets Setup Instructions"
echo "====================================================="
echo ""
echo "1. Go to your GitHub repository"
echo "2. Navigate to Settings → Secrets and Variables → Actions"
echo "3. Click 'New repository secret'"
echo ""
echo "Add the following secrets:"
echo ""
echo "Name: SERVER_HOST"
echo "Value: $SERVER_HOST"
echo ""
echo "Name: SERVER_USERNAME"
echo "Value: $SERVER_USERNAME"
echo ""
echo "Name: SERVER_SSH_KEY"
echo "Value: (Copy the private key below)"
echo ""
echo "Private Key:"
echo "$PRIVATE_KEY"
echo ""
echo "Public Key to add to your server:"
cat ~/.ssh/github_actions_deploy.pub
echo ""
echo "After adding the secrets, run: ./setup-server-key.sh $SERVER_HOST $SERVER_USERNAME" 