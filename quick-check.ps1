#!/usr/bin/env pwsh
# Quick verification script - checks if your site is working correctly
# Run: .\quick-check.ps1

$Domain = "hardhat-handyman.com"
$PagesURL = "https://c80ea875.hardhat-handyman.pages.dev"

Write-Host ""
Write-Host "🔍 Hardhat Handyman - Quick Site Check" -ForegroundColor Cyan
Write-Host "════════════════════════════════════════" -ForegroundColor Cyan
Write-Host ""

# Check Pages deployment
Write-Host "📊 Checking Pages deployment..." -ForegroundColor Yellow
try {
    $pagesResponse = Invoke-WebRequest -Uri $PagesURL -UseBasicParsing -TimeoutSec 10
    if ($pagesResponse.Content -match "Hardhat Handyman") {
        Write-Host "✅ Pages deployment: WORKING" -ForegroundColor Green
        Write-Host "   Status: $($pagesResponse.StatusCode)" -ForegroundColor Gray
    } elseif ($pagesResponse.Content -match "Hello World") {
        Write-Host "⚠️  Pages deployment: Shows 'Hello World'" -ForegroundColor Yellow
    } else {
        Write-Host "❓ Pages deployment: Unknown content" -ForegroundColor Yellow
    }
} catch {
    Write-Host "❌ Pages deployment: ERROR" -ForegroundColor Red
    Write-Host "   $($_.Exception.Message)" -ForegroundColor Gray
}
Write-Host ""

# Check main domain
Write-Host "🌐 Checking main domain..." -ForegroundColor Yellow
try {
    $domainResponse = Invoke-WebRequest -Uri "https://$Domain" -UseBasicParsing -TimeoutSec 10
    if ($domainResponse.Content -match "Hardhat Handyman") {
        Write-Host "✅ $Domain : WORKING!" -ForegroundColor Green
        Write-Host "   ✨ Your site is LIVE and showing correctly!" -ForegroundColor Green
        Write-Host "   Status: $($domainResponse.StatusCode)" -ForegroundColor Gray
    } elseif ($domainResponse.Content -match "Hello World") {
        Write-Host "❌ $Domain : Shows 'Hello World'" -ForegroundColor Red
        Write-Host "   Action: Remove the Worker in Cloudflare dashboard" -ForegroundColor Yellow
        Write-Host "   Go to: Workers & Pages → Workers tab → Delete Worker" -ForegroundColor Gray
    } else {
        Write-Host "❓ $Domain : Unknown content" -ForegroundColor Yellow
        Write-Host "   First 100 chars: $($domainResponse.Content.Substring(0, [Math]::Min(100, $domainResponse.Content.Length)))" -ForegroundColor Gray
    }
} catch {
    Write-Host "❌ $Domain : ERROR" -ForegroundColor Red
    Write-Host "   $($_.Exception.Message)" -ForegroundColor Gray
    if ($_.Exception.Message -match "SSL") {
        Write-Host "   Note: SSL might still be provisioning (wait 5-10 minutes)" -ForegroundColor Yellow
    }
}
Write-Host ""

# Check www domain
Write-Host "🌐 Checking www subdomain..." -ForegroundColor Yellow
try {
    $wwwResponse = Invoke-WebRequest -Uri "https://www.$Domain" -UseBasicParsing -TimeoutSec 10
    if ($wwwResponse.Content -match "Hardhat Handyman") {
        Write-Host "✅ www.$Domain : WORKING!" -ForegroundColor Green
    } elseif ($wwwResponse.Content -match "Hello World") {
        Write-Host "❌ www.$Domain : Shows 'Hello World'" -ForegroundColor Red
    } else {
        Write-Host "❓ www.$Domain : Unknown content" -ForegroundColor Yellow
    }
} catch {
    Write-Host "⚠️  www.$Domain : ERROR" -ForegroundColor Yellow
    Write-Host "   $($_.Exception.Message)" -ForegroundColor Gray
}
Write-Host ""

Write-Host "════════════════════════════════════════" -ForegroundColor Cyan
Write-Host ""

# Summary
Write-Host "📋 Summary:" -ForegroundColor Cyan
Write-Host ""
Write-Host "If you see 'Hello World':" -ForegroundColor Yellow
Write-Host "  1. Go to https://dash.cloudflare.com" -ForegroundColor White
Write-Host "  2. Workers & Pages → Workers tab" -ForegroundColor White
Write-Host "  3. Delete any Worker with routes to $Domain" -ForegroundColor White
Write-Host "  4. Clear cache: Caching → Purge Everything" -ForegroundColor White
Write-Host "  5. Wait 2-3 minutes and run this script again" -ForegroundColor White
Write-Host ""
Write-Host "If you see errors:" -ForegroundColor Yellow
Write-Host "  • Custom domain might not be configured yet" -ForegroundColor White
Write-Host "  • Add it in: Workers & Pages → Pages → hardhat-handyman → Custom domains" -ForegroundColor White
Write-Host ""