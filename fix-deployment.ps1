#!/usr/bin/env pwsh
# Hardhat Handyman - Complete Deployment Fix Script
# This script fixes the "Hello World" issue and ensures proper deployment
# Run with PowerShell 7 x64

param(
    [switch]$SkipDeploy = $false
)

$ErrorActionPreference = "Continue"
$ProjectPath = "c:\Users\chaza\OneDrive\Documents\Projects\Dev\hardhat-handyman\hardhat-handyman"
$ProjectName = "hardhat-handyman"
$Domain = "hardhat-handyman.com"

Write-Host ""
Write-Host "═══════════════════════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host "   Hardhat Handyman - Deployment Fix Script" -ForegroundColor Yellow
Write-Host "   Fixing 'Hello World' Issue & Configuring Cloudflare" -ForegroundColor Yellow
Write-Host "═══════════════════════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host ""

# Change to project directory
Write-Host "📂 Navigating to project directory..." -ForegroundColor Cyan
Set-Location $ProjectPath
Write-Host "   Location: $ProjectPath" -ForegroundColor Gray
Write-Host ""

# Step 1: Check Wrangler installation
Write-Host "🔍 Step 1: Checking Wrangler CLI..." -ForegroundColor Cyan
$wranglerInstalled = Get-Command npx -ErrorAction SilentlyContinue
if (-not $wranglerInstalled) {
    Write-Host "   ❌ Node.js/npx not found. Please install Node.js first." -ForegroundColor Red
    Write-Host "   Download from: https://nodejs.org/" -ForegroundColor Yellow
    exit 1
}
Write-Host "   ✅ Wrangler CLI available via npx" -ForegroundColor Green
Write-Host ""

# Step 2: Check authentication
Write-Host "🔑 Step 2: Checking Cloudflare authentication..." -ForegroundColor Cyan
$whoamiOutput = npx wrangler whoami 2>&1 | Out-String
if ($LASTEXITCODE -ne 0 -or $whoamiOutput -match "not authenticated") {
    Write-Host "   ⚠️  Not logged in to Cloudflare" -ForegroundColor Yellow
    Write-Host "   🔓 Opening browser for authentication..." -ForegroundColor Cyan
    npx wrangler login
    Write-Host ""
    if ($LASTEXITCODE -ne 0) {
        Write-Host "   ❌ Login failed. Please try again." -ForegroundColor Red
        exit 1
    }
} else {
    Write-Host "   ✅ Authenticated with Cloudflare" -ForegroundColor Green
    Write-Host "   $($whoamiOutput.Trim())" -ForegroundColor Gray
}
Write-Host ""

# Step 3: List existing Workers (to identify conflicts)
Write-Host "🔍 Step 3: Checking for conflicting Workers..." -ForegroundColor Cyan
Write-Host "   (Workers that might be showing 'Hello World')" -ForegroundColor Gray
Write-Host ""

$workersOutput = npx wrangler deployments list 2>&1 | Out-String
if ($workersOutput -match "No deployments found") {
    Write-Host "   ℹ️  No Workers found via CLI" -ForegroundColor Blue
    Write-Host "   Note: You may need to check the dashboard for Workers" -ForegroundColor Yellow
} else {
    Write-Host "   Workers found:" -ForegroundColor Yellow
    Write-Host $workersOutput -ForegroundColor Gray
}
Write-Host ""

Write-Host "   ⚠️  IMPORTANT: If you see any Worker with 'Hello World':" -ForegroundColor Yellow
Write-Host "   1. Go to: https://dash.cloudflare.com" -ForegroundColor White
Write-Host "   2. Click: Workers & Pages → Workers tab" -ForegroundColor White
Write-Host "   3. Find the Worker with routes to $Domain" -ForegroundColor White
Write-Host "   4. DELETE it or remove the routes" -ForegroundColor White
Write-Host ""

