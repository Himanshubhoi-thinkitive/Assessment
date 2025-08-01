import { defineConfig, devices } from '@playwright/test';

/**
 * Optimized Playwright configuration - FIXED for single run without retries
 */
export default defineConfig({
  testDir: './tests',
  
  // Disable parallel for stability
  fullyParallel: false,
  forbidOnly: !!process.env.CI,
  
  // FIXED: No retries to prevent multiple runs
  retries: 0,
  
  // FIXED: Single worker for stability
  workers: 1,
  
  // Enhanced reporting
  reporter: process.env.CI ? [
    ['blob'],        // Fast blob reports for CI
    ['github'],      // GitHub annotations
    ['line']         // Minimal console output
  ] : [
    ['html', { open: 'never' }],  // HTML for local dev
    ['list'],        // Console output
    ['junit', { outputFile: 'test-results/junit.xml' }] // JUnit for CI integration
  ],
  
  // Increased timeouts for complex workflow
  timeout: 120000,  // 2 minutes max per test
  expect: {
    timeout: 30000, // 30 seconds for assertions
  },
  
  use: {
    baseURL: 'https://stage_aithinkitive.uat.provider.ecarehealth.com',
    
    // Optimized viewport
    viewport: { width: 1280, height: 720 },
    ignoreHTTPSErrors: true,
    
    // Enhanced debugging info
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    
    // Longer timeouts for complex interactions
    actionTimeout: 30000,     // 30 seconds for actions
    navigationTimeout: 60000, // 60 seconds for navigation
    
    // Force headless mode for consistency
    headless: true,
    
    // Optimized browser options for stability
    launchOptions: {
      headless: true,
      // Slower execution for better stability
      slowMo: 100,
      args: [
        '--disable-web-security',
        '--disable-features=VizDisplayCompositor',
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
        '--disable-background-networking',
        '--disable-blink-features=AutomationControlled',
        '--disable-component-extensions-with-background-pages',
        '--disable-ipc-flooding-protection',
        // Additional stability flags
        '--disable-client-side-phishing-detection',
        '--disable-popup-blocking',
        '--disable-prompt-on-repost',
        '--disable-hang-monitor',
        '--disable-backgrounding-occluded-windows',
        '--disable-renderer-backgrounding',
        '--force-prefers-reduced-motion'
      ]
    }
  },

  projects: [
    {
      name: 'chromium',
      use: { 
        ...devices['Desktop Chrome'],
        contextOptions: {
          permissions: ['clipboard-read', 'clipboard-write'],
          // Additional context options for stability
          reducedMotion: 'reduce',
          forcedColors: 'none'
        }
      },
    }
  ],

  outputDir: 'test-results/',
  
  // Global setup and teardown (if needed)
  // globalSetup: require.resolve('./utils/global-setup'),
  // globalTeardown: require.resolve('./utils/global-teardown'),
});