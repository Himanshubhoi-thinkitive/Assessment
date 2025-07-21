#!/bin/bash

echo "================================================"
echo "    Login Automation Framework Setup"
echo "================================================"
echo

echo "[1/4] Installing Node.js dependencies..."
npm install

if [ $? -ne 0 ]; then
    echo "ERROR: Failed to install dependencies"
    exit 1
fi

echo
echo "[2/4] Installing Playwright browsers..."
npx playwright install

if [ $? -ne 0 ]; then
    echo "ERROR: Failed to install Playwright browsers"
    exit 1
fi

echo
echo "[3/4] Creating test results directories..."
mkdir -p test-results/screenshots
mkdir -p test-results/videos

echo
echo "[4/4] Running initial test validation..."
npx playwright test --reporter=line

echo
echo "================================================"
echo "    Setup Complete!"
echo "================================================"
echo
echo "Available commands:"
echo "  npm test                 - Run all tests"
echo "  npm run test:headed      - Run tests with browser visible"
echo "  npm run test:ui          - Run tests in UI mode"
echo "  npm run test:debug       - Debug tests"
echo "  npm run test:report      - View test reports"
echo
echo "Framework is ready to use!"
echo "Check README.md for detailed usage instructions."
echo
