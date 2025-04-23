#!/bin/bash

# Check if server information is provided
if [ -z "$1" ] || [ -z "$2" ]; then
    echo "Please provide your server IP address and SSH username"
    echo "Usage: ./setup-server-key.sh your-server-ip your-username"
    exit 1
fi

SERVER_HOST=$1
SERVER_USERNAME=$2

# Get the public key
PUBLIC_KEY=$(cat ~/.ssh/github_actions_deploy.pub)

# Add the public key to the server
echo "Adding public key to server..."
ssh $SERVER_USERNAME@$SERVER_HOST "mkdir -p ~/.ssh && chmod 700 ~/.ssh && echo '$PUBLIC_KEY' >> ~/.ssh/authorized_keys && chmod 600 ~/.ssh/authorized_keys"

echo "Public key has been added to your server successfully!" 