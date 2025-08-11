const BasePage = require('./BasePage');

/**
 * Home Page Object Model
 * Contains selectors and methods specific to the home page
 */
class HomePage extends BasePage {
  constructor(page) {
    super(page);
    
    // Common selectors - adjust these based on your actual application
    this.selectors = {
      // Navigation elements
      header: 'header',
      navigation: 'nav',
      logo: '[data-testid="logo"], .logo, h1',
      menuButton: '[data-testid="menu-button"], .menu-button, .hamburger',
      
      // Main content
      mainContent: 'main, .main-content, #main',
      title: 'h1, .title, [data-testid="page-title"]',
      
      // Common form elements
      searchInput: '[data-testid="search"], input[type="search"], .search-input',
      searchButton: '[data-testid="search-button"], .search-button, button[type="submit"]',
      
      // Common buttons
      primaryButton: '[data-testid="primary-button"], .btn-primary, .primary-btn',
      secondaryButton: '[data-testid="secondary-button"], .btn-secondary, .secondary-btn',
      
      // Footer
      footer: 'footer',
      
      // Links
      aboutLink: 'a[href*="about"], [data-testid="about-link"]',
      contactLink: 'a[href*="contact"], [data-testid="contact-link"]',
      
      // Common UI elements
      loadingSpinner: '.loading, .spinner, [data-testid="loading"]',
      errorMessage: '.error, .alert-error, [data-testid="error"]',
      successMessage: '.success, .alert-success, [data-testid="success"]'
    };
  }

  /**
   * Navigate to home page
   */
  async navigateToHome() {
    await this.goto('/');
    await this.waitForPageLoad();
  }

  /**
   * Check if page loaded successfully
   * @returns {Promise<boolean>} True if page loaded
   */
  async isPageLoaded() {
    // Check for basic page structure
    const hasHeader = await this.isElementVisible(this.selectors.header);
    const hasMainContent = await this.isElementVisible(this.selectors.mainContent);
    return hasHeader || hasMainContent;
  }

  /**
   * Check if navigation is present and functional
   * @returns {Promise<boolean>} True if navigation works
   */
  async isNavigationWorking() {
    return await this.isElementVisible(this.selectors.navigation);
  }

  /**
   * Test search functionality if present
   * @param {string} searchTerm - Term to search for
   */
  async performSearch(searchTerm) {
    const searchInputExists = await this.isElementVisible(this.selectors.searchInput);
    if (searchInputExists) {
      await this.fill(this.selectors.searchInput, searchTerm);
      
      const searchButtonExists = await this.isElementVisible(this.selectors.searchButton);
      if (searchButtonExists) {
        await this.click(this.selectors.searchButton);
      } else {
        // Try pressing Enter if no search button
        await this.page.keyboard.press('Enter');
      }
      
      // Wait for search results or page change
      await this.page.waitForTimeout(1000);
    }
  }

  /**
   * Click primary action button if present
   */
  async clickPrimaryButton() {
    const buttonExists = await this.isElementVisible(this.selectors.primaryButton);
    if (buttonExists) {
      await this.click(this.selectors.primaryButton);
      await this.page.waitForTimeout(500); // Brief wait for action to complete
    }
  }

  /**
   * Check if footer is present
   * @returns {Promise<boolean>} True if footer exists
   */
  async hasFooter() {
    return await this.isElementVisible(this.selectors.footer);
  }

  /**
   * Get all visible links on the page
   * @returns {Promise<Array>} Array of link elements
   */
  async getVisibleLinks() {
    return await this.page.$$('a:visible');
  }

  /**
   * Check for any error messages
   * @returns {Promise<boolean>} True if error message is present
   */
  async hasErrorMessage() {
    return await this.isElementVisible(this.selectors.errorMessage);
  }

  /**
   * Check if page is still loading
   * @returns {Promise<boolean>} True if loading indicator is present
   */
  async isLoading() {
    return await this.isElementVisible(this.selectors.loadingSpinner);
  }
}

module.exports = HomePage;
