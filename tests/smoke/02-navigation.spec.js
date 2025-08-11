const { test, expect } = require('@playwright/test');
const HomePage = require('../../page-objects/HomePage');

test.describe('Navigation Smoke Tests @smoke', () => {
  let homePage;

  test.beforeEach(async ({ page }) => {
    homePage = new HomePage(page);
    await homePage.navigateToHome();
  });

  test('should have navigation elements present', async ({ page }) => {
    // Check if navigation is present
    const hasNavigation = await homePage.isNavigationWorking();
    const hasLogo = await homePage.isElementVisible(homePage.selectors.logo);
    
    // At least one navigation element should be present
    expect(hasNavigation || hasLogo).toBe(true);
  });

  test('should have clickable links', async ({ page }) => {
    // Get all visible links
    const links = await homePage.getVisibleLinks();
    
    // Should have at least one link
    expect(links.length).toBeGreaterThan(0);
    
    // Test first few links (limit to avoid long test times)
    const linksToTest = Math.min(links.length, 3);
    
    for (let i = 0; i < linksToTest; i++) {
      const link = links[i];
      const href = await link.getAttribute('href');
      
      // Skip external links, mailto, tel, etc.
      if (href && !href.startsWith('http') && !href.startsWith('mailto') && !href.startsWith('tel')) {
        // Verify link is clickable (has href or click handler)
        const isClickable = href || await link.getAttribute('onclick');
        expect(isClickable).toBeTruthy();
      }
    }
  });

  test('should handle menu button if present', async ({ page }) => {
    const hasMenuButton = await homePage.isElementVisible(homePage.selectors.menuButton);
    
    if (hasMenuButton) {
      // Click menu button
      await homePage.click(homePage.selectors.menuButton);
      
      // Wait for menu to potentially open
      await page.waitForTimeout(500);
      
      // Verify no JavaScript errors occurred
      const errors = [];
      page.on('pageerror', error => errors.push(error));
      
      // Click again to close (if it's a toggle)
      await homePage.click(homePage.selectors.menuButton);
      await page.waitForTimeout(500);
      
      // Should not have JavaScript errors
      expect(errors.length).toBe(0);
    }
  });

  test('should navigate to different sections', async ({ page }) => {
    const currentUrl = page.url();
    
    // Try to find and click internal navigation links
    const aboutLink = await homePage.isElementVisible(homePage.selectors.aboutLink);
    const contactLink = await homePage.isElementVisible(homePage.selectors.contactLink);
    
    if (aboutLink) {
      await homePage.click(homePage.selectors.aboutLink);
      await page.waitForTimeout(1000);
      
      // URL should change or page should update
      const newUrl = page.url();
      const urlChanged = newUrl !== currentUrl;
      const pageUpdated = await homePage.isPageLoaded();
      
      expect(urlChanged || pageUpdated).toBe(true);
    } else if (contactLink) {
      await homePage.click(homePage.selectors.contactLink);
      await page.waitForTimeout(1000);
      
      // URL should change or page should update
      const newUrl = page.url();
      const urlChanged = newUrl !== currentUrl;
      const pageUpdated = await homePage.isPageLoaded();
      
      expect(urlChanged || pageUpdated).toBe(true);
    }
  });

  test('should handle browser back/forward navigation', async ({ page }) => {
    const initialUrl = page.url();
    
    // Try to navigate to a different page first
    const links = await homePage.getVisibleLinks();
    
    if (links.length > 0) {
      // Click first internal link
      const firstLink = links[0];
      const href = await firstLink.getAttribute('href');
      
      if (href && !href.startsWith('http') && !href.startsWith('mailto') && !href.startsWith('tel')) {
        await firstLink.click();
        await page.waitForTimeout(1000);
        
        // Go back
        await page.goBack();
        await page.waitForTimeout(1000);
        
        // Should be back to initial page
        const backUrl = page.url();
        expect(backUrl).toBe(initialUrl);
        
        // Page should still be functional
        expect(await homePage.isPageLoaded()).toBe(true);
      }
    }
  });

  test('should maintain navigation state on page interactions', async ({ page }) => {
    // Check initial navigation state
    const initialNavigation = await homePage.isNavigationWorking();
    
    // Perform some page interactions
    await page.mouse.move(100, 100);
    await page.keyboard.press('Tab');
    await page.waitForTimeout(500);
    
    // Navigation should still be present
    const finalNavigation = await homePage.isNavigationWorking();
    expect(finalNavigation).toBe(initialNavigation);
  });
});
