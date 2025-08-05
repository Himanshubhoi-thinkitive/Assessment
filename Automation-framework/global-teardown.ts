import { FullConfig } from '@playwright/test';
import { rmSync, existsSync } from 'fs';

/**
 * Global teardown for healthcare automation tests
 * Runs once after all tests complete
 */
async function globalTeardown(config: FullConfig) {
  console.log('🏥 Starting Healthcare Automation Framework Global Teardown');
  
  // Calculate total execution time
  const startTime = parseInt(process.env.TEST_START_TIME || '0');
  const endTime = Date.now();
  const totalTime = endTime - startTime;
  
  console.log(`⏱️  Total execution time: ${Math.round(totalTime / 1000)}s`);
  
  // Clean up temporary files if not in CI
  if (!process.env.CI && process.env.CLEANUP_ON_EXIT === 'true') {
    console.log('🧹 Cleaning up temporary files...');
    
    const cleanupPaths = [
      'temp',
      '.temp',
      'downloads'
    ];
    
    cleanupPaths.forEach(path => {
      if (existsSync(path)) {
        try {
          rmSync(path, { recursive: true, force: true });
          console.log(`✅ Cleaned up: ${path}`);
        } catch (error) {
          console.log(`⚠️  Could not clean up ${path}: ${error}`);
        }
      }
    });
  }
  
  // Log final summary
  console.log('📊 Test execution completed');
  console.log('📁 Generated artifacts:');
  
  const artifacts = [
    { path: 'enhanced-report/', description: 'Enhanced HTML Report' },
    { path: 'playwright-report/', description: 'Standard Playwright Report' },
    { path: 'test-results/', description: 'Test Results & Screenshots' }
  ];
  
  artifacts.forEach(artifact => {
    if (existsSync(artifact.path)) {
      console.log(`   ✅ ${artifact.description}: ${artifact.path}`);
    }
  });
  
  console.log('✅ Global teardown completed successfully');
}

export default globalTeardown;