import { test, expect, TestUtils } from '../fixtures/base';

test.describe('Application Loading', () => {
  test('should load the application successfully', async ({ page }) => {
    // Track console errors
    const { errors } = await TestUtils.checkConsoleErrors(page);

    // Navigate to the application
    await TestUtils.navigateAndWait(page, '/');

    // Verify the page title
    await expect(page).toHaveTitle(/Wallflower/);

    // Verify the main app container is present
    await expect(page.getByTestId('app')).toBeVisible();

    // Verify the header is present
    await expect(page.getByTestId('header')).toBeVisible();

    // Verify the logo is present and clickable
    await expect(page.getByTestId('logo-link')).toBeVisible();
    await expect(page.getByTestId('logo-link')).toHaveText('Wallflower');

    // Verify main content area is present
    await expect(page.locator('.main-content')).toBeVisible();

    // Check that no critical JavaScript errors occurred
    expect(errors.filter(error => 
      !error.includes('favicon.ico') && 
      !error.includes('manifest.json')
    )).toHaveLength(0);
  });

  test('should display the home page content', async ({ page }) => {
    await TestUtils.navigateAndWait(page, '/');

    // Verify home page is displayed
    await expect(page.getByTestId('home-page')).toBeVisible();

    // Verify welcome message
    await expect(page.getByRole('heading', { name: 'Welcome to Wallflower' })).toBeVisible();

    // Verify description text
    await expect(page.getByText('Your travel planning companion')).toBeVisible();

    // Verify CTA button is present and functional
    const ctaButton = page.getByTestId('get-started-button');
    await expect(ctaButton).toBeVisible();
    await expect(ctaButton).toHaveText('Get Started');
  });

  test('should handle page refresh correctly', async ({ page }) => {
    await TestUtils.navigateAndWait(page, '/');
    
    // Verify initial load
    await expect(page.getByTestId('home-page')).toBeVisible();
    
    // Refresh the page
    await page.reload();
    await TestUtils.waitForPageLoad(page);
    
    // Verify page still works after refresh
    await expect(page.getByTestId('app')).toBeVisible();
    await expect(page.getByTestId('home-page')).toBeVisible();
  });

  test('should be responsive on mobile viewport', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    
    await TestUtils.navigateAndWait(page, '/');

    // Verify app still loads on mobile
    await expect(page.getByTestId('app')).toBeVisible();
    await expect(page.getByTestId('header')).toBeVisible();
    await expect(page.getByTestId('home-page')).toBeVisible();

    // Verify navigation is still accessible
    await expect(page.getByTestId('main-navigation')).toBeVisible();
  });
});
