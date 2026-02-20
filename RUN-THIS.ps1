#!/usr/bin/env pwsh
# MAIN SCRIPT - Run this to fix everything
# PowerShell 7 x64 - Windows

Write-Host ""
Write-Host "═══════════════════════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host "   🔧 Hardhat Handyman - Complete Fix & Deploy" -ForegroundColor Yellow
Write-Host "   PowerShell 7 x64 - Windows" -ForegroundColor Yellow
Write-Host "═══════════════════════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host ""

$ProjectPath = "c:\Users\chaza\OneDrive\Documents\Projects\Dev\hardhat-handyman\hardhat-handyman"

# Navigate to project
Set-Location $ProjectPath

Write-Host "📍 Current Directory:" -ForegroundColor Cyan
Write-Host "   $ProjectPath" -ForegroundColor Gray
Write-Host ""

# Run the comprehensive fix script
Write-Host "🚀 Executing complete deployment fix..." -ForegroundColor Cyan
Write-Host ""

& "$ProjectPath\fix-deployment.ps1"

Write-Host ""
Write-Host "═══════════════════════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host "   ✅ Script Complete!" -ForegroundColor Green
Write-Host "═══════════════════════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host ""

# Ask if user wants to run quick check
$response = Read-Host "Would you like to check if your site is working now? (y/n)"
if ($response -eq 'y' -or $response -eq 'Y') {
    Write-Host ""
    & "$ProjectPath\quick-check.ps1"
}

Write-Host ""
Write-Host "🎉 All done! Follow the manual steps shown above to complete setup." -ForegroundColor Green
Write-Host ""