# 🔐 GitHub Secrets Setup Guide

Complete step-by-step instructions to enable automatic deployment when you push code to GitHub.

---

## 🎯 What This Does

Once configured, every time you run `git push origin main`, GitHub Actions will automatically deploy your site to Cloudflare Pages. No manual deployment needed!

---

## 📋 Prerequisites

- ✅ GitHub repository created: https://github.com/chazam41892-gif/hardhat-handyman
- ✅ Cloudflare account with Pages project
- ✅ 5 minutes to get your credentials

---

## 🔑 Required Secrets

You need to add 2 secrets to your GitHub repository:

| Secret Name | What It Is | Where to Get It |
|-------------|------------|-----------------|
| `CLOUDFLARE_API_TOKEN` | Authentication token for Wrangler | Cloudflare Dashboard |
| `CLOUDFLARE_ACCOUNT_ID` | Your Cloudflare account identifier | Cloudflare Dashboard |

---

## 📖 Step-by-Step Instructions

### Part 1: Get Your Cloudflare Account ID

**Time: 1 minute**

1. **Go to Cloudflare Dashboard:**
   - Open: https://dash.cloudflare.com
   - Log in to your account

2. **Navigate to Pages:**
   - Click **"Workers & Pages"** in the left sidebar
   - Click on your **"hardhat-handyman"** project

3. **Find Your Account ID:**
   - Look at the URL in your browser. It will look like:
     ```
     https://dash.cloudflare.com/abc123def456/pages/view/hardhat-handyman
                                    ^^^^^^^^^^^^
                                    This is your Account ID
     ```
   - **Copy the part between the first two slashes** (e.g., `abc123def456`)
   - Or scroll down on any Pages page and look for **"Account ID"** on the right sidebar

4. **Save this for later** - you'll need it in Part 3

---

### Part 2: Create Cloudflare API Token

**Time: 2 minutes**

1. **Go to API Tokens Page:**
   - Open: https://dash.cloudflare.com/profile/api-tokens
   - Or: Dashboard → My Profile → API Tokens

2. **Create New Token:**
   - Click **"Create Token"** button (blue button, top right)

3. **Use the Template:**
   - Find **"Edit Cloudflare Workers"** template
   - Click **"Use template"** button next to it

4. **Configure Token Permissions:**
   
   Make sure these permissions are set:
   
   | Permission Type | Permission | Access |
   |----------------|-----------|--------|
   | Account | Cloudflare Pages | Edit |
   | Account | Workers Scripts | Edit |
   | Zone | Zone | Read |
   | Zone | DNS | Edit |

5. **Set Account Resources:**
   - Under **"Account Resources"**
   - Select: **Include** → **All accounts**
   - Or select your specific account if you prefer

6. **Optional - Set Token Expiration:**
   - You can leave it as **"Never expires"** (recommended for automation)
   - Or set a custom expiration date

7. **Create the Token:**
   - Click **"Continue to summary"**
   - Review the permissions
   - Click **"Create Token"**

8. **IMPORTANT - Copy Your Token:**
   - You'll see a screen with your new API token
   - It looks like: `abc123XYZ789_very_long_random_string`
   - **❗ Click "Copy" and save it immediately!**
   - **⚠️ You can ONLY see this token ONCE. If you close this page, you'll need to create a new token.**
   - Paste it somewhere safe temporarily (like Notepad)

9. **Save this for Part 3**

---

### Part 3: Add Secrets to GitHub

**Time: 2 minutes**

1. **Go to Your Repository Settings:**
   - Open: https://github.com/chazam41892-gif/hardhat-handyman
   - Click the **"Settings"** tab (top right, near the star button)

2. **Navigate to Secrets:**
   - In the left sidebar, find **"Secrets and variables"**
   - Click to expand it
   - Click **"Actions"** underneath

3. **Add First Secret - API Token:**
   
   - Click **"New repository secret"** (green button, top right)
   - **Name:** `CLOUDFLARE_API_TOKEN` (must be exact, all caps)
   - **Secret:** Paste the long token from Part 2, Step 8
   - Click **"Add secret"**

4. **Add Second Secret - Account ID:**
   
   - Click **"New repository secret"** again
   - **Name:** `CLOUDFLARE_ACCOUNT_ID` (must be exact, all caps)
   - **Secret:** Paste the Account ID from Part 1, Step 3
   - Click **"Add secret"**

5. **Verify Your Secrets:**
   
   You should now see 2 secrets listed:
   ```
   CLOUDFLARE_API_TOKEN       Updated now by you
   CLOUDFLARE_ACCOUNT_ID      Updated now by you
   ```

---

## ✅ Test the Setup

Now that secrets are configured, test the auto-deployment:

### Method 1: Make a Small Change

```powershell
# Make a small change to trigger deployment
echo "# Test update $(Get-Date)" >> README.md
git add README.md
git commit -m "Test GitHub Actions deployment"
git push origin main
```

### Method 2: Manual Trigger

