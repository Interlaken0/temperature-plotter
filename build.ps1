# Enhanced Build Script for Temperature Plotter
# This script creates a complete, production-ready build with error handling

# Set strict error handling - stop script if any command fails
$ErrorActionPreference = "Stop"

# Display build start message with colour coding
Write-Host "Starting Temperature Plotter build process..." -ForegroundColor Green

# Clean previous build artifacts to ensure fresh build
if (Test-Path "out") {
    Remove-Item -Recurse -Force "out"
    Write-Host "Cleaned previous builds from out/ directory" -ForegroundColor Yellow
}

if (Test-Path ".webpack") {
    Remove-Item -Recurse -Force ".webpack"
    Write-Host "Cleaned webpack cache from .webpack/ directory" -ForegroundColor Yellow
}

# Install/update dependencies to ensure latest versions
Write-Host "Installing dependencies..." -ForegroundColor Blue
npm install

# Run linting to validate code quality before building
Write-Host "Running code quality checks..." -ForegroundColor Blue
npm run lint

# Run tests to validate code before building (prevents broken builds)
Write-Host "Running tests to validate code quality..." -ForegroundColor Blue
npm test

# Build the application using Electron Forge make command
Write-Host "Building application for production..." -ForegroundColor Blue
npm run make

# Verify build succeeded and provide clear feedback
if (Test-Path "out/make") {
    $exeFiles = Get-ChildItem -Path "out/make" -Filter "*.exe" -Recurse
    if ($exeFiles.Count -gt 0) {
        Write-Host "✅ Build successful! Found $($exeFiles.Count) executable(s)" -ForegroundColor Green
        Write-Host "📁 Location: out/make/" -ForegroundColor Cyan
        foreach ($exe in $exeFiles) {
            Write-Host "   - $($exe.Name)" -ForegroundColor White
        }
    } else {
        Write-Host "⚠️  Build completed but no EXE files found in out/make/" -ForegroundColor Yellow
    }
} else {
    Write-Host "❌ Build failed - no output directory found at out/make/" -ForegroundColor Red
    Write-Host "Check the build logs above for error details" -ForegroundColor Red
    exit 1
}

Write-Host "Build process completed!" -ForegroundColor Green
