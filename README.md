# Carbon Footprint Tracker

A modern web application to track and analyze your carbon footprint with an intuitive user interface and comprehensive data visualization.

## Features

- 🌟 Modern, responsive UI with Material-UI and Tailwind CSS
- 📊 Interactive data visualization using Chart.js
- 🔐 Secure user authentication with JWT
- 📱 Mobile-friendly design with responsive layout
- 🔄 Real-time carbon footprint calculations
- 📈 Personalized analytics and insights
- 🎨 Customized theme with environmental color palette
- 📱 Progressive Web App (PWA) support
- 🔒 MongoDB persistence with secure data storage

## Tech Stack

- Frontend:
  - React 18 with TypeScript
  - Material-UI (MUI) for core components
  - Tailwind CSS for custom styling
  - Chart.js for data visualization
  - Formik & Yup for form validation

- Backend:
  - Node.js with Express
  - MongoDB for data persistence
  - JWT for authentication
  - TypeScript support

- Infrastructure:
  - Docker and Docker Compose
  - Nginx for reverse proxy
  - GitHub Actions for CI/CD (optional)

## Quick Start

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/carbon-tracker-project.git
   cd carbon-tracker-project
   ```

2. Start with Docker Compose:
   ```bash
   docker-compose up --build
   ```

3. Access the application:
   - Frontend: http://localhost
   - Backend API: http://localhost/api

## Development Setup

### Prerequisites
- Node.js 16+
- Docker and Docker Compose
- MongoDB (if running locally)
- Git

### Environment Variables

Create a .env file in both frontend and backend directories:

#### Frontend (.env)
```
REACT_APP_API_URL=http://localhost/api
```

#### Backend (.env)
```
MONGODB_URI=mongodb://mongo:27017/carbon-tracker
JWT_SECRET=your-secret-key
PORT=4000
```

### Running Locally

1. Install dependencies:
   ```bash
   # Frontend dependencies
   cd frontend && npm install
   
   # Backend dependencies
   cd backend && npm install
   ```

2. Start with Docker Compose:
   ```bash
   docker-compose up --build
   ```

3. For development without Docker:
   ```bash
   # Start MongoDB
   mongod

   # Start backend (in backend directory)
   npm run dev

   # Start frontend (in frontend directory)
   npm start
   ```

## Testing

Run tests for both frontend and backend:
```bash
# Frontend tests
cd frontend && npm test

# Backend tests
cd backend && npm test
```

## Project Structure

```
├── frontend/                # React TypeScript frontend
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── contexts/       # React contexts (Auth, etc)
│   │   ├── pages/         # Page components
│   │   └── theme.ts       # MUI theme configuration
│   └── ...
├── backend/                # Node.js Express backend
│   ├── src/
│   │   ├── routes/        # API routes
│   │   ├── models/        # Mongoose models
│   │   └── middleware/    # Custom middleware
│   └── ...
└── docker-compose.yml     # Docker composition
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to your branch
5. Create a Pull Request

## License

MIT License - See LICENSE file for details

## Acknowledgments

- Material-UI for the component library
- Chart.js for data visualization
- MongoDB team for the database
- All contributors who have helped to improve this project