import { test, expect, TestUtils } from '../fixtures/base';

test.describe('Navigation', () => {
  test('should navigate between pages using header navigation', async ({ page }) => {
    await TestUtils.navigateAndWait(page, '/');

    // Verify we start on home page
    await expect(page.getByTestId('home-page')).toBeVisible();

    // Navigate to Trip Planner
    await page.getByTestId('nav-planner').click();
    await TestUtils.waitForPageLoad(page);
    await expect(page.getByTestId('trip-planner-page')).toBeVisible();
    await expect(page).toHaveURL('/planner');

    // Navigate to About
    await page.getByTestId('nav-about').click();
    await TestUtils.waitForPageLoad(page);
    await expect(page.getByTestId('about-page')).toBeVisible();
    await expect(page).toHaveURL('/about');

    // Navigate back to Home
    await page.getByTestId('nav-home').click();
    await TestUtils.waitForPageLoad(page);
    await expect(page.getByTestId('home-page')).toBeVisible();
    await expect(page).toHaveURL('/');
  });

  test('should navigate using logo link', async ({ page }) => {
    await TestUtils.navigateAndWait(page, '/planner');
    
    // Verify we're on planner page
    await expect(page.getByTestId('trip-planner-page')).toBeVisible();

    // Click logo to go home
    await page.getByTestId('logo-link').click();
    await TestUtils.waitForPageLoad(page);
    
    // Verify we're back on home page
    await expect(page.getByTestId('home-page')).toBeVisible();
    await expect(page).toHaveURL('/');
  });

  test('should navigate using CTA button', async ({ page }) => {
    await TestUtils.navigateAndWait(page, '/');

    // Click the "Get Started" button
    await page.getByTestId('get-started-button').click();
    await TestUtils.waitForPageLoad(page);

    // Verify we're on the trip planner page
    await expect(page.getByTestId('trip-planner-page')).toBeVisible();
    await expect(page).toHaveURL('/planner');
  });

  test('should handle direct URL navigation', async ({ page }) => {
    // Navigate directly to planner
    await TestUtils.navigateAndWait(page, '/planner');
    await expect(page.getByTestId('trip-planner-page')).toBeVisible();

    // Navigate directly to about
    await TestUtils.navigateAndWait(page, '/about');
    await expect(page.getByTestId('about-page')).toBeVisible();

    // Navigate directly to home
    await TestUtils.navigateAndWait(page, '/');
    await expect(page.getByTestId('home-page')).toBeVisible();
  });

  test('should maintain navigation state across page interactions', async ({ page }) => {
    await TestUtils.navigateAndWait(page, '/');

    // Navigate to planner
    await page.getByTestId('nav-planner').click();
    await TestUtils.waitForPageLoad(page);

    // Verify navigation links are still functional
    await expect(page.getByTestId('main-navigation')).toBeVisible();
    await expect(page.getByTestId('nav-home')).toBeVisible();
    await expect(page.getByTestId('nav-planner')).toBeVisible();
    await expect(page.getByTestId('nav-about')).toBeVisible();

    // Test browser back button
    await page.goBack();
    await TestUtils.waitForPageLoad(page);
    await expect(page.getByTestId('home-page')).toBeVisible();

    // Test browser forward button
    await page.goForward();
    await TestUtils.waitForPageLoad(page);
    await expect(page.getByTestId('trip-planner-page')).toBeVisible();
  });

  test('should show active navigation state', async ({ page }) => {
    await TestUtils.navigateAndWait(page, '/');

    // Check that navigation links are present and clickable
    const homeLink = page.getByTestId('nav-home');
    const plannerLink = page.getByTestId('nav-planner');
    const aboutLink = page.getByTestId('nav-about');

    await expect(homeLink).toBeVisible();
    await expect(plannerLink).toBeVisible();
    await expect(aboutLink).toBeVisible();

    // Verify links have proper href attributes
    await expect(homeLink).toHaveAttribute('href', '/');
    await expect(plannerLink).toHaveAttribute('href', '/planner');
    await expect(aboutLink).toHaveAttribute('href', '/about');
  });
});
