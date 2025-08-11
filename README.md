# Wallflower

A React-based travel planning application that helps users discover unique travel experiences and plan memorable trips.

## Features

- **Trip Planning**: Interactive form for planning travel itineraries
- **Responsive Design**: Works seamlessly across desktop, tablet, and mobile devices
- **Modern UI**: Clean, intuitive interface built with React and TypeScript
- **Comprehensive Testing**: Full test coverage with Jest, React Testing Library, and Playwright

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

2. Install dependencies:
```bash
cd client
npm install
```

3. Install Playwright browsers:
```bash
npm run playwright:install
```

### Development

1. Start the development server:
```bash
npm start
```

2. Open [http://localhost:3000](http://localhost:3000) to view the application

The page will reload when you make edits, and you'll see any lint errors in the console.

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