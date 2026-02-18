# Cloudflare Deployment Guide

This guide will help you deploy the Hardhat Handyman website to Cloudflare Pages.

## Prerequisites

- A Cloudflare account (free tier is sufficient)
- Git repository connected to GitHub

## Deployment Options

### Option 1: Cloudflare Pages (Recommended)

Cloudflare Pages is the easiest way to deploy this static website.

#### Steps:

1. **Login to Cloudflare Dashboard**
   - Go to https://dash.cloudflare.com/
   - Navigate to "Workers & Pages" in the sidebar

2. **Create a New Pages Project**
   - Click "Create application"
   - Select "Pages"
   - Click "Connect to Git"

3. **Connect Your Repository**
   - Select your GitHub account
   - Choose the `hardhat-handyman` repository
   - Click "Begin setup"

4. **Configure Build Settings**
   - **Project name**: `hardhat-handyman`
   - **Production branch**: `main`
   - **Build command**: Leave empty (static site, no build needed)
   - **Build output directory**: `/`
   - Click "Save and Deploy"

5. **Wait for Deployment**
   - Cloudflare will deploy your site automatically
   - You'll get a URL like: `hardhat-handyman.pages.dev`

6. **Custom Domain (Optional)**
   - Go to "Custom domains" tab
   - Click "Set up a custom domain"
   - Follow instructions to add your domain

### Option 2: Cloudflare Workers Sites

For more advanced features like API endpoints, use Workers Sites.

#### Steps:

1. **Install Wrangler CLI**
   ```bash
   npm install -g wrangler
   ```

2. **Login to Cloudflare**
   ```bash
   wrangler login
   ```

3. **Deploy the Site**
   ```bash
   wrangler pages publish . --project-name=hardhat-handyman
   ```

## File Structure for Cloudflare

```
hardhat-handyman/
├── index.html          # Main HTML file (entry point)
├── css/
│   └── styles.css      # Stylesheet
├── js/
│   └── main.js         # JavaScript functionality
├── assets/             # Images and other assets
├── wrangler.toml       # Cloudflare configuration
└── DEPLOYMENT.md       # This file
```

## Important Notes

### File Placement

- **Root Level**: `index.html` must be in the root directory
- **CSS**: Place in `css/` folder for organization
- **JavaScript**: Place in `js/` folder
- **Images**: Place in `assets/` folder
- **Build Output**: If using a build tool, set output to root or specify in Cloudflare Pages settings

### Cloudflare Pages Features

- **Automatic Deployments**: Every push to your repository triggers a new deployment
- **Preview Deployments**: Pull requests get their own preview URLs
- **Edge Network**: Your site is served from Cloudflare's global CDN
- **Free SSL**: Automatic HTTPS certificate
- **Analytics**: Built-in web analytics (enable in dashboard)

### Lead Generation Enhancement

The current implementation stores leads in localStorage. For production, consider:

1. **Cloudflare Workers** for backend API
2. **Cloudflare D1** for database storage
3. **Cloudflare Workers KV** for simple key-value storage
4. **Email notifications** via workers and external email APIs

### Next Steps for AI Lead Generation

To implement AI-powered lead generation:

1. Create a Cloudflare Worker to handle form submissions
2. Integrate with AI services (OpenAI, Anthropic, etc.)
3. Store leads in Cloudflare D1 or external database
4. Set up email notifications for new leads
5. Create a dashboard to view and manage leads

## Troubleshooting

### Site Not Loading

- Check that `index.html` is in the root directory
- Verify build output directory is set to `/` or empty
- Check Cloudflare Pages deployment logs

### CSS/JS Not Loading

- Verify file paths are correct (relative paths work best)
- Check browser console for 404 errors
- Ensure files are committed to repository

### Form Not Working

- Current implementation uses localStorage (client-side only)
- For production, implement a Cloudflare Worker backend
- See `workers/contact-form.js` for example implementation

## Performance Optimization

- Cloudflare automatically minifies HTML, CSS, and JS
- Enable "Auto Minify" in Cloudflare dashboard under Speed > Optimization
- Use Cloudflare's image optimization for any images you add
- Consider using Cloudflare's Rocket Loader for JavaScript

## Resources

- [Cloudflare Pages Documentation](https://developers.cloudflare.com/pages/)
- [Cloudflare Workers Documentation](https://developers.cloudflare.com/workers/)
- [Wrangler CLI Documentation](https://developers.cloudflare.com/workers/wrangler/)
