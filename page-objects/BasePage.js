/**
 * Base Page Object Model
 * Contains common functionality shared across all pages
 */
class BasePage {
  constructor(page) {
    this.page = page;
  }

  /**
   * Navigate to a specific URL
   * @param {string} url - The URL to navigate to
   */
  async goto(url) {
    await this.page.goto(url);
  }

  /**
   * Wait for page to load completely
   */
  async waitForPageLoad() {
    await this.page.waitForLoadState('networkidle');
  }

  /**
   * Get page title
   * @returns {Promise<string>} Page title
   */
  async getTitle() {
    return await this.page.title();
  }

  /**
   * Take a screenshot
   * @param {string} name - Screenshot name
   */
  async takeScreenshot(name) {
    await this.page.screenshot({ path: `test-results/${name}.png` });
  }

  /**
   * Wait for element to be visible
   * @param {string} selector - Element selector
   * @param {number} timeout - Timeout in milliseconds
   */
  async waitForElement(selector, timeout = 10000) {
    await this.page.waitForSelector(selector, { state: 'visible', timeout });
  }

  /**
   * Check if element exists and is visible
   * @param {string} selector - Element selector
   * @returns {Promise<boolean>} True if element is visible
   */
  async isElementVisible(selector) {
    try {
      await this.page.waitForSelector(selector, { state: 'visible', timeout: 5000 });
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Click on an element
   * @param {string} selector - Element selector
   */
  async click(selector) {
    await this.page.click(selector);
  }

  /**
   * Fill input field
   * @param {string} selector - Input selector
   * @param {string} value - Value to fill
   */
  async fill(selector, value) {
    await this.page.fill(selector, value);
  }

  /**
   * Get text content of an element
   * @param {string} selector - Element selector
   * @returns {Promise<string>} Text content
   */
  async getText(selector) {
    return await this.page.textContent(selector);
  }

  /**
   * Check if page contains specific text
   * @param {string} text - Text to search for
   * @returns {Promise<boolean>} True if text is found
   */
  async hasText(text) {
    try {
      await this.page.waitForSelector(`text=${text}`, { timeout: 5000 });
      return true;
    } catch {
      return false;
    }
  }
}

module.exports = BasePage;
