@echo off
REM EPA Portfolio Quick Screenshot Capture
REM Run this on February 20th for fast screenshot capture

echo 🎯 EPA Portfolio Quick Screenshot Capture
echo ========================================
echo.

REM Create directories if they don't exist
if not exist "unit-tests" mkdir unit-tests
if not exist "integration-tests" mkdir integration-tests
if not exist "coverage" mkdir coverage
if not exist "ui-evidence" mkdir ui-evidence

echo 📸 Ready to capture EPA Portfolio Screenshots
echo.
echo 🎯 Instructions:
echo 1. Each command will run and wait for you to take a screenshot
echo 2. Use Snipping Tool or similar to capture the output
echo 3. Save to the specified file path
echo 4. Press any key to continue to next screenshot
echo.

pause
echo.
echo 📸 1/9: Constants Unit Test Results
echo 📁 Save as: unit-tests\constants-test.png
echo 🚀 Running: npm test -- __tests__/unit/constants.test.js --verbose
echo.
npm test -- __tests__/unit/constants.test.js --verbose
echo.
echo ✅ Take screenshot now, then press any key to continue...
pause

echo.
echo 📸 2/9: TemperatureChart Component Test Results  
echo 📁 Save as: unit-tests\temperature-chart-test.png
echo 🚀 Running: npm test -- __tests__/unit/TemperatureChart.test.jsx --verbose
echo.
npm test -- __tests__/unit/TemperatureChart.test.jsx --verbose
echo.
echo ✅ Take screenshot now, then press any key to continue...
pause

echo.
echo 📸 3/9: useTemperature Hook Test Results
echo 📁 Save as: unit-tests\useTemperature-hook-test.png
echo 🚀 Running: npm test -- __tests__/unit/useTemperature.test.js --verbose
echo.
npm test -- __tests__/unit/useTemperature.test.js --verbose
echo.
echo ✅ Take screenshot now, then press any key to continue...
pause

echo.
echo 📸 4/9: Temperature Integration Test Results
echo 📁 Save as: integration-tests\temperature-workflow.png
echo 🚀 Running: npm test -- __tests__/integration/temperature.test.js --verbose
echo.
npm test -- __tests__/integration/temperature.test.js --verbose
echo.
echo ✅ Take screenshot now, then press any key to continue...
pause

echo.
echo 📸 5/9: Overall Test Coverage Report
echo 📁 Save as: coverage\overall-coverage.png
echo 🚀 Running: npm test -- __tests__ --coverage
echo.
npm test -- __tests__ --coverage
echo.
echo ✅ Take screenshot now, then press any key to continue...
pause

echo.
echo 📸 6/9: Component Coverage HTML Report
echo 📁 Save as: coverage\component-coverage.png
echo 🚀 Opening: coverage\lcov-report\index.html
echo 🎯 Navigate to TemperatureChart.jsx coverage section
echo.
start coverage\lcov-report\index.html
echo ✅ Take screenshot now, then press any key to continue...
pause

echo.
echo 📸 7/9: Application Running (Manual)
echo 📁 Save as: ui-evidence\app-running.png
echo 🚀 Run: npm start (in separate terminal)
echo 🎯 Wait for app to load, then screenshot the running application
echo.
echo ✅ Start app manually, take screenshot, then press any key to continue...
pause

echo.
echo 📸 8/9: Full Test Suite Execution
echo 📁 Save as: ui-evidence\test-output.png
echo 🚀 Running: npm test -- __tests__ --verbose
echo.
npm test -- __tests__ --verbose
echo.
echo ✅ Take screenshot now, then press any key to continue...
pause

echo.
echo 📸 9/9: Documentation Preview
echo 📁 Save as: ui-evidence\documentation-preview.png
echo 🚀 Opening: __tests__/DOCUMENTATION_INDEX.md
echo 🎯 Show file explorer with test structure and documentation content
echo.
start __tests__\DOCUMENTATION_INDEX.md
echo ✅ Take screenshot now, then press any key to continue...
pause

echo.
echo 🎉 All screenshot prompts completed!
echo ========================================
echo.
echo 📋 Final Steps:
echo 1. Verify all 9 screenshots are captured
echo 2. Check image quality and clarity  
echo 3. Run: git add __tests__/ src/main/dll/
echo 4. Commit with EPA portfolio message
echo 5. Push to GitHub
echo.
echo 🏆 Ready for EPA Portfolio Showcase!
echo.
pause
