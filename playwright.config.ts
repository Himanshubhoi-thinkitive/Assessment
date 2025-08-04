import { defineConfig, devices } from '@playwright/test';

/**
 * Bulletproof Playwright configuration - No network idle dependencies
 * Optimized for complex healthcare applications with continuous network activity
 * @see https://playwright.dev/docs/test-configuration
 */
export default defineConfig({
  testDir: './tests',
  
  // Test organization
  fullyParallel: false, // Sequential execution for stability
  forbidOnly: !!process.env.CI,
  
  // Conservative retry strategy
  retries: process.env.CI ? 1 : 0, // One retry in CI only
  
  // Single worker for maximum stability
  workers: 1,
  
  // Reporting configuration
  reporter: process.env.CI ? [
    ['html', { open: 'never', outputFolder: 'playwright-report' }],
    ['github'], // GitHub annotations for CI
    ['junit', { outputFile: 'test-results/junit.xml' }],
    ['json', { outputFile: 'test-results/results.json' }]
  ] : [
    ['html', { open: 'on-failure' }],
    ['list']
  ],
  
  // Extended timeouts for complex workflows
  timeout: 600000, // 10 minutes per test (very generous for complex healthcare workflows)
  expect: {
    timeout: 60000, // 1 minute for assertions
  },
  
  // Global test configuration
  use: {
    // Base URL
    baseURL: 'https://stage_aithinkitive.uat.provider.ecarehealth.com',
    
    // Browser viewport
    viewport: { width: 1280, height: 720 },
    ignoreHTTPSErrors: true,
    
    // Conservative artifact collection
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    
    // Extended timeouts for all actions
    actionTimeout: 60000, // 1 minute for any action
    navigationTimeout: 120000, // 2 minutes for navigation
    
    // Always headless in CI
    headless: process.env.CI ? true : false,
    
    // Optimized browser launch options for maximum stability
    launchOptions: {
      args: [
        // Essential stability flags
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-gpu',
        
        // Network and security
        '--disable-web-security',
        '--ignore-certificate-errors',
        '--ignore-ssl-errors',
        '--ignore-certificate-errors-spki-list',
        
        // Performance optimization
        '--disable-background-timer-throttling',
        '--disable-backgrounding-occluded-windows',
        '--disable-renderer-backgrounding',
        '--disable-features=TranslateUI',
        '--disable-features=VizDisplayCompositor',
        
        // Resource management
        '--memory-pressure-off',
        '--max_old_space_size=4096',
        
        // Stability flags
        '--disable-extensions',
        '--disable-default-apps',
        '--disable-sync',
        '--disable-component-update',
        '--disable-default-apps',
        '--disable-client-side-phishing-detection',
        
        // UI stability
        '--force-prefers-reduced-motion',
        '--disable-smooth-scrolling',
        '--disable-threaded-animation',
        '--disable-threaded-scrolling',
        
        // Additional stability
        '--no-default-browser-check',
        '--no-first-run',
        '--mute-audio',
        '--disable-background-networking',
        '--disable-blink-features=AutomationControlled',
        '--disable-component-extensions-with-background-pages',
        '--disable-ipc-flooding-protection',
        '--disable-popup-blocking',
        '--disable-prompt-on-repost',
        '--disable-hang-monitor',
        '--disable-features=VizDisplayCompositor',
        '--run-all-compositor-stages-before-draw',
        '--disable-new-content-rendering-timeout',
        
        // Font and rendering
        '--disable-font-subpixel-positioning',
        '--disable-partial-raster',
        '--disable-skia-runtime-opts',
        '--disable-system-font-check'
      ],
      
      // Slow execution for better reliability
      slowMo: process.env.CI ? 1000 : 250, // 1 second delay between actions in CI
      
      // Extended browser launch timeout
      timeout: 120000, // 2 minutes to start browser
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
          strictSelectors: false, // Allow flexible selectors
          
          // Additional context options for stability
          bypassCSP: true, // Bypass Content Security Policy if needed
          javaScriptEnabled: true,
          
          // Viewport settings
          hasTouch: false,
          isMobile: false,
        }
      },
    },
  ],

  // Output configuration
  outputDir: 'test-results/',
  
  // No global setup/teardown to avoid additional complexity
  globalSetup: undefined,
  globalTeardown: undefined,
});