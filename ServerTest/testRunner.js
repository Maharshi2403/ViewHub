#!/usr/bin/env node

import { spawn } from 'child_process';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Test configuration
const TEST_CONFIG = {
  SERVER_URL: 'http://localhost:4000/graphql',
  TIMEOUT: 30000,
  RETRY_ATTEMPTS: 5,
  RETRY_DELAY: 2000
};

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

function logSection(title) {
  log(`\n${'='.repeat(60)}`, 'cyan');
  log(`  ${title}`, 'bright');
  log(`${'='.repeat(60)}`, 'cyan');
}

async function waitForServer(url, timeout = TEST_CONFIG.TIMEOUT) {
  const start = Date.now();
  log(`Waiting for server at ${url}...`, 'yellow');
  
  while (Date.now() - start < timeout) {
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: '{ __schema { types { name } } }' })
      });
      
      if (response.ok) {
        log(`✓ Server is ready!`, 'green');
        return true;
      }
    } catch (error) {
      // Server not ready yet
    }
    
    await new Promise(resolve => setTimeout(resolve, 1000));
  }
  
  throw new Error(`Server not ready after ${timeout}ms`);
}

function runCommand(command, args = [], options = {}) {
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
        reject(new Error(`Command failed with code ${code}`));
      }
    });
    
    child.on('error', reject);
  });
}

async function runTests() {
  try {
    logSection('ViewHub GraphQL Server Test Suite');
    
    // Check if server is running
    try {
      await waitForServer(TEST_CONFIG.SERVER_URL);
    } catch (error) {
      log(`❌ Server is not running at ${TEST_CONFIG.SERVER_URL}`, 'red');
      log(`Please start the server first:`, 'yellow');
      log(`  cd GraphQL && npm start`, 'blue');
      process.exit(1);
    }
    
    // Install test dependencies if needed
    logSection('Installing Test Dependencies');
    try {
      await runCommand('npm', ['install'], { cwd: __dirname });
      log(`✓ Dependencies installed`, 'green');
    } catch (error) {
      log(`⚠️  Warning: Could not install dependencies: ${error.message}`, 'yellow');
    }
    
    // Run tests
    logSection('Running Test Suite');
    
    const testCommands = [
      { name: 'Unit Tests', command: 'npm', args: ['test', '--', '--testPathPattern=unit'] },
      { name: 'Integration Tests', command: 'npm', args: ['test', '--', '--testPathPattern=integration'] },
      { name: 'Schema Validation Tests', command: 'npm', args: ['test', '--', '--testPathPattern=schemaValidation'] },
      { name: 'Data Source Tests', command: 'npm', args: ['test', '--', '--testPathPattern=dataSource'] },
      { name: 'Data Operations Tests', command: 'npm', args: ['test', '--', '--testPathPattern=dataOperations'] },
      { name: 'Data Modification Tests', command: 'npm', args: ['test', '--', '--testPathPattern=dataModification'] },
      { name: 'All Tests', command: 'npm', args: ['test'] }
    ];
    
    for (const testCmd of testCommands) {
      try {
        log(`\nRunning ${testCmd.name}...`, 'magenta');
        await runCommand(testCmd.command, testCmd.args, { cwd: __dirname });
        log(`✓ ${testCmd.name} completed successfully`, 'green');
      } catch (error) {
        log(`❌ ${testCmd.name} failed: ${error.message}`, 'red');
      }
    }
    
    logSection('Test Suite Complete');
    log(`All tests have been executed. Check the output above for results.`, 'bright');
    
  } catch (error) {
    log(`❌ Test suite failed: ${error.message}`, 'red');
    process.exit(1);
  }
}

// Handle command line arguments
const args = process.argv.slice(2);
if (args.includes('--help') || args.includes('-h')) {
  log(`
ViewHub GraphQL Server Test Suite

Usage: node testRunner.js [options]

Options:
  --help, -h     Show this help message
  --watch, -w    Run tests in watch mode
  --coverage     Generate coverage report
  --verbose      Run with verbose output

Examples:
  node testRunner.js                # Run all tests
  node testRunner.js --coverage     # Run with coverage
  node testRunner.js --watch        # Run in watch mode
`, 'cyan');
  process.exit(0);
}

// Run the test suite
runTests();