# Step 4: Verify files are ready
Write-Host "📦 Step 4: Verifying deployment files..." -ForegroundColor Cyan

$requiredFiles = @(
    "index.html",
    "favicon.png",
    "_headers",
    "_routes.json",
    "wrangler.toml"
)

$allFilesPresent = $true
foreach ($file in $requiredFiles) {
    if (Test-Path $file) {
        Write-Host "   ✅ $file" -ForegroundColor Green
    } else {
        Write-Host "   ❌ $file - MISSING!" -ForegroundColor Red
        $allFilesPresent = $false
    }
}

# Check images directory
if (Test-Path "images") {
    $imageCount = (Get-ChildItem -Path "images" -Recurse -File -Filter "*.jpg" -ErrorAction SilentlyContinue).Count
    Write-Host "   ✅ images/ ($imageCount images found)" -ForegroundColor Green
} else {
    Write-Host "   ❌ images/ - MISSING!" -ForegroundColor Red
    $allFilesPresent = $false
}

# Check functions directory
if (Test-Path "functions/api/lead.js") {
    Write-Host "   ✅ functions/api/lead.js" -ForegroundColor Green
} else {
    Write-Host "   ⚠️  functions/api/lead.js - Not found (lead form won't work)" -ForegroundColor Yellow
}

Write-Host ""

if (-not $allFilesPresent) {
    Write-Host "   ❌ Some required files are missing!" -ForegroundColor Red
    Write-Host "   Please ensure all files are in the correct location." -ForegroundColor Yellow
    exit 1
}

# Step 5: Deploy to Cloudflare Pages
if (-not $SkipDeploy) {
    Write-Host "🚀 Step 5: Deploying to Cloudflare Pages..." -ForegroundColor Cyan
    Write-Host "   Project: $ProjectName" -ForegroundColor Gray
    Write-Host "   This may take 30-60 seconds..." -ForegroundColor Gray
    Write-Host ""
    
    npx wrangler pages deploy . --project-name=$ProjectName --commit-dirty=true
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host ""
        Write-Host "   ✅ Deployment successful!" -ForegroundColor Green
    } else {
        Write-Host ""
        Write-Host "   ❌ Deployment failed!" -ForegroundColor Red
        Write-Host "   Check the error message above for details." -ForegroundColor Yellow
        exit 1
    }
} else {
    Write-Host "⏭️  Step 5: Skipping deployment (--SkipDeploy flag used)" -ForegroundColor Yellow
}
Write-Host ""

# Step 6: Configure custom domain
Write-Host "🌐 Step 6: Custom Domain Configuration" -ForegroundColor Cyan
Write-Host ""
Write-Host "   The custom domain must be configured in the Cloudflare dashboard:" -ForegroundColor Yellow
Write-Host ""
Write-Host "   1. Go to: https://dash.cloudflare.com" -ForegroundColor White
Write-Host "   2. Click: Workers & Pages → Pages tab" -ForegroundColor White
Write-Host "   3. Click: $ProjectName project" -ForegroundColor White
Write-Host "   4. Click: Custom domains" -ForegroundColor White
Write-Host "   5. Add domain: $Domain" -ForegroundColor White
Write-Host "   6. Add domain: www.$Domain" -ForegroundColor White
Write-Host ""
Write-Host "   Cloudflare will automatically configure DNS records." -ForegroundColor Gray
Write-Host ""

