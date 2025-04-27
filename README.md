# Carbon Footprint Tracker

A comprehensive web application for tracking and managing your carbon footprint, supporting UN Sustainable Development Goal 13: Climate Action.

## Features

- User Authentication
  - Secure registration and login
  - JWT-based authentication
  - Profile management

- Activity Tracking
  - Track various types of activities:
    - Transport (car, bus, train, plane)
    - Energy consumption (electricity, gas, oil)
    - Food consumption (meat, dairy, vegetables)
  - Automatic carbon footprint calculation
  - Historical data tracking

- Carbon Footprint Analytics
  - Total carbon footprint calculation
  - Breakdown by activity type
  - Historical trends
  - Environmental impact assessment

## Tech Stack

### Frontend
- React.js with TypeScript
- Material-UI for components
- Axios for API calls
- JWT for authentication

### Backend
- Node.js with Express
- MongoDB for data storage
- JWT for authentication
- RESTful API design

### Infrastructure
- Docker and Docker Compose
- Nginx reverse proxy
- GitHub Actions for CI/CD
- GitHub Container Registry

## Quick Start

1. Clone the repository:
   ```bash
   git clone --recursive https://github.com/jordan-888/docker-carbon-footprint-tracker.git
   cd docker-carbon-footprint-tracker
   ```

2. Start the application:
   ```bash
   ./start-app.sh
   ```

3. Access the application:
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:4000
   - MongoDB: mongodb://localhost:27017

## Development

### Prerequisites
- Node.js v18+
- Docker and Docker Compose
- Git

### Environment Variables
Create `.env` files in both frontend and backend directories:

Frontend (.env):
```
REACT_APP_API_URL=http://localhost:4000
```

Backend (.env):
```
MONGODB_URI=mongodb://mongo:27017/carbon_tracker
JWT_SECRET=your_jwt_secret
```

### Running Locally
```bash
# Start all services
docker-compose up -d

# Frontend only
cd frontend
npm install
npm start

# Backend only
cd backend
npm install
npm start
```

## API Endpoints

### Authentication
- POST /api/auth/register - Register new user
- POST /api/auth/login - User login
- GET /api/auth/me - Get user profile

### Activities
- GET /api/activities - List activities
- POST /api/activities - Create activity
- PUT /api/activities/:id - Update activity
- DELETE /api/activities/:id - Delete activity
- GET /api/activities/summary - Get carbon footprint summary

## Deployment

The application is deployed using GitHub Actions. Required secrets:

- `SERVER_HOST`: Production server hostname
- `SERVER_USERNAME`: SSH username
- `SERVER_SSH_KEY`: SSH private key
- `JWT_SECRET`: JWT secret for production

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

This project is licensed under the MIT License.

## Acknowledgments

- UN SDG 13: Climate Action
- Carbon footprint calculation factors from verified sources
- Open-source community and contributors