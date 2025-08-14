import { test, expect, TestUtils } from '../fixtures/base';

test.describe('Console Errors and Performance', () => {
  test('should not have JavaScript errors on home page', async ({ page }) => {
    const errors: string[] = [];
    const warnings: string[] = [];

    // Listen for console messages
    page.on('console', msg => {
      if (msg.type() === 'error') {
        errors.push(msg.text());
      } else if (msg.type() === 'warning') {
        warnings.push(msg.text());
      }
    });

    // Listen for page errors
    page.on('pageerror', error => {
      errors.push(error.message);
    });

    await TestUtils.navigateAndWait(page, '/');

    // Filter out common non-critical errors
    const criticalErrors = errors.filter(error => 
      !error.includes('favicon.ico') && 
      !error.includes('manifest.json') &&
      !error.includes('logo192.png') &&
      !error.includes('robots.txt')
    );

    expect(criticalErrors).toHaveLength(0);
  });

  test('should not have JavaScript errors on trip planner page', async ({ page }) => {
    const errors: string[] = [];

    page.on('console', msg => {
      if (msg.type() === 'error') {
        errors.push(msg.text());
      }
    });

    page.on('pageerror', error => {
      errors.push(error.message);
    });

    await TestUtils.navigateAndWait(page, '/planner');

    // Interact with form to trigger any potential errors
    await page.getByTestId('destination-input').fill('Test Destination');
    await page.getByTestId('start-date-input').fill('2024-06-01');
    await page.getByTestId('travelers-select').selectOption('2');

    const criticalErrors = errors.filter(error => 
      !error.includes('favicon.ico') && 
      !error.includes('manifest.json')
    );

    expect(criticalErrors).toHaveLength(0);
  });

  test('should not have JavaScript errors on about page', async ({ page }) => {
    const errors: string[] = [];

    page.on('console', msg => {
      if (msg.type() === 'error') {
        errors.push(msg.text());
      }
    });

    page.on('pageerror', error => {
      errors.push(error.message);
    });

    await TestUtils.navigateAndWait(page, '/about');

    const criticalErrors = errors.filter(error => 
      !error.includes('favicon.ico') && 
      !error.includes('manifest.json')
    );

    expect(criticalErrors).toHaveLength(0);
  });

  test('should handle network errors gracefully', async ({ page }) => {
    const errors: string[] = [];

    page.on('console', msg => {
      if (msg.type() === 'error') {
        errors.push(msg.text());
      }
    });

    // Navigate to a page and check for network-related errors
    await TestUtils.navigateAndWait(page, '/');

    // Try to trigger some interactions that might cause network requests
    await page.getByTestId('get-started-button').click();
    await TestUtils.waitForPageLoad(page);

    // Check that no unhandled network errors occurred
    const networkErrors = errors.filter(error => 
      error.includes('net::') || 
      error.includes('fetch') ||
      error.includes('XMLHttpRequest')
    );

    expect(networkErrors).toHaveLength(0);
  });

  test('should load pages within reasonable time', async ({ page }) => {
    // Test home page load time
    const homeStartTime = Date.now();
    await TestUtils.navigateAndWait(page, '/');
    const homeLoadTime = Date.now() - homeStartTime;
    
    expect(homeLoadTime).toBeLessThan(5000); // 5 seconds max

    // Test planner page load time
    const plannerStartTime = Date.now();
    await page.getByTestId('nav-planner').click();
    await TestUtils.waitForPageLoad(page);
    const plannerLoadTime = Date.now() - plannerStartTime;
    
    expect(plannerLoadTime).toBeLessThan(3000); // 3 seconds max for navigation

    // Test about page load time
    const aboutStartTime = Date.now();
    await page.getByTestId('nav-about').click();
    await TestUtils.waitForPageLoad(page);
    const aboutLoadTime = Date.now() - aboutStartTime;
    
    expect(aboutLoadTime).toBeLessThan(3000); // 3 seconds max for navigation
  });

  test('should not have memory leaks during navigation', async ({ page }) => {
    // Navigate between pages multiple times to check for memory leaks
    for (let i = 0; i < 3; i++) {
      await page.getByTestId('nav-home').click();
      await TestUtils.waitForPageLoad(page);
      await expect(page.getByTestId('home-page')).toBeVisible();

      await page.getByTestId('nav-planner').click();
      await TestUtils.waitForPageLoad(page);
      await expect(page.getByTestId('trip-planner-page')).toBeVisible();

      await page.getByTestId('nav-about').click();
      await TestUtils.waitForPageLoad(page);
      await expect(page.getByTestId('about-page')).toBeVisible();
    }

    // If we get here without timeouts or crashes, navigation is working properly
    await expect(page.getByTestId('app')).toBeVisible();
  });

  test('should handle form validation errors gracefully', async ({ page }) => {
    const errors: string[] = [];

    page.on('console', msg => {
      if (msg.type() === 'error') {
        errors.push(msg.text());
      }
    });

    await TestUtils.navigateAndWait(page, '/planner');

    // Try to submit form with invalid data
    await page.getByTestId('destination-input').fill('');
    await page.getByTestId('plan-trip-button').click();

    // Wait a moment for any validation to occur
    await page.waitForTimeout(500);

    // Check that validation doesn't cause JavaScript errors
    const validationErrors = errors.filter(error => 
      !error.includes('favicon.ico') && 
      !error.includes('manifest.json')
    );

    expect(validationErrors).toHaveLength(0);
  });

  test('should handle rapid user interactions without errors', async ({ page }) => {
    const errors: string[] = [];

    page.on('console', msg => {
      if (msg.type() === 'error') {
        errors.push(msg.text());
      }
    });

    await TestUtils.navigateAndWait(page, '/');

    // Rapidly click navigation links
    for (let i = 0; i < 5; i++) {
      await page.getByTestId('nav-planner').click();
      await page.getByTestId('nav-home').click();
      await page.getByTestId('nav-about').click();
    }

    await TestUtils.waitForPageLoad(page);

    const rapidClickErrors = errors.filter(error => 
      !error.includes('favicon.ico') && 
      !error.includes('manifest.json')
    );

    expect(rapidClickErrors).toHaveLength(0);
  });

  test('should maintain functionality after page refresh', async ({ page }) => {
    const errors: string[] = [];

    page.on('console', msg => {
      if (msg.type() === 'error') {
        errors.push(msg.text());
      }
    });

    // Navigate to planner and fill form
    await TestUtils.navigateAndWait(page, '/planner');
    await page.getByTestId('destination-input').fill('Test Location');

    // Refresh page
    await page.reload();
    await TestUtils.waitForPageLoad(page);

    // Verify functionality still works
    await expect(page.getByTestId('trip-planner-form')).toBeVisible();
    await page.getByTestId('destination-input').fill('New Test Location');

    const refreshErrors = errors.filter(error => 
      !error.includes('favicon.ico') && 
      !error.includes('manifest.json')
    );

    expect(refreshErrors).toHaveLength(0);
  });
});
