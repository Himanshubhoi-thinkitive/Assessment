@echo off
echo ================================================
echo    Login Automation Framework Setup
echo ================================================
echo.

echo [1/4] Installing Node.js dependencies...
call npm install

if %ERRORLEVEL% NEQ 0 (
    echo ERROR: Failed to install dependencies
    pause
    exit /b 1
)

echo.
echo [2/4] Installing Playwright browsers...
call npx playwright install

if %ERRORLEVEL% NEQ 0 (
    echo ERROR: Failed to install Playwright browsers
    pause
    exit /b 1
)

echo.
echo [3/4] Creating test results directories...
if not exist "test-results\screenshots" mkdir "test-results\screenshots"
if not exist "test-results\videos" mkdir "test-results\videos"

echo.
echo [4/4] Running initial test validation...
call npx playwright test --reporter=line

echo.
echo ================================================
echo    Setup Complete!
echo ================================================
echo.
echo Available commands:
echo   npm test                 - Run all tests
echo   npm run test:headed      - Run tests with browser visible
echo   npm run test:ui          - Run tests in UI mode
echo   npm run test:debug       - Debug tests
echo   npm run test:report      - View test reports
echo.
echo Framework is ready to use!
echo Check README.md for detailed usage instructions.
echo.
pause