1. Go to: https://github.com/chazam41892-gif/hardhat-handyman/actions
2. Click on **"Deploy to Cloudflare Pages"** workflow
3. Click **"Run workflow"** dropdown
4. Click the green **"Run workflow"** button

---

## 📊 Monitor Deployment

After pushing code:

1. **Go to Actions Tab:**
   - https://github.com/chazam41892-gif/hardhat-handyman/actions

2. **Watch the Workflow:**
   - You'll see a yellow dot 🟡 = Running
   - Green checkmark ✅ = Success
   - Red X ❌ = Failed

3. **View Logs:**
   - Click on the workflow run to see detailed logs
   - You can see each step of the deployment

4. **Check Your Site:**
   - After success, visit: https://hardhat-handyman.com
   - Changes should be live!

---

## 🎉 Success! Now What?

Once configured, your workflow is:

```powershell
# 1. Make changes to your site
code index.html

# 2. Push to GitHub
git add .
git commit -m "Updated hero section"
git push origin main

# 3. Wait 1-2 minutes
# GitHub automatically deploys to Cloudflare!

# 4. Check your live site
# https://hardhat-handyman.com
```

**No more manual deployments!** 🚀

---

## 🚨 Troubleshooting

### Error: "Authentication error"

**Problem:** Invalid API token

**Solution:**
1. Go back to: https://dash.cloudflare.com/profile/api-tokens
2. Delete the old token
3. Create a new token following Part 2 above
4. Update the `CLOUDFLARE_API_TOKEN` secret in GitHub

---

### Error: "Project not found"

**Problem:** Wrong Account ID or project name

**Solution:**
1. Verify your Account ID from Cloudflare Pages URL
2. Update `CLOUDFLARE_ACCOUNT_ID` in GitHub secrets
3. Check that project name is exactly: `hardhat-handyman`

---

### Error: "Pages Deploy failed"

**Problem:** Wrangler version mismatch

**Solution:**
Already fixed! The workflow now uses wrangler v4. If you still see this:
1. Check that `.github/workflows/deploy.yml` has `wranglerVersion: '4.67.0'`
2. If not, run: `git pull origin main` to get latest version

---

### Workflow Doesn't Start

**Problem:** Secrets not set or workflow file missing

**Solution:**
1. Verify both secrets exist at: https://github.com/chazam41892-gif/hardhat-handyman/settings/secrets/actions
2. Verify workflow file exists at: `.github/workflows/deploy.yml`
3. Try manual trigger from Actions tab

---

## 📚 Reference Links

| Resource | URL |
|----------|-----|
| **GitHub Secrets** | https://github.com/chazam41892-gif/hardhat-handyman/settings/secrets/actions |
| **GitHub Actions** | https://github.com/chazam41892-gif/hardhat-handyman/actions |
| **Cloudflare API Tokens** | https://dash.cloudflare.com/profile/api-tokens |
| **Cloudflare Pages** | https://dash.cloudflare.com → Workers & Pages |
| **Wrangler Docs** | https://developers.cloudflare.com/workers/wrangler/ |

---

## 🔐 Security Notes

- ✅ **Never commit secrets to your repository**
- ✅ Secrets are encrypted by GitHub and never exposed in logs
- ✅ Only repository admins can view/modify secrets
- ✅ API tokens can be revoked anytime from Cloudflare dashboard
- ✅ Use token expiration if you want extra security

---

## 💡 Pro Tips

**Tip 1: Use the Local Script for Testing**
```powershell
# Test locally before pushing
.\push-and-deploy.ps1
```

**Tip 2: Add Deploy Status Badge**

Add this to your README to show deployment status:

```markdown
![Deploy Status](https://github.com/chazam41892-gif/hardhat-handyman/actions/workflows/deploy.yml/badge.svg)
```

**Tip 3: Disable Auto-Deploy Temporarily**

To pause auto-deployments without removing secrets:
1. Go to: https://github.com/chazam41892-gif/hardhat-handyman/actions
2. Click "Deploy to Cloudflare Pages"
3. Click "..." menu → "Disable workflow"

Re-enable when ready!

---

## 🎯 Summary

**What You Just Set Up:**

1. ✅ Cloudflare API Token - Lets GitHub deploy to Cloudflare
2. ✅ Cloudflare Account ID - Identifies your account
3. ✅ GitHub Secrets - Securely stores credentials
4. ✅ GitHub Actions - Automatically deploys on every push

**Your New Workflow:**

```
Code Change → git push → GitHub Actions → Cloudflare → Live Site
               1 min                1 min             INSTANT
```

**Total time from code to production: ~2 minutes!** 🚀

---

## ❓ Need Help?

If you get stuck:

1. **Check the workflow logs**: https://github.com/chazam41892-gif/hardhat-handyman/actions
2. **Verify your secrets are set** (names must match exactly)
3. **Test local deployment first**: `.\push-and-deploy.ps1`
4. **Check Cloudflare dashboard** for any issues

---

**Last Updated:** February 19, 2026  
**Wrangler Version:** 4.67.0  
**GitHub Actions:** v3
