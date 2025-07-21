# 🚀 Quick Start Guide

## Immediate Setup (5 minutes)

### Step 1: Navigate to Framework Directory
```bash
cd "C:\Users\TH-KH-LAP-05\Documents\Playwright_demo\Automation-framework"
```

### Step 2: Run Setup Script (Windows)
```bash
setup.bat
```

### Step 2: Run Setup Script (Linux/Mac)
```bash
chmod +x setup.sh
./setup.sh
```

### Step 3: Verify Installation
```bash
npm run test:headed
```

## 🎯 Quick Test Commands

| Command | Description | When to Use |
|---------|-------------|-------------|
| `npm test` | Run all tests (headless) | CI/CD, quick validation |
| `npm run test:headed` | Run with browser visible | Debugging, development |
| `npm run test:ui` | Interactive UI mode | Writing new tests |
| `npm run test:debug` | Step-by-step debugging | Troubleshooting failures |
| `npm run test:report` | View detailed reports | After test execution |

## 📝 Quick Test Execution

### Run Specific Tests
```bash
# Run only login tests
npx playwright test tests/login.spec.ts

# Run only successful login test
npx playwright test -g "successful login"

# Run only error validation tests
npx playwright test -g "error message"
```

### Browser-Specific Testing
```bash
# Chrome only
npx playwright test --project=chromium

# Firefox only  
npx playwright test --project=firefox

# All browsers
npx playwright test --project=chromium --project=firefox --project=webkit
```

## 🐛 Quick Debugging

### If Tests Fail:
1. **Check browser installation:**
   ```bash
   npx playwright install
   ```

2. **Run in headed mode to see what's happening:**
   ```bash
   npm run test:headed
   ```

3. **Check test reports:**
   ```bash
   npm run test:report
   ```

4. **Debug specific test:**
   ```bash
   npx playwright test tests/login.spec.ts --debug
   ```

## 📊 Quick Results

After running tests, check:
- **HTML Report:** `playwright-report/index.html`
- **Screenshots:** `test-results/screenshots/`
- **Videos:** `test-results/` (if tests fail)

## ⚡ Framework Features at a Glance

✅ **Page Object Model** - Maintainable test structure  
✅ **TypeScript** - Type safety and IntelliSense  
✅ **Cross-browser** - Chrome, Firefox, Safari, Mobile  
✅ **Parallel execution** - Fast test runs  
✅ **Rich reporting** - HTML, JSON, JUnit formats  
✅ **Screenshot/Video** - Visual debugging  
✅ **CI/CD ready** - Easy integration  

## 🎪 Test Coverage

| Test Case | Status | Description |
|-----------|--------|-------------|
| ✅ Valid Login | Pass | Login with correct credentials |
| ❌ Invalid Username | Error | Wrong username validation |
| ❌ Invalid Password | Error | Wrong password validation |
| ❌ Both Invalid | Error | Both credentials wrong |
| ❌ Empty Fields | Error | Empty form validation |
| 🎨 Error Styling | Visual | Error message appearance |
| 🔄 Form Reset | Functional | Form clearing and reuse |

## 🆘 Need Help?

1. **Check README.md** for detailed documentation
2. **Run framework validation:**
   ```bash
   npx playwright test tests/framework-validation.spec.ts
   ```
3. **View configuration:** Check `playwright.config.ts`
4. **Test data:** Check `utils/testData.ts`

---
**Ready to test!** 🚀 Your framework is configured and ready for login testing automation.
