#!/bin/bash

# Check if server information is provided
if [ -z "$SERVER_HOST" ] || [ -z "$SERVER_USERNAME" ]; then
    echo "Please set SERVER_HOST and SERVER_USERNAME environment variables"
    echo "Example: SERVER_HOST=your-server-ip SERVER_USERNAME=your-username ./trigger-deployment.sh"
    exit 1
fi

echo "Triggering deployment..."

# Run deployment script on server
ssh -i ~/.ssh/github_actions_deploy $SERVER_USERNAME@$SERVER_HOST "cd /opt/carbon-tracker && ./deploy.sh"

# Monitor deployment
echo "Monitoring deployment..."
ssh -i ~/.ssh/github_actions_deploy $SERVER_USERNAME@$SERVER_HOST "cd /opt/carbon-tracker && ./monitor.sh"

echo "Deployment completed!" 