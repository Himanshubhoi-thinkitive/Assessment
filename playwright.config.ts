import { defineConfig, devices } from '@playwright/test';

/**
 * See https://playwright.dev/docs/test-configuration.
 */
export default defineConfig({
  testDir: './tests',
  /* Run tests in files in parallel */
  fullyParallel: true,
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!process.env.CI,
  /* Retry on CI only */
  retries: process.env.CI ? 2 : 0,
  /* Opt out of parallel tests on CI. */
  workers: process.env.CI ? 1 : undefined,
  
  /* Reporter configuration for CI */
  reporter: [
    ['html'],
    ['junit', { outputFile: 'test-results/junit.xml' }],
    ['json', { outputFile: 'test-results/results.json' }],
    process.env.CI ? ['github'] : ['list']
  ],
  
  /* Global test timeout - increased for healthcare workflows */
  timeout: 240000, // 4 minutes for complex healthcare workflow
  expect: {
    timeout: 15000, // 15 seconds for assertions
  },
  
  /* Shared settings for all projects */
  use: {
    /* Base URL for your application */
    baseURL: 'https://stage_aithinkitive.uat.provider.ecarehealth.com',
    
    /* Browser context options */
    viewport: { width: 1280, height: 720 },
    ignoreHTTPSErrors: true,
    
    /* Collect trace when retrying the failed test */
    trace: 'on-first-retry',
    
    /* Take screenshot on failure */
    screenshot: 'only-on-failure',
    
    /* Record video on failure */
    video: 'retain-on-failure',
    
    /* Action timeout - increased for slow loading elements */
    actionTimeout: 20000, // 20 seconds
    navigationTimeout: 60000, // 1 minute for page navigation
    
    /* Additional browser options for CI stability */
    launchOptions: {
      // Force headless in CI, allow headed locally
      headless: process.env.CI ? true : false,
      slowMo: process.env.CI ? 500 : 0, // Slow down actions in CI for stability
      args: [
        '--disable-web-security',
        '--disable-features=VizDisplayCompositor',
        '--disable-dev-shm-usage',
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-gpu',
        '--disable-background-timer-throttling',
        '--disable-backgrounding-occluded-windows',
        '--disable-renderer-backgrounding'
      ]
    }
  },

  /* Configure projects for major browsers */
  projects: [
    {
      name: 'chromium',
      use: { 
        ...devices['Desktop Chrome'],
        // Additional Chrome-specific options for healthcare app
        contextOptions: {
          permissions: ['clipboard-read', 'clipboard-write']
        }
      },
    },
    
    // Uncomment these when ready to test on other browsers
    // {
    //   name: 'firefox',
    //   use: { ...devices['Desktop Firefox'] },
    // },
    // {
    //   name: 'webkit',
    //   use: { ...devices['Desktop Safari'] },
    // },
  ],

  /* Output directories */
  outputDir: 'test-results/',
});