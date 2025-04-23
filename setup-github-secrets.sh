#!/bin/bash

# Check if GitHub CLI is installed
if ! command -v gh &> /dev/null; then
    echo "GitHub CLI is not installed. Please install it first:"
    echo "https://cli.github.com/manual/installation"
    exit 1
fi

# Check if user is logged in to GitHub CLI
if ! gh auth status &> /dev/null; then
    echo "You are not logged in to GitHub CLI. Please log in first:"
    echo "gh auth login"
    exit 1
fi

# Get server information
read -p "Enter your server IP address or hostname: " SERVER_HOST
read -p "Enter your server SSH username: " SERVER_USERNAME

# Get the private key
PRIVATE_KEY=$(cat ~/.ssh/github_actions_deploy)

# Add secrets to GitHub
echo "Adding secrets to GitHub..."
gh secret set SERVER_HOST -b"$SERVER_HOST"
gh secret set SERVER_USERNAME -b"$SERVER_USERNAME"
gh secret set SERVER_SSH_KEY -b"$PRIVATE_KEY"

echo "GitHub Secrets have been set up successfully!"
echo "Public key to add to your server:"
cat ~/.ssh/github_actions_deploy.pub 