# Login Automation Testing Framework

A comprehensive automation testing framework built with **Playwright** and **TypeScript** for testing login functionality. This framework implements the **Page Object Model (POM)** design pattern for maintainable and scalable test automation.

## 🚀 Framework Features

- **Page Object Model (POM)** implementation
- **TypeScript** for type safety and better IDE support
- **Playwright** for cross-browser testing
- **Comprehensive test coverage** for login scenarios
- **Built-in reporting** with HTML, JSON, and JUnit formats
- **Screenshot capture** on failures
- **Video recording** for debugging
- **Parallel test execution**
- **CI/CD ready** configuration

## 📋 Test Coverage

### Positive Test Cases
- ✅ Successful login with valid credentials
- ✅ Form reset and reuse functionality

### Negative Test Cases
- ❌ Failed login with invalid username
- ❌ Failed login with invalid password
- ❌ Failed login with both invalid credentials
- ❌ Failed login with empty credentials
- ❌ Error message styling and visibility verification

## 🏗️ Project Structure

```
Automation-framework/
├── pages/                  # Page Object Models
│   ├── BasePage.ts        # Base page with common functionality
│   └── LoginPage.ts       # Login page specific actions and elements
├── tests/                  # Test specifications
│   └── login.spec.ts      # Login functionality test suite
├── utils/                  # Utility functions and test data
│   ├── testData.ts        # Test data configuration
│   └── helpers.ts         # Helper functions
├── test-results/           # Test execution results
├── playwright.config.ts    # Playwright configuration
├── tsconfig.json          # TypeScript configuration
├── package.json           # Dependencies and scripts
└── README.md              # This file
```

## 🛠️ Prerequisites

Before running the tests, ensure you have the following installed:

- **Node.js** (version 16 or higher)
- **npm** or **yarn** package manager

## 📦 Installation

1. **Navigate to the project directory:**
   ```bash
   cd C:\Users\TH-KH-LAP-05\Documents\Automation-framework
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Install Playwright browsers:**
   ```bash
   npm run install:browsers
   ```

## 🏃‍♂️ Running Tests

### Basic Test Execution

```bash
# Run all tests in headless mode
npm test

# Run tests in headed mode (browser visible)
npm run test:headed

# Run tests with UI mode (interactive)
npm run test:ui

# Debug tests step by step
npm run test:debug
```

### Advanced Test Execution

```bash
# Run tests on specific browser
npx playwright test --project=chromium
npx playwright test --project=firefox
npx playwright test --project=webkit

# Run specific test file
npx playwright test tests/login.spec.ts

# Run tests with specific tag/grep
npx playwright test --grep "successful login"

# Run tests in parallel (default)
npx playwright test --workers=4

# Run tests in serial mode
npx playwright test --workers=1
```

## 📊 Test Reports

### View Test Reports

```bash
# Open HTML report (after test execution)
npm run test:report

# Generate and view reports
npx playwright show-report
```

### Report Locations

- **HTML Report:** `playwright-report/index.html`
- **JSON Report:** `test-results/results.json`
- **JUnit Report:** `test-results/results.xml`
- **Screenshots:** `test-results/screenshots/`
- **Videos:** `test-results/videos/`

## 🎯 Test Data Configuration

The framework uses centralized test data management:

```typescript
// Valid credentials
username: 'tomsmith'
password: 'SuperSecretPassword!'

// Test URL
baseURL: 'https://the-internet.herokuapp.com'
```

## 🏛️ Page Object Model Architecture

### BasePage Class
- Common functionality for all pages
- Navigation methods
- Screenshot utilities
- Wait mechanisms

### LoginPage Class
- Login-specific elements and actions
- Form interaction methods
- Validation methods
- Error handling

## 🔧 Configuration

### Playwright Configuration (`playwright.config.ts`)
- **Browser Support:** Chromium, Firefox, WebKit
- **Mobile Testing:** iPhone, Android devices
- **Parallel Execution:** Enabled by default
- **Retry Logic:** 2 retries on CI
- **Timeouts:** Configurable action and navigation timeouts

### TypeScript Configuration (`tsconfig.json`)
- **Path Mapping:** For easy imports
- **Strict Mode:** Enabled for type safety
- **ES2020 Target:** Modern JavaScript features

## 🧪 Framework Design Principles

### 1. Page Object Model (POM)
- Separates test logic from page structure
- Improves maintainability
- Reduces code duplication

### 2. Data-Driven Testing
- Centralized test data management
- Easy data modification
- Support for multiple test environments

### 3. Modular Architecture
- Reusable components
- Clear separation of concerns
- Easy to extend and maintain

### 4. Comprehensive Reporting
- Multiple report formats
- Visual evidence (screenshots/videos)
- Detailed test execution logs

## 🐛 Debugging

### Debug Failed Tests

```bash
# Run in debug mode
npm run test:debug

# Run specific test in debug mode
npx playwright test tests/login.spec.ts --debug

# Run with trace viewer
npx playwright test --trace on
npx playwright show-trace trace.zip
```

### Common Issues and Solutions

1. **Element not found:**
   - Check selector accuracy
   - Add proper waits
   - Verify page load completion

2. **Timeout errors:**
   - Increase timeout values
   - Check network conditions
   - Verify element visibility

3. **Browser launch issues:**
   - Reinstall browsers: `npm run install:browsers`
   - Check system permissions
   - Verify Node.js version

## 🚀 Framework Choice Explanation

### Why Playwright + TypeScript?

1. **Cross-Browser Support:** Native support for Chromium, Firefox, and WebKit
2. **Modern Architecture:** Built for modern web applications
3. **Type Safety:** TypeScript provides compile-time error checking
4. **Rich API:** Comprehensive set of testing utilities
5. **Active Development:** Regular updates and community support
6. **CI/CD Integration:** Easy integration with CI/CD pipelines

### Why Page Object Model?

1. **Maintainability:** Changes to UI require updates in one place
2. **Readability:** Tests are more readable and self-documenting
3. **Reusability:** Page objects can be reused across multiple tests
4. **Scalability:** Easy to add new pages and functionality

## 🔄 Continuous Integration

The framework is ready for CI/CD integration:

```yaml
# Example GitHub Actions workflow
- name: Run Playwright Tests
  run: |
    npm install
    npm run install:browsers
    npm test
```

## 📈 Extending the Framework

### Adding New Test Cases

1. Create new test methods in existing spec files
2. Follow naming convention: `Should [expected behavior] when [condition]`
3. Use descriptive assertions and logging

### Adding New Page Objects

1. Extend `BasePage` class
2. Define page-specific locators
3. Implement page-specific actions
4. Add validation methods

### Adding New Utilities

1. Add helper functions in `utils/helpers.ts`
2. Add test data in `utils/testData.ts`
3. Import and use across test files

## 🤝 Best Practices

1. **Use explicit waits** instead of sleep
2. **Implement proper error handling**
3. **Take screenshots** for visual verification
4. **Use descriptive test names** and comments
5. **Keep tests independent** and idempotent
6. **Follow POM principles** consistently
7. **Maintain test data** separately from test logic

## 📞 Support and Maintenance

For issues or questions:
1. Check the test reports for detailed error information
2. Review the console logs for debugging information
3. Use the debug mode for step-by-step execution
4. Take screenshots to verify visual elements

---

**Framework Version:** 1.0.0  
**Last Updated:** January 2025  
**Compatible with:** Playwright 1.40+, Node.js 16+
