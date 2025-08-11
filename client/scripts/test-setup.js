#!/usr/bin/env node

/**
 * Test setup verification script
 * Verifies that all components of the testing framework are properly configured
 */

const fs = require('fs');
const path = require('path');

console.log('🧪 Wallflower Test Setup Verification\n');

// Check if required files exist
const requiredFiles = [
  'package.json',
  'playwright.config.ts',
  'src/App.tsx',
  'src/setupTests.ts',
  'tests/fixtures/base.ts',
  'tests/smoke/app-loads.spec.ts',
  'tests/smoke/navigation.spec.ts',
  'tests/smoke/trip-planner.spec.ts',
  'tests/smoke/ui-components.spec.ts',
  'tests/smoke/console-errors.spec.ts'
];

console.log('📁 Checking required files...');
let allFilesExist = true;

requiredFiles.forEach(file => {
  const filePath = path.join(__dirname, '..', file);
  if (fs.existsSync(filePath)) {
    console.log(`✅ ${file}`);
  } else {
    console.log(`❌ ${file} - MISSING`);
    allFilesExist = false;
  }
});

// Check package.json scripts
console.log('\n📦 Checking npm scripts...');
const packageJson = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'package.json'), 'utf8'));
const requiredScripts = [
  'start',
  'test',
  'test:e2e',
  'test:e2e:headed',
  'test:e2e:ui',
  'test:e2e:debug',
  'playwright:install'
];

let allScriptsExist = true;
requiredScripts.forEach(script => {
  if (packageJson.scripts[script]) {
    console.log(`✅ npm run ${script}`);
  } else {
    console.log(`❌ npm run ${script} - MISSING`);
    allScriptsExist = false;
  }
});

// Check dependencies
console.log('\n📚 Checking dependencies...');
const requiredDeps = ['react', 'react-dom', 'react-router-dom', 'typescript'];
const requiredDevDeps = ['@playwright/test'];

let allDepsExist = true;
requiredDeps.forEach(dep => {
  if (packageJson.dependencies[dep]) {
    console.log(`✅ ${dep} (${packageJson.dependencies[dep]})`);
  } else {
    console.log(`❌ ${dep} - MISSING`);
    allDepsExist = false;
  }
});

requiredDevDeps.forEach(dep => {
  if (packageJson.devDependencies[dep]) {
    console.log(`✅ ${dep} (${packageJson.devDependencies[dep]})`);
  } else {
    console.log(`❌ ${dep} - MISSING`);
    allDepsExist = false;
  }
});

// Summary
console.log('\n📊 Setup Summary:');
if (allFilesExist && allScriptsExist && allDepsExist) {
  console.log('🎉 All checks passed! Your Playwright testing setup is ready.');
  console.log('\n🚀 Next steps:');
  console.log('1. Start the development server: npm start');
  console.log('2. In another terminal, run tests: npm run test:e2e');
  console.log('3. Or run tests in headed mode: npm run test:e2e:headed');
  process.exit(0);
} else {
  console.log('⚠️  Some issues were found. Please review the missing items above.');
  process.exit(1);
}
