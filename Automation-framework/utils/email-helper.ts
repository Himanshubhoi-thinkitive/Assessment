import nodemailer from 'nodemailer';

/**
 * Email configuration and helper functions
 */

export interface EmailConfig {
  host: string;
  port: number;
  secure: boolean;
  auth: {
    user: string;
    pass: string;
  };
}

export interface TestSummary {
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

export class EmailReporter {
  private transporter: nodemailer.Transporter;
  private config: EmailConfig;

  constructor(config: EmailConfig) {
    this.config = config;
    this.transporter = nodemailer.createTransport({
      host: config.host,
      port: config.port,
      secure: config.secure,
      auth: config.auth,
    });
  }

  /**
   * Generate HTML email content for test results
   */
  private generateEmailHTML(summary: TestSummary): string {
    const statusClass = summary.status === 'success' ? 'status-success' : 'status-error';
    const statusIcon = summary.status === 'success' ? '✅' : '❌';
    const statusText = summary.status === 'success' ? 'All Tests Passed!' : 'Some Tests Failed';
    const statusMessage = summary.status === 'success' 
      ? 'Great job! All automated tests completed successfully.' 
      : 'Attention needed: Some tests failed and require investigation.';

    return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Healthcare Test Report</title>
      <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        
        body {
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          line-height: 1.6;
          color: #333;
          background: #f8f9fa;
        }
        
        .email-container {
          max-width: 600px;
          margin: 20px auto;
          background: white;
          border-radius: 12px;
          overflow: hidden;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }
        
        .header {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          padding: 30px 20px;
          text-align: center;
        }
        
        .header h1 {
          font-size: 24px;
          margin-bottom: 8px;
        }
        
        .header p {
          opacity: 0.9;
          font-size: 14px;
        }
        
        .content {
          padding: 30px 20px;
        }
        
        .status {
          text-align: center;
          padding: 25px;
          border-radius: 12px;
          margin: 25px 0;
          border: 2px solid;
        }
        
        .status-success {
          background: #d4edda;
          border-color: #155724;
          color: #155724;
        }
        
        .status-error {
          background: #f8d7da;
          border-color: #721c24;
          color: #721c24;
        }
        
        .status h2 {
          font-size: 20px;
          margin-bottom: 10px;
        }
        
        .metrics {
          display: flex;
          justify-content: space-around;
          margin: 30px 0;
          flex-wrap: wrap;
          gap: 15px;
        }
        
        .metric {
          text-align: center;
          padding: 20px;
          background: #f8f9fa;
          border-radius: 10px;
          flex: 1;
          min-width: 100px;
        }
        
        .metric-number {
          font-size: 28px;
          font-weight: bold;
          display: block;
          margin-bottom: 5px;
        }
        
        .metric-label {
          color: #666;
          font-size: 12px;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }
        
        .details {
          background: #f8f9fa;
          padding: 20px;
          border-radius: 10px;
          margin: 25px 0;
        }
        
        .details h3 {
          color: #2d3748;
          margin-bottom: 15px;
          font-size: 16px;
        }
        
        .detail-row {
          display: flex;
          justify-content: space-between;
          padding: 8px 0;
          border-bottom: 1px solid #e2e8f0;
        }
        
        .detail-row:last-child {
          border-bottom: none;
        }
        
        .detail-label {
          font-weight: 600;
          color: #4a5568;
        }
        
        .detail-value {
          color: #2d3748;
          font-family: 'Courier New', monospace;
          font-size: 13px;
        }
        
        .actions {
          text-align: center;
          margin: 30px 0;
        }
        
        .button {
          display: inline-block;
          background: #4299e1;
          color: white;
          padding: 12px 24px;
          text-decoration: none;
          border-radius: 8px;
          font-weight: 600;
          margin: 8px;
          transition: background 0.3s ease;
        }
        
        .button:hover {
          background: #3182ce;
        }
        
        .button-secondary {
          background: #718096;
        }
        
        .button-secondary:hover {
          background: #4a5568;
        }
        
        .footer {
          background: #2d3748;
          color: #a0aec0;
          padding: 20px;
          text-align: center;
          font-size: 12px;
        }
        
        @media (max-width: 600px) {
          .email-container {
            margin: 10px;
          }
          
          .content {
            padding: 20px 15px;
          }
          
          .metrics {
            flex-direction: column;
          }
          
          .detail-row {
            flex-direction: column;
            gap: 5px;
          }
        }
      </style>
    </head>
    <body>
      <div class="email-container">
        <div class="header">
          <h1>🏥 Healthcare Test Report</h1>
          <p>Automated E2E Testing Results</p>
        </div>
        
        <div class="content">
          <div class="status ${statusClass}">
            <h2>${statusIcon} ${statusText}</h2>
            <p>${statusMessage}</p>
          </div>
          
          <div class="metrics">
            <div class="metric">
              <span class="metric-number">${summary.total}</span>
              <div class="metric-label">Total Tests</div>
            </div>
            <div class="metric">
              <span class="metric-number" style="color: #48bb78;">${summary.passed}</span>
              <div class="metric-label">Passed</div>
            </div>
            <div class="metric">
              <span class="metric-number" style="color: #f56565;">${summary.failed}</span>
              <div class="metric-label">Failed</div>
            </div>
          </div>
          
          <div class="details">
            <h3>📋 Execution Details</h3>
            <div class="detail-row">
              <span class="detail-label">Workflow:</span>
              <span class="detail-value">${summary.workflow} #${summary.runNumber}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">Branch:</span>
              <span class="detail-value">${summary.branch}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">Duration:</span>
              <span class="detail-value">${Math.round(summary.duration / 1000)}s</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">Triggered by:</span>
              <span class="detail-value">${summary.actor}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">Timestamp:</span>
              <span class="detail-value">${summary.timestamp}</span>
            </div>
          </div>
          
          <div class="actions">
            <a href="${summary.reportUrl}" class="button">
              📊 View Detailed Report
            </a>
            <a href="${summary.repositoryUrl}" class="button button-secondary">
              📁 View Repository
            </a>
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

  /**
   * Generate email subject based on test results
   */
  private generateSubject(summary: TestSummary): string {
    if (summary.status === 'success') {
      return `✅ Healthcare Tests PASSED - All ${summary.total} tests successful`;
    } else {
      return `❌ Healthcare Tests FAILED - ${summary.failed} of ${summary.total} tests failed`;
    }
  }

  /**
   * Send test results email
   */
  async sendTestResults(
    summary: TestSummary,
    recipients: string[],
    attachmentPath?: string
  ): Promise<boolean> {
    try {
      const subject = this.generateSubject(summary);
      const html = this.generateEmailHTML(summary);

      const mailOptions: nodemailer.SendMailOptions = {
        from: `Healthcare Test Automation <${this.config.auth.user}>`,
        to: recipients.join(', '),
        subject,
        html,
        attachments: attachmentPath ? [
          {
            filename: 'test-report.html',
            path: attachmentPath,
          },
        ] : undefined,
      };

      const info = await this.transporter.sendMail(mailOptions);
      console.log('✅ Email sent successfully:', info.messageId);
      return true;
    } catch (error) {
      console.error('❌ Failed to send email:', error);
      return false;
    }
  }

  /**
   * Verify email configuration
   */
  async verifyConnection(): Promise<boolean> {
    try {
      await this.transporter.verify();
      console.log('✅ SMTP connection verified');
      return true;
    } catch (error) {
      console.error('❌ SMTP connection failed:', error);
      return false;
    }
  }
}

/**
 * Environment-based email configuration
 */
export function getEmailConfig(): EmailConfig {
  return {
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.SMTP_PORT || '587'),
    secure: process.env.SMTP_SECURE === 'true',
    auth: {
      user: process.env.EMAIL_USERNAME || '',
      pass: process.env.EMAIL_PASSWORD || '',
    },
  };
}

/**
 * Get email recipients from environment
 */
export function getEmailRecipients(): string[] {
  const recipients = process.env.EMAIL_TO || '';
  return recipients.split(',').map(email => email.trim()).filter(Boolean);
}