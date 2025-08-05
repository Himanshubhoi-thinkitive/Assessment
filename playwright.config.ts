import { defineConfig, devices } from '@playwright/test';

/**
 * Optimized Playwright configuration for healthcare applications
 * Balanced approach between stability and performance
 * @see https://playwright.dev/docs/test-configuration
 */
export default defineConfig({
  testDir: './tests',
  
  // Test organization
  fullyParallel: false, // Sequential execution for data integrity
  forbidOnly: !!process.env.CI,
  
  // Reasonable retry strategy
  retries: process.env.CI ? 2 : 1, // More retries for flaky CI environments
  
  // Optimal worker count
  workers: process.env.CI ? 1 : 2, // Single worker in CI, 2 locally
  
  // Comprehensive reporting
  reporter: process.env.CI ? [
    ['html', { open: 'never', outputFolder: 'playwright-report' }],
    ['github'], // GitHub annotations for CI
    ['junit', { outputFile: 'test-results/junit.xml' }],
    ['json', { outputFile: 'test-results/results.json' }],
    ['line'] // Console output for debugging
  ] : [
    ['html', { open: 'on-failure' }],
    ['list']
  ],
  
  // Reasonable timeouts
  timeout: 300000, // 5 minutes per test (reduced from 10 minutes)
  expect: {
    timeout: 30000, // 30 seconds for assertions (reduced from 1 minute)
  },
  
  // Global test configuration
  use: {
    // Base URL from environment or default
    baseURL: process.env.BASE_URL || 'https://stage_aithinkitive.uat.provider.ecarehealth.com',
    
    // Browser viewport
    viewport: { width: 1280, height: 720 },
    ignoreHTTPSErrors: true,
    
    // Artifact collection
    trace: process.env.CI ? 'retain-on-failure' : 'on-first-retry',
    screenshot: 'only-on-failure',
    video: process.env.CI ? 'retain-on-failure' : 'off',
    
    // Reasonable timeouts
    actionTimeout: 30000, // 30 seconds for actions (reduced from 1 minute)
    navigationTimeout: 60000, // 1 minute for navigation (reduced from 2 minutes)
    
    // Always headless in CI
    headless: !!process.env.CI,
    
    // Streamlined browser launch options
    launchOptions: {
      args: [
        // Essential stability flags only
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-gpu',
        '--ignore-certificate-errors',
        '--disable-web-security',
        '--disable-features=VizDisplayCompositor',
        
        // Remove excessive flags that could cause issues
        process.env.CI ? '--disable-extensions' : '',
        process.env.CI ? '--no-first-run' : '',
      ].filter(Boolean),
      
      // Reasonable execution speed
      slowMo: process.env.CI ? 500 : 100, // Reduced slowMo
      
      // Browser launch timeout
      timeout: 60000, // 1 minute (reduced from 2 minutes)
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
          forcedColors: 'none',
          strictSelectors: false,
          
          // Simplified context options
          bypassCSP: true,
          javaScriptEnabled: true,
          hasTouch: false,
          isMobile: false,
        }
      },
    },
    
    // Optional: Add Firefox for cross-browser testing
    {
      name: 'firefox',
      use: { 
        ...devices['Desktop Firefox'],
        contextOptions: {
          reducedMotion: 'reduce',
          strictSelectors: false,
        }
      },
    },
  ],

  // Output configuration
  outputDir: 'test-results/',
  
  // NO global setup to avoid the missing file error
  // globalSetup: undefined,
  // globalTeardown: undefined,
});