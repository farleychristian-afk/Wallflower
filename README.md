# Wallflower

## Playwright Smoke Tests

This repository contains comprehensive smoke tests for the Wallflower web application using Playwright. These tests verify that basic functionality works correctly without testing complex business logic.

### 🎯 What Are Smoke Tests?

Smoke tests are a subset of automated tests that verify the most critical functionality of an application. They are:
- **Fast** - Complete in under 5-10 minutes
- **Reliable** - Minimal flakiness, focused on stable functionality
- **Essential** - Test core features that must work for the app to be usable
- **Broad** - Cover multiple areas but not in depth

### 📁 Project Structure

```
├── tests/smoke/                 # Smoke test files
│   ├── 01-page-loading.spec.js  # Basic page loading tests
│   ├── 02-navigation.spec.js    # Navigation functionality
│   ├── 03-form-controls.spec.js # Form elements and interactions
│   ├── 04-responsive-design.spec.js # Responsive design tests
│   └── 05-accessibility.spec.js # Basic accessibility checks
├── page-objects/               # Page Object Models
│   ├── BasePage.js            # Base page with common functionality
│   └── HomePage.js            # Home page specific methods
├── fixtures/                  # Test data and configuration
│   └── test-data.js          # Reusable test data
├── test-results/             # Test output (auto-generated)
├── playwright-report/        # HTML reports (auto-generated)
├── playwright.config.js      # Playwright configuration
├── package.json             # Dependencies and scripts
└── .github/workflows/       # CI/CD configuration
    └── smoke-tests.yml      # GitHub Actions workflow
```

### 🚀 Quick Start

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Install Playwright browsers:**
   ```bash
   npm run install:browsers
   ```

3. **Run all smoke tests:**
   ```bash
   npm run test:smoke
   ```

4. **View test report:**
   ```bash
   npm run test:report
   ```

### 📋 Available Scripts

| Script | Description |
|--------|-------------|
| `npm test` | Run all tests |
| `npm run test:smoke` | Run only smoke tests (recommended) |
| `npm run test:headed` | Run tests with browser UI visible |
| `npm run test:debug` | Run tests in debug mode |
| `npm run test:ui` | Open Playwright UI mode |
| `npm run test:report` | Show HTML test report |
| `npm run install:browsers` | Install Playwright browsers |

### 🧪 Test Categories

#### 1. Page Loading Tests (`01-page-loading.spec.js`)
- ✅ Home page loads successfully
- ✅ Basic page structure is present
- ✅ No loading indicators after page load
- ✅ No error messages on initial load
- ✅ Page responds within reasonable time
- ✅ Page has accessible content
- ✅ Page handles refresh correctly

#### 2. Navigation Tests (`02-navigation.spec.js`)
- ✅ Navigation elements are present
- ✅ Links are clickable and functional
- ✅ Menu button works (if present)
- ✅ Navigation to different sections
- ✅ Browser back/forward navigation
- ✅ Navigation state maintained during interactions

#### 3. Form Controls Tests (`03-form-controls.spec.js`)
- ✅ Input fields accept text correctly
- ✅ Buttons are clickable and functional
- ✅ Search functionality (if present)
- ✅ Form submission handling
- ✅ Dropdown/select elements work
- ✅ Checkboxes and radio buttons function
- ✅ Primary action buttons work

#### 4. Responsive Design Tests (`04-responsive-design.spec.js`)
- ✅ Works on desktop viewport (1920x1080)
- ✅ Works on tablet viewport (768x1024)
- ✅ Works on mobile viewport (375x667)
- ✅ Handles viewport changes gracefully
- ✅ No horizontal scroll on mobile
- ✅ Functionality maintained across screen sizes
- ✅ Touch interactions work on mobile

#### 5. Accessibility Tests (`05-accessibility.spec.js`)
- ✅ Proper page title
- ✅ Heading structure (h1, h2, etc.)
- ✅ Alt text for images
- ✅ Form labels present
- ✅ Keyboard navigation works
- ✅ Proper link text
- ✅ Button text is descriptive
- ✅ Basic color contrast check
- ✅ Focus management

### ⚙️ Configuration

#### Environment Variables
Set these in your environment or CI/CD:

```bash
BASE_URL=http://localhost:3000  # Your app URL
BROWSER=chromium               # Default browser
CI=true                       # Enables CI-specific settings
```

#### Playwright Configuration
Key settings in `playwright.config.js`:
- **Browsers**: Chromium, Firefox, WebKit, Mobile Chrome, Mobile Safari
- **Retries**: 2 retries on CI, 0 locally
- **Timeouts**: 10s action, 30s navigation
- **Artifacts**: Screenshots and videos on failure
- **Reports**: HTML, JSON, JUnit

### 🔧 Customization

#### Adding New Tests
1. Create a new `.spec.js` file in `tests/smoke/`
2. Add the `@smoke` tag to the test description
3. Use the existing page objects or create new ones
4. Follow the naming convention: `##-description.spec.js`

#### Updating Selectors
Modify selectors in `page-objects/HomePage.js` to match your application:

```javascript
this.selectors = {
  // Update these to match your app's HTML structure
  header: 'header',
  navigation: 'nav',
  logo: '[data-testid="logo"]',
  // ... add your specific selectors
};
```

#### Adding Test Data
Add new test data in `fixtures/test-data.js`:

```javascript
const testData = {
  // Add your test data here
  newFeature: {
    testValue: 'example'
  }
};
```

### 🚨 CI/CD Integration

The included GitHub Actions workflow (`.github/workflows/smoke-tests.yml`) will:
- Run on every push to main/develop
- Run on pull requests
- Run daily at 6 AM UTC
- Test across multiple browsers
- Upload test results and screenshots
- Publish HTML reports to GitHub Pages (optional)

### 🐛 Troubleshooting

#### Common Issues

**Tests failing locally but passing in CI:**
- Check your `BASE_URL` environment variable
- Ensure your local app is running on the correct port
- Verify browser versions match

**Flaky tests:**
- Increase timeouts in `playwright.config.js`
- Add more specific waits in page objects
- Check for race conditions in async operations

**Selector not found errors:**
- Update selectors in page objects to match your HTML
- Use `data-testid` attributes for more stable selectors
- Check if elements are hidden or not yet loaded

#### Debug Mode
Run tests in debug mode to step through them:
```bash
npm run test:debug
```

#### UI Mode
Use Playwright's UI mode for interactive debugging:
```bash
npm run test:ui
```

### 📊 Best Practices

1. **Keep tests fast** - Smoke tests should complete quickly
2. **Use stable selectors** - Prefer `data-testid` over CSS classes
3. **Avoid business logic** - Focus on UI controls working
4. **Make tests independent** - Each test should work in isolation
5. **Use page objects** - Keep selectors and methods organized
6. **Tag appropriately** - Use `@smoke` for easy filtering
7. **Handle waits properly** - Use Playwright's built-in waiting mechanisms

### 🔄 Maintenance

- **Weekly**: Review test results and fix any flaky tests
- **Monthly**: Update selectors if UI changes
- **Quarterly**: Review test coverage and add new smoke tests
- **As needed**: Update browser versions and dependencies

### 📞 Support

For issues with the smoke tests:
1. Check the troubleshooting section above
2. Review test results and screenshots in `test-results/`
3. Run tests in debug mode for more information
4. Check the Playwright documentation: https://playwright.dev/

---

**Note**: These smoke tests are designed to be generic and work with most web applications. You'll need to customize the selectors and test data to match your specific Wallflower application structure.