# Wallflower

A full-stack travel planning application with React frontend, Express.js backend, and comprehensive testing frameworks.

## Features

### Frontend (React Application)
- **Trip Planning**: Interactive form for planning travel itineraries
- **Responsive Design**: Works seamlessly across desktop, tablet, and mobile devices
- **Modern UI**: Clean, intuitive interface built with React and TypeScript
- **Playwright E2E Testing**: Comprehensive smoke tests across multiple browsers

### Backend (Express.js APIs)
- **RESTful APIs**: Users, Posts, and Authentication endpoints
- **PACT Contract Testing**: Comprehensive consumer and provider tests
- **Express.js Backend**: Modern Node.js server with middleware
- **Mock Data**: Ready-to-use mock data for development and testing
- **Error Handling**: Consistent error responses across all endpoints
- **Security**: Helmet.js for security headers, CORS support
- **Logging**: Morgan for HTTP request logging

## Project Structure

```
wallflower/
├── client/                 # React application
│   ├── src/               # Source code
│   │   ├── App.tsx        # Main application component
│   │   ├── App.css        # Application styles
│   │   ├── index.tsx      # React entry point
│   │   └── setupTests.ts  # Test configuration
│   ├── tests/             # Playwright E2E tests
│   │   ├── fixtures/      # Test utilities and fixtures
│   │   └── smoke/         # Smoke test suite
│   ├── public/            # Static assets
│   ├── package.json       # Dependencies and scripts
│   └── playwright.config.ts # Playwright configuration
├── api/                   # Express.js API routes
├── tests/pact/            # PACT contract tests
├── server.js              # Express server
└── .github/workflows/     # CI/CD workflows
```

## Getting Started

### Prerequisites

- Node.js 16+
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd wallflower
```

2. Install backend dependencies:
```bash
npm install
```

3. Install frontend dependencies:
```bash
cd client && npm install
```

4. Install Playwright browsers (for E2E testing):
```bash
cd client && npm run playwright:install
```

5. Copy environment configuration:
```bash
cp .env.example .env
```

### Development

#### Backend Server
```bash
# Start the Express.js development server
npm run dev
```
The server will start on `http://localhost:3000`

#### Frontend Application
```bash
# Start the React development server
cd client && npm start
```
The React app will start on `http://localhost:3000`

## Testing

### Unit Tests (Jest + React Testing Library)

Run unit tests:
```bash
npm test
```

Run tests in watch mode:
```bash
npm test -- --watch
```

### End-to-End Tests (Playwright)

Run all E2E tests:
```bash
npm run test:e2e
```

Run tests in headed mode (see browser):
```bash
npm run test:e2e:headed
```

Run tests with UI mode:
```bash
npm run test:e2e:ui
```

Debug tests:
```bash
npm run test:e2e:debug
```

### Test Structure

#### Smoke Tests
Located in `client/tests/smoke/`, these tests verify core functionality:

- **app-loads.spec.ts**: Application loading and basic functionality
- **navigation.spec.ts**: Navigation between pages and routing
- **trip-planner.spec.ts**: Trip planning form functionality
- **ui-components.spec.ts**: UI component rendering and styling
- **console-errors.spec.ts**: JavaScript errors and performance

#### Test Utilities
- **fixtures/base.ts**: Common test utilities and custom fixtures

### Continuous Integration

The project includes GitHub Actions workflows that:
- Run Playwright tests on push/PR to main/develop branches
- Test across multiple browsers (Chromium, Firefox, WebKit)
- Generate test reports and artifacts
- Support both desktop and mobile viewports

## Available Scripts

In the `client` directory:

- `npm start` - Runs the app in development mode
- `npm test` - Launches the test runner (Jest)
- `npm run build` - Builds the app for production
- `npm run test:e2e` - Runs Playwright tests
- `npm run test:e2e:headed` - Runs Playwright tests in headed mode
- `npm run test:e2e:ui` - Opens Playwright UI mode
- `npm run test:e2e:debug` - Runs Playwright in debug mode
- `npm run playwright:install` - Installs Playwright browsers

## Browser Support

The application is tested on:
- Chrome/Chromium (latest)
- Firefox (latest)
- Safari/WebKit (latest)
- Mobile Chrome (Pixel 5)
- Mobile Safari (iPhone 12)

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Make your changes
4. Run tests to ensure everything works (`npm test && npm run test:e2e`)
5. Commit your changes (`git commit -m 'Add amazing feature'`)
6. Push to the branch (`git push origin feature/amazing-feature`)
7. Open a Pull Request

## License

This project is licensed under the MIT License.