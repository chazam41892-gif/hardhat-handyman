# File Placement Guide for Cloudflare Pages

This document explains the file structure and why each file is placed where it is for optimal Cloudflare Pages deployment.

## 📁 Root Directory Files

These files MUST be in the root directory:

### `index.html` ⭐ REQUIRED
- **Purpose**: Main entry point for your website
- **Location**: `/index.html`
- **Why**: Cloudflare Pages automatically serves this as the homepage
- **Important**: Must be in the root, not in a subdirectory

### `_headers` (Optional but Recommended)
- **Purpose**: Configure HTTP headers for security and caching
- **Location**: `/_headers`
- **Why**: Cloudflare Pages automatically processes this file
- **Contains**: Security headers, cache control, CORS settings

### `_redirects` (Optional but Recommended)
- **Purpose**: Configure URL redirects and rewrites
- **Location**: `/_redirects`
- **Why**: Cloudflare Pages uses this for routing
- **Contains**: URL mappings and redirect rules

### `wrangler.toml` (Optional)
- **Purpose**: Configuration for Cloudflare Workers/Wrangler CLI
- **Location**: `/wrangler.toml`
- **Why**: Used if deploying via Wrangler CLI
- **Contains**: Project settings, environment variables

### `.gitignore`
- **Purpose**: Specify files to exclude from Git
- **Location**: `/.gitignore`
- **Why**: Prevents committing unnecessary files
- **Contains**: node_modules, .env, build artifacts

### `package.json` (Optional)
- **Purpose**: Node.js project configuration
- **Location**: `/package.json`
- **Why**: Defines dependencies and npm scripts
- **Contains**: Scripts for local development

## 📁 CSS Directory

### `css/styles.css`
- **Purpose**: Website stylesheet
- **Location**: `/css/styles.css`
- **Why**: Organized structure, easy to manage
- **Referenced in**: `index.html` as `<link href="css/styles.css">`

**Alternative Locations**:
- Could be `/style.css` (root)
- Could be `/styles/main.css`
- **Best Practice**: Use `/css/` folder for organization

## 📁 JavaScript Directory

### `js/main.js`
- **Purpose**: Website interactivity and logic
- **Location**: `/js/main.js`
- **Why**: Organized structure, separate from HTML
- **Referenced in**: `index.html` as `<script src="js/main.js">`

**Alternative Locations**:
- Could be `/script.js` (root)
- Could be `/scripts/app.js`
- **Best Practice**: Use `/js/` folder for organization

## 📁 Assets Directory

### `assets/`
- **Purpose**: Images, fonts, and media files
- **Location**: `/assets/`
- **Why**: Centralized media storage
- **Contains**: 
  - Images: `/assets/logo.png`
  - Icons: `/assets/favicon.ico`
  - Documents: `/assets/brochure.pdf`

**Usage in HTML**:
```html
<img src="assets/logo.png" alt="Logo">
```

**Alternative Structures**:
```
/assets/
  /images/
  /icons/
  /fonts/
  /documents/
```

## 📁 Workers Directory

### `workers/contact-form.js`
- **Purpose**: Cloudflare Worker for backend API
- **Location**: `/workers/contact-form.js`
- **Why**: Separate from main site code
- **Deployment**: Deployed separately as a Worker
- **Note**: Not served by Cloudflare Pages directly

## 📄 Documentation Files

### `README.md`
- **Purpose**: Project documentation
- **Location**: `/README.md`
- **Why**: Standard location for GitHub/documentation
- **Displayed**: On GitHub repository page

### `DEPLOYMENT.md`
- **Purpose**: Deployment instructions
- **Location**: `/DEPLOYMENT.md`
- **Why**: Separate deployment guide
- **For**: Step-by-step Cloudflare deployment

### `schema.sql`
- **Purpose**: Database schema for Cloudflare D1
- **Location**: `/schema.sql`
- **Why**: Reference for database setup
- **Used with**: `wrangler d1 execute` command

