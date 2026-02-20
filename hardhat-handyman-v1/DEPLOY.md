# 🚀 CLOUDFLARE DEPLOYMENT - QUICK START

## ✅ FIXED - Ready to Deploy!

The `wrangler.jsonc` config file is now included. This fixes the deployment error.

---

## 📦 Deployment Steps (Windows PowerShell)

### Step 1: Extract the Zip
```powershell
# Extract to C:\Projects\
Expand-Archive -Path "hardhat-handyman-DEPLOY.zip" -DestinationPath "C:\Projects\"
```

### Step 2: Navigate to the Project
```powershell
cd C:\Projects\hardhat-handyman-v1
```

### Step 3: Deploy to Cloudflare
```powershell
npx wrangler deploy
```

That's it! The site will deploy automatically.

---

## 🔧 Alternative: Cloudflare Pages Dashboard

If you prefer using the web interface:

1. Go to https://dash.cloudflare.com
2. Click **Pages** → **Create a project**
3. Choose **Upload assets**
4. Upload the entire `hardhat-handyman-v1` folder
5. Set custom domain: **hardhat-handyman.com**
6. Click **Deploy**

---

## ⚙️ Post-Deployment Configuration

### 1. Add Google Ads Conversion ID
Edit `index.html` line 13:
```javascript
gtag('config', 'AW-CONVERSION_ID'); // Replace with your actual ID
```

### 2. Add Leviathan Webhook
Edit `functions/api/lead.js` line 91-96:
```javascript
await fetch('https://api.metanoiaunlimited.com/leviathan/leads', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(leadData)
});
```

### 3. Test the Contact Form
- Visit your deployed site
- Fill out the contact form
- Check that leads are being captured

---

## 📁 What's Inside

- ✅ `index.html` - Main website
- ✅ `wrangler.jsonc` - Cloudflare config (FIXED!)
- ✅ `functions/api/lead.js` - AI lead generation
- ✅ `images/` - All 76 images organized
- ✅ `favicon.png` - Browser icon
- ✅ `README.md` - Full documentation

---

## 🆘 Troubleshooting

### Error: "Cannot find path"
Make sure you're in the correct directory:
```powershell
cd C:\Projects\hardhat-handyman-v1
ls  # Should show index.html, wrangler.jsonc, etc.
```

### Error: "Missing entry-point"
This is FIXED! The `wrangler.jsonc` file is now included.

### Error: "npx not found"
Install Node.js from https://nodejs.org

---

## 🎯 Domain Setup

After deployment:
1. Go to Cloudflare Dashboard → Pages
2. Click your project → **Custom domains**
3. Add: **hardhat-handyman.com**
4. Follow DNS setup instructions

---

**Ready to Deploy!** 🚀
