# 🏗️ Hardhat Handyman Website + Leviathan AI

**Live Site:** https://hardhat-handyman.com  
**Repository:** https://github.com/chazam41892-gif/hardhat-handyman  
**Powered by:** Cloudflare Pages + Leviathan AI Swarm

---

## 🎯 What This Is

A professional handyman services website with integrated AI lead generation system. Every contact form submission flows through a 3-layer AI architecture that scores, qualifies, and delivers leads directly to your inbox.

### Key Features:
- 🎨 Beautiful, responsive design with 59 professional photos
- 🤖 AI-powered lead qualification and scoring
- 📧 Automated customer responses
- 📱 Urgent SMS notifications for high-priority leads
- ⚡ Fast, global CDN delivery via Cloudflare
- 🔒 Secure, SSL-enabled
- 📊 Lead deduplication and enrichment

---

## 🚀 Quick Deploy (One Command)

```powershell
.\push-and-deploy.ps1
```

**That's it!** This single command:
1. ✅ Stages all changes
2. ✅ Commits to git
3. ✅ Pushes to GitHub
4. ✅ Deploys to Cloudflare Pages
5. ✅ Makes your site live

---

## 🏗️ Architecture

```
┌─────────────────────────────────┐
│   Website (hardhat-handyman)    │
│   - Contact form captures leads │
└────────────┬────────────────────┘
             │
             ▼
┌─────────────────────────────────┐
│   Cloudflare Pages Function     │
│   /api/lead.js                  │
│   - AI scoring & enrichment     │
└────────────┬────────────────────┘
             │
             ▼
┌═════════════════════════════════════════════════════════════┐
║        LEVIATHAN AI SWARM (3-Layer Architecture)            ║
╠═════════════════════════════════════════════════════════════╣
║  INPUT LAYER → MEMORY LAYER → OUTPUT LAYER                  ║
║       ↓              ↓              ↓                        ║
║  ManualInput →  LeadScorer →  EmailCompiler                ║
║  WebScraper →   Deduplication     ↓                         ║
║  CSVImport      MemoryLayer   Gmail Delivery                ║
║                                   ↓                          ║
║                     chazam41892@gmail.com                   ║
║                     metanoiaunlimited418@gmail.com          ║
╚═════════════════════════════════════════════════════════════╝
```

**Full Architecture Documentation:** [LEVIATHAN-INTEGRATION.md](LEVIATHAN-INTEGRATION.md)

---

## 📁 Project Structure

```
hardhat-handyman/
├── index.html                  # Main website (989 lines)
├── functions/api/lead.js       # 🤖 Leviathan AI integration  
├── images/                     # 59 professional photos
├── _headers                    # Caching rules
├── _routes.json                # Function routing
├── wrangler.toml               # Cloudflare config
│
├── Scripts/
│   ├── push-and-deploy.ps1    # ⭐ Main deploy script
│   ├── fix-deployment.ps1     # Configuration helper
│   ├── quick-check.ps1        # Test site
│   └── RUN-THIS.ps1           # Interactive menu
│
└── Docs/
    ├── LEVIATHAN-INTEGRATION.md  # AI architecture
    ├── GITHUB-DEPLOY.md          # Deployment guide
    └── DEPLOY-FIX.md             # Troubleshooting
```

---

## ⚙️ Setup (One-Time)

### 1. Install Dependencies
```powershell
git clone https://github.com/chazam41892-gif/hardhat-handyman.git
cd hardhat-handyman
npm install
```

### 2. Configure Cloudflare Environment Variables

