import { Page, Locator } from '@playwright/test';

/**
 * Base Page class that contains common functionality for all page objects
 * Implements the Page Object Model pattern
 */
export class BasePage {
  protected page: Page;
  protected url: string;

  constructor(page: Page, url: string = '') {
    this.page = page;
    this.url = url;
  }

  /**
   * Navigate to the page URL
   */
  async goto(): Promise<void> {
    await this.page.goto(this.url);
  }

  /**
   * Wait for the page to load completely
   */
  async waitForPageLoad(): Promise<void> {
    await this.page.waitForLoadState('networkidle');
  }

  /**
   * Get the current page title
   */
  async getTitle(): Promise<string> {
    return await this.page.title();
  }

  /**
   * Get the current page URL
   */
  async getCurrentUrl(): Promise<string> {
    return this.page.url();
  }

  /**
   * Wait for an element to be visible
   */
  async waitForElementVisible(locator: Locator, timeout: number = 10000): Promise<void> {
    await locator.waitFor({ state: 'visible', timeout });
  }

  /**
   * Wait for an element to be hidden
   */
  async waitForElementHidden(locator: Locator, timeout: number = 10000): Promise<void> {
    await locator.waitFor({ state: 'hidden', timeout });
  }

  /**
   * Take a screenshot of the current page
   */
  async takeScreenshot(name: string): Promise<void> {
    await this.page.screenshot({ path: `test-results/screenshots/${name}.png` });
  }
}
