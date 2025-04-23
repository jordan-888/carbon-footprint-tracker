# Carbon Tracker Deployment Guide

This guide will help you deploy the Carbon Tracker application to your own server using CI/CD with GitHub Actions.

## Prerequisites

- A GitHub account
- A server with SSH access
- A domain name (optional, for SSL)

## Step 1: Set Up GitHub Secrets

1. Go to your GitHub repository
2. Navigate to Settings → Secrets and Variables → Actions
3. Add the following secrets:
   - `SERVER_HOST`: Your server's IP address or hostname
   - `SERVER_USERNAME`: Your server's SSH username
   - `SERVER_SSH_KEY`: Your SSH private key (the content of `~/.ssh/github_actions_deploy`)

## Step 2: Set Up Your Server

1. SSH into your server:
   ```bash
   ssh your-username@your-server-ip
   ```

2. Add the GitHub Actions public key to your server:
   ```bash
   mkdir -p ~/.ssh
   chmod 700 ~/.ssh
   echo "ssh-ed25519 AAAAC3NzaC1lZDI1NTE5AAAAIMDWwUK1TJte4jHJZLpJmr4t/rwnlIyMsXGaSCyv6hAy github-actions-deploy" >> ~/.ssh/authorized_keys
   chmod 600 ~/.ssh/authorized_keys
   ```

## Step 3: Deploy the Application

1. On your local machine, set your server information:
   ```bash
   export SERVER_HOST="your-server-ip"
   export SERVER_USERNAME="your-username"
   ```

2. Run the setup script:
   ```bash
   ./setup-server.sh
   ```

3. Test the connection:
   ```bash
   ./test-connection.sh
   ```

4. Trigger the deployment:
   ```bash
   ./trigger-deployment.sh
   ```

## Step 4: Set Up DNS (Optional)

If you have a domain name, you can set up DNS:

1. Run the DNS setup script:
   ```bash
   ./carbon-tracker-nginx/dns-setup.sh your-domain.com
   ```

2. Add the DNS records to your domain registrar

3. After DNS propagation (can take up to 48 hours), set up SSL:
   ```bash
   ./carbon-tracker-nginx/setup-ssl.sh your-domain.com
   ```

## Step 5: Monitor Your Deployment

1. Check the GitHub Actions tab in your repository for deployment status

2. Monitor your server:
   ```bash
   ./carbon-tracker-nginx/monitor.sh
   ```

## Troubleshooting

If you encounter issues:

1. Check the GitHub Actions logs
2. Check the server logs:
   ```bash
   docker-compose -f /opt/carbon-tracker/docker-compose.prod.yml logs
   ```
3. Check the Nginx logs:
   ```bash
   docker-compose -f /opt/carbon-tracker/docker-compose.prod.yml logs nginx
   ```

## Updating Your Application

To update your application:

1. Make changes to your code
2. Commit and push to GitHub
3. GitHub Actions will automatically deploy the changes

## Security Considerations

- Keep your SSH keys secure
- Regularly update your server
- Monitor your application logs
- Set up a firewall on your server 