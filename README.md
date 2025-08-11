# Wallflower 🌸

A web application with Express APIs and comprehensive PACT contract testing.

## Overview

Wallflower is a modern web application built with Node.js and Express, featuring a robust API layer with comprehensive contract testing using PACT. The application includes user management, posts, and authentication endpoints with full test coverage.

## Features

- **RESTful APIs**: Users, Posts, and Authentication endpoints
- **PACT Contract Testing**: Comprehensive consumer and provider tests
- **Express.js Backend**: Modern Node.js server with middleware
- **Mock Data**: Ready-to-use mock data for development and testing
- **Error Handling**: Consistent error responses across all endpoints
- **Security**: Helmet.js for security headers, CORS support
- **Logging**: Morgan for HTTP request logging

## Quick Start

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd wallflower

# Install dependencies
npm install

# Copy environment configuration
cp .env.example .env

# Start the development server
npm run dev
```

The server will start on `http://localhost:3000`

### API Endpoints

#### Health Check
- `GET /health` - Server health status
- `GET /` - API information

#### Users API
- `GET /api/users` - Get all users (with pagination)
- `GET /api/users/:id` - Get user by ID
- `POST /api/users` - Create new user
- `PUT /api/users/:id` - Update user
- `DELETE /api/users/:id` - Delete user

#### Posts API
- `GET /api/posts` - Get all posts (with pagination)
- `GET /api/posts/:id` - Get post by ID
- `POST /api/posts` - Create new post
- `PUT /api/posts/:id` - Update post
- `DELETE /api/posts/:id` - Delete post

#### Authentication API
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration
- `POST /api/auth/logout` - User logout
- `GET /api/auth/profile` - Get user profile (requires auth)

## PACT Contract Testing

This project includes comprehensive PACT contract tests to ensure API reliability and prevent breaking changes between frontend and backend.

### What is PACT?

PACT is a contract testing framework that:
- Defines contracts between service consumers (frontend) and providers (backend)
- Generates contracts from consumer tests
- Verifies that providers fulfill the contracts
- Prevents breaking changes between services

### Running PACT Tests

```bash
# Run all PACT tests
npm run test:pact

# Run consumer tests only
npm run test:pact:consumer

# Run provider verification only
npm run test:pact:provider

# Use the custom test runner
node scripts/run-pact-tests.js
```

### Test Structure

```
tests/pact/
├── consumer/           # Consumer contract tests
│   ├── users.consumer.pact.test.js
│   ├── posts.consumer.pact.test.js
│   └── auth.consumer.pact.test.js
├── provider/           # Provider verification tests
│   └── provider.verification.test.js
├── templates/          # Templates for new API tests
│   └── api.consumer.template.js
└── README.md          # Detailed PACT documentation
```

### Adding New API Tests

1. Copy the template:
   ```bash
   cp tests/pact/templates/api.consumer.template.js tests/pact/consumer/your-api.consumer.pact.test.js
   ```

2. Customize for your API:
   - Update API name and paths
   - Modify test cases
   - Add provider states
   - Use unique port numbers

3. Update provider verification to include new states

## Development

### Available Scripts

```bash
npm start          # Start production server
npm run dev        # Start development server with nodemon
npm test           # Run all tests
npm run test:pact  # Run PACT contract tests
```

### Project Structure

```
wallflower/
├── api/                    # API route modules
│   ├── index.js           # Main API router
│   ├── users.js           # Users endpoints
│   ├── posts.js           # Posts endpoints
│   └── auth.js            # Authentication endpoints
├── tests/                 # Test files
│   ├── pact/             # PACT contract tests
│   └── setup.js          # Test configuration
├── scripts/              # Utility scripts
│   └── run-pact-tests.js # PACT test runner
├── pacts/                # Generated PACT contracts
├── logs/                 # Log files
├── server.js             # Main server file
├── package.json          # Dependencies and scripts
└── README.md             # This file
```

## Testing Philosophy

This project emphasizes contract testing to ensure reliable API communication:

1. **Consumer Tests**: Define what the frontend expects from the API
2. **Provider Tests**: Verify that the API meets consumer expectations
3. **Contract Generation**: Automatic generation of contract specifications
4. **Continuous Verification**: Prevent breaking changes during development

## Contributing

1. Fork the repository
2. Create a feature branch
3. Add your changes with appropriate tests
4. Ensure all PACT tests pass
5. Submit a pull request

### Adding New APIs

When adding new APIs:

1. Create the API endpoint in the `api/` directory
2. Add consumer PACT tests using the provided template
3. Update provider verification with new states
4. Document the new endpoints in this README
5. Test thoroughly with both unit and contract tests

## Environment Variables

See `.env.example` for available configuration options:

- `PORT`: Server port (default: 3000)
- `NODE_ENV`: Environment (development/production)
- `PACT_BROKER_BASE_URL`: PACT Broker URL for sharing contracts
- `LOG_LEVEL`: Logging level for PACT tests

## License

MIT License - see LICENSE file for details