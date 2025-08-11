const { test, expect } = require('@playwright/test');
const HomePage = require('../../page-objects/HomePage');

test.describe('Page Loading Smoke Tests @smoke', () => {
  let homePage;

  test.beforeEach(async ({ page }) => {
    homePage = new HomePage(page);
  });

  test('should load home page successfully', async ({ page }) => {
    // Navigate to home page
    await homePage.navigateToHome();
    
    // Verify page loaded
    expect(await homePage.isPageLoaded()).toBe(true);
    
    // Check page title is not empty
    const title = await homePage.getTitle();
    expect(title).toBeTruthy();
    expect(title.length).toBeGreaterThan(0);
  });

  test('should have basic page structure', async ({ page }) => {
    await homePage.navigateToHome();
    
    // Check for basic HTML structure
    const hasHeader = await homePage.isElementVisible(homePage.selectors.header);
    const hasMainContent = await homePage.isElementVisible(homePage.selectors.mainContent);
    const hasFooter = await homePage.hasFooter();
    
    // At least one of these should be present
    expect(hasHeader || hasMainContent || hasFooter).toBe(true);
  });

  test('should not show loading indicators after page load', async ({ page }) => {
    await homePage.navigateToHome();
    
    // Wait a bit for any loading to complete
    await page.waitForTimeout(2000);
    
    // Check that loading indicators are not present
    const isLoading = await homePage.isLoading();
    expect(isLoading).toBe(false);
  });

  test('should not display error messages on initial load', async ({ page }) => {
    await homePage.navigateToHome();
    
    // Check for error messages
    const hasError = await homePage.hasErrorMessage();
    expect(hasError).toBe(false);
  });

  test('should respond within reasonable time', async ({ page }) => {
    const startTime = Date.now();
    
    await homePage.navigateToHome();
    
    const loadTime = Date.now() - startTime;
    
    // Page should load within 10 seconds
    expect(loadTime).toBeLessThan(10000);
  });

  test('should have accessible content', async ({ page }) => {
    await homePage.navigateToHome();
    
    // Check that page has some visible text content
    const bodyText = await page.textContent('body');
    expect(bodyText).toBeTruthy();
    expect(bodyText.trim().length).toBeGreaterThan(0);
  });

  test('should handle page refresh correctly', async ({ page }) => {
    await homePage.navigateToHome();
    
    // Verify initial load
    expect(await homePage.isPageLoaded()).toBe(true);
    
    // Refresh the page
    await page.reload();
    await homePage.waitForPageLoad();
    
    // Verify page still works after refresh
    expect(await homePage.isPageLoaded()).toBe(true);
    
    // Should not show errors after refresh
    const hasError = await homePage.hasErrorMessage();
    expect(hasError).toBe(false);
  });
});
