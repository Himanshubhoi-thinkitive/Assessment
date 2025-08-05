import { chromium, FullConfig } from '@playwright/test';
import { mkdirSync, existsSync } from 'fs';

/**
 * Global setup for healthcare automation tests
 * Runs once before all tests
 */
async function globalSetup(config: FullConfig) {
  console.log('🏥 Starting Healthcare Automation Framework Global Setup');
  
  // Create necessary directories
  const directories = [
    'test-results',
    'test-results/screenshots',
    'enhanced-report',
    'playwright-report'
  ];
  
  directories.forEach(dir => {
    if (!existsSync(dir)) {
      mkdirSync(dir, { recursive: true });
      console.log(`✅ Created directory: ${dir}`);
    }
  });
  
  // Verify base URL is accessible
  const baseURL = process.env.BASE_URL || config.projects[0].use?.baseURL;
  if (baseURL) {
    console.log(`🌐 Verifying base URL: ${baseURL}`);
    
    try {
      const browser = await chromium.launch();
      const page = await browser.newPage();
      
      const response = await page.goto(baseURL, { 
        waitUntil: 'networkidle',
        timeout: 30000 
      });
      
      if (response && response.ok()) {
        console.log(`✅ Base URL is accessible (${response.status()})`);
      } else {
        console.log(`⚠️  Base URL returned status: ${response?.status() || 'Unknown'}`);
      }
      
      await browser.close();
    } catch (error) {
      console.log(`⚠️  Could not verify base URL: ${error}`);
    }
  }
  
  // Set up environment variables
  process.env.TEST_START_TIME = Date.now().toString();
  
  // Log environment information
  console.log('📋 Environment Information:');
  console.log(`   Node.js: ${process.version}`);
  console.log(`   Platform: ${process.platform}`);
  console.log(`   Architecture: ${process.arch}`);
  console.log(`   CI: ${process.env.CI ? 'Yes' : 'No'}`);
  console.log(`   Base URL: ${baseURL || 'Not set'}`);
  console.log(`   Email Reports: ${process.env.ENABLE_EMAIL_REPORTS !== 'false' ? 'Enabled' : 'Disabled'}`);
  
  console.log('✅ Global setup completed successfully');
}

export default globalSetup;