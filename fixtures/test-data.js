/**
 * Test data fixtures for smoke tests
 * Contains reusable test data and configuration
 */

const testData = {
  // Sample user data for form testing
  sampleUser: {
    firstName: 'Test',
    lastName: 'User',
    email: 'test.user@example.com',
    phone: '1234567890',
    password: 'TestPassword123!',
    message: 'This is a test message for smoke testing purposes.'
  },

  // Search terms for testing search functionality
  searchTerms: {
    valid: ['test', 'search', 'example'],
    invalid: ['xyzabc123', '!@#$%^&*()'],
    empty: ['', ' ', '   ']
  },

  // Common selectors that might be used across tests
  commonSelectors: {
    // Navigation
    navigation: 'nav, .nav, .navigation, [role="navigation"]',
    logo: '.logo, [data-testid="logo"], .brand',
    menuButton: '.menu-button, .hamburger, [aria-label*="menu"]',
    
    // Content areas
    header: 'header, .header, [role="banner"]',
    main: 'main, .main, .content, [role="main"]',
    footer: 'footer, .footer, [role="contentinfo"]',
    
    // Forms
    contactForm: 'form[name="contact"], #contact-form, .contact-form',
    searchForm: 'form[role="search"], .search-form, #search-form',
    
    // Buttons
    submitButton: 'button[type="submit"], input[type="submit"], .submit-btn',
    cancelButton: 'button[type="button"]:contains("Cancel"), .cancel-btn',
    
    // Messages
    errorMessage: '.error, .alert-error, [role="alert"]',
    successMessage: '.success, .alert-success, .success-message',
    warningMessage: '.warning, .alert-warning, .warning-message',
    
    // Loading states
    loadingSpinner: '.loading, .spinner, .loader, [aria-label*="loading"]',
    loadingOverlay: '.loading-overlay, .modal-backdrop'
  },

  // Viewport configurations for responsive testing
  viewports: {
    mobile: { width: 375, height: 667 },
    tablet: { width: 768, height: 1024 },
    desktop: { width: 1920, height: 1080 },
    largeDesktop: { width: 2560, height: 1440 }
  },

  // Timeout configurations
  timeouts: {
    short: 1000,      // 1 second
    medium: 5000,     // 5 seconds
    long: 10000,      // 10 seconds
    veryLong: 30000   // 30 seconds
  },

  // URLs for testing (adjust based on your application)
  urls: {
    home: '/',
    about: '/about',
    contact: '/contact',
    login: '/login',
    signup: '/signup'
  },

  // Expected page titles (adjust based on your application)
  expectedTitles: {
    home: ['Wallflower', 'Home', 'Welcome'],
    about: ['About', 'About Us'],
    contact: ['Contact', 'Contact Us']
  },

  // Test environment configuration
  environment: {
    baseUrl: process.env.BASE_URL || 'http://localhost:3000',
    isCI: !!process.env.CI,
    browser: process.env.BROWSER || 'chromium'
  }
};

module.exports = testData;
