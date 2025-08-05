import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './BasePage';

/**
 * Login Page Object Model
 * Contains all elements and actions related to the login functionality
 */
export class LoginPage extends BasePage {
  // Page elements (locators)
  private readonly usernameInput: Locator;
  private readonly passwordInput: Locator;
  private readonly loginButton: Locator;
  private readonly errorMessage: Locator;
  private readonly successMessage: Locator;
  private readonly logoutButton: Locator;
  private readonly pageHeader: Locator;

  constructor(page: Page) {
    super(page, '/login');
    
    // Initialize locators using data-testid, id, or CSS selectors
    this.usernameInput = page.locator('#username');
    this.passwordInput = page.locator('#password');
    this.loginButton = page.locator('button[type="submit"]');
    this.errorMessage = page.locator('#flash');
    this.successMessage = page.locator('#flash.success');
    this.logoutButton = page.locator('a[href="/logout"]');
    this.pageHeader = page.locator('h2');
  }

  /**
   * Navigate to login page and wait for it to load
   */
  async navigateToLoginPage(): Promise<void> {
    await this.goto();
    await this.waitForPageLoad();
    await this.waitForElementVisible(this.usernameInput);
  }

  /**
   * Enter username in the username field
   * @param username - Username to enter
   */
  async enterUsername(username: string): Promise<void> {
    await this.usernameInput.clear();
    await this.usernameInput.fill(username);
  }

  /**
   * Enter password in the password field
   * @param password - Password to enter
   */
  async enterPassword(password: string): Promise<void> {
    await this.passwordInput.clear();
    await this.passwordInput.fill(password);
  }

  /**
   * Click the login button
   */
  async clickLoginButton(): Promise<void> {
    await this.loginButton.click();
  }

  /**
   * Perform complete login action with username and password
   * @param username - Username to login with
   * @param password - Password to login with
   */
  async login(username: string, password: string): Promise<void> {
    await this.enterUsername(username);
    await this.enterPassword(password);
    await this.clickLoginButton();
    
    // Wait for page response after login attempt
    await this.waitForPageLoad();
  }

  /**
   * Get the error message text
   * @returns Promise<string> - Error message text
   */
  async getErrorMessage(): Promise<string> {
    await this.waitForElementVisible(this.errorMessage);
    return await this.errorMessage.textContent() || '';
  }

  /**
   * Get the success message text
   * @returns Promise<string> - Success message text
   */
  async getSuccessMessage(): Promise<string> {
    await this.waitForElementVisible(this.successMessage);
    return await this.successMessage.textContent() || '';
  }

  /**
   * Check if error message is displayed
   * @returns Promise<boolean> - True if error message is visible
   */
  async isErrorMessageDisplayed(): Promise<boolean> {
    try {
      await this.waitForElementVisible(this.errorMessage, 5000);
      return await this.errorMessage.isVisible();
    } catch {
      return false;
    }
  }

  /**
   * Check if success message is displayed
   * @returns Promise<boolean> - True if success message is visible
   */
  async isSuccessMessageDisplayed(): Promise<boolean> {
    try {
      await this.waitForElementVisible(this.successMessage, 5000);
      return await this.successMessage.isVisible();
    } catch {
      return false;
    }
  }

  /**
   * Check if logout button is displayed (indicates successful login)
   * @returns Promise<boolean> - True if logout button is visible
   */
  async isLogoutButtonDisplayed(): Promise<boolean> {
    try {
      await this.waitForElementVisible(this.logoutButton, 10000);
      return await this.logoutButton.isVisible();
    } catch {
      return false;
    }
  }

  /**
   * Click the logout button
   */
  async logout(): Promise<void> {
    if (await this.isLogoutButtonDisplayed()) {
      await this.logoutButton.click();
      await this.waitForPageLoad();
    }
  }

  /**
   * Get the page header text
   * @returns Promise<string> - Header text
   */
  async getPageHeader(): Promise<string> {
    return await this.pageHeader.textContent() || '';
  }

  /**
   * Verify that the login form is displayed
   */
  async verifyLoginFormDisplayed(): Promise<void> {
    await expect(this.usernameInput).toBeVisible();
    await expect(this.passwordInput).toBeVisible();
    await expect(this.loginButton).toBeVisible();
  }

  /**
   * Clear all form fields
   */
  async clearForm(): Promise<void> {
    await this.usernameInput.clear();
    await this.passwordInput.clear();
  }
}
