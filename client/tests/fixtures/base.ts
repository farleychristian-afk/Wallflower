import { test as base, expect } from '@playwright/test';

// Define custom fixtures for common test operations
type TestFixtures = {
  // Add custom fixtures here as needed
};

// Extend the base test with custom fixtures
export const test = base.extend<TestFixtures>({
  // Custom fixtures can be added here
});

export { expect };

// Common test utilities
export class TestUtils {
  /**
   * Wait for the page to be fully loaded and hydrated
   */
  static async waitForPageLoad(page: any) {
    await page.waitForLoadState('networkidle');
    await page.waitForFunction(() => document.readyState === 'complete');
  }

  /**
   * Check for console errors and warnings
   */
  static async checkConsoleErrors(page: any) {
    const errors: string[] = [];
    const warnings: string[] = [];

    page.on('console', (msg: any) => {
      if (msg.type() === 'error') {
        errors.push(msg.text());
      } else if (msg.type() === 'warning') {
        warnings.push(msg.text());
      }
    });

    return { errors, warnings };
  }

  /**
   * Fill form field with validation
   */
  static async fillField(page: any, selector: string, value: string) {
    await page.fill(selector, value);
    await expect(page.locator(selector)).toHaveValue(value);
  }

  /**
   * Navigate and wait for page to be ready
   */
  static async navigateAndWait(page: any, url: string) {
    await page.goto(url);
    await this.waitForPageLoad(page);
  }

  /**
   * Take screenshot with timestamp
   */
  static async takeScreenshot(page: any, name: string) {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    await page.screenshot({ 
      path: `test-results/screenshots/${name}-${timestamp}.png`,
      fullPage: true 
    });
  }
}
