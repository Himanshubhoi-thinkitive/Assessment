import { Page } from '@playwright/test';

/**
 * Utility functions for test execution
 */

/**
 * Wait for a specified amount of time
 * @param ms - Milliseconds to wait
 */
export const wait = async (ms: number): Promise<void> => {
  return new Promise(resolve => setTimeout(resolve, ms));
};

/**
 * Generate random string for unique test data
 * @param length - Length of the random string
 * @returns Random string
 */
export const generateRandomString = (length: number = 8): string => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
};

/**
 * Generate random email address
 * @returns Random email address
 */
export const generateRandomEmail = (): string => {
  return `test_${generateRandomString(6)}@example.com`;
};

/**
 * Get current timestamp as string
 * @returns Current timestamp
 */
export const getCurrentTimestamp = (): string => {
  return new Date().toISOString().replace(/[:.]/g, '-');
};

/**
 * Format test name for screenshot/file names
 * @param testName - Original test name
 * @returns Formatted test name
 */
export const formatTestName = (testName: string): string => {
  return testName.toLowerCase()
    .replace(/\s+/g, '_')
    .replace(/[^a-z0-9_]/g, '')
    .substring(0, 50);
};

/**
 * Log test step for better debugging
 * @param step - Step description
 * @param details - Optional details
 */
export const logTestStep = (step: string, details?: string): void => {
  const timestamp = new Date().toLocaleTimeString();
  console.log(`[${timestamp}] TEST STEP: ${step}${details ? ` - ${details}` : ''}`);
};

/**
 * Take screenshot with formatted name
 * @param page - Playwright page object
 * @param testName - Name of the test
 * @param stepName - Name of the step
 */
export const takeScreenshot = async (page: Page, testName: string, stepName: string): Promise<void> => {
  const formattedTestName = formatTestName(testName);
  const formattedStepName = formatTestName(stepName);
  const timestamp = getCurrentTimestamp();
  const screenshotName = `${formattedTestName}_${formattedStepName}_${timestamp}`;
  
  await page.screenshot({
    path: `test-results/screenshots/${screenshotName}.png`,
    fullPage: true
  });
  
  logTestStep(`Screenshot taken: ${screenshotName}.png`);
};

/**
 * Retry function for flaky operations
 * @param fn - Function to retry
 * @param retries - Number of retries
 * @param delay - Delay between retries in ms
 */
export const retryOperation = async <T>(
  fn: () => Promise<T>,
  retries: number = 3,
  delay: number = 1000
): Promise<T> => {
  for (let i = 0; i < retries; i++) {
    try {
      return await fn();
    } catch (error) {
      if (i === retries - 1) throw error;
      await wait(delay);
      logTestStep(`Retrying operation, attempt ${i + 2}/${retries}`);
    }
  }
  throw new Error('All retry attempts failed');
};

/**
 * Clean up text by removing extra whitespace and special characters
 * @param text - Text to clean
 * @returns Cleaned text
 */
export const cleanText = (text: string): string => {
  return text.replace(/\s+/g, ' ').trim();
};
