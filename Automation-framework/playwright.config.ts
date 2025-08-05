import { defineConfig, devices } from '@playwright/test';

/**
 * Enhanced Playwright configuration file
 * Defines test execution settings, browser configurations, and reporting options
 * with email notifications and enhanced HTML reporting
 */
export default defineConfig({
  // Test directory
  testDir: './tests',
  
  // Run tests in files in parallel
  fullyParallel: true,
  
  // Fail the build on CI if you accidentally left test.only in the source code
  forbidOnly: !!process.env.CI,
  
  // Retry on CI only
  retries: process.env.CI ? 2 : 0,
  
  // Opt out of parallel tests on CI
  workers: process.env.CI ? 1 : undefined,
  
  // Global timeout for each test
  timeout: 30 * 1000,
  
  // Global timeout for expect assertions
  expect: {
    timeout: 10 * 1000,
  },
  
  // Reporter configuration
  reporter: [
    // GitHub Actions reporter for CI
    ['github'],
    
    // Standard Playwright HTML reporter
    ['html', { 
      outputFolder: 'playwright-report',
      open: 'never' 
    }],
    
    // JSON reporter for programmatic access
    ['json', { 
      outputFile: 'test-results/results.json' 
    }],
    
    // JUnit reporter for CI systems
    ['junit', { 
      outputFile: 'test-results/results.xml' 
    }],
    
    // Line reporter for console output
    ['line']
  ],
  
  // Shared settings for all the projects below
  use: {
    // Base URL for all tests
    baseURL: process.env.BASE_URL || 'https://the-internet.herokuapp.com',
    
    // Collect trace when retrying the failed test
    trace: 'on-first-retry',
    
    // Take screenshot on failure
    screenshot: 'only-on-failure',
    
    // Record video on failure
    video: 'retain-on-failure',
    
    // Global timeout for each action
    actionTimeout: 10000,
    
    // Global timeout for navigation
    navigationTimeout: 30000,
    
    // Extra HTTP headers
    extraHTTPHeaders: {
      'User-Agent': 'Healthcare-Automation-Framework/2.0 Playwright-Test'
    },
    
    // Ignore HTTPS errors
    ignoreHTTPSErrors: true,
    
    // Accept downloads
    acceptDownloads: true,
  },

  // Configure projects for major browsers
  projects: [
    {
      name: 'chromium-desktop',
      use: { 
        ...devices['Desktop Chrome'],
        // Custom viewport for healthcare app
        viewport: { width: 1366, height: 768 }
      },
    },
    
    {
      name: 'firefox',
      use: { 
        ...devices['Desktop Firefox'],
        viewport: { width: 1366, height: 768 }
      },
    },
    
    {
      name: 'webkit',
      use: { 
        ...devices['Desktop Safari'],
        viewport: { width: 1366, height: 768 }
      },
    },
    
    // Mobile testing projects
    {
      name: 'mobile-chrome',
      use: { 
        ...devices['Pixel 5'] 
      },
    },
    
    {
      name: 'mobile-safari',
      use: { 
        ...devices['iPhone 12'] 
      },
    },
    
    // Tablet testing
    {
      name: 'tablet',
      use: { 
        ...devices['iPad Pro'] 
      },
    },
  ],

  // Output directory for test artifacts
  outputDir: 'test-results/',
});