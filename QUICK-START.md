# 🚀 Quick Start Guide

Get your Hardhat Handyman website live on Cloudflare Pages in 5 minutes!

## Option 1: Deploy via Cloudflare Dashboard (Easiest)

### Step 1: Push to GitHub
Your repository is already on GitHub at: `https://github.com/chazam41892-gif/hardhat-handyman`

### Step 2: Connect to Cloudflare Pages

1. Go to https://dash.cloudflare.com/
2. Login or create a free account
3. Click "Workers & Pages" in the left sidebar
4. Click "Create application" → "Pages" → "Connect to Git"
5. Authorize Cloudflare to access your GitHub
6. Select repository: `chazam41892-gif/hardhat-handyman`
7. Click "Begin setup"

### Step 3: Configure Deployment

```
Project name:          hardhat-handyman
Production branch:     main
Build command:         (leave empty)
Build output directory: /
```

Click "Save and Deploy"

### Step 4: Wait for Deployment
- First deployment takes 1-2 minutes
- You'll get a URL: `https://hardhat-handyman.pages.dev`
- Every push to `main` branch auto-deploys!

### Step 5: Test Your Site
Visit your new URL and verify:
- ✅ Homepage loads
- ✅ Navigation works
- ✅ Contact form displays
- ✅ Responsive on mobile

## Option 2: Deploy via Wrangler CLI

### Prerequisites
```bash
# Install Node.js if you don't have it
# Download from: https://nodejs.org/

# Install Wrangler globally
npm install -g wrangler
```

### Deploy Steps
```bash
# 1. Login to Cloudflare
wrangler login

# 2. Deploy from repository root
cd /path/to/hardhat-handyman
wrangler pages publish . --project-name=hardhat-handyman

# 3. Your site is live!
```

## What You Get

✅ **Live Website**: Professional handyman services site  
✅ **Free Hosting**: No cost for basic usage  
✅ **Global CDN**: Fast loading worldwide  
✅ **Auto SSL/HTTPS**: Secure by default  
✅ **Auto Deployments**: Push code → auto deploy  
✅ **Custom Domain**: Add your own domain (optional)  
✅ **Preview Deploys**: PRs get preview URLs  

## Next Steps

### 1. Add Your Branding
- Replace emoji logo with your actual logo
- Update colors in `css/styles.css`
- Add your business photos to `assets/`

### 2. Customize Content
- Edit service descriptions in `index.html`
- Update contact information
- Add your service areas

### 3. Set Up Lead Generation (Optional)

#### Quick Version (Client-Side)
Already implemented! Form saves to browser localStorage.

#### Production Version (Server-Side)
1. Deploy Cloudflare Worker from `workers/contact-form.js`
2. Set up D1 database using `schema.sql`
3. Update form in `js/main.js` to POST to Worker
4. Configure email notifications

**Detailed instructions**: See [DEPLOYMENT.md](DEPLOYMENT.md)

### 4. Add Custom Domain
1. In Cloudflare Pages dashboard
2. Go to "Custom domains" tab
3. Click "Set up a custom domain"
4. Follow the DNS instructions
5. Your site at `yourcompany.com` in 5 minutes!

### 5. Enable Analytics
1. Cloudflare Pages dashboard
2. Click "Web Analytics"
3. Enable free analytics
4. View visitor stats, page views, etc.

## Local Development

Test changes locally before deploying:

```bash
# Option 1: Using Python
python3 -m http.server 8000

# Option 2: Using npx
npx http-server -p 8000

# Option 3: Using npm scripts (if package.json installed)
npm start

# Then visit: http://localhost:8000
```

## File Structure Reference

```
Your Repository
├── index.html          ← Main page (REQUIRED)
├── css/styles.css      ← Styling
├── js/main.js          ← Functionality
├── assets/             ← Your images go here
├── _headers            ← Security settings
├── _redirects          ← URL routing
└── DEPLOYMENT.md       ← Detailed docs
```

**Full details**: See [FILE-PLACEMENT-GUIDE.md](FILE-PLACEMENT-GUIDE.md)

## Troubleshooting

### Site shows blank page?
- Check `index.html` is in root directory
- Look at browser console for errors
- Check Cloudflare Pages deployment logs

### CSS not loading?
- Verify file path: `css/styles.css`
- Check file is committed to Git
- Clear browser cache

### Form not working?
- Current version saves to localStorage (client-side)
- For production, deploy the Worker
- See [DEPLOYMENT.md](DEPLOYMENT.md) for Worker setup

## Cost Breakdown

Cloudflare Pages (Free Tier):
- ✅ Unlimited sites
- ✅ Unlimited requests
- ✅ 500 builds/month
- ✅ 100 GB bandwidth/month
- ✅ Free SSL/HTTPS
- ✅ Free DDoS protection

This is more than enough for most small business websites!

## Support

- 📖 [Full Documentation](README.md)
- 🚀 [Deployment Guide](DEPLOYMENT.md)
- 📁 [File Placement](FILE-PLACEMENT-GUIDE.md)
- 🌐 [Cloudflare Docs](https://developers.cloudflare.com/pages/)

## Common Questions

**Q: Do I need a credit card?**  
A: No! Cloudflare Pages free tier requires no payment.

**Q: Can I use my own domain?**  
A: Yes! Add custom domain in Cloudflare dashboard.

**Q: How do I update the site?**  
A: Just push changes to GitHub. Auto-deploys!

**Q: Can I see preview before deploying?**  
A: Yes! Pull requests get preview URLs automatically.

**Q: Where are form submissions stored?**  
A: Currently in browser localStorage. Deploy Worker for database storage.

---

## 🎉 You're Ready!

Your website is ready to deploy. Follow Option 1 above and you'll be live in minutes!

Need help? Check the full documentation in this repository.
