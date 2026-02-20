#!/usr/bin/env pwsh
# Quick Deployment Script for Hardhat Handyman
# Run this from the hardhat-handyman directory

Write-Host "🚀 Deploying Hardhat Handyman to Cloudflare Pages..." -ForegroundColor Cyan
Write-Host ""

# Check if wrangler is installed
if (!(Get-Command wrangler -ErrorAction SilentlyContinue)) {
    Write-Host "⚠️  Wrangler not found. Installing..." -ForegroundColor Yellow
    npm install -g wrangler
}

# Login check
Write-Host "📝 Checking Cloudflare authentication..." -ForegroundColor Cyan
$loginCheck = wrangler whoami 2>&1
if ($LASTEXITCODE -ne 0) {
    Write-Host "🔑 Please login to Cloudflare:" -ForegroundColor Yellow
    wrangler login
}

Write-Host ""
Write-Host "✅ Ready to deploy!" -ForegroundColor Green
Write-Host ""
Write-Host "📦 Deploying to Cloudflare Pages..." -ForegroundColor Cyan

# Deploy to Cloudflare Pages
wrangler pages deploy . --project-name=hardhat-handyman

if ($LASTEXITCODE -eq 0) {
    Write-Host ""
    Write-Host "🎉 Deployment successful!" -ForegroundColor Green
    Write-Host ""
    Write-Host "🌐 Your site should be live at:" -ForegroundColor Cyan
    Write-Host "   https://hardhat-handyman.pages.dev" -ForegroundColor White
    Write-Host "   https://hardhat-handyman.com" -ForegroundColor White
    Write-Host "   https://www.hardhat-handyman.com" -ForegroundColor White
    Write-Host ""
    Write-Host "⏱️  Changes may take 30-60 seconds to propagate globally" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "🔍 Next steps:" -ForegroundColor Cyan
    Write-Host "   1. Go to https://dash.cloudflare.com" -ForegroundColor White
    Write-Host "   2. Check Workers & Pages > hardhat-handyman" -ForegroundColor White
    Write-Host "   3. Verify custom domain is configured" -ForegroundColor White
    Write-Host "   4. Remove any conflicting Worker routes if 'Hello World' still appears" -ForegroundColor White
    Write-Host ""
} else {
    Write-Host ""
    Write-Host "❌ Deployment failed!" -ForegroundColor Red
    Write-Host "   Check the error message above" -ForegroundColor Yellow
    Write-Host "   Common issues:" -ForegroundColor Yellow
    Write-Host "   - Not logged in (run: wrangler login)" -ForegroundColor White
    Write-Host "   - Wrong directory (should be in hardhat-handyman folder)" -ForegroundColor White
    Write-Host "   - No internet connection" -ForegroundColor White
    Write-Host ""
}
