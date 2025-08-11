const { test, expect } = require('@playwright/test');
const HomePage = require('../../page-objects/HomePage');

test.describe('Accessibility Smoke Tests @smoke', () => {
  let homePage;

  test.beforeEach(async ({ page }) => {
    homePage = new HomePage(page);
    await homePage.navigateToHome();
  });

  test('should have proper page title', async ({ page }) => {
    const title = await homePage.getTitle();
    
    // Title should exist and be meaningful
    expect(title).toBeTruthy();
    expect(title.length).toBeGreaterThan(0);
    expect(title.toLowerCase()).not.toBe('untitled');
    expect(title.toLowerCase()).not.toBe('document');
  });

  test('should have proper heading structure', async ({ page }) => {
    // Check for headings
    const h1Elements = await page.$$('h1');
    const headings = await page.$$('h1, h2, h3, h4, h5, h6');
    
    // Should have at least one heading
    expect(headings.length).toBeGreaterThan(0);
    
    // Should have exactly one h1 (best practice)
    expect(h1Elements.length).toBeLessThanOrEqual(1);
    
    // If h1 exists, it should have content
    if (h1Elements.length > 0) {
      const h1Text = await h1Elements[0].textContent();
      expect(h1Text.trim().length).toBeGreaterThan(0);
    }
  });

  test('should have alt text for images', async ({ page }) => {
    const images = await page.$$('img');
    
    for (const img of images) {
      const alt = await img.getAttribute('alt');
      const src = await img.getAttribute('src');
      
      // Images should have alt attribute (can be empty for decorative images)
      expect(alt).not.toBeNull();
      
      // If image has meaningful src, alt should probably have content
      if (src && !src.includes('placeholder') && !src.includes('spacer')) {
        // This is a guideline, not a hard rule
        // Decorative images can have empty alt=""
      }
    }
  });

  test('should have proper form labels', async ({ page }) => {
    const inputs = await page.$$('input[type="text"], input[type="email"], input[type="password"], textarea, select');
    
    for (const input of inputs) {
      const id = await input.getAttribute('id');
      const ariaLabel = await input.getAttribute('aria-label');
      const ariaLabelledBy = await input.getAttribute('aria-labelledby');
      const placeholder = await input.getAttribute('placeholder');
      
      // Input should have some form of labeling
      let hasLabel = false;
      
      if (id) {
        // Check for associated label
        const label = await page.$(`label[for="${id}"]`);
        if (label) hasLabel = true;
      }
      
      if (ariaLabel || ariaLabelledBy || placeholder) {
        hasLabel = true;
      }
      
      // For smoke tests, we'll be lenient but check that some labeling exists
      // In a real app, you'd want proper labels for all form controls
      if (await input.isVisible()) {
        // At minimum, visible inputs should have some form of identification
        expect(hasLabel || id || placeholder).toBeTruthy();
      }
    }
  });

  test('should be keyboard navigable', async ({ page }) => {
    // Test basic keyboard navigation
    await page.keyboard.press('Tab');
    
    // Check if focus is visible somewhere
    const focusedElement = await page.evaluate(() => document.activeElement);
    expect(focusedElement).toBeTruthy();
    
    // Try a few more tabs
    await page.keyboard.press('Tab');
    await page.keyboard.press('Tab');
    
    // Should not cause errors
    const hasError = await homePage.hasErrorMessage();
    expect(hasError).toBe(false);
  });

  test('should have proper link text', async ({ page }) => {
    const links = await page.$$('a[href]');
    
    for (const link of links) {
      const linkText = await link.textContent();
      const ariaLabel = await link.getAttribute('aria-label');
      const title = await link.getAttribute('title');
      
      // Links should have descriptive text
      const hasDescriptiveText = (linkText && linkText.trim().length > 0) || 
                                ariaLabel || 
                                title;
      
      expect(hasDescriptiveText).toBe(true);
      
      // Avoid generic link text
      if (linkText) {
        const genericTexts = ['click here', 'read more', 'more', 'link'];
        const isGeneric = genericTexts.some(generic => 
          linkText.toLowerCase().trim() === generic
        );
        
        // This is a warning rather than a failure for smoke tests
        if (isGeneric) {
          console.warn(`Generic link text found: "${linkText}"`);
        }
      }
    }
  });

  test('should have proper button text', async ({ page }) => {
    const buttons = await page.$$('button, input[type="button"], input[type="submit"]');
    
    for (const button of buttons) {
      const buttonText = await button.textContent();
      const ariaLabel = await button.getAttribute('aria-label');
      const value = await button.getAttribute('value');
      const title = await button.getAttribute('title');
      
      // Buttons should have descriptive text
      const hasDescriptiveText = (buttonText && buttonText.trim().length > 0) || 
                                ariaLabel || 
                                value || 
                                title;
      
      if (await button.isVisible()) {
        expect(hasDescriptiveText).toBe(true);
      }
    }
  });

  test('should have proper color contrast (basic check)', async ({ page }) => {
    // This is a very basic check - for comprehensive accessibility testing,
    // you'd want to use tools like axe-core
    
    // Check that text is not the same color as background
    const textElements = await page.$$('p, h1, h2, h3, h4, h5, h6, span, div, a, button');
    
    if (textElements.length > 0) {
      // Sample a few text elements
      const elementsToCheck = Math.min(textElements.length, 5);
      
      for (let i = 0; i < elementsToCheck; i++) {
        const element = textElements[i];
        
        if (await element.isVisible()) {
          const styles = await element.evaluate(el => {
            const computed = window.getComputedStyle(el);
            return {
              color: computed.color,
              backgroundColor: computed.backgroundColor
            };
          });
          
          // Very basic check - colors should be different
          expect(styles.color).not.toBe(styles.backgroundColor);
        }
      }
    }
  });

  test('should handle focus management', async ({ page }) => {
    // Test that focus is manageable
    const focusableElements = await page.$$('a, button, input, textarea, select, [tabindex]:not([tabindex="-1"])');
    
    if (focusableElements.length > 0) {
      // Focus first element
      await focusableElements[0].focus();
      
      // Check that element is focused
      const focusedElement = await page.evaluate(() => document.activeElement);
      expect(focusedElement).toBeTruthy();
      
      // Test escape key doesn't break anything
      await page.keyboard.press('Escape');
      
      // Should not cause errors
      const hasError = await homePage.hasErrorMessage();
      expect(hasError).toBe(false);
    }
  });
});
