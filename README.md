# Hardhat Handyman Website

Professional handyman service website for Rocky's business with AI-powered lead generation capabilities.

## Features

- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile devices
- **Lead Generation Form**: Contact form with client-side validation for capturing leads
- **Service Showcase**: Display of 6 core handyman services
- **Professional Design**: Modern, clean UI with smooth animations
- **SEO Optimized**: Proper meta tags for search engine visibility

## Files

- `index.html` - Main website HTML
- `styles.css` - Styling and responsive design
- `script.js` - Form validation and interactive features

## Deployment

### Option 1: Static Hosting (GitHub Pages, Netlify, Vercel)
1. Upload all files to your hosting provider
2. Point your domain (hardhat-handyman.com) to the hosting service

### Option 2: Traditional Web Hosting
1. Upload files to your web server via FTP/SFTP
2. Ensure files are in the web root directory (public_html, www, etc.)

## Backend Integration

The contact form currently logs submissions to the browser console. To enable actual lead capture:

1. Create a backend endpoint to receive form submissions
2. Update `script.js` in the `submitForm()` function to POST to your endpoint:
   ```javascript
   fetch('/api/submit-lead', {
       method: 'POST',
       headers: { 'Content-Type': 'application/json' },
       body: JSON.stringify(formData)
   })
   ```
3. Consider integrating with:
   - Email services (SendGrid, Mailgun)
   - CRM systems (HubSpot, Salesforce)
   - AI chatbots for instant responses

## Local Testing

```bash
python3 -m http.server 8080
# Then visit http://localhost:8080
```

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## License

© 2026 Hardhat Handyman. All rights reserved.
