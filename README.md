# Hardhat Handyman

Professional handyman services website with AI-powered lead generation.

## Overview

This is a modern, responsive website for Hardhat Handyman services, optimized for deployment on Cloudflare Pages. The site features a professional design, service showcase, and an intelligent contact form with lead generation capabilities.

## Features

- 🎨 **Modern Design**: Clean, professional interface with responsive layout
- 🚀 **Fast Performance**: Optimized for Cloudflare's edge network
- 📱 **Mobile-First**: Fully responsive design works on all devices
- 📝 **Contact Form**: Easy-to-use form for customer inquiries
- 🤖 **AI Lead Generation**: Smart lead scoring and prioritization (via Cloudflare Workers)
- 🔒 **Secure**: HTTPS by default with Cloudflare
- 📊 **Analytics Ready**: Easy integration with Cloudflare Analytics

## Project Structure

```
hardhat-handyman/
├── index.html          # Main website file
├── css/
│   └── styles.css      # Stylesheet
├── js/
│   └── main.js         # JavaScript functionality
├── assets/             # Images and media files
├── workers/
│   └── contact-form.js # Cloudflare Worker for form handling
├── wrangler.toml       # Cloudflare configuration
├── schema.sql          # Database schema for lead storage
├── DEPLOYMENT.md       # Detailed deployment instructions
└── README.md          # This file
```

## Quick Start

### Local Development

1. Clone this repository:
   ```bash
   git clone https://github.com/chazam41892-gif/hardhat-handyman.git
   cd hardhat-handyman
   ```

2. Open `index.html` in your browser or use a local server:
   ```bash
   # Using Python
   python -m http.server 8000
   
   # Or using Node.js
   npx http-server
   ```

3. Visit `http://localhost:8000` in your browser

### Deploy to Cloudflare Pages

See [DEPLOYMENT.md](DEPLOYMENT.md) for detailed deployment instructions.

**Quick Deploy:**

1. Push this repository to GitHub
2. Login to [Cloudflare Dashboard](https://dash.cloudflare.com/)
3. Go to Workers & Pages > Create application > Pages
4. Connect your GitHub repository
5. Click "Save and Deploy"

Your site will be live at `https://hardhat-handyman.pages.dev`

## Services Offered

- 🔧 General Repairs
- 🎨 Painting (Interior & Exterior)
- ⚡ Electrical Work
- 🚰 Plumbing
- 🪟 Door & Window Installation
- 🛠️ Assembly Services

## Lead Generation

The contact form includes AI-powered features:

- **Lead Scoring**: Automatically prioritizes leads based on urgency and project scope
- **Smart Storage**: Stores leads in Cloudflare D1 or KV storage
- **Email Notifications**: Sends instant notifications for new leads
- **Analytics**: Track conversion rates and lead sources

### Setting Up Lead Generation

1. Deploy the Cloudflare Worker from `workers/contact-form.js`
2. Set up Cloudflare D1 database using `schema.sql`
3. Configure environment variables in Cloudflare Dashboard
4. Update form action in `js/main.js` to point to your Worker

## Customization

### Branding

Edit the following to customize the site:

- **Colors**: Update CSS variables in `css/styles.css`
- **Content**: Modify text in `index.html`
- **Services**: Add/remove service cards in the services section
- **Logo**: Replace the emoji in the header with your logo image

### Adding Images

1. Place images in the `assets/` folder
2. Reference them in HTML: `<img src="assets/your-image.jpg" alt="Description">`
3. Optimize images before uploading for best performance

## Technologies Used

- **HTML5**: Semantic markup
- **CSS3**: Modern styling with custom properties
- **JavaScript**: ES6+ features
- **Cloudflare Pages**: Hosting and deployment
- **Cloudflare Workers**: Backend API for form handling
- **Cloudflare D1**: Database for lead storage

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## Performance

- **Load Time**: < 1 second (on Cloudflare's edge network)
- **Lighthouse Score**: 90+ (Performance, Accessibility, Best Practices, SEO)
- **Mobile-Friendly**: Google Mobile-Friendly Test approved

## Security

- HTTPS enabled by default
- Form validation (client and server-side)
- CORS protection on API endpoints
- No sensitive data stored client-side

## Contributing

This is a private project for Hardhat Handyman. For questions or suggestions, please contact the repository owner.

## License

© 2026 Hardhat Handyman. All rights reserved.

## Support

For technical issues or questions about deployment:
- Check [DEPLOYMENT.md](DEPLOYMENT.md) for deployment help
- Review [Cloudflare Pages Documentation](https://developers.cloudflare.com/pages/)
- Contact the site administrator

---

Built with ❤️ for professional handyman services.
