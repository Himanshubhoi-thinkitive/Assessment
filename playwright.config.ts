import { defineConfig, devices } from '@playwright/test';

/**
 * Enhanced Playwright configuration optimized for headless CI/CD stability
 * @see https://playwright.dev/docs/test-configuration
 */
export default defineConfig({
  testDir: './tests',
  
  // Test organization
  fullyParallel: false, // Run tests sequentially for stability
  forbidOnly: !!process.env.CI,
  
  // Retry configuration - More retries for CI stability
  retries: process.env.CI ? 1 : 0, // Reduced retries to save time
  
  // Worker configuration
  workers: process.env.CI ? 1 : undefined, // Single worker in CI
  
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
  
  // Extended timeout configuration for complex healthcare workflows
  timeout: 300000, // 5 minutes per test (extended for complex workflows)
  expect: {
    timeout: 45000, // 45 seconds for assertions (increased)
  },
  
  // Global test configuration
  use: {
    // Base URL for your application
    baseURL: 'https://stage_aithinkitive.uat.provider.ecarehealth.com',
    
    // Browser configuration optimized for headless
    viewport: { width: 1280, height: 720 },
    ignoreHTTPSErrors: true,
    
    // Test artifacts - Conservative settings for CI
    trace: process.env.CI ? 'retain-on-failure' : 'on-first-retry',
    screenshot: 'only-on-failure',
    video: process.env.CI ? 'retain-on-failure' : 'retain-on-failure',
    
    // Extended timeouts for headless stability
    actionTimeout: 45000, // 45 seconds for actions (increased)
    navigationTimeout: 90000, // 90 seconds for navigation (increased)
    
    // Force headless in CI with better stability
    headless: process.env.CI ? true : false,
    
    // Enhanced browser launch options for headless stability
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
        '--force-prefers-reduced-motion',
        // Additional stability flags for headless mode
        '--disable-smooth-scrolling',
        '--disable-threaded-animation',
        '--disable-threaded-scrolling',
        '--disable-partial-raster',
        '--disable-skia-runtime-opts',
        '--disable-system-font-check',
        '--disable-font-subpixel-positioning',
        '--disable-features=TranslateUI',
        '--disable-features=VizDisplayCompositor',
        '--run-all-compositor-stages-before-draw',
        '--disable-new-content-rendering-timeout'
      ],
      // Increased slowMo for better stability in headless
      slowMo: process.env.CI ? 500 : 100, // Slower execution for better reliability
      
      // Additional browser options for stability
      timeout: 60000, // Browser launch timeout
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
          // Additional context options for stability
          strictSelectors: false, // Allow more flexible selectors
        }
      },
    },
  ],

  // Output configuration
  outputDir: 'test-results/',
  
  // Global setup for better stability
  globalSetup: process.env.CI ? undefined : undefined,
  globalTeardown: process.env.CI ? undefined : undefined,
});