# Step 7: Set environment variables
Write-Host "⚙️  Step 7: Environment Variables for Leviathan AI Integration" -ForegroundColor Cyan
Write-Host ""
Write-Host "   For the AI lead generation to work, add these in Cloudflare dashboard:" -ForegroundColor Yellow
Write-Host ""
Write-Host "   Settings → Environment variables → Production:" -ForegroundColor White
Write-Host "   🤖 LEVIATHAN SWARM CONNECTION:" -ForegroundColor Cyan
Write-Host "   • LEVIATHAN_WEBHOOK_URL (Your Leviathan endpoint)" -ForegroundColor Gray
Write-Host "   • LEVIATHAN_API_KEY     (AI authentication key)" -ForegroundColor Gray
Write-Host ""
Write-Host "   📧 EMAIL & SMS NOTIFICATIONS:" -ForegroundColor Cyan
Write-Host "   • SENDGRID_API_KEY      (Email service)" -ForegroundColor Gray
Write-Host "   • OWNER_EMAIL           (Your email address)" -ForegroundColor Gray
Write-Host "   • TWILIO_ACCOUNT_SID    (SMS service)" -ForegroundColor Gray
Write-Host "   • TWILIO_AUTH_TOKEN     (SMS auth)" -ForegroundColor Gray
Write-Host "   • TWILIO_PHONE          (Your Twilio number)" -ForegroundColor Gray
Write-Host "   • OWNER_PHONE           (Your phone: +15555551234)" -ForegroundColor Gray
Write-Host ""
Write-Host "   📊 OPTIONAL STORAGE:" -ForegroundColor Cyan
Write-Host "   • LEADS_KV              (KV namespace binding)" -ForegroundColor Gray
Write-Host ""

# Step 8: Verification
Write-Host "✅ Step 8: Verification Checklist" -ForegroundColor Cyan
Write-Host ""
Write-Host "   After completing the manual steps above, verify:" -ForegroundColor Yellow
Write-Host ""
Write-Host "   [ ] Remove conflicting Worker (if it exists)" -ForegroundColor White
Write-Host "   [ ] Add custom domains in Pages settings" -ForegroundColor White
Write-Host "   [ ] Wait 2-3 minutes for DNS propagation" -ForegroundColor White
Write-Host "   [ ] Visit: https://$Domain" -ForegroundColor White
Write-Host "   [ ] See your website (NOT 'Hello World')" -ForegroundColor White
Write-Host "   [ ] All images load correctly" -ForegroundColor White
Write-Host "   [ ] Contact form displays" -ForegroundColor White
Write-Host "   [ ] Add environment variables for lead form" -ForegroundColor White
Write-Host ""

# Final summary
Write-Host "═══════════════════════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host "   🎉 Deployment Process Complete!" -ForegroundColor Green
Write-Host "═══════════════════════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host ""
Write-Host "📋 NEXT STEPS (Manual - Required):" -ForegroundColor Yellow
Write-Host ""
Write-Host "1. 🗑️  Remove the Worker showing 'Hello World':" -ForegroundColor White
Write-Host "   https://dash.cloudflare.com → Workers & Pages → Workers tab" -ForegroundColor Gray
Write-Host ""
Write-Host "2. 🌐 Add custom domain to your Pages project:" -ForegroundColor White
Write-Host "   https://dash.cloudflare.com → Workers & Pages → Pages → $ProjectName" -ForegroundColor Gray
Write-Host ""
Write-Host "3. ⚙️  Add environment variables (for lead form):" -ForegroundColor White
Write-Host "   In Pages project → Settings → Environment variables" -ForegroundColor Gray
Write-Host ""
Write-Host "4. 🧹 Clear cache:" -ForegroundColor White
Write-Host "   https://dash.cloudflare.com → Caching → Purge Everything" -ForegroundColor Gray
Write-Host ""
Write-Host "5. ⏰ Wait 2-3 minutes, then visit:" -ForegroundColor White
Write-Host "   https://$Domain" -ForegroundColor Cyan
Write-Host ""
Write-Host "═══════════════════════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host ""
Write-Host "📞 Support Documentation:" -ForegroundColor Yellow
Write-Host "   • DEPLOYMENT-SUCCESS.md - Complete setup guide" -ForegroundColor Gray
Write-Host "   • DEPLOY-FIX.md - Troubleshooting guide" -ForegroundColor Gray
Write-Host ""
Write-Host "✨ Your professional website is ready to capture leads!" -ForegroundColor Green
Write-Host ""