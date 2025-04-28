# Carbon Tracker Deployment Guide

This guide covers the deployment process for the Carbon Tracker application.

## Architecture Overview

- Frontend: React SPA with Material-UI and Tailwind CSS
- Backend: Node.js/Express REST API
- Database: MongoDB
- Proxy: Nginx reverse proxy
- Containers: Docker with Compose

## Local Development Environment

### Prerequisites
- Docker and Docker Compose
- Node.js 16+
- Git

### Quick Start
```bash
# Clone and start
git clone <repository-url>
cd carbon-tracker-project
docker-compose up --build
```

Access:
- Frontend: http://localhost
- API: http://localhost/api
- MongoDB: mongodb://localhost:27017

## Production Deployment

### Prerequisites
- Docker and Docker Compose installed on production server
- Domain name with DNS configured
- SSL certificate (recommended)
- MongoDB instance (local or Atlas)

### Environment Configuration

1. Create production environment files:
```bash
cp .env.example .env.production
```

2. Configure production variables:
```env
# Backend
MONGODB_URI=mongodb://your-production-mongodb-uri
JWT_SECRET=your-secure-jwt-secret
NODE_ENV=production

# Frontend
REACT_APP_API_URL=https://your-domain.com/api
```

### Deployment Steps

1. Build production images:
```bash
docker-compose -f docker-compose.prod.yml build
```

2. Start services:
```bash
docker-compose -f docker-compose.prod.yml up -d
```

3. Verify deployment:
```bash
docker-compose ps
curl https://your-domain.com/health
```

## SSL/TLS Configuration

1. Using Certbot with Nginx:
```bash
apt-get update
apt-get install certbot python3-certbot-nginx
certbot --nginx -d your-domain.com
```

2. Manual certificate configuration:
```bash
# Generate certificate
openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
  -keyout /etc/ssl/private/nginx-selfsigned.key \
  -out /etc/ssl/certs/nginx-selfsigned.crt

# Configure Nginx
nano /etc/nginx/conf.d/default.conf
```

## Database Management

### Backups

1. Create backup:
```bash
docker exec mongodb mongodump --out /backup/$(date +%Y%m%d)
```

2. Restore from backup:
```bash
docker exec mongodb mongorestore /backup/20250428
```

### Migration

1. Export data:
```bash
mongoexport --db carbon-tracker --collection activities \
  --out activities.json
```

2. Import to new instance:
```bash
mongoimport --db carbon-tracker --collection activities \
  --file activities.json
```

## Monitoring and Maintenance

### Health Checks

- Frontend: https://your-domain.com/health
- Backend: https://your-domain.com/api/health
- MongoDB: Check connection in logs

### Log Management

View logs:
```bash
# All services
docker-compose logs -f

# Specific service
docker-compose logs -f backend
```

### Resource Monitoring

```bash
# Container stats
docker stats

# Disk usage
docker system df
```

## Troubleshooting

### Common Issues

1. Connection refused:
   - Check container status
   - Verify network configuration
   - Confirm port mappings

2. Database connection failed:
   - Verify MongoDB URI
   - Check network connectivity
   - Validate credentials

3. SSL/TLS issues:
   - Verify certificate paths
   - Check certificate validity
   - Confirm Nginx configuration

### Quick Fixes

```bash
# Restart services
docker-compose restart

# Rebuild containers
docker-compose up --build -d

# Clear volumes
docker-compose down -v
```

## Security Considerations

1. Environment Variables:
   - Use secure secrets
   - Never commit .env files
   - Rotate credentials regularly

2. Network Security:
   - Configure firewalls
   - Use SSL/TLS
   - Implement rate limiting

3. Database Security:
   - Strong authentication
   - Regular backups
   - Access control

## Performance Optimization

1. Frontend:
   - Enable compression
   - Configure caching
   - Optimize bundle size

2. Backend:
   - Implement caching
   - Optimize queries
   - Use connection pooling

3. Database:
   - Create indexes
   - Monitor query performance
   - Regular maintenance

## Continuous Integration/Deployment

1. Automated testing
2. Image building
3. Deployment verification
4. Rollback procedures

## Support

For issues and support:
1. Check logs
2. Review documentation
3. Contact maintainers
4. Submit issue ticket

Remember to always backup data before major changes and test in staging environment first.