## 🎯 Cloudflare Pages Requirements

### What Cloudflare Pages Needs:

1. **Entry Point**: `index.html` in root or specified build output directory
2. **Static Files**: All HTML, CSS, JS, images must be accessible
3. **Relative Paths**: Use relative paths (e.g., `css/styles.css` not `/css/styles.css`)
4. **No Server Code**: Only static files (use Workers for server-side logic)

### Build Output Directory:

- **Default**: `/` (root directory)
- **If using a build tool**: Set to `/dist`, `/build`, or `/public`
- **Configure in**: Cloudflare Pages dashboard under "Build settings"

## ✅ Correct File Placement Summary

```
hardhat-handyman/              ← Repository root
├── index.html                 ← REQUIRED: Main entry point
├── _headers                   ← Optional: Security & caching
├── _redirects                 ← Optional: URL routing
├── wrangler.toml             ← Optional: Wrangler config
├── package.json              ← Optional: npm scripts
├── .gitignore                ← Recommended: Git exclusions
├── README.md                 ← Documentation
├── DEPLOYMENT.md             ← Deployment guide
├── schema.sql                ← Database schema
│
├── css/                      ← Stylesheets folder
│   └── styles.css            ← Main stylesheet
│
├── js/                       ← JavaScript folder
│   └── main.js               ← Main script
│
├── assets/                   ← Media folder
│   ├── README.md
│   └── (images, fonts, etc.)
│
└── workers/                  ← Workers code (deployed separately)
    └── contact-form.js       ← Form handler Worker
```

## 🚀 Deployment Process

### Cloudflare Pages:
1. Reads files from repository root (or specified directory)
2. Looks for `index.html` as entry point
3. Processes `_headers` and `_redirects` files
4. Serves all static files through global CDN
5. Applies automatic optimizations (minification, compression)

### Cloudflare Workers:
1. Deployed separately from Pages
2. Can be used as API endpoints for Pages
3. Configure in Cloudflare Dashboard or via Wrangler

## ⚠️ Common Mistakes to Avoid

1. **❌ Wrong**: Putting `index.html` in a subdirectory
   - **✅ Right**: `/index.html` in root

2. **❌ Wrong**: Using absolute paths `/css/styles.css`
   - **✅ Right**: Using relative paths `css/styles.css`

3. **❌ Wrong**: Committing `node_modules/`
   - **✅ Right**: Add to `.gitignore`

4. **❌ Wrong**: Trying to run server-side code in Pages
   - **✅ Right**: Use Cloudflare Workers for backend

5. **❌ Wrong**: Large unoptimized images
   - **✅ Right**: Compress images before uploading

## 🔗 Quick Reference

| File Type | Location | Required | Purpose |
|-----------|----------|----------|---------|
| HTML | `/index.html` | ✅ Yes | Entry point |
| CSS | `/css/*.css` | Recommended | Styling |
| JavaScript | `/js/*.js` | Recommended | Interactivity |
| Images | `/assets/*` | Optional | Media |
| Config | `/_headers` | Optional | HTTP headers |
| Config | `/_redirects` | Optional | URL routing |
| Config | `/wrangler.toml` | Optional | Wrangler CLI |

## 💡 Pro Tips

1. **Use relative paths** throughout your HTML/CSS/JS
2. **Organize by type** (css/, js/, assets/) for clarity
3. **Keep root clean** - only essential files in root
4. **Document everything** - README for others (and future you!)
5. **Test locally** before deploying to catch path issues
6. **Use _headers** for better security and performance
7. **Compress images** - smaller files = faster loading

## 🎓 Learning More

- [Cloudflare Pages Docs](https://developers.cloudflare.com/pages/)
- [HTML Best Practices](https://developer.mozilla.org/en-US/docs/Learn/HTML)
- [Web Performance](https://web.dev/performance/)

---

This structure is optimized for Cloudflare Pages but works with any static hosting platform!
