import { test, expect } from '@playwright/test';

test.describe('Psynapsys Login-Logout Flow', () => {
  
  test('should successfully login and logout with valid credentials', async ({ page }) => {
    const baseUrl = 'https://qa.app.psynap-sys.com/';
    const loginUrl = 'https://qa.app.psynap-sys.com/auth/login';
    const organization = 'test';
    const email = 'sainath.gaikwad+4@thinkitive.com';
    const password = 'Sai1234#';

    // Step 1: Navigate to the login page
    await page.goto(baseUrl);
    
    // Wait for redirect to login page
    await page.waitForURL(loginUrl, { timeout: 10000 });
    
    // Verify we're on the login page
    await expect(page).toHaveURL(loginUrl);
    await expect(page).toHaveTitle('Psynapsys');
    
    // Verify login form elements are present
    await expect(page.locator('input[name="tenant"]')).toBeVisible();
    await expect(page.locator('input[name="email"]')).toBeVisible();
    await expect(page.locator('input[name="password"]')).toBeVisible();
    await expect(page.locator('button[type="button"]:has-text("Sign In")')).toBeVisible();

    // Step 2: Fill in the login form
    await page.locator('input[name="tenant"]').fill(organization);
    await page.locator('input[name="email"]').fill(email);
    await page.locator('input[name="password"]').fill(password);
    
    // Verify the form is filled correctly
    await expect(page.locator('input[name="tenant"]')).toHaveValue(organization);
    await expect(page.locator('input[name="email"]')).toHaveValue(email);
    await expect(page.locator('input[name="password"]')).toHaveValue(password);

    // Step 3: Click the Sign In button
    await page.locator('button[type="button"]:has-text("Sign In")').click();

    // Wait for navigation to complete and verify successful login
    await page.waitForURL(/.*\/app\/dashboard.*/, { timeout: 10000 });
    
    // Verify we're on the dashboard/home page
    await expect(page).toHaveURL(/.*\/app\/dashboard.*/);
    await expect(page.locator('text=Welcome')).toBeVisible();
    
    // Verify the user profile is displayed in the navbar
    await expect(page.locator('text=Sainath Gaikwad')).toBeVisible();
    
    // Verify dashboard content is loaded
    await expect(page.locator('text=No. of clients')).toBeVisible();
    await expect(page.locator('text=No. of Therapist')).toBeVisible();
    await expect(page.locator('text=No. of Appointments')).toBeVisible();

    // Step 4: Click on the navbar profile icon (Sainath Gaikwad)
    await page.locator('div[aria-haspopup="menu"]:has-text("Sainath Gaikwad")').click();
    
    // Wait for dropdown to appear
    await page.waitForSelector('button[role="menuitem"]:has-text("Logout")', { timeout: 5000 });
    
    // Verify dropdown menu is visible
    await expect(page.locator('button[role="menuitem"]:has-text("Profile")')).toBeVisible();
    await expect(page.locator('button[role="menuitem"]:has-text("Logout")')).toBeVisible();

    // Step 5: Click on "Logout" in the dropdown
    await page.locator('button[role="menuitem"]:has-text("Logout")').click();

    // Wait for logout to complete and verify redirection to login page
    await page.waitForURL(loginUrl, { timeout: 10000 });
    
    // Verify we're back on the login page
    await expect(page).toHaveURL(loginUrl);
    await expect(page.locator('input[name="tenant"]')).toBeVisible();
    await expect(page.locator('input[name="email"]')).toBeVisible();
    await expect(page.locator('input[name="password"]')).toBeVisible();
    await expect(page.locator('button[type="button"]:has-text("Sign In")')).toBeVisible();
    
    // Verify form fields are empty after logout
    await expect(page.locator('input[name="tenant"]')).toHaveValue('');
    await expect(page.locator('input[name="email"]')).toHaveValue('');
    await expect(page.locator('input[name="password"]')).toHaveValue('');
  });

  test('should handle invalid login credentials', async ({ page }) => {
    const baseUrl = 'https://qa.app.psynap-sys.com/';
    const loginUrl = 'https://qa.app.psynap-sys.com/auth/login';
    
    // Navigate to login page
    await page.goto(baseUrl);
    
    // Wait for redirect to login page
    await page.waitForURL(loginUrl, { timeout: 10000 });
    
    // Try to login with invalid credentials
    await page.locator('input[name="tenant"]').fill('invalid');
    await page.locator('input[name="email"]').fill('invalid@email.com');
    await page.locator('input[name="password"]').fill('InvalidPassword');
    
    // Click Sign In button
    await page.locator('button[type="button"]:has-text("Sign In")').click();
    
    // Should remain on login page (not redirected to dashboard)
    await page.waitForTimeout(3000); // Wait for any potential error messages
    await expect(page).toHaveURL(loginUrl);
    
    // Verify we're still on login page
    await expect(page.locator('input[name="tenant"]')).toBeVisible();
    await expect(page.locator('input[name="email"]')).toBeVisible();
    await expect(page.locator('input[name="password"]')).toBeVisible();
  });

  test('should validate required fields', async ({ page }) => {
    const baseUrl = 'https://qa.app.psynap-sys.com/';
    const loginUrl = 'https://qa.app.psynap-sys.com/auth/login';
    
    // Navigate to login page
    await page.goto(baseUrl);
    
    // Wait for redirect to login page
    await page.waitForURL(loginUrl, { timeout: 10000 });
    
    // Verify required field indicators are present
    await expect(page.locator('label:has-text("Organization") span:has-text("*")')).toBeVisible();
    await expect(page.locator('label:has-text("Email") span:has-text("*")')).toBeVisible();
    await expect(page.locator('label:has-text("Password") span:has-text("*")')).toBeVisible();
    
    // Try to submit form without filling required fields
    await page.locator('button[type="button"]:has-text("Sign In")').click();
    
    // Should remain on login page
    await expect(page).toHaveURL(loginUrl);
    await expect(page.locator('input[name="tenant"]')).toBeVisible();
  });

  test('should display correct placeholders and labels', async ({ page }) => {
    const baseUrl = 'https://qa.app.psynap-sys.com/';
    const loginUrl = 'https://qa.app.psynap-sys.com/auth/login';
    
    // Navigate to login page
    await page.goto(baseUrl);
    
    // Wait for redirect to login page
    await page.waitForURL(loginUrl, { timeout: 10000 });
    
    // Verify field labels
    await expect(page.locator('label:has-text("Organization")')).toBeVisible();
    await expect(page.locator('label:has-text("Email")')).toBeVisible();
    await expect(page.locator('label:has-text("Password")')).toBeVisible();
    
    // Verify field placeholders
    await expect(page.locator('input[name="tenant"]')).toHaveAttribute('placeholder', 'Enter Organization');
    await expect(page.locator('input[name="email"]')).toHaveAttribute('placeholder', 'enter your email');
    await expect(page.locator('input[name="password"]')).toHaveAttribute('placeholder', 'Min. 8 characters');
    
    // Verify forgot password link
    await expect(page.locator('a:has-text("Forgot Password?")')).toBeVisible();
    
    // Verify Sign In button
    await expect(page.locator('button[type="button"]:has-text("Sign In")')).toBeVisible();
  });

});