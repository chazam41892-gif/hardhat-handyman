#!/usr/bin/env pwsh
# Complete GitHub Push & Cloudflare Deploy Script
# Automates: git add → commit → push → deploy

param(
    [string]$CommitMessage = "Update Hardhat Handyman site with Leviathan AI integration",
    [switch]$SkipGitHub = $false,
    [switch]$SkipDeploy = $false
)

Write-Host ""
Write-Host "═══════════════════════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host "   🚀 GitHub Push & Cloudflare Deploy" -ForegroundColor Yellow
Write-Host "   Hardhat Handyman + Leviathan AI" -ForegroundColor Yellow
Write-Host "═══════════════════════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host ""

$ErrorActionPreference = "Stop"

# ═══════════════════════════════════════════════════════════════════
# STEP 1: Git Status Check
# ═══════════════════════════════════════════════════════════════════

Write-Host "📊 Step 1: Checking Git status..." -ForegroundColor Cyan
$gitStatus = git status --porcelain
if ($gitStatus) {
    Write-Host "   ✓ Changes detected:" -ForegroundColor Green
    git status --short
} else {
    Write-Host "   ℹ️  No changes to commit" -ForegroundColor Blue
    if ($SkipDeploy) {
        Write-Host "   Nothing to do. Exiting." -ForegroundColor Gray
        exit 0
    }
}
Write-Host ""

# ═══════════════════════════════════════════════════════════════════
# STEP 2: Add All Changes
# ═══════════════════════════════════════════════════════════════════

if (-not $SkipGitHub -and $gitStatus) {
    Write-Host "📦 Step 2: Staging files for commit..." -ForegroundColor Cyan
    
    # Add all files except backup
    git add .
    git reset HEAD functions/api/lead.js.backup 2>$null
    
    Write-Host "   ✓ Files staged" -ForegroundColor Green
    Write-Host ""
    
    # ═══════════════════════════════════════════════════════════════════
    # STEP 3: Commit Changes
    # ═══════════════════════════════════════════════════════════════════
    
    Write-Host "💾 Step 3: Creating commit..." -ForegroundColor Cyan
    Write-Host "   Message: $CommitMessage" -ForegroundColor Gray
    
    git commit -m "$CommitMessage"
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host "   ✓ Commit created" -ForegroundColor Green
    } else {
        Write-Host "   ⚠️  Commit failed or nothing to commit" -ForegroundColor Yellow
    }
    Write-Host ""
    
    # ═══════════════════════════════════════════════════════════════════
    # STEP 4: Push to GitHub
    # ═══════════════════════════════════════════════════════════════════
    
    Write-Host "🌐 Step 4: Pushing to GitHub..." -ForegroundColor Cyan
    Write-Host "   Repository: https://github.com/chazam41892-gif/hardhat-handyman.git" -ForegroundColor Gray
    
    git push origin main
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host "   ✓ Pushed to GitHub successfully" -ForegroundColor Green
    } else {
        Write-Host "   ❌ Push failed!" -ForegroundColor Red
        Write-Host "   You may need to pull first: git pull origin main" -ForegroundColor Yellow
        exit 1
    }
    Write-Host ""
} else {
    Write-Host "⏭️  Skipping GitHub push" -ForegroundColor Yellow
    Write-Host ""
}

# ═══════════════════════════════════════════════════════════════════
# STEP 5: Deploy to Cloudflare Pages
# ═══════════════════════════════════════════════════════════════════

if (-not $SkipDeploy) {
    Write-Host "🚀 Step 5: Deploying to Cloudflare Pages..." -ForegroundColor Cyan
    Write-Host "   This will make your site live at hardhat-handyman.com" -ForegroundColor Gray
    Write-Host ""
    
    npx wrangler pages deploy . --project-name=hardhat-handyman --commit-dirty=true
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host ""
        Write-Host "   ✓ Deployment successful!" -ForegroundColor Green
    } else {
        Write-Host ""
        Write-Host "   ❌ Deployment failed!" -ForegroundColor Red
        exit 1
    }
} else {
    Write-Host "⏭️  Skipping Cloudflare deployment" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "═══════════════════════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host "   ✅ COMPLETE!" -ForegroundColor Green
Write-Host "═══════════════════════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host ""
Write-Host "📍 Your site is live at:" -ForegroundColor Cyan
Write-Host "   • https://hardhat-handyman.com" -ForegroundColor White
Write-Host "   • https://www.hardhat-handyman.com" -ForegroundColor White
Write-Host "   • https://hardhat-handyman.pages.dev" -ForegroundColor Gray
Write-Host ""
Write-Host "📂 GitHub Repository:" -ForegroundColor Cyan
Write-Host "   https://github.com/chazam41892-gif/hardhat-handyman" -ForegroundColor White
Write-Host ""
Write-Host "🤖 Leviathan AI Status:" -ForegroundColor Cyan
Write-Host "   Integration ready - configure webhook in Cloudflare dashboard" -ForegroundColor White
Write-Host ""
Write-Host "📋 Next Steps:" -ForegroundColor Yellow
Write-Host "   1. Configure environment variables in Cloudflare" -ForegroundColor White
Write-Host "   2. Set up Leviathan webhook URL" -ForegroundColor White
Write-Host "   3. Remove any conflicting Workers showing 'Hello World'" -ForegroundColor White
Write-Host "   4. Test form submission at hardhat-handyman.com" -ForegroundColor White
Write-Host ""
