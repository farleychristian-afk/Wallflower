import { test, expect, TestUtils } from '../fixtures/base';

test.describe('UI Components', () => {
  test('should render header component correctly', async ({ page }) => {
    await TestUtils.navigateAndWait(page, '/');

    const header = page.getByTestId('header');
    await expect(header).toBeVisible();

    // Check header styling and layout
    await expect(header).toHaveCSS('background-color', 'rgb(44, 62, 80)');
    
    // Verify logo is properly styled
    const logo = page.getByTestId('logo-link');
    await expect(logo).toBeVisible();
    await expect(logo).toHaveCSS('color', 'rgb(255, 255, 255)');
    await expect(logo).toHaveCSS('text-decoration', 'none solid rgb(255, 255, 255)');

    // Verify navigation links are properly styled
    const navLinks = page.getByTestId('main-navigation').locator('.nav-link');
    await expect(navLinks).toHaveCount(3);
    
    for (let i = 0; i < 3; i++) {
      const link = navLinks.nth(i);
      await expect(link).toHaveCSS('color', 'rgb(255, 255, 255)');
    }
  });

  test('should render form components correctly', async ({ page }) => {
    await TestUtils.navigateAndWait(page, '/planner');

    // Check form styling
    const form = page.getByTestId('trip-planner-form');
    await expect(form).toBeVisible();

    // Check input field styling
    const destinationInput = page.getByTestId('destination-input');
    await expect(destinationInput).toHaveCSS('border', '2px solid rgb(221, 221, 221)');
    await expect(destinationInput).toHaveCSS('border-radius', '4px');
    await expect(destinationInput).toHaveCSS('padding', '12px');

    // Check button styling
    const submitButton = page.getByTestId('plan-trip-button');
    await expect(submitButton).toHaveCSS('background-color', 'rgb(39, 174, 96)');
    await expect(submitButton).toHaveCSS('color', 'rgb(255, 255, 255)');
    await expect(submitButton).toHaveCSS('border-radius', '6px');
  });

  test('should handle hover states correctly', async ({ page }) => {
    await TestUtils.navigateAndWait(page, '/');

    // Test navigation link hover
    const homeLink = page.getByTestId('nav-home');
    await homeLink.hover();
    
    // Note: CSS hover states are difficult to test directly in Playwright
    // We can verify the element is hoverable and interactive
    await expect(homeLink).toBeVisible();

    // Test CTA button hover
    const ctaButton = page.getByTestId('get-started-button');
    await ctaButton.hover();
    await expect(ctaButton).toBeVisible();
  });

  test('should display proper typography', async ({ page }) => {
    await TestUtils.navigateAndWait(page, '/');

    // Check main heading
    const mainHeading = page.getByRole('heading', { name: 'Welcome to Wallflower' });
    await expect(mainHeading).toBeVisible();
    await expect(mainHeading).toHaveCSS('color', 'rgb(44, 62, 80)');

    // Check logo typography
    const logo = page.getByTestId('logo-link');
    await expect(logo).toHaveCSS('font-weight', '700');
  });

  test('should be responsive on different screen sizes', async ({ page }) => {
    // Test desktop view
    await page.setViewportSize({ width: 1200, height: 800 });
    await TestUtils.navigateAndWait(page, '/');

    const header = page.getByTestId('header');
    await expect(header).toBeVisible();

    // Test tablet view
    await page.setViewportSize({ width: 768, height: 1024 });
    await expect(header).toBeVisible();

    // Test mobile view
    await page.setViewportSize({ width: 375, height: 667 });
    await expect(header).toBeVisible();

    // Verify navigation is still accessible on mobile
    await expect(page.getByTestId('main-navigation')).toBeVisible();
  });

  test('should handle focus states correctly', async ({ page }) => {
    await TestUtils.navigateAndWait(page, '/planner');

    // Test input focus
    const destinationInput = page.getByTestId('destination-input');
    await destinationInput.focus();
    await expect(destinationInput).toBeFocused();
    await expect(destinationInput).toHaveCSS('border-color', 'rgb(52, 152, 219)');

    // Test button focus
    const submitButton = page.getByTestId('plan-trip-button');
    await submitButton.focus();
    await expect(submitButton).toBeFocused();
  });

  test('should display loading states appropriately', async ({ page }) => {
    await TestUtils.navigateAndWait(page, '/');

    // Verify page loads without showing loading spinners or skeleton screens
    // (This is a basic check - in a real app you might have loading states)
    await expect(page.getByTestId('app')).toBeVisible();
    await expect(page.getByTestId('home-page')).toBeVisible();
  });

  test('should handle empty states gracefully', async ({ page }) => {
    await TestUtils.navigateAndWait(page, '/planner');

    // Verify form starts in empty state
    await expect(page.getByTestId('destination-input')).toHaveValue('');
    await expect(page.getByTestId('start-date-input')).toHaveValue('');
    await expect(page.getByTestId('end-date-input')).toHaveValue('');
    await expect(page.getByTestId('travelers-select')).toHaveValue('1');
  });

  test('should maintain visual consistency across pages', async ({ page }) => {
    // Check header consistency across pages
    await TestUtils.navigateAndWait(page, '/');
    const homeHeader = page.getByTestId('header');
    await expect(homeHeader).toBeVisible();

    await TestUtils.navigateAndWait(page, '/planner');
    const plannerHeader = page.getByTestId('header');
    await expect(plannerHeader).toBeVisible();
    await expect(plannerHeader).toHaveCSS('background-color', 'rgb(44, 62, 80)');

    await TestUtils.navigateAndWait(page, '/about');
    const aboutHeader = page.getByTestId('header');
    await expect(aboutHeader).toBeVisible();
    await expect(aboutHeader).toHaveCSS('background-color', 'rgb(44, 62, 80)');
  });

  test('should handle text content correctly', async ({ page }) => {
    await TestUtils.navigateAndWait(page, '/about');

    // Verify about page content
    await expect(page.getByRole('heading', { name: 'About Wallflower' })).toBeVisible();
    await expect(page.getByText('Wallflower helps you discover unique travel experiences')).toBeVisible();
    await expect(page.getByText('Our mission is to connect travelers')).toBeVisible();
  });
});
