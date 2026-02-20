# 🚀 GitHub & Deployment Guide - Hardhat Handyman

## ✅ Your GitHub Repository

**Repository:** https://github.com/chazam41892-gif/hardhat-handyman  
**Status:** Already connected and configured  
**Branch:** main

---

## 🎯 THREE WAYS TO DEPLOY

### Option 1: Automated Script (Recommended) ⚡

Deploy with one command:

```powershell
.\push-and-deploy.ps1
```

**What it does:**
1. ✓ Stages all changes (`git add`)
2. ✓ Creates commit with smart message
3. ✓ Pushes to GitHub (`git push`)
4. ✓ Deploys to Cloudflare Pages
5. ✓ Shows deployment URL

**Custom commit message:**
```powershell
.\push-and-deploy.ps1 -CommitMessage "Fixed contact form bug"
```

**Only push to GitHub (no deploy):**
```powershell
.\push-and-deploy.ps1 -SkipDeploy
```

**Only deploy (no GitHub push):**
```powershell
.\push-and-deploy.ps1 -SkipGitHub
```

---

### Option 2: GitHub Actions (Auto-Deploy on Push) 🤖

**Setup (One-time):**

1. **Get Cloudflare API Token:**
   ```powershell
   # Opens Cloudflare dashboard
   Start-Process "https://dash.cloudflare.com/profile/api-tokens"
   ```
   - Click **Create Token**
   - Use **Edit Cloudflare Workers** template
   - Copy the token

2. **Get Account ID:**
   ```powershell
   npx wrangler whoami
   ```
   Look for: `Account ID: xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx`

3. **Add Secrets to GitHub:**
   ```powershell
   # Opens your repository settings
   Start-Process "https://github.com/chazam41892-gif/hardhat-handyman/settings/secrets/actions"
   ```
   
   Add two secrets:
   - `CLOUDFLARE_API_TOKEN` = (your token from step 1)
   - `CLOUDFLARE_ACCOUNT_ID` = (your account ID from step 2)

4. **Enable Workflow:**
   The workflow file is already created at `.github/workflows/deploy.yml`

**How it works:**
- Every time you push to `main` branch → auto-deploys to Cloudflare
- View deployments: https://github.com/chazam41892-gif/hardhat-handyman/actions

---

### Option 3: Manual Commands (Full Control) 🎮

```powershell
# 1. Stage all files
git add .

# 2. Commit with message
git commit -m "Update site with Leviathan AI integration"

# 3. Push to GitHub
git push origin main

# 4. Deploy to Cloudflare
npx wrangler pages deploy . --project-name=hardhat-handyman
```

---

## 📦 Files in Your Repository

```
hardhat-handyman/
├── .github/
│   └── workflows/
│       └── deploy.yml              ← Auto-deployment workflow
├── functions/
│   └── api/
│       ├── lead.js                 ← Leviathan AI integration
│       ├── image-transform.js
│       └── image-upload.js
├── images/                         ← All photos (59 images)
│   ├── gallery/
│   ├── logos/
│   └── meet-rocky/
├── index.html                      ← Main website
├── favicon.png
├── _headers                        ← Caching rules
├── _routes.json                    ← Function routing
├── wrangler.toml                   ← Cloudflare config
├── package.json
├── .gitignore
│
├── push-and-deploy.ps1             ← One-command deploy
├── fix-deployment.ps1              ← Fix & configure
├── deploy.ps1                      ← Simple deploy
├── quick-check.ps1                 ← Test deployment
├── RUN-THIS.ps1                    ← Main script
│
├── LEVIATHAN-INTEGRATION.md        ← AI architecture
├── DEPLOYMENT-SUCCESS.md           ← Setup guide
├── DEPLOY-FIX.md                   ← Troubleshooting
├── GITHUB-DEPLOY.md                ← This file
└── README.md
```

---

## 🔄 Typical Workflow

### Making Updates to Your Site:

1. **Edit files** (index.html, lead.js, etc.)

2. **Test locally** (optional):
   ```powershell
   npm run dev
   ```

3. **Deploy**:
   ```powershell
   .\push-and-deploy.ps1
   ```

4. **Verify**:
   ```powershell
   .\quick-check.ps1
   ```

That's it! Your changes are live.

---

## 🌐 Your Live URLs

| URL | Status | Purpose |
|-----|--------|---------|
| **hardhat-handyman.com** | 🎯 Production | Main public URL |
| **www.hardhat-handyman.com** | 🎯 Production | Www subdomain |
| **hardhat-handyman.pages.dev** | 📊 Staging | Cloudflare preview |

---

## 🤖 Leviathan AI Deployment

Your AI system runs separately. Two deployment options:

### Option A: Cloud Service (Recommended for Production)

**Railway.app** (Free tier available):
```powershell
# 1. Install Railway CLI
npm install -g @railway/cli

# 2. Login
railway login

# 3. Initialize project
railway init

# 4. Deploy
railway up
```

**Render.com** (Free tier):
- Go to: https://render.com
- New → Web Service
- Connect your `leviathan-of-hashem` repository
- Start command: `python wrangler.toml/.py`
- Get webhook URL: `https://your-app.onrender.com/api/lead`

