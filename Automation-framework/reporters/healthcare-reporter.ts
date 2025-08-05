import { Reporter, FullConfig, Suite, TestCase, TestResult, FullResult } from '@playwright/test/reporter';
import { writeFileSync, mkdirSync, existsSync } from 'fs';
import { join } from 'path';

/**
 * Test Summary Interface
 */
interface TestSummary {
  total: number;
  passed: number;
  failed: number;
  skipped: number;
  duration: number;
  status: 'success' | 'failure';
  workflow: string;
  runNumber: string;
  branch: string;
  commit: string;
  actor: string;
  timestamp: string;
  reportUrl: string;
  repositoryUrl: string;
}

/**
 * Custom Playwright Reporter with Enhanced HTML Reports
 * Generates beautiful HTML reports with detailed test information
 */
export class HealthcareTestReporter implements Reporter {
  private results: TestResult[] = [];
  private startTime: number = 0;
  private endTime: number = 0;
  private outputDir: string;

  constructor(options: { outputDir?: string } = {}) {
    this.outputDir = options.outputDir || 'enhanced-report';
  }

  onBegin(config: FullConfig, suite: Suite) {
    this.startTime = Date.now();
    console.log(`🏥 Starting Healthcare test suite with ${suite.allTests().length} tests`);
    
    // Create output directory
    if (!existsSync(this.outputDir)) {
      mkdirSync(this.outputDir, { recursive: true });
    }
  }

  onTestEnd(test: TestCase, result: TestResult) {
    this.results.push(result);
    
    const status = result.status;
    const duration = result.duration;
    const emoji = status === 'passed' ? '✅' : status === 'failed' ? '❌' : '⏭️';
    
    console.log(`${emoji} ${test.title} (${duration}ms)`);
    
    if (result.error) {
      console.log(`   Error: ${result.error.message}`);
    }
  }

  async onEnd(result: FullResult) {
    this.endTime = Date.now();
    const totalDuration = this.endTime - this.startTime;
    
    console.log(`\n📊 Test execution completed in ${totalDuration}ms`);
    
    // Generate summary
    const summary = this.createTestSummary(totalDuration);
    
    // Generate HTML report
    await this.generateHTMLReport(summary);
    
    // Print summary
    this.printSummary(summary);
  }

  private createTestSummary(duration: number): TestSummary {
    const total = this.results.length;
    const passed = this.results.filter(r => r.status === 'passed').length;
    const failed = this.results.filter(r => r.status === 'failed').length;
    const skipped = this.results.filter(r => r.status === 'skipped').length;
    
    return {
      total,
      passed,
      failed,
      skipped,
      duration,
      status: failed > 0 ? 'failure' : 'success',
      workflow: process.env.GITHUB_WORKFLOW || 'Healthcare Tests',
      runNumber: process.env.GITHUB_RUN_NUMBER || '1',
      branch: process.env.GITHUB_REF_NAME || 'main',
      commit: process.env.GITHUB_SHA || '',
      actor: process.env.GITHUB_ACTOR || 'System',
      timestamp: new Date().toISOString(),
      reportUrl: process.env.GITHUB_SERVER_URL && process.env.GITHUB_REPOSITORY && process.env.GITHUB_RUN_ID 
        ? `${process.env.GITHUB_SERVER_URL}/${process.env.GITHUB_REPOSITORY}/actions/runs/${process.env.GITHUB_RUN_ID}`
        : '',
      repositoryUrl: process.env.GITHUB_SERVER_URL && process.env.GITHUB_REPOSITORY
        ? `${process.env.GITHUB_SERVER_URL}/${process.env.GITHUB_REPOSITORY}`
        : '',
    };
  }

  private async generateHTMLReport(summary: TestSummary): Promise<void> {
    const reportPath = join(this.outputDir, 'index.html');
    
    const html = this.generateHTMLContent(summary);
    
    try {
      writeFileSync(reportPath, html, 'utf8');
      console.log(`✅ Enhanced HTML report generated: ${reportPath}`);
      
      // Also generate a JSON summary
      const summaryPath = join(this.outputDir, 'summary.json');
      writeFileSync(summaryPath, JSON.stringify(summary, null, 2), 'utf8');
      console.log(`✅ Test summary JSON generated: ${summaryPath}`);
      
    } catch (error) {
      console.error('❌ Failed to generate HTML report:', error);
    }
  }

