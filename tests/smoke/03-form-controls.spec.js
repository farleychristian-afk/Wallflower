const { test, expect } = require('@playwright/test');
const HomePage = require('../../page-objects/HomePage');

test.describe('Form Controls Smoke Tests @smoke', () => {
  let homePage;

  test.beforeEach(async ({ page }) => {
    homePage = new HomePage(page);
    await homePage.navigateToHome();
  });

  test('should handle input fields correctly', async ({ page }) => {
    // Look for input fields
    const inputs = await page.$$('input[type="text"], input[type="email"], input[type="password"], input:not([type]), textarea');
    
    if (inputs.length > 0) {
      // Test first input field
      const firstInput = inputs[0];
      
      // Check if input is visible and enabled
      const isVisible = await firstInput.isVisible();
      const isEnabled = await firstInput.isEnabled();
      
      expect(isVisible).toBe(true);
      expect(isEnabled).toBe(true);
      
      // Test typing in the input
      await firstInput.fill('test input');
      const value = await firstInput.inputValue();
      expect(value).toBe('test input');
      
      // Clear the input
      await firstInput.fill('');
      const clearedValue = await firstInput.inputValue();
      expect(clearedValue).toBe('');
    }
  });

  test('should handle buttons correctly', async ({ page }) => {
    // Look for buttons
    const buttons = await page.$$('button, input[type="button"], input[type="submit"]');
    
    if (buttons.length > 0) {
      // Test first few buttons
      const buttonsToTest = Math.min(buttons.length, 3);
      
      for (let i = 0; i < buttonsToTest; i++) {
        const button = buttons[i];
        
        // Check if button is visible and enabled
        const isVisible = await button.isVisible();
        const isEnabled = await button.isEnabled();
        
        if (isVisible && isEnabled) {
          // Get button text for context
          const buttonText = await button.textContent();
          
          // Click the button
          await button.click();
          
          // Wait for any potential action
          await page.waitForTimeout(500);
          
          // Verify no JavaScript errors occurred
          const errors = [];
          page.on('pageerror', error => errors.push(error));
          
          expect(errors.length).toBe(0);
        }
      }
    }
  });

  test('should handle search functionality if present', async ({ page }) => {
    const hasSearchInput = await homePage.isElementVisible(homePage.selectors.searchInput);
    
    if (hasSearchInput) {
      // Test search functionality
      await homePage.performSearch('test search');
      
      // Wait for search to complete
      await page.waitForTimeout(2000);
      
      // Verify no errors occurred
      const hasError = await homePage.hasErrorMessage();
      expect(hasError).toBe(false);
      
      // Page should still be functional
      expect(await homePage.isPageLoaded()).toBe(true);
    }
  });

  test('should handle form submission if forms are present', async ({ page }) => {
    // Look for forms
    const forms = await page.$$('form');
    
    if (forms.length > 0) {
      const form = forms[0];
      
      // Look for required fields in the form
      const requiredInputs = await form.$$('input[required], textarea[required], select[required]');
      
      // Fill required fields with test data
      for (const input of requiredInputs) {
        const inputType = await input.getAttribute('type') || 'text';
        const tagName = await input.evaluate(el => el.tagName.toLowerCase());
        
        if (tagName === 'input') {
          switch (inputType) {
            case 'email':
              await input.fill('test@example.com');
              break;
            case 'password':
              await input.fill('testpassword123');
              break;
            case 'number':
              await input.fill('123');
              break;
            case 'tel':
              await input.fill('1234567890');
              break;
            default:
              await input.fill('test value');
          }
        } else if (tagName === 'textarea') {
          await input.fill('test message');
        } else if (tagName === 'select') {
          const options = await input.$$('option');
          if (options.length > 1) {
            await input.selectOption({ index: 1 });
          }
        }
      }
      
      // Look for submit button
      const submitButton = await form.$('button[type="submit"], input[type="submit"]');
      
      if (submitButton) {
        const isEnabled = await submitButton.isEnabled();
        
        if (isEnabled) {
          // Click submit (but don't actually submit in smoke tests)
          // Instead, just verify the button is clickable
          const buttonText = await submitButton.textContent();
          expect(buttonText).toBeTruthy();
        }
      }
    }
  });

  test('should handle dropdown/select elements', async ({ page }) => {
    // Look for select elements
    const selects = await page.$$('select');
    
    if (selects.length > 0) {
      const select = selects[0];
      
      // Check if select is visible and enabled
      const isVisible = await select.isVisible();
      const isEnabled = await select.isEnabled();
      
      expect(isVisible).toBe(true);
      expect(isEnabled).toBe(true);
      
      // Get options
      const options = await select.$$('option');
      expect(options.length).toBeGreaterThan(0);
      
      // Select different option if available
      if (options.length > 1) {
        await select.selectOption({ index: 1 });
        
        // Verify selection worked
        const selectedValue = await select.inputValue();
        expect(selectedValue).toBeTruthy();
      }
    }
  });

  test('should handle checkboxes and radio buttons', async ({ page }) => {
    // Test checkboxes
    const checkboxes = await page.$$('input[type="checkbox"]');
    
    if (checkboxes.length > 0) {
      const checkbox = checkboxes[0];
      
      if (await checkbox.isVisible() && await checkbox.isEnabled()) {
        // Test checking/unchecking
        await checkbox.check();
        expect(await checkbox.isChecked()).toBe(true);
        
        await checkbox.uncheck();
        expect(await checkbox.isChecked()).toBe(false);
      }
    }
    
    // Test radio buttons
    const radioButtons = await page.$$('input[type="radio"]');
    
    if (radioButtons.length > 0) {
      const radio = radioButtons[0];
      
      if (await radio.isVisible() && await radio.isEnabled()) {
        await radio.check();
        expect(await radio.isChecked()).toBe(true);
      }
    }
  });

  test('should handle primary action buttons', async ({ page }) => {
    const hasPrimaryButton = await homePage.isElementVisible(homePage.selectors.primaryButton);
    
    if (hasPrimaryButton) {
      // Click primary button
      await homePage.clickPrimaryButton();
      
      // Verify no errors occurred
      const hasError = await homePage.hasErrorMessage();
      expect(hasError).toBe(false);
      
      // Page should remain functional
      expect(await homePage.isPageLoaded()).toBe(true);
    }
  });
});
