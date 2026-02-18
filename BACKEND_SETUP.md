# Backend Integration Examples

This folder contains examples for integrating your contact form with various backend services.

## Quick Setup with Formspree (Easiest)

1. Sign up at https://formspree.io/
2. Create a new form
3. Copy your form ID
4. Replace the `submitForm` function in `script.js` with:

```javascript
async function submitForm(formData) {
    const submitButton = contactForm.querySelector('.submit-button');
    const originalText = submitButton.textContent;
    submitButton.textContent = 'Sending...';
    submitButton.disabled = true;
    
    try {
        const response = await fetch('https://formspree.io/f/YOUR_FORM_ID', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData)
        });
        
        if (response.ok) {
            showMessage('Thank you! Your request has been received. We\'ll contact you within 24 hours.', 'success');
            contactForm.reset();
        } else {
            throw new Error('Form submission failed');
        }
    } catch (error) {
        console.error('Error:', error);
        showMessage('Sorry, there was an error sending your request. Please try again.', 'error');
    } finally {
        submitButton.textContent = originalText;
        submitButton.disabled = false;
    }
}
```

## Option 2: EmailJS

1. Sign up at https://www.emailjs.com/
2. Create an email service
3. Create an email template
4. Get your User ID, Service ID, and Template ID
5. Add EmailJS library to your HTML (before closing `</body>`):

```html
<script type="text/javascript" src="https://cdn.jsdelivr.net/npm/@emailjs/browser@3/dist/email.min.js"></script>
<script type="text/javascript">
    (function(){
        emailjs.init("YOUR_USER_ID");
    })();
</script>
```

6. Replace the `submitForm` function in `script.js`:

```javascript
async function submitForm(formData) {
    const submitButton = contactForm.querySelector('.submit-button');
    const originalText = submitButton.textContent;
    submitButton.textContent = 'Sending...';
    submitButton.disabled = true;
    
    try {
        const result = await emailjs.send(
            'YOUR_SERVICE_ID',
            'YOUR_TEMPLATE_ID',
            {
                name: formData.name,
                email: formData.email,
                phone: formData.phone,
                service: formData.service,
                message: formData.message
            }
        );
        
        console.log('Success:', result);
        showMessage('Thank you! Your request has been received. We\'ll contact you within 24 hours.', 'success');
        contactForm.reset();
    } catch (error) {
        console.error('Error:', error);
        showMessage('Sorry, there was an error sending your request. Please try again.', 'error');
    } finally {
        submitButton.textContent = originalText;
        submitButton.disabled = false;
    }
}
```

## Option 3: Netlify Forms (If hosting on Netlify)

1. Add `netlify` attribute to your form in `index.html`:

```html
<form id="contactForm" class="contact-form" netlify>
    <input type="hidden" name="form-name" value="contact" />
    <!-- rest of your form fields -->
</form>
```

2. That's it! Netlify will automatically handle form submissions.

## Option 4: Cloudflare Workers

Create a worker at https://workers.cloudflare.com/

```javascript
// workers.js
export default {
    async fetch(request, env) {
        // Handle CORS
        if (request.method === 'OPTIONS') {
            return new Response(null, {
                headers: {
                    'Access-Control-Allow-Origin': '*',
                    'Access-Control-Allow-Methods': 'POST',
                    'Access-Control-Allow-Headers': 'Content-Type',
                }
            });
        }

        if (request.method === 'POST') {
            const formData = await request.json();
            
            // Send email using Mailgun (or another service)
            const mailgunResponse = await fetch(
                `https://api.mailgun.net/v3/${env.MAILGUN_DOMAIN}/messages`,
                {
                    method: 'POST',
                    headers: {
                        'Authorization': 'Basic ' + btoa('api:' + env.MAILGUN_API_KEY),
                    },
                    body: new URLSearchParams({
                        from: 'Website <no-reply@hardhat-handyman.com>',
                        to: env.RECIPIENT_EMAIL,
                        subject: 'New Lead from Website',
                        text: `
Name: ${formData.name}
Email: ${formData.email}
Phone: ${formData.phone}
Service: ${formData.service}
Message: ${formData.message}
Timestamp: ${formData.timestamp}
                        `
                    })
                }
            );

            return new Response(JSON.stringify({ success: true }), {
                headers: {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*',
                }
            });
        }

        return new Response('Method not allowed', { status: 405 });
    }
};
```

## Recommendation

For your first client site, use **Formspree** - it's the easiest and most reliable option. You get 50 free submissions per month, which is plenty for a new handyman business.

Once you're comfortable, you can upgrade to Cloudflare Workers for unlimited submissions and more control.