  private generateHTMLContent(summary: TestSummary): string {
    const statusClass = summary.status === 'success' ? 'status-success' : 'status-error';
    const statusIcon = summary.status === 'success' ? '✅' : '❌';
    const statusText = summary.status === 'success' ? 'All Tests Passed' : 'Some Tests Failed';
    const statusColor = summary.status === 'success' ? '#48bb78' : '#f56565';
    
    return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Healthcare Automation Test Report</title>
      <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">
      <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        
        body { 
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          min-height: 100vh;
          padding: 20px;
          line-height: 1.6;
        }
        
        .container {
          max-width: 1200px;
          margin: 0 auto;
          background: white;
          border-radius: 20px;
          box-shadow: 0 25px 50px rgba(0,0,0,0.15);
          overflow: hidden;
        }
        
        .header {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          padding: 40px;
          text-align: center;
        }
        
        .header h1 {
          font-size: 2.5rem;
          font-weight: 700;
          margin-bottom: 10px;
        }
        
        .header p {
          font-size: 1.2rem;
          opacity: 0.9;
        }
        
        .content {
          padding: 40px;
        }
        
        .status-section {
          text-align: center;
          margin-bottom: 40px;
        }
        
        .status-card {
          display: inline-block;
          background: #f8fafc;
          border: 3px solid ${statusColor};
          border-radius: 15px;
          padding: 30px;
          margin: 20px 0;
          min-width: 300px;
        }
        
        .status-icon {
          font-size: 4rem;
          margin-bottom: 15px;
          display: block;
        }
        
        .status-title {
          font-size: 1.8rem;
          font-weight: 700;
          color: #2d3748;
          margin-bottom: 10px;
        }
        
        .metrics-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 20px;
          margin: 40px 0;
        }
        
        .metric-card {
          background: #f7fafc;
          border-radius: 12px;
          padding: 25px;
          text-align: center;
          border-left: 4px solid #4299e1;
          transition: transform 0.2s ease;
        }
        
        .metric-card:hover {
          transform: translateY(-2px);
        }
        
        .metric-number {
          font-size: 2.5rem;
          font-weight: 700;
          color: #2d3748;
          display: block;
        }
        
        .metric-label {
          color: #718096;
          font-weight: 500;
          margin-top: 5px;
        }
        
        .details-section {
          background: #f8fafc;
          border-radius: 12px;
          padding: 30px;
          margin: 30px 0;
        }
        
        .details-title {
          font-size: 1.5rem;
          font-weight: 600;
          color: #2d3748;
          margin-bottom: 20px;
          border-bottom: 2px solid #e2e8f0;
          padding-bottom: 10px;
        }
        
