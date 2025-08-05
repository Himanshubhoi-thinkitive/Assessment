import { test, expect } from '@playwright/test';

/**
 * Framework Validation Test
 * Quick test to verify the framework setup is working correctly
 */

test.describe('Framework Validation', () => {
  test('Framework setup verification', async ({ page }) => {
    // Navigate to the test site
    await page.goto('https://the-internet.herokuapp.com/login');
    
    // Verify page loads correctly
    await expect(page).toHaveTitle(/The Internet/);
    
    // Verify login form elements are present
    await expect(page.locator('#username')).toBeVisible();
    await expect(page.locator('#password')).toBeVisible();
    await expect(page.locator('button[type="submit"]')).toBeVisible();
    
    console.log('✅ Framework validation successful!');
  });
});