**Fly.io**:
```powershell
# 1. Install Fly CLI
powershell -Command "iwr https://fly.io/install.ps1 -useb | iex"

# 2. Launch
fly launch

# 3. Deploy
fly deploy
```

### Option B: Local with Cloudflare Tunnel (Development)

```powershell
# 1. Install cloudflared
winget install Cloudflare.Cloudflare

# 2. Start Leviathan locally
python wrangler.toml/.py

# 3. Expose via tunnel (in another terminal)
cloudflared tunnel --url http://localhost:8000

# 4. Get URL like: https://random-name.trycloudflare.com
# 5. Use this as LEVIATHAN_WEBHOOK_URL
```

---

## ⚙️ Environment Variables Setup

After deploying, configure in Cloudflare:

1. **Go to dashboard:**
   ```powershell
   Start-Process "https://dash.cloudflare.com"
   ```

2. **Navigate to:**
   Workers & Pages → hardhat-handyman → Settings → Environment variables

3. **Add for Production:**

   ```bash
   # Leviathan Connection
   LEVIATHAN_WEBHOOK_URL="https://your-leviathan.railway.app/api/lead"
   LEVIATHAN_API_KEY="your_secure_key"
   
   # Email Services
   SENDGRID_API_KEY="SG.xxxxx"
   OWNER_EMAIL="info@hardhat-handyman.com"
   
   # SMS Services  
   TWILIO_ACCOUNT_SID="ACxxxxx"
   TWILIO_AUTH_TOKEN="xxxxx"
   TWILIO_PHONE="+15555551234"
   OWNER_PHONE="+15555559999"
   ```

4. **Save and Redeploy**

---

## 🧪 Testing Your Deployment

### Quick Test:
```powershell
.\quick-check.ps1
```

### Manual Test:
```powershell
# Test the lead form
$body = @{
    name = "Test User"
    email = "test@example.com"
    phone = "555-0123"
    message = "Test message for roof repair"
} | ConvertTo-Json

Invoke-WebRequest -Uri "https://hardhat-handyman.com/api/lead" `
    -Method POST `
    -Body $body `
    -ContentType "application/json"
```

### Check Logs:
```powershell
npx wrangler pages deployment tail --project-name=hardhat-handyman
```

---

## 🔧 Troubleshooting

### "Push rejected" error?
```powershell
# Pull changes first
git pull origin main

# Then push
git push origin main
```

### "Authentication failed"?
```powershell
# Re-authenticate
git config --global user.email "chazam41892@gmail.com"
git config --global user.name "chazam41892"

# Or use GitHub CLI
gh auth login
```

### Deployment fails?
```powershell
# Check authentication
npx wrangler whoami

# Re-login if needed
npx wrangler login
```

### Changes not showing on site?
1. Clear Cloudflare cache:
   - Dashboard → Caching → Purge Everything
2. Hard refresh browser: Ctrl + Shift + R
3. Wait 30-60 seconds for propagation

---

## 📊 Monitoring & Analytics

### View Deployments:
- **GitHub:** https://github.com/chazam41892-gif/hardhat-handyman/actions
- **Cloudflare:** https://dash.cloudflare.com → Workers & Pages → hardhat-handyman

### Check Traffic:
```powershell
Start-Process "https://dash.cloudflare.com/analytics"
```

### View Logs:
```powershell
# Real-time logs
npx wrangler pages deployment tail --project-name=hardhat-handyman

# Specific deployment
npx wrangler pages deployment tail --deployment-id=<ID>
```

---

## 🚀 Quick Reference Commands

| Task | Command |
|------|---------|
| **Deploy everything** | `.\push-and-deploy.ps1` |
| **Just push to GitHub** | `.\push-and-deploy.ps1 -SkipDeploy` |
| **Just deploy** | `.\push-and-deploy.ps1 -SkipGitHub` |
| **Check if working** | `.\quick-check.ps1` |
| **View logs** | `npx wrangler pages deployment tail` |
| **Test locally** | `npm run dev` |
| **Fix and deploy** | `.\fix-deployment.ps1` |

---

## 🎯 Complete Deployment Checklist

- [x] Repository connected to GitHub
- [x] Deployment scripts created
- [x] Leviathan AI integration added
- [x] GitHub Actions workflow configured
- [ ] Cloudflare environment variables set
- [ ] Leviathan swarm deployed and accessible
- [ ] Webhook URL configured
- [ ] Custom domain configured (hardhat-handyman.com)
- [ ] "Hello World" worker removed
- [ ] Test form submission successful
- [ ] Email notifications working
- [ ] SMS notifications working (optional)

---

## 📞 Support Resources

**Repository:** https://github.com/chazam41892-gif/hardhat-handyman  
**Website:** https://hardhat-handyman.com  
**Cloudflare Dashboard:** https://dash.cloudflare.com  
**Leviathan Docs:** LEVIATHAN-INTEGRATION.md

**Email Recipients (for leads):**
- chazam41892@gmail.com
- metanoiaunlimited418@gmail.com

---

## 🎉 You're Ready!

Your complete deployment pipeline:

```
Write Code → .\push-and-deploy.ps1 → GitHub → Cloudflare → LIVE SITE
                                             ↓
                                      Leviathan AI Swarm
                                             ↓
                                     Your Gmail Inbox
```

Just run `.\push-and-deploy.ps1` whenever you want to update your site! 🚀
