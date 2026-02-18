# Assets Directory

Place your images, logos, and other media files here.

## Recommended Assets

### Images to Add:

1. **Logo** (`logo.png` or `logo.svg`)
   - Recommended size: 200x200px
   - Format: PNG or SVG for transparency

2. **Hero Image** (`hero-bg.jpg`)
   - Recommended size: 1920x1080px
   - Use for background of hero section

3. **Service Images** (optional)
   - Individual images for each service
   - Recommended size: 600x400px

4. **Before/After Photos**
   - Showcase your work
   - Create a gallery section

5. **Team Photos**
   - Add credibility and personality
   - Headshots or action shots

## Image Optimization Tips

- **Compress images** before uploading (use tools like TinyPNG, ImageOptim)
- **Use WebP format** where possible for better performance
- **Provide alt text** for accessibility
- **Use responsive images** with srcset for different screen sizes

## Cloudflare Image Optimization

Cloudflare Pages automatically optimizes images. You can also use:

- **Cloudflare Images**: Advanced image optimization and resizing
- **Cloudflare Polish**: Automatic image compression (available on paid plans)

## Adding Images to Your Site

In your HTML:

```html
<!-- Logo in header -->
<img src="assets/logo.png" alt="Hardhat Handyman Logo" class="logo-img">

<!-- Hero background -->
<section class="hero" style="background-image: url('assets/hero-bg.jpg')">

<!-- Service images -->
<img src="assets/service-repair.jpg" alt="General Repair Services">
```

## Folder Structure

Organize assets by type:

```
assets/
├── images/
│   ├── logo.png
│   ├── hero-bg.jpg
│   └── services/
│       ├── repair.jpg
│       ├── painting.jpg
│       └── electrical.jpg
├── icons/
│   └── favicon.ico
└── documents/
    └── service-brochure.pdf
```
