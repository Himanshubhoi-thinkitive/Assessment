import { defineConfig, devices } from '@playwright/test';

/**
 * Enhanced Playwright configuration for CI/CD stability
 * @see https://playwright.dev/docs/test-configuration
 */
export default defineConfig({
  testDir: './tests',
  
  // Test organization
  fullyParallel: false, // Run tests sequentially for stability
  forbidOnly: !!process.env.CI,
  
  // Retry configuration
  retries: process.env.CI ? 2 : 0, // Retry failed tests in CI
  
  // Worker configuration
  workers: process.env.CI ? 1 : undefined, // Single worker in CI, default locally
  
  // Enhanced reporting for CI
  reporter: process.env.CI ? [
    ['html', { open: 'never', outputFolder: 'playwright-report' }],
    ['github'], // GitHub annotations
    ['junit', { outputFile: 'test-results/junit.xml' }],
    ['json', { outputFile: 'test-results/results.json' }]
  ] : [
    ['html', { open: 'on-failure' }],
    ['list']
  ],
  
  // Timeout configuration
  timeout: 180000, // 3 minutes per test (healthcare workflows can be complex)
  expect: {
    timeout: 30000, // 30 seconds for assertions
  },
  
  // Global test configuration
  use: {
    // Base URL for your application
    baseURL: 'https://stage_aithinkitive.uat.provider.ecarehealth.com',
    
    // Browser configuration
    viewport: { width: 1280, height: 720 },
    ignoreHTTPSErrors: true,
    
    // Test artifacts - More conservative settings
    trace: process.env.CI ? 'retain-on-failure' : 'on-first-retry',
    screenshot: process.env.CI ? 'only-on-failure' : 'only-on-failure', // Changed from 'on'
    video: process.env.CI ? 'retain-on-failure' : 'retain-on-failure', // Changed from 'on'
    
    // Timeouts
    actionTimeout: 30000, // 30 seconds for actions
    navigationTimeout: 60000, // 60 seconds for navigation
    
    // Force headless in CI
    headless: process.env.CI ? true : false,
    
    // Browser launch options optimized for CI
    launchOptions: {
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-gpu',
        '--disable-web-security',
        '--disable-features=VizDisplayCompositor',
        '--disable-background-timer-throttling',
        '--disable-backgrounding-occluded-windows',
        '--disable-renderer-backgrounding',
        '--disable-extensions',
        '--disable-default-apps',
        '--disable-sync',
        '--metrics-recording-only',
        '--no-default-browser-check',
        '--no-first-run',
        '--mute-audio',
        '--disable-background-networking',
        '--disable-blink-features=AutomationControlled',
        '--disable-component-extensions-with-background-pages',
        '--disable-ipc-flooding-protection',
        '--disable-client-side-phishing-detection',
        '--disable-popup-blocking',
        '--disable-prompt-on-repost',
        '--disable-hang-monitor',
        '--force-prefers-reduced-motion'
      ],
      // Slower execution for CI stability
      slowMo: process.env.CI ? 250 : 0,
    }
  },

  // Project configuration
  projects: [
    {
      name: 'chromium-desktop',
      use: { 
        ...devices['Desktop Chrome'],
        contextOptions: {
          permissions: ['clipboard-read', 'clipboard-write'],
          reducedMotion: 'reduce',
          forcedColors: 'none'
        }
      },
    },
    
    // Optional: Add more browsers for comprehensive testing
    // Uncomment when needed
    /*
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },
    */
  ],

  // Output configuration
  outputDir: 'test-results/',
  
  // Global hooks (if needed)
  // globalSetup: require.resolve('./utils/global-setup'),
  // globalTeardown: require.resolve('./utils/global-teardown'),
});