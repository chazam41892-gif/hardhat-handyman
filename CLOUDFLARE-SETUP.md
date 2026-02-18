# Cloudflare Setup Guide for Hardhat Handyman

## Prerequisites

- Node.js 18+ installed
- Cloudflare account
- GitHub repository (already set up ✅)

## 🚀 Quick Start

### 1. Install Wrangler CLI

```bash
npm install
```

Or globally:

```bash
npm install -g wrangler
```

### 2. Login to Cloudflare

```bash
wrangler login
```

### 3. Local Development

```bash
npm run dev
```

This starts a local server at `http://localhost:8788`

### 4. Deploy to Cloudflare Pages

```bash
npm run deploy
```

## 🖼️ Image Handling

### Automatic Conversion (HEIC → JPEG)

The `/api/image-upload` endpoint handles image uploads and converts HEIC to JPEG automatically.

### Image Optimization

Use the `/api/image-transform` endpoint for on-the-fly image resizing:

```
/api/image-transform?path=images/gallery/roofing/01-metal-roof-finished.jpg&width=800&quality=85
```

### Image Upload Form (for adding new projects)

```html
<form action="/api/image-upload" method="POST" enctype="multipart/form-data">
  <input type="file" name="image" accept="image/*">
  <button type="submit">Upload</button>
</form>
```

## 🌐 Cloudflare Tunnel (for local testing)

### Setup Tunnel

1. Install cloudflared:

```bash
# Windows
winget install Cloudflare.cloudflared
```

1. Login:

```bash
cloudflared tunnel login
```

1. Create tunnel:

```bash
cloudflared tunnel create hardhat-handyman-dev
```

1. Run tunnel:

```bash
npm run tunnel
```

This creates a public URL like `https://xxx.trycloudflare.com` pointing to your local dev server.

## 🔧 Configuration

### Environment Variables

Set these in Cloudflare Dashboard → Workers & Pages → hardhat-handyman → Settings → Environment Variables:

**Required for Lead Processing:**

- `LEVIATHAN_API_KEY` - Your Leviathan AI API key
- `LEVIATHAN_WEBHOOK_URL` - Webhook endpoint
- `OWNER_PHONE` - Rocky's phone for urgent leads
- `OWNER_EMAIL` - Rocky's email

**Optional for Notifications:**

- `TWILIO_ACCOUNT_SID` - For SMS alerts
- `TWILIO_AUTH_TOKEN` - For SMS alerts
- `TWILIO_PHONE_NUMBER` - Twilio number
- `SENDGRID_API_KEY` - For email notifications

### Wrangler Configuration

Edit `wrangler.toml` to customize:

- Project name
- Routes
- R2 storage bindings
- Cron triggers

## 📁 Project Structure

```
hardhat-handyman-v1/
├── functions/
│   └── api/
│       ├── lead.js              # Lead capture & AI processing
│       ├── image-upload.js      # Handle image uploads
│       └── image-transform.js   # On-the-fly image optimization
├── images/                      # All gallery images (76 images)
├── index.html                   # Main website
├── wrangler.toml               # Cloudflare configuration
├── cloudflare-tunnel.yml       # Tunnel configuration
├── _headers                    # Cloudflare caching rules
├── .dev.vars                   # Local environment variables
└── package.json                # npm scripts

```

## 🎨 Image Paths - All Verified ✅

All 76 images are properly organized:

- `images/gallery/tricky-jobs/` (5 images)
- `images/gallery/dirty-jobs/` (9 images)
- `images/gallery/roofing/` (11 images)
- `images/gallery/flooring/` (9 images)
- `images/gallery/craftsmanship/` (6 images)
- `images/gallery/construction/` (8 images)
- `images/gallery/before-after/` (5 images)
- `images/gallery/team/` (5 images)
- `images/meet-rocky/` (12 images)
- `images/logos/` (3 images)

## 🔄 Deployment Workflow

### From Local → GitHub → Cloudflare

1. **Make changes locally**
2. **Commit to git:**

   ```bash
   git add .
   git commit -m "Update website"
   git push origin main
   ```

3. **Cloudflare auto-deploys** from GitHub (if set up with GitHub integration)

### Direct Deployment (bypassing GitHub)

```bash
npm run deploy
```

## 🧪 Testing

### Test API Endpoints

```bash
# Test lead submission
curl -X POST http://localhost:8788/api/lead \
  -H "Content-Type: application/json" \
  -d '{"name":"Test","phone":"555-1234","email":"test@example.com","message":"Test project"}'

# Test image transformation
curl http://localhost:8788/api/image-transform?path=images/logos/hardhat-logo.png&width=400
```

## 📞 Support

For Cloudflare-specific issues:

- Docs: <https://developers.cloudflare.com/pages/>
- Wrangler: <https://developers.cloudflare.com/workers/wrangler/>
- Community: <https://community.cloudflare.com/>

## 🎯 Next Steps

1. ✅ Configure environment variables in Cloudflare Dashboard
2. ✅ Test the `/api/lead` endpoint
3. ✅ Set up Leviathan webhook integration
4. ✅ Add SMS/Email notification services
5. ✅ Test image upload functionality
6. ✅ Configure custom domain