Go to: [Cloudflare Dashboard](https://dash.cloudflare.com) → Workers & Pages → hardhat-handyman → Settings → Environment variables

**Required for AI:**
```bash
LEVIATHAN_WEBHOOK_URL="https://your-leviathan-endpoint.com/api/lead"
LEVIATHAN_API_KEY="your_api_key"
```

**Optional (Auto-responses & SMS):**
```bash
SENDGRID_API_KEY="SG.xxxxx"
OWNER_EMAIL="info@hardhat-handyman.com"
TWILIO_ACCOUNT_SID="ACxxxxx"
TWILIO_AUTH_TOKEN="xxxxx"
TWILIO_PHONE="+15555551234"
OWNER_PHONE="+15555559999"
```

### 3. Deploy
```powershell
.\push-and-deploy.ps1
```

**Done!** 🎉

---

## 🤖 How the AI Works

### When a customer fills out the contact form:

```javascript
// 1. Website captures
{
  name: "Sarah Johnson",
  email: "sarah@email.com",
  phone: "555-0198",
  message: "Need urgent roof repair - water leaking!"
}

// 2. Cloudflare enriches with AI
{
  lead_id: "HH-1708358400-ABC123",
  score: 0.90,  // 90/100 quality score
  priority: "high",
  urgency: "urgent",
  project_type: ["roofing"],
  estimated_value: "$8,000-$30,000",
  ai_insights: ["⚠️ WATER EMERGENCY - Priority response"]
}

// 3. Leviathan processes in 3 layers
// INPUT → ManualInputAgent receives
// MEMORY → LeadScorer validates, Dedup checks
// OUTPUT → EmailCompiler sends to your Gmail

// 4. You receive formatted email report
// Recipients: chazam41892@gmail.com, metanoiaunlimited418@gmail.com
```

**Lead Scoring Details:** See [LEVIATHAN-INTEGRATION.md](LEVIATHAN-INTEGRATION.md)

---

## 📊 AI Classification

The system automatically detects:

**Project Types:**
- Roofing, Flooring, Outdoor, Bathroom, Kitchen, Painting, Electrical, Plumbing, Renovation

**Priority Levels:**
- `high` - Emergency/urgent keywords
- `medium-high` - Large projects, renovation
- `medium` - Standard inquiry
- `medium-low` - Basic contact

**Urgency:**
- `urgent` - Emergency, ASAP, water damage
- `normal` - This week, soon
- `low` - Planning, considering

---

## 🚀 Deployment Options

### Option 1: Automated Script ⭐ (Recommended)
```powershell
.\push-and-deploy.ps1
```

### Option 2: GitHub Actions (Auto-deploy on push)
```powershell
# Already configured! Just push to main:
git push origin main
```
Workflow: `.github/workflows/deploy.yml`

### Option 3: Manual
```powershell
git add .
git commit -m "Update site"
git push origin main
npx wrangler pages deploy . --project-name=hardhat-handyman
```

**Full Deployment Guide:** [GITHUB-DEPLOY.md](GITHUB-DEPLOY.md)

---

## 🧪 Testing

### Quick Health Check:
```powershell
.\quick-check.ps1
```

### Test Lead Submission:
```powershell
$body = @{
    name = "Test User"
    email = "test@example.com"
    phone = "555-0123"
    message = "Need urgent roof repair"
} | ConvertTo-Json

Invoke-WebRequest -Uri "https://hardhat-handyman.com/api/lead" `
    -Method POST -Body $body -ContentType "application/json"
```

### View Live Logs:
```powershell
npx wrangler pages deployment tail --project-name=hardhat-handyman
```

---

## 🛠️ Local Development

```powershell
# Start local server
npm run dev

# Opens at: http://localhost:8788
```

---

## 🚨 Common Issues

### "Hello World" Still Showing?
**Solution:** Remove conflicting Cloudflare Worker
1. Dashboard → Workers & Pages → Workers tab
2. Delete any Worker with routes to your domain
3. Caching → Purge Everything

### Deployment Failed?
```powershell
npx wrangler login
.\push-and-deploy.ps1
```

### Form Not Working?
- Check environment variables are set
- Verify `/api/lead` function deployed
- Check browser console for errors

**Complete Troubleshooting:** [DEPLOY-FIX.md](DEPLOY-FIX.md)

---

## 📈 Roadmap

### Phase 2: Enhanced AI Agents
- [ ] Auto-schedule follow-ups
- [ ] Generate project estimates
- [ ] Conversion tracking

### Phase 3: Mobile App
- [ ] Progressive Web App (PWA)
- [ ] Real-time notifications
- [ ] Job scheduling

### Phase 4: Voice AI
- [ ] Phone call integration
- [ ] Speech-to-text processing
- [ ] AI voice assistant

---

## 📞 Links & Resources

| Resource | URL |
|----------|-----|
| **Live Site** | https://hardhat-handyman.com |
| **GitHub Repo** | https://github.com/chazam41892-gif/hardhat-handyman |
| **Cloudflare** | https://dash.cloudflare.com |
| **Preview URL** | https://hardhat-handyman.pages.dev |

**Lead Recipients:**
- chazam41892@gmail.com
- metanoiaunlimited418@gmail.com

**Documentation:**
- [LEVIATHAN-INTEGRATION.md](LEVIATHAN-INTEGRATION.md) - Complete AI architecture
- [GITHUB-DEPLOY.md](GITHUB-DEPLOY.md) - Full deployment guide
- [DEPLOYMENT-SUCCESS.md](DEPLOYMENT-SUCCESS.md) - Setup checklist
- [DEPLOY-FIX.md](DEPLOY-FIX.md) - Troubleshooting guide

---

## 🎯 Quick Commands

| Command | Purpose |
|---------|---------|
| `.\push-and-deploy.ps1` | Deploy everything (git + Cloudflare) |
| `.\quick-check.ps1` | Test if site is working |
| `.\fix-deployment.ps1` | Configure and troubleshoot |
| `npm run dev` | Local development server |
| `npx wrangler pages deployment tail` | View live logs |

---

## 📄 License

© 2024-2026 Hardhat Handyman. All rights reserved.  
Powered by **Leviathan AI** | Metanoia Unlimited

---

## 🎉 Ready to Deploy?

```powershell
# Clone repository
git clone https://github.com/chazam41892-gif/hardhat-handyman.git
cd hardhat-handyman

# Install dependencies
npm install

# Deploy to production
.\push-and-deploy.ps1
```

**Your site will be live at hardhat-handyman.com in less than 2 minutes!** 🚀

---

**Questions?** Check the [GITHUB-DEPLOY.md](GITHUB-DEPLOY.md) guide or review [LEVIATHAN-INTEGRATION.md](LEVIATHAN-INTEGRATION.md) for AI architecture details.