        .details-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 15px;
        }
        
        .detail-item {
          display: flex;
          justify-content: space-between;
          padding: 10px 0;
          border-bottom: 1px solid #e2e8f0;
        }
        
        .detail-label {
          font-weight: 500;
          color: #4a5568;
        }
        
        .detail-value {
          color: #2d3748;
          font-family: 'Monaco', 'Consolas', monospace;
          font-size: 0.9rem;
        }
        
        .test-results {
          margin: 30px 0;
        }
        
        .test-item {
          background: white;
          border: 1px solid #e2e8f0;
          border-radius: 8px;
          padding: 15px;
          margin: 10px 0;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }
        
        .test-name {
          font-weight: 500;
          flex: 1;
        }
        
        .test-status {
          padding: 4px 12px;
          border-radius: 20px;
          font-size: 0.85rem;
          font-weight: 500;
        }
        
        .test-passed {
          background: #d4edda;
          color: #155724;
        }
        
        .test-failed {
          background: #f8d7da;
          color: #721c24;
        }
        
        .test-skipped {
          background: #fff3cd;
          color: #856404;
        }
        
        .links-section {
          margin-top: 40px;
          text-align: center;
        }
        
        .button-group {
          display: flex;
          gap: 15px;
          justify-content: center;
          flex-wrap: wrap;
        }
        
        .btn {
          display: inline-block;
          padding: 12px 24px;
          border-radius: 8px;
          text-decoration: none;
          font-weight: 600;
          transition: all 0.3s ease;
          border: none;
          cursor: pointer;
        }
        
        .btn-primary {
          background: #4299e1;
          color: white;
        }
        
        .btn-primary:hover {
          background: #3182ce;
          transform: translateY(-2px);
        }
        
        .btn-secondary {
          background: #718096;
          color: white;
        }
        
        .btn-secondary:hover {
          background: #4a5568;
        }
        
        .footer {
          background: #2d3748;
          color: #a0aec0;
          padding: 30px;
          text-align: center;
        }
        
        @media (max-width: 768px) {
          .container { margin: 10px; border-radius: 10px; }
          .content { padding: 20px; }
          .header { padding: 30px 20px; }
          .header h1 { font-size: 2rem; }
          .metrics-grid { grid-template-columns: 1fr; }
          .button-group { flex-direction: column; align-items: center; }
          .detail-item { flex-direction: column; gap: 5px; }
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>🏥 Healthcare Test Report</h1>
          <p>Automated E2E Testing Results</p>
        </div>
        
        <div class="content">
          <div class="status-section">
            <div class="status-card">
              <span class="status-icon">${statusIcon}</span>
              <div class="status-title">${statusText}</div>
            </div>
          </div>
          
          <div class="metrics-grid">
            <div class="metric-card">
              <span class="metric-number">${summary.total}</span>
              <div class="metric-label">Total Tests</div>
            </div>
            <div class="metric-card">
              <span class="metric-number" style="color: #48bb78;">${summary.passed}</span>
              <div class="metric-label">Passed</div>
            </div>
            <div class="metric-card">
              <span class="metric-number" style="color: #f56565;">${summary.failed}</span>
              <div class="metric-label">Failed</div>
            </div>
            <div class="metric-card">
              <span class="metric-number">${Math.round(summary.duration / 1000)}s</span>
              <div class="metric-label">Duration</div>
            </div>
          </div>
          
          <div class="details-section">
            <h3 class="details-title">📋 Execution Details</h3>
            <div class="details-grid">
              <div class="detail-item">
                <span class="detail-label">Workflow:</span>
                <span class="detail-value">${summary.workflow} #${summary.runNumber}</span>
              </div>
              <div class="detail-item">
                <span class="detail-label">Branch:</span>
                <span class="detail-value">${summary.branch}</span>
              </div>
              <div class="detail-item">
                <span class="detail-label">Commit:</span>
                <span class="detail-value">${summary.commit.substring(0, 8)}</span>
              </div>
              <div class="detail-item">
                <span class="detail-label">Actor:</span>
                <span class="detail-value">${summary.actor}</span>
              </div>
              <div class="detail-item">
                <span class="detail-label">Generated:</span>
                <span class="detail-value">${new Date(summary.timestamp).toLocaleString()}</span>
              </div>
            </div>
          </div>
          
          <div class="test-results">
            <h3 class="details-title">🧪 Test Results</h3>
            ${this.generateTestResultsHTML()}
          </div>
          
          <div class="links-section">
            <h3 class="details-title">🔗 Quick Links</h3>
            <div class="button-group">
              ${summary.reportUrl ? `<a href="${summary.reportUrl}" class="btn btn-primary">📊 View Action Details</a>` : ''}
              ${summary.repositoryUrl ? `<a href="${summary.repositoryUrl}" class="btn btn-secondary">📁 Repository</a>` : ''}
            </div>
          </div>
        </div>
        
        <div class="footer">
          <p>Generated by Healthcare Provider Automation Framework</p>
          <p>Powered by Playwright & GitHub Actions</p>
        </div>
      </div>
    </body>
    </html>
    `;
  }

  private generateTestResultsHTML(): string {
    if (this.results.length === 0) {
      return '<p>No test results available.</p>';
    }

    return this.results.map(result => {
      const statusClass = result.status === 'passed' ? 'test-passed' : 
                         result.status === 'failed' ? 'test-failed' : 'test-skipped';
      const statusText = result.status.toUpperCase();
      const duration = result.duration ? `${result.duration}ms` : 'N/A';
      
      return `
        <div class="test-item">
          <div class="test-name">
            ${result.test?.title || 'Unknown Test'}
            <small style="color: #718096; display: block; font-size: 0.8rem;">
              Duration: ${duration}
            </small>
          </div>
          <span class="test-status ${statusClass}">${statusText}</span>
        </div>
      `;
    }).join('');
  }

  private printSummary(summary: TestSummary): void {
    console.log('\n' + '='.repeat(60));
    console.log('🏥 HEALTHCARE TEST EXECUTION SUMMARY');
    console.log('='.repeat(60));
    console.log(`📊 Total Tests: ${summary.total}`);
    console.log(`✅ Passed: ${summary.passed}`);
    console.log(`❌ Failed: ${summary.failed}`);
    console.log(`⏭️  Skipped: ${summary.skipped}`);
    console.log(`⏱️  Duration: ${Math.round(summary.duration / 1000)}s`);
    console.log(`🏷️  Status: ${summary.status.toUpperCase()}`);
    
    if (summary.reportUrl) {
      console.log(`🔗 Report URL: ${summary.reportUrl}`);
    }
    
    console.log('='.repeat(60));
    
    if (summary.failed > 0) {
      console.log('❌ Some tests failed. Please check the detailed report for more information.');
    } else {
      console.log('✅ All tests passed successfully!');
    }
  }
}

export default HealthcareTestReporter;