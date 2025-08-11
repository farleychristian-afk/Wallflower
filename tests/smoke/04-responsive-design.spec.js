const { test, expect } = require('@playwright/test');
const HomePage = require('../../page-objects/HomePage');

test.describe('Responsive Design Smoke Tests @smoke', () => {
  let homePage;

  test.beforeEach(async ({ page }) => {
    homePage = new HomePage(page);
  });

  test('should work on desktop viewport', async ({ page }) => {
    // Set desktop viewport
    await page.setViewportSize({ width: 1920, height: 1080 });
    await homePage.navigateToHome();
    
    // Verify page loads and is functional
    expect(await homePage.isPageLoaded()).toBe(true);
    
    // Check that content is visible
    const bodyText = await page.textContent('body');
    expect(bodyText.trim().length).toBeGreaterThan(0);
  });

  test('should work on tablet viewport', async ({ page }) => {
    // Set tablet viewport
    await page.setViewportSize({ width: 768, height: 1024 });
    await homePage.navigateToHome();
    
    // Verify page loads and is functional
    expect(await homePage.isPageLoaded()).toBe(true);
    
    // Check that navigation still works
    const hasNavigation = await homePage.isNavigationWorking();
    const hasMenuButton = await homePage.isElementVisible(homePage.selectors.menuButton);
    
    // Either navigation or menu button should be present
    expect(hasNavigation || hasMenuButton).toBe(true);
  });

  test('should work on mobile viewport', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    await homePage.navigateToHome();
    
    // Verify page loads and is functional
    expect(await homePage.isPageLoaded()).toBe(true);
    
    // Check that content is still accessible
    const bodyText = await page.textContent('body');
    expect(bodyText.trim().length).toBeGreaterThan(0);
    
    // Mobile often has hamburger menu
    const hasMenuButton = await homePage.isElementVisible(homePage.selectors.menuButton);
    if (hasMenuButton) {
      // Test menu button functionality
      await homePage.click(homePage.selectors.menuButton);
      await page.waitForTimeout(500);
    }
  });

  test('should handle viewport changes gracefully', async ({ page }) => {
    // Start with desktop
    await page.setViewportSize({ width: 1920, height: 1080 });
    await homePage.navigateToHome();
    
    expect(await homePage.isPageLoaded()).toBe(true);
    
    // Change to mobile
    await page.setViewportSize({ width: 375, height: 667 });
    await page.waitForTimeout(1000);
    
    // Page should still be functional
    expect(await homePage.isPageLoaded()).toBe(true);
    
    // Change back to desktop
    await page.setViewportSize({ width: 1920, height: 1080 });
    await page.waitForTimeout(1000);
    
    // Should still work
    expect(await homePage.isPageLoaded()).toBe(true);
  });

  test('should not have horizontal scroll on mobile', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    await homePage.navigateToHome();
    
    // Check for horizontal overflow
    const scrollWidth = await page.evaluate(() => document.body.scrollWidth);
    const clientWidth = await page.evaluate(() => document.body.clientWidth);
    
    // Allow small differences due to scrollbars
    expect(scrollWidth - clientWidth).toBeLessThanOrEqual(20);
  });

  test('should maintain functionality across different screen sizes', async ({ page }) => {
    const viewports = [
      { width: 1920, height: 1080 }, // Desktop
      { width: 1024, height: 768 },  // Tablet landscape
      { width: 768, height: 1024 },  // Tablet portrait
      { width: 375, height: 667 }    // Mobile
    ];
    
    for (const viewport of viewports) {
      await page.setViewportSize(viewport);
      await homePage.navigateToHome();
      
      // Basic functionality should work on all viewports
      expect(await homePage.isPageLoaded()).toBe(true);
      
      // Should not have errors
      const hasError = await homePage.hasErrorMessage();
      expect(hasError).toBe(false);
      
      // Content should be present
      const bodyText = await page.textContent('body');
      expect(bodyText.trim().length).toBeGreaterThan(0);
    }
  });

  test('should handle touch interactions on mobile', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    await homePage.navigateToHome();
    
    // Test touch interactions if buttons are present
    const buttons = await page.$$('button, a, [role="button"]');
    
    if (buttons.length > 0) {
      const button = buttons[0];
      
      if (await button.isVisible()) {
        // Simulate touch tap
        await button.tap();
        await page.waitForTimeout(500);
        
        // Should not cause errors
        const hasError = await homePage.hasErrorMessage();
        expect(hasError).toBe(false);
      }
    }
  });
});
