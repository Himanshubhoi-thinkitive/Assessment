import { test, expect } from '@playwright/test';

/**
 * Login-Logout Test Suite
 * Test Site: https://the-internet.herokuapp.com/login
 * 
 * Test Scenarios:
 * 1. Should successfully login with valid credentials
 * 2. Should fail login with invalid username
 * 3. Should fail login with invalid password
 * 4. Should display appropriate error messages for different invalid credentials
 */

test.describe('Login-Logout Functionality', () => {
  const BASE_URL = 'https://the-internet.herokuapp.com/login';
  
  // Valid credentials
  const VALID_USERNAME = 'tomsmith';
  const VALID_PASSWORD = 'SuperSecretPassword!';
  
  // Invalid credentials
  const INVALID_USERNAME = 'Himanshubhoi';
  const INVALID_PASSWORD = 'Password';

  // Page selectors
  const SELECTORS = {
    USERNAME_INPUT: '#username',
    PASSWORD_INPUT: '#password',
    LOGIN_BUTTON: 'button[type="submit"]',
    LOGOUT_BUTTON: 'a[href="/logout"]',
    SUCCESS_MESSAGE: '.flash.success',
    ERROR_MESSAGE: '.flash.error',
    SECURE_AREA_HEADING: 'h2',
    LOGIN_PAGE_HEADING: 'h2'
  };

  // Expected messages
  const MESSAGES = {
    LOGIN_SUCCESS: 'You logged into a secure area!',
    LOGOUT_SUCCESS: 'You logged out of the secure area!',
    INVALID_USERNAME: 'Your username is invalid!',
    INVALID_PASSWORD: 'Your password is incorrect Himanshu!',
    SECURE_AREA_TITLE: 'Secure Area',
    LOGIN_PAGE_TITLE: 'Login Page'
  };

  test.beforeEach(async ({ page }) => {
    // Set a longer timeout for navigation
    page.setDefaultTimeout(60000); // 60 seconds
    
    // Navigate to the login page with extended timeout and retry logic
    let retryCount = 0;
    const maxRetries = 3;
    
    while (retryCount < maxRetries) {
      try {
        await page.goto(BASE_URL, { 
          waitUntil: 'networkidle', // Wait for network to be idle
          timeout: 60000 // 60 seconds timeout
        });
        
        // Verify the page loaded correctly
        await expect(page).toHaveTitle('The Internet', { timeout: 30000 });
        break; // Success, exit retry loop
        
      } catch (error) {
        retryCount++;
        console.log(`Navigation attempt ${retryCount} failed:`, error.message);
        
        if (retryCount >= maxRetries) {
          throw new Error(`Failed to navigate to ${BASE_URL} after ${maxRetries} attempts`);
        }
        
        // Wait before retrying
        await page.waitForTimeout(5000);
      }
    }
  });

  test('Should successfully login with valid credentials', async ({ page }) => {
    // Fill in valid credentials
    await page.fill(SELECTORS.USERNAME_INPUT, VALID_USERNAME);
    await page.fill(SELECTORS.PASSWORD_INPUT, VALID_PASSWORD);
    
    // Click login button
    await page.click(SELECTORS.LOGIN_BUTTON);
    
    // Wait for navigation to secure area with extended timeout
    await page.waitForURL('**/secure', { timeout: 30000 });
    
    // Verify successful login
    await expect(page.locator(SELECTORS.SUCCESS_MESSAGE)).toBeVisible({ timeout: 15000 });
    await expect(page.locator(SELECTORS.SUCCESS_MESSAGE)).toContainText(MESSAGES.LOGIN_SUCCESS);
    
    // Verify we're on the secure area page
    await expect(page.locator(SELECTORS.SECURE_AREA_HEADING)).toContainText(MESSAGES.SECURE_AREA_TITLE);
    
    // Verify logout button is present
    await expect(page.locator(SELECTORS.LOGOUT_BUTTON)).toBeVisible();
    
    // Test logout functionality
    await page.click(SELECTORS.LOGOUT_BUTTON);
    
    // Wait for navigation back to login page
    await page.waitForURL('**/login', { timeout: 30000 });
    
    // Verify successful logout
    await expect(page.locator(SELECTORS.SUCCESS_MESSAGE)).toBeVisible({ timeout: 15000 });
    await expect(page.locator(SELECTORS.SUCCESS_MESSAGE)).toContainText(MESSAGES.LOGOUT_SUCCESS);
    
    // Verify we're back on the login page
    await expect(page.locator(SELECTORS.LOGIN_PAGE_HEADING)).toContainText(MESSAGES.LOGIN_PAGE_TITLE);
  });

  test('Should fail login with invalid username', async ({ page }) => {
    // Fill in invalid username with any password
    await page.fill(SELECTORS.USERNAME_INPUT, INVALID_USERNAME);
    await page.fill(SELECTORS.PASSWORD_INPUT, INVALID_PASSWORD);
    
    // Click login button
    await page.click(SELECTORS.LOGIN_BUTTON);
    
    // Wait for the page to process the login attempt with extended timeout
    await page.waitForSelector(SELECTORS.ERROR_MESSAGE, { timeout: 15000 });
    
    // Verify error message appears
    await expect(page.locator(SELECTORS.ERROR_MESSAGE)).toBeVisible();
    await expect(page.locator(SELECTORS.ERROR_MESSAGE)).toContainText(MESSAGES.INVALID_USERNAME);
    
    // Verify we're still on the login page
    await expect(page.locator(SELECTORS.LOGIN_PAGE_HEADING)).toContainText(MESSAGES.LOGIN_PAGE_TITLE);
    
    // Verify URL hasn't changed (still on login page)
    expect(page.url()).toContain('/login');
  });

  test('Should fail login with invalid password', async ({ page }) => {
    // Fill in valid username with invalid password
    await page.fill(SELECTORS.USERNAME_INPUT, VALID_USERNAME);
    await page.fill(SELECTORS.PASSWORD_INPUT, INVALID_PASSWORD);
    
    // Click login button
    await page.click(SELECTORS.LOGIN_BUTTON);
    
    // Wait for the page to process the login attempt with extended timeout
    await page.waitForSelector(SELECTORS.ERROR_MESSAGE, { timeout: 15000 });
    
    // Verify error message appears
    await expect(page.locator(SELECTORS.ERROR_MESSAGE)).toBeVisible();
    await expect(page.locator(SELECTORS.ERROR_MESSAGE)).toContainText(MESSAGES.INVALID_PASSWORD);
    
    // Verify we're still on the login page
    await expect(page.locator(SELECTORS.LOGIN_PAGE_HEADING)).toContainText(MESSAGES.LOGIN_PAGE_TITLE);
    
    // Verify URL hasn't changed (still on login page)
    expect(page.url()).toContain('/login');
  });

  test('Should display appropriate error messages for different invalid credentials', async ({ page }) => {
    // Test Case 1: Invalid username
    await page.fill(SELECTORS.USERNAME_INPUT, INVALID_USERNAME);
    await page.fill(SELECTORS.PASSWORD_INPUT, VALID_PASSWORD);
    await page.click(SELECTORS.LOGIN_BUTTON);
    
    await page.waitForSelector(SELECTORS.ERROR_MESSAGE, { timeout: 15000 });
    await expect(page.locator(SELECTORS.ERROR_MESSAGE)).toContainText(MESSAGES.INVALID_USERNAME);
    
    // Clear the flash message by refreshing
    await page.reload({ waitUntil: 'networkidle', timeout: 30000 });
    
    // Test Case 2: Invalid password
    await page.fill(SELECTORS.USERNAME_INPUT, VALID_USERNAME);
    await page.fill(SELECTORS.PASSWORD_INPUT, INVALID_PASSWORD);
    await page.click(SELECTORS.LOGIN_BUTTON);
    
    await page.waitForSelector(SELECTORS.ERROR_MESSAGE, { timeout: 15000 });
    await expect(page.locator(SELECTORS.ERROR_MESSAGE)).toContainText(MESSAGES.INVALID_PASSWORD);
    
    // Clear the flash message by refreshing
    await page.reload({ waitUntil: 'networkidle', timeout: 30000 });
    
    // Test Case 3: Both invalid
    await page.fill(SELECTORS.USERNAME_INPUT, INVALID_USERNAME);
    await page.fill(SELECTORS.PASSWORD_INPUT, INVALID_PASSWORD);
    await page.click(SELECTORS.LOGIN_BUTTON);
    
    await page.waitForSelector(SELECTORS.ERROR_MESSAGE, { timeout: 15000 });
    // Should show username error first (based on server logic)
    await expect(page.locator(SELECTORS.ERROR_MESSAGE)).toContainText(MESSAGES.INVALID_USERNAME);
  });
});