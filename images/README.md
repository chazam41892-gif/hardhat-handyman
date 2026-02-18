# Images Folder

This folder is for your website images.

## ✅ ALLOWED Image Formats

- `.jpg` or `.jpeg` (recommended)
- `.png` (for logos with transparency)
- `.webp` (modern, smaller file size)
- `.gif` (for animations)

## ❌ NOT ALLOWED - iPhone Formats

**Do NOT upload these formats!** They won't work on websites:
- `.heic` or `.heif` (iPhone photos)
- `.hevc` (iPhone videos)
- `.mov` (iPhone videos)

## How to Convert iPhone Photos

### Method 1: Change iPhone Settings (Future Photos)
1. Open iPhone **Settings**
2. Go to **Camera**
3. Tap **Formats**
4. Select **"Most Compatible"** instead of "High Efficiency"
5. All new photos will be in `.jpg` format!

### Method 2: Convert Existing Photos (Already Taken)

**Online (FREE):**
- Go to: https://heictojpg.com/
- Upload your .heic files
- Download as .jpg
- Then upload to this folder

**On Mac:**
1. Open the .heic file in **Preview**
2. Click **File** → **Export**
3. Format: Choose **JPEG**
4. Quality: 80-90% is perfect
5. Save and upload to this folder

**On Windows:**
1. Install "HEIF Image Extensions" from Microsoft Store (free)
2. Open photo in Photos app
3. Click three dots (...) → **Save As**
4. Choose **JPEG**
5. Upload to this folder

## Recommended Images for Your Site

Here's what images you should add:

### 1. Hero Background (`hero-bg.jpg`)
- Your work truck or your team
- Size: 1920x1080px
- Keep file under 500KB (compress at https://tinypng.com/)

### 2. Service Photos (6 images)
- `service-general-repairs.jpg`
- `service-electrical.jpg`
- `service-plumbing.jpg`
- `service-painting.jpg`
- `service-assembly.jpg`
- `service-maintenance.jpg`

Size: 800x600px each
Keep under 200KB each

### 3. About/Team Photo (`team.jpg`)
- Photo of Rocky or the team
- Size: 600x600px
- Keep under 150KB

### 4. Logo (`logo.png`)
- If you have a business logo
- Size: 300x300px
- Use PNG for transparent background
- Keep under 50KB

## Image Optimization

Before uploading, compress your images:
- Use: https://tinypng.com/ (FREE)
- Drag and drop your images
- Download compressed versions
- Can reduce file size by 70% without visible quality loss!

**Why compress?**
- Faster loading website
- Better Google ranking
- Works better on mobile phones
- Uses less bandwidth

## After Adding Images

Update your HTML (`index.html`):

```html
<!-- Hero section with background -->
<section id="home" class="hero" style="background-image: url('images/hero-bg.jpg');">
    <!-- content -->
</section>

<!-- Service card with image -->
<div class="service-card">
    <img src="images/service-plumbing.jpg" alt="Plumbing services">
    <h3>Plumbing</h3>
    <p>Leaky faucets, pipe repairs...</p>
</div>
```

## File Naming Tips

✅ Good names:
- `hero-background.jpg`
- `service-plumbing.jpg`
- `team-photo-2026.jpg`

❌ Bad names:
- `IMG_1234.jpg` (not descriptive)
- `My Photo.jpg` (has spaces)
- `photo@home.jpg` (has special characters)

**Rules:**
- Use lowercase
- Use hyphens (-) instead of spaces
- Be descriptive
- Include year if needed

## Need Images?

If you don't have photos yet, use FREE stock photos:

- https://unsplash.com/ (100% free, no attribution needed)
- https://pexels.com/ (100% free)
- Search for: "handyman", "home repair", "construction worker"

**Download in JPG format!**

## Current Images

_(List your images here as you add them)_

- [ ] hero-bg.jpg
- [ ] service-general-repairs.jpg
- [ ] service-electrical.jpg
- [ ] service-plumbing.jpg
- [ ] service-painting.jpg
- [ ] service-assembly.jpg
- [ ] service-maintenance.jpg
- [ ] team.jpg
- [ ] logo.png (optional)

## Videos

If you want to add videos:

### ✅ ALLOWED Video Formats
- `.mp4` (recommended)
- `.webm` (modern, smaller size)

### ❌ NOT ALLOWED
- `.hevc` (iPhone high-efficiency video)
- `.mov` (QuickTime - doesn't work well on web)

### Convert Videos
- Use: https://cloudconvert.com/ (FREE)
- Upload your iPhone video
- Convert to: MP4
- Settings: H.264 codec, 720p resolution
- Keep under 10MB for web!

---

Remember: Compress everything before uploading! Fast websites = happy customers! 🚀
