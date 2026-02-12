# EPA Portfolio Screenshot Capture Script
# Run this on February 20th to capture all required screenshots

Write-Host "🎯 EPA Portfolio Screenshot Capture Script" -ForegroundColor Green
Write-Host "=========================================" -ForegroundColor Green
Write-Host ""

# Create timestamp for folder naming
$timestamp = Get-Date -Format "yyyy-MM-dd-HH-mm"
$screenshotBasePath = "__tests__\screenshots"

Write-Host "📸 Screenshot Capture Started: $timestamp" -ForegroundColor Yellow
Write-Host ""

# Function to pause for screenshot capture
function Take-Screenshot {
    param(
        [string]$Description,
        [string]$FilePath
    )
    Write-Host ""
    Write-Host "📸 Ready to capture: $Description" -ForegroundColor Cyan
    Write-Host "📁 Save as: $FilePath" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "🎯 Steps:" -ForegroundColor Yellow
    Write-Host "1. Run the command below" -ForegroundColor White
    Write-Host "2. Take screenshot of the output" -ForegroundColor White
    Write-Host "3. Save to the specified path" -ForegroundColor White
    Write-Host "4. Press any key to continue..." -ForegroundColor White
    $null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
    Write-Host ""
}

# 1. Constants Test Screenshot
Take-Screenshot -Description "Constants Unit Test Results" -FilePath "$screenshotBasePath\unit-tests\constants-test.png"
Write-Host "🚀 Command: npm test -- __tests__/unit/constants.test.js --verbose" -ForegroundColor Green
npm test -- __tests__/unit/constants.test.js --verbose

# 2. TemperatureChart Test Screenshot
Take-Screenshot -Description "TemperatureChart Component Test Results" -FilePath "$screenshotBasePath\unit-tests\temperature-chart-test.png"
Write-Host "🚀 Command: npm test -- __tests__/unit/TemperatureChart.test.jsx --verbose" -ForegroundColor Green
npm test -- __tests__/unit/TemperatureChart.test.jsx --verbose

# 3. useTemperature Hook Test Screenshot
Take-Screenshot -Description "useTemperature Hook Test Results" -FilePath "$screenshotBasePath\unit-tests\useTemperature-hook-test.png"
Write-Host "🚀 Command: npm test -- __tests__/unit/useTemperature.test.js --verbose" -ForegroundColor Green
npm test -- __tests__/unit/useTemperature.test.js --verbose

# 4. Integration Test Screenshot
Take-Screenshot -Description "Temperature Integration Test Results" -FilePath "$screenshotBasePath\integration-tests\temperature-workflow.png"
Write-Host "🚀 Command: npm test -- __tests__/integration/temperature.test.js --verbose" -ForegroundColor Green
npm test -- __tests__/integration/temperature.test.js --verbose

# 5. Overall Coverage Screenshot
Take-Screenshot -Description "Overall Test Coverage Report" -FilePath "$screenshotBasePath\coverage\overall-coverage.png"
Write-Host "🚀 Command: npm test -- __tests__ --coverage" -ForegroundColor Green
npm test -- __tests__ --coverage

# 6. Component Coverage Screenshot
Take-Screenshot -Description "Component Coverage HTML Report" -FilePath "$screenshotBasePath\coverage\component-coverage.png"
Write-Host "🚀 Open: coverage/lcov-report/index.html in browser" -ForegroundColor Green
Write-Host "🎯 Navigate to TemperatureChart.jsx coverage section" -ForegroundColor Yellow
Start-Process "coverage\lcov-report\index.html"

# 7. Application Running Screenshot
Take-Screenshot -Description "Temperature Plotter Application Running" -FilePath "$screenshotBasePath\ui-evidence\app-running.png"
Write-Host "🚀 Command: npm start" -ForegroundColor Green
Write-Host "🎯 Wait for app to load, then screenshot the running application" -ForegroundColor Yellow
# Note: Don't auto-start npm start as it blocks the script

# 8. Full Test Suite Screenshot
Take-Screenshot -Description "Full Test Suite Execution" -FilePath "$screenshotBasePath\ui-evidence\test-output.png"
Write-Host "🚀 Command: npm test -- __tests__ --verbose" -ForegroundColor Green
npm test -- __tests__ --verbose

# 9. Documentation Preview Screenshot
Take-Screenshot -Description "Test Documentation Preview" -FilePath "$screenshotBasePath\ui-evidence\documentation-preview.png"
Write-Host "🚀 Open: __tests__/DOCUMENTATION_INDEX.md in IDE" -ForegroundColor Green
Write-Host "🎯 Show file explorer with test structure and documentation content" -ForegroundColor Yellow
Start-Process "__tests__\DOCUMENTATION_INDEX.md"

Write-Host ""
Write-Host "🎉 Screenshot Capture Complete!" -ForegroundColor Green
Write-Host "=========================================" -ForegroundColor Green
Write-Host ""
Write-Host "📋 Next Steps:" -ForegroundColor Yellow
Write-Host "1. Verify all 9 screenshots are captured" -ForegroundColor White
Write-Host "2. Check image quality and clarity" -ForegroundColor White
Write-Host "3. Run: git add __tests__/ src/main/dll/" -ForegroundColor White
Write-Host "4. Commit with EPA portfolio message" -ForegroundColor White
Write-Host "5. Push to GitHub" -ForegroundColor White
Write-Host ""
Write-Host "🏆 Ready for EPA Portfolio Showcase!" -ForegroundColor Green
