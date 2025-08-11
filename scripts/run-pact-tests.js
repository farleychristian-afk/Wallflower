#!/usr/bin/env node

/**
 * PACT Test Runner Script
 * 
 * This script provides a convenient way to run PACT tests with proper setup and cleanup.
 * It handles starting/stopping the provider server and running tests in the correct order.
 */

const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');

// Configuration
const PROVIDER_PORT = 3001;
const PROVIDER_TIMEOUT = 10000; // 10 seconds

// Colors for console output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m'
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function createDirectories() {
  const dirs = ['logs', 'pacts'];
  dirs.forEach(dir => {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
      log(`Created directory: ${dir}`, 'cyan');
    }
  });
}

function runCommand(command, args, options = {}) {
  return new Promise((resolve, reject) => {
    log(`Running: ${command} ${args.join(' ')}`, 'blue');
    
    const child = spawn(command, args, {
      stdio: 'inherit',
      shell: true,
      ...options
    });

    child.on('close', (code) => {
      if (code === 0) {
        resolve(code);
      } else {
        reject(new Error(`Command failed with exit code ${code}`));
      }
    });

    child.on('error', (error) => {
      reject(error);
    });
  });
}

function startProviderServer() {
  return new Promise((resolve, reject) => {
    log('Starting provider server...', 'yellow');
    
    const server = spawn('node', ['server.js'], {
      env: { ...process.env, PORT: PROVIDER_PORT },
      stdio: 'pipe'
    });

    let serverReady = false;
    const timeout = setTimeout(() => {
      if (!serverReady) {
        server.kill();
        reject(new Error('Provider server failed to start within timeout'));
      }
    }, PROVIDER_TIMEOUT);

    server.stdout.on('data', (data) => {
      const output = data.toString();
      if (output.includes(`running on port ${PROVIDER_PORT}`)) {
        serverReady = true;
        clearTimeout(timeout);
        log(`Provider server started on port ${PROVIDER_PORT}`, 'green');
        resolve(server);
      }
    });

    server.stderr.on('data', (data) => {
      console.error(data.toString());
    });

    server.on('close', (code) => {
      if (!serverReady) {
        clearTimeout(timeout);
        reject(new Error(`Provider server exited with code ${code}`));
      }
    });
  });
}

async function runConsumerTests() {
  log('Running consumer tests...', 'magenta');
  try {
    await runCommand('npx', ['jest', '--testPathPattern=consumer', '--verbose']);
    log('Consumer tests completed successfully!', 'green');
    return true;
  } catch (error) {
    log('Consumer tests failed!', 'red');
    console.error(error.message);
    return false;
  }
}

async function runProviderTests() {
  log('Running provider verification tests...', 'magenta');
  
  let server;
  try {
    // Start provider server
    server = await startProviderServer();
    
    // Wait a bit for server to be fully ready
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Run provider tests
    await runCommand('npx', ['jest', '--testPathPattern=provider', '--verbose']);
    log('Provider tests completed successfully!', 'green');
    return true;
  } catch (error) {
    log('Provider tests failed!', 'red');
    console.error(error.message);
    return false;
  } finally {
    if (server) {
      log('Stopping provider server...', 'yellow');
      server.kill();
    }
  }
}

async function main() {
  const args = process.argv.slice(2);
  const command = args[0] || 'all';

  log('🌸 Wallflower PACT Test Runner', 'bright');
  log('================================', 'bright');

  // Create necessary directories
  createDirectories();

  try {
    switch (command) {
      case 'consumer':
        await runConsumerTests();
        break;
      
      case 'provider':
        await runProviderTests();
        break;
      
      case 'all':
      default:
        log('Running all PACT tests...', 'cyan');
        
        const consumerSuccess = await runConsumerTests();
        if (!consumerSuccess) {
          process.exit(1);
        }
        
        const providerSuccess = await runProviderTests();
        if (!providerSuccess) {
          process.exit(1);
        }
        
        log('🎉 All PACT tests completed successfully!', 'green');
        break;
      
      case 'help':
        log('Usage: node scripts/run-pact-tests.js [command]', 'cyan');
        log('Commands:', 'cyan');
        log('  consumer  - Run consumer tests only', 'cyan');
        log('  provider  - Run provider tests only', 'cyan');
        log('  all       - Run all tests (default)', 'cyan');
        log('  help      - Show this help message', 'cyan');
        break;
      
      default:
        log(`Unknown command: ${command}`, 'red');
        log('Use "help" to see available commands', 'yellow');
        process.exit(1);
    }
  } catch (error) {
    log('Test execution failed!', 'red');
    console.error(error);
    process.exit(1);
  }
}

// Handle process termination
process.on('SIGINT', () => {
  log('\nReceived SIGINT, cleaning up...', 'yellow');
  process.exit(0);
});

process.on('SIGTERM', () => {
  log('\nReceived SIGTERM, cleaning up...', 'yellow');
  process.exit(0);
});

if (require.main === module) {
  main();
}
