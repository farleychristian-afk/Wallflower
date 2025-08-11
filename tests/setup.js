// Jest setup file for PACT tests
const path = require('path');

// Set up PACT configuration
process.env.PACT_DIR = path.resolve(__dirname, '../pacts');
process.env.LOG_LEVEL = process.env.LOG_LEVEL || 'INFO';

// Ensure pacts directory exists
const fs = require('fs');
if (!fs.existsSync(process.env.PACT_DIR)) {
  fs.mkdirSync(process.env.PACT_DIR, { recursive: true });
}

// Global test timeout
jest.setTimeout(30000);

// Clean up after tests
afterAll(() => {
  // Any global cleanup can go here
});
