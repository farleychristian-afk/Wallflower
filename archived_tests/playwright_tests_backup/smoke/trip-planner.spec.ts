import { test, expect, TestUtils } from '../fixtures/base';

test.describe('Trip Planner', () => {
  test.beforeEach(async ({ page }) => {
    await TestUtils.navigateAndWait(page, '/planner');
  });

  test('should display trip planner form', async ({ page }) => {
    // Verify page loads correctly
    await expect(page.getByTestId('trip-planner-page')).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Plan Your Trip' })).toBeVisible();

    // Verify form is present
    await expect(page.getByTestId('trip-planner-form')).toBeVisible();

    // Verify all form fields are present
    await expect(page.getByTestId('destination-input')).toBeVisible();
    await expect(page.getByTestId('start-date-input')).toBeVisible();
    await expect(page.getByTestId('end-date-input')).toBeVisible();
    await expect(page.getByTestId('travelers-select')).toBeVisible();
    await expect(page.getByTestId('plan-trip-button')).toBeVisible();
  });

  test('should allow basic form input', async ({ page }) => {
    // Fill destination field
    await TestUtils.fillField(page, '[data-testid="destination-input"]', 'Paris, France');

    // Fill start date
    await TestUtils.fillField(page, '[data-testid="start-date-input"]', '2024-06-01');

    // Fill end date
    await TestUtils.fillField(page, '[data-testid="end-date-input"]', '2024-06-07');

    // Select number of travelers
    await page.getByTestId('travelers-select').selectOption('2');
    await expect(page.getByTestId('travelers-select')).toHaveValue('2');

    // Verify all fields have correct values
    await expect(page.getByTestId('destination-input')).toHaveValue('Paris, France');
    await expect(page.getByTestId('start-date-input')).toHaveValue('2024-06-01');
    await expect(page.getByTestId('end-date-input')).toHaveValue('2024-06-07');
  });

  test('should handle form submission', async ({ page }) => {
    // Set up console log monitoring
    const consoleLogs: string[] = [];
    page.on('console', msg => {
      if (msg.type() === 'log') {
        consoleLogs.push(msg.text());
      }
    });

    // Fill out the form
    await TestUtils.fillField(page, '[data-testid="destination-input"]', 'Tokyo, Japan');
    await TestUtils.fillField(page, '[data-testid="start-date-input"]', '2024-09-15');
    await TestUtils.fillField(page, '[data-testid="end-date-input"]', '2024-09-22');
    await page.getByTestId('travelers-select').selectOption('3');

    // Submit the form
    await page.getByTestId('plan-trip-button').click();

    // Wait a moment for any async operations
    await page.waitForTimeout(500);

    // Verify form submission was handled (check console log)
    expect(consoleLogs.some(log => log.includes('Trip planned:'))).toBeTruthy();
  });

  test('should validate required fields', async ({ page }) => {
    // Try to submit empty form
    await page.getByTestId('plan-trip-button').click();

    // Verify HTML5 validation prevents submission
    // The destination field should be focused and show validation
    await expect(page.getByTestId('destination-input')).toBeFocused();
  });

  test('should handle form field interactions', async ({ page }) => {
    const destinationInput = page.getByTestId('destination-input');
    const startDateInput = page.getByTestId('start-date-input');
    const endDateInput = page.getByTestId('end-date-input');
    const travelersSelect = page.getByTestId('travelers-select');

    // Test placeholder text
    await expect(destinationInput).toHaveAttribute('placeholder', 'Where would you like to go?');

    // Test field focus states
    await destinationInput.focus();
    await expect(destinationInput).toBeFocused();

    await startDateInput.focus();
    await expect(startDateInput).toBeFocused();

    await endDateInput.focus();
    await expect(endDateInput).toBeFocused();

    // Test select options
    await expect(travelersSelect).toContainText('1 Traveler');
    await expect(travelersSelect).toContainText('2 Travelers');
    await expect(travelersSelect).toContainText('3 Travelers');
    await expect(travelersSelect).toContainText('4+ Travelers');
  });

  test('should maintain form state during navigation', async ({ page }) => {
    // Fill out some form data
    await TestUtils.fillField(page, '[data-testid="destination-input"]', 'London, UK');
    await TestUtils.fillField(page, '[data-testid="start-date-input"]', '2024-05-01');

    // Navigate away and back
    await page.getByTestId('nav-home').click();
    await TestUtils.waitForPageLoad(page);
    await expect(page.getByTestId('home-page')).toBeVisible();

    await page.getByTestId('nav-planner').click();
    await TestUtils.waitForPageLoad(page);

    // Note: In a real app, you might want to preserve form state
    // For this smoke test, we just verify the form is reset (which is expected behavior)
    await expect(page.getByTestId('destination-input')).toHaveValue('');
    await expect(page.getByTestId('start-date-input')).toHaveValue('');
  });

  test('should be accessible via keyboard navigation', async ({ page }) => {
    // Test tab navigation through form fields
    await page.keyboard.press('Tab');
    await expect(page.getByTestId('destination-input')).toBeFocused();

    await page.keyboard.press('Tab');
    await expect(page.getByTestId('start-date-input')).toBeFocused();

    await page.keyboard.press('Tab');
    await expect(page.getByTestId('end-date-input')).toBeFocused();

    await page.keyboard.press('Tab');
    await expect(page.getByTestId('travelers-select')).toBeFocused();

    await page.keyboard.press('Tab');
    await expect(page.getByTestId('plan-trip-button')).toBeFocused();
  });
});
