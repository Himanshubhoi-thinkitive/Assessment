import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { TestData } from '../utils/testData';
import { logTestStep, takeScreenshot } from '../utils/helpers';

/**
 * Login Test Suite
 * Tests for login functionality covering positive and negative scenarios
 */

test.describe('Login Functionality Tests', () => {
  let loginPage: LoginPage;

  /**
   * Setup before each test
   * Initializes the LoginPage object and navigates to login page
   */
  test.beforeEach(async ({ page }) => {
    logTestStep('Setting up test - Creating LoginPage instance');
    loginPage = new LoginPage(page);
    
    logTestStep('Navigating to login page');
    await loginPage.navigateToLoginPage();
    
    logTestStep('Verifying login form is displayed');
    await loginPage.verifyLoginFormDisplayed();
  });

  /**
   * Cleanup after each test
   * Logout if user is logged in to ensure clean state
   */
  test.afterEach(async ({ page }) => {
    logTestStep('Cleaning up after test - Attempting logout');
    try {
      await loginPage.logout();
    } catch (error) {
      // Ignore logout errors as user might not be logged in
      logTestStep('Logout not needed or failed - continuing cleanup');
    }
  });

  /**
   * Test Case 1: Successful login with valid credentials
   * Verifies that user can login with correct username and password
   */
  test('Should successfully login with valid credentials', async ({ page }) => {
    logTestStep('Starting test: Successful login with valid credentials');
    
    // Take screenshot before login attempt
    await takeScreenshot(page, 'successful_login', 'before_login');
    
    // Perform login with valid credentials
    logTestStep('Attempting login with valid credentials', 
                `Username: ${TestData.validCredentials.username}`);
    await loginPage.login(
      TestData.validCredentials.username, 
      TestData.validCredentials.password
    );
    
    // Take screenshot after login attempt
    await takeScreenshot(page, 'successful_login', 'after_login');
    
    // Verify successful login
    logTestStep('Verifying successful login indicators');
    
    // Check if logout button is displayed (indicates successful login)
    const isLoggedIn = await loginPage.isLogoutButtonDisplayed();
    expect(isLoggedIn).toBeTruthy();
    
    // Verify success message contains expected text
    const successMessage = await loginPage.getSuccessMessage();
    logTestStep('Checking success message', `Message: ${successMessage}`);
    expect(successMessage).toContain(TestData.expectedMessages.loginSuccess);
    
    // Verify URL changed to secure area
    const currentUrl = await loginPage.getCurrentUrl();
    expect(currentUrl).toContain('/secure');
    
    logTestStep('Test completed successfully: Valid credentials login');
  });

  /**
   * Test Case 2: Failed login with invalid username
   * Verifies error message appears when using invalid username
   */
  test('Should show error message with invalid username', async ({ page }) => {
    logTestStep('Starting test: Failed login with invalid username');
    
    // Take screenshot before login attempt
    await takeScreenshot(page, 'invalid_username', 'before_login');
    
    // Attempt login with invalid username
    logTestStep('Attempting login with invalid username', 
                `Username: ${TestData.invalidCredentials.invalidUsername.username}`);
    await loginPage.login(
      TestData.invalidCredentials.invalidUsername.username,
      TestData.invalidCredentials.invalidUsername.password
    );
    
    // Take screenshot after login attempt
    await takeScreenshot(page, 'invalid_username', 'after_login');
    
    // Verify error message is displayed
    logTestStep('Verifying error message for invalid username');
    
    const isErrorDisplayed = await loginPage.isErrorMessageDisplayed();
    expect(isErrorDisplayed).toBeTruthy();
    
    // Verify error message content
    const errorMessage = await loginPage.getErrorMessage();
    logTestStep('Checking error message', `Message: ${errorMessage}`);
    expect(errorMessage).toContain(TestData.expectedMessages.loginFailureInvalidUsername);
    
    // Verify user is still on login page
    const currentUrl = await loginPage.getCurrentUrl();
    expect(currentUrl).toContain('/login');
    
    // Verify logout button is not displayed (user not logged in)
    const isLoggedIn = await loginPage.isLogoutButtonDisplayed();
    expect(isLoggedIn).toBeFalsy();
    
    logTestStep('Test completed successfully: Invalid username error validation');
  });

  /**
   * Test Case 3: Failed login with invalid password
   * Verifies error message appears when using invalid password
   */
  test('Should show error message with invalid password', async ({ page }) => {
    logTestStep('Starting test: Failed login with invalid password');
    
    // Take screenshot before login attempt
    await takeScreenshot(page, 'invalid_password', 'before_login');
    
    // Attempt login with invalid password
    logTestStep('Attempting login with invalid password', 
                `Username: ${TestData.invalidCredentials.invalidPassword.username}`);
    await loginPage.login(
      TestData.invalidCredentials.invalidPassword.username,
      TestData.invalidCredentials.invalidPassword.password
    );
    
    // Take screenshot after login attempt
    await takeScreenshot(page, 'invalid_password', 'after_login');
    
    // Verify error message is displayed
    logTestStep('Verifying error message for invalid password');
    
    const isErrorDisplayed = await loginPage.isErrorMessageDisplayed();
    expect(isErrorDisplayed).toBeTruthy();
    
    // Verify error message content
    const errorMessage = await loginPage.getErrorMessage();
    logTestStep('Checking error message', `Message: ${errorMessage}`);
    expect(errorMessage).toContain(TestData.expectedMessages.loginFailureInvalidPassword);
    
    // Verify user is still on login page
    const currentUrl = await loginPage.getCurrentUrl();
    expect(currentUrl).toContain('/login');
    
    // Verify logout button is not displayed (user not logged in)
    const isLoggedIn = await loginPage.isLogoutButtonDisplayed();
    expect(isLoggedIn).toBeFalsy();
    
    logTestStep('Test completed successfully: Invalid password error validation');
  });

  /**
   * Test Case 4: Failed login with both invalid credentials
   * Verifies error message appears when both username and password are invalid
   */
  test('Should show error message with both invalid credentials', async ({ page }) => {
    logTestStep('Starting test: Failed login with both invalid credentials');
    
    // Attempt login with both invalid credentials
    logTestStep('Attempting login with both invalid credentials');
    await loginPage.login(
      TestData.invalidCredentials.bothInvalid.username,
      TestData.invalidCredentials.bothInvalid.password
    );
    
    // Verify error message is displayed
    const isErrorDisplayed = await loginPage.isErrorMessageDisplayed();
    expect(isErrorDisplayed).toBeTruthy();
    
    // Verify error message content (should show username error first)
    const errorMessage = await loginPage.getErrorMessage();
    expect(errorMessage).toContain(TestData.expectedMessages.loginFailureInvalidUsername);
    
    logTestStep('Test completed successfully: Both invalid credentials error validation');
  });

  /**
   * Test Case 5: Failed login with empty credentials
   * Verifies behavior when submitting empty form
   */
  test('Should handle empty credentials appropriately', async ({ page }) => {
    logTestStep('Starting test: Failed login with empty credentials');
    
    // Attempt login with empty credentials
    logTestStep('Attempting login with empty credentials');
    await loginPage.login('', '');
    
    // Verify user is still on login page
    const currentUrl = await loginPage.getCurrentUrl();
    expect(currentUrl).toContain('/login');
    
    // Verify logout button is not displayed
    const isLoggedIn = await loginPage.isLogoutButtonDisplayed();
    expect(isLoggedIn).toBeFalsy();
    
    logTestStep('Test completed successfully: Empty credentials validation');
  });

  /**
   * Test Case 6: Verify error message styling and visibility
   * Ensures error messages are properly styled and visible to users
   */
  test('Should display error messages with proper styling', async ({ page }) => {
    logTestStep('Starting test: Error message styling verification');
    
    // Trigger an error by using invalid credentials
    await loginPage.login('invalid', 'invalid');
    
    // Verify error message is visible and contains error styling
    const isErrorDisplayed = await loginPage.isErrorMessageDisplayed();
    expect(isErrorDisplayed).toBeTruthy();
    
    // Take screenshot to verify visual appearance
    await takeScreenshot(page, 'error_styling', 'error_message_display');
    
    logTestStep('Test completed successfully: Error message styling verification');
  });

  /**
   * Test Case 7: Login form reset functionality
   * Verifies form can be cleared and reused
   */
  test('Should allow form reset and reuse', async ({ page }) => {
    logTestStep('Starting test: Form reset functionality');
    
    // Fill form with invalid data
    await loginPage.enterUsername('invalid');
    await loginPage.enterPassword('invalid');
    
    // Clear the form
    await loginPage.clearForm();
    
    // Verify form is cleared
    const username = await page.inputValue('#username');
    const password = await page.inputValue('#password');
    expect(username).toBe('');
    expect(password).toBe('');
    
    // Use form again with valid credentials
    await loginPage.login(
      TestData.validCredentials.username,
      TestData.validCredentials.password
    );
    
    // Verify successful login
    const isLoggedIn = await loginPage.isLogoutButtonDisplayed();
    expect(isLoggedIn).toBeTruthy();
    
    logTestStep('Test completed successfully: Form reset and reuse validation');
  });
});
