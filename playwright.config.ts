import { defineConfig, devices } from '@playwright/test';

/**
 * Optimized Playwright configuration for fast CI/CD execution
 */
export default defineConfig({
  testDir: './tests',
  
  // Parallel execution for speed
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  
  // Minimal retries for faster feedback
  retries: process.env.CI ? 1 : 0,
  
  // Optimal worker count
  workers: process.env.CI ? 2 : undefined,
  
  // Fast reporting configuration
  reporter: process.env.CI ? [
    ['blob'],        // Fast blob reports for CI
    ['github'],      // GitHub annotations
    ['line']         // Minimal console output
  ] : [
    ['html', { open: 'never' }],  // HTML for local dev
    ['list']         // Console output
  ],
  
  // Reasonable timeouts
  timeout: 120000,  // 2 minutes max per test
  expect: {
    timeout: 10000, // 10 seconds for assertions
  },
  
  use: {
    baseURL: 'https://stage_aithinkitive.uat.provider.ecarehealth.com',
    
    // Optimized viewport
    viewport: { width: 1280, height: 720 },
    ignoreHTTPSErrors: true,
    
    // Minimal tracing for speed
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    
    // Faster timeouts
    actionTimeout: 15000,     // 15 seconds
    navigationTimeout: 30000, // 30 seconds
    
    // Optimized browser options
    launchOptions: {
      headless: process.env.CI ? true : false,
      // Remove slowMo for faster execution
      args: [
        '--disable-web-security',
        '--disable-dev-shm-usage',
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-gpu',
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
        '--disable-background-networking'
      ]
    }
  },

  projects: [
    {
      name: 'chromium',
      use: { 
        ...devices['Desktop Chrome'],
        contextOptions: {
          permissions: ['clipboard-read', 'clipboard-write']
        }
      },
    }
  ],

  outputDir: 'test-results/',
  
  // Global setup and teardown (if needed)
  // globalSetup: require.resolve('./utils/global-setup'),
  // globalTeardown: require.resolve('./utils/global-teardown'),
});