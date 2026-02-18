# Deploying to GitHub and Cloudflare Pages

## ✅ Current Status
Your project is ready for GitHub! All files are committed with proper image paths using `.jpg` format.

## 📋 Step 1: Create GitHub Repository

1. Go to https://github.com/new
2. Create a new repository (e.g., "hardhat-handyman-website")
3. **DO NOT** initialize with README, .gitignore, or license (we already have these)
4. Click "Create repository"

## 📤 Step 2: Push to GitHub

After creating the repository, GitHub will show you commands. Use these:

```powershell
cd hardhat-handyman-v1
git remote add origin https://github.com/YOUR-USERNAME/YOUR-REPO-NAME.git
git branch -M main
git push -u origin main
```

Replace `YOUR-USERNAME` and `YOUR-REPO-NAME` with your actual GitHub username and repository name.

## 🌐 Step 3: Deploy to Cloudflare Pages

1. Go to https://dash.cloudflare.com
2. Navigate to **Workers & Pages** → **Create application** → **Pages** → **Connect to Git**
3. Select your GitHub repository
4. Configure build settings:
   - **Framework preset:** None
   - **Build command:** (leave empty)
   - **Build output directory:** `/`
   - **Root directory:** `hardhat-handyman-v1`
5. Click **Save and Deploy**

## ✅ What's Already Configured

✓ All images are `.jpg` format (converted from HEIC)
✓ Image paths are relative and correct (`images/gallery/...`)
✓ `.gitignore` excludes unnecessary files
✓ `_headers` file optimizes caching for Cloudflare
✓ All 76 images organized in proper folders:
  - Tricky jobs (5 images)
  - Dirty jobs (9 images)
  - Roofing (11 images)
  - Flooring (9 images)
  - Craftsmanship (6 images)
  - Construction (8 images)
  - Before/After (5 images)
  - Team (5 images)
  - Meet Rocky (12 images)
  - Logos (3 images)

## 📍 Important Notes

- **All file paths use forward slashes** (`images/gallery/roofing/01-metal-roof-finished.jpg`)
- **Image extensions are `.jpg`** (not `.jpeg`)
- **Cloudflare will automatically serve your `index.html`** as the homepage
- **The `_headers` file** will cache images for optimal performance

## 🔧 If Image Paths Need Fixing

All paths are already correct! But if you need to verify:

```powershell
cd hardhat-handyman-v1
Get-ChildItem -Path images -Recurse -File | Select-Object FullName
```

## 📞 Next Steps After Deployment

1. Update Google Ads conversion ID in `index.html` (line 10)
2. Configure the contact form API endpoint if using Cloudflare functions
3. Test all images load correctly
4. Verify contact form submission

Your site is ready to go live! 🚀
