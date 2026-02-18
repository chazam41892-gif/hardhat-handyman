/**
 * Cloudflare Worker for handling contact form submissions
 * This worker receives form data, validates it, and can store it in D1 or send notifications
 * 
 * Deploy this separately as a Cloudflare Worker and update your form to POST to this endpoint
 */

// Helper function to get allowed origins
function getAllowedOrigin(request) {
  const origin = request.headers.get('Origin');
  // Add your production domains here
  const allowedOrigins = [
    'https://hardhat-handyman.pages.dev',
    'http://localhost:8000',
    'http://localhost:3000',
  ];
  
  if (allowedOrigins.includes(origin)) {
    return origin;
  }
  return allowedOrigins[0]; // Default to production
}

export default {
  async fetch(request, env) {
    const allowedOrigin = getAllowedOrigin(request);
    
    // CORS headers with specific origin
    const corsHeaders = {
      'Access-Control-Allow-Origin': allowedOrigin,
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    };
    
    // Handle CORS preflight requests
    if (request.method === 'OPTIONS') {
      return new Response(null, {
        headers: corsHeaders,
      });
    }

    // Only allow POST requests
    if (request.method !== 'POST') {
      return new Response('Method not allowed', {
        status: 405,
        headers: corsHeaders,
      });
    }

    try {
      // Parse the form data
      const formData = await request.json();
      
      // Validate required fields
      const requiredFields = ['name', 'email', 'phone', 'message'];
      for (const field of requiredFields) {
        if (!formData[field]) {
          return new Response(JSON.stringify({
            success: false,
            error: `Missing required field: ${field}`,
          }), {
            status: 400,
            headers: {
              'Content-Type': 'application/json',
              ...corsHeaders,
            },
          });
        }
      }

      // Validate email format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email)) {
        return new Response(JSON.stringify({
          success: false,
          error: 'Invalid email format',
        }), {
          status: 400,
          headers: {
            'Content-Type': 'application/json',
            ...corsHeaders,
          },
        });
      }

      // Create lead object
      const lead = {
        id: crypto.randomUUID(),
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        service: formData.service || 'Not specified',
        message: formData.message,
        timestamp: new Date().toISOString(),
        source: 'website',
        status: 'new',
      };

      // Store in Cloudflare D1 (if configured)
      if (env.DB) {
        try {
          await env.DB.prepare(
            'INSERT INTO leads (id, name, email, phone, service, message, timestamp, source, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)'
          ).bind(
            lead.id,
            lead.name,
            lead.email,
            lead.phone,
            lead.service,
            lead.message,
            lead.timestamp,
            lead.source,
            lead.status
          ).run();
        } catch (dbError) {
          console.error('Database error:', dbError);
          // Continue even if DB fails - we can still send notification
        }
      }

      // Store in KV (alternative simple storage)
      if (env.LEADS_KV) {
        try {
          await env.LEADS_KV.put(lead.id, JSON.stringify(lead));
        } catch (kvError) {
          console.error('KV error:', kvError);
        }
      }

      // Send email notification (using a service like SendGrid, Mailgun, etc.)
      // This is a placeholder - implement based on your chosen email service
      if (env.EMAIL_SERVICE_API_KEY) {
        try {
          await sendEmailNotification(lead, env.EMAIL_SERVICE_API_KEY);
        } catch (emailError) {
          console.error('Email notification error:', emailError);
        }
      }

      // AI-powered lead scoring (optional)
      // Analyze the message content to prioritize leads
      const leadScore = calculateLeadScore(lead);
      
      // Return success response
      return new Response(JSON.stringify({
        success: true,
        message: 'Thank you for your inquiry! We\'ll get back to you within 24 hours.',
        leadId: lead.id,
        leadScore: leadScore,
      }), {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          ...corsHeaders,
        },
      });

    } catch (error) {
      console.error('Error processing form submission:', error);
      return new Response(JSON.stringify({
        success: false,
        error: 'An error occurred processing your request. Please try again.',
      }), {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
          ...corsHeaders,
        },
      });
    }
  },
};

/**
 * Calculate lead score based on message content and other factors
 * Higher score = higher priority lead
 */
function calculateLeadScore(lead) {
  let score = 0;
  
  const message = lead.message.toLowerCase();
  
  // Urgency indicators
  if (message.includes('urgent') || message.includes('asap') || message.includes('emergency')) {
    score += 30;
  }
  
  // Project size indicators
  if (message.includes('large') || message.includes('multiple') || message.includes('whole')) {
    score += 20;
  }
  
  // Budget indicators
  if (message.includes('budget') || message.includes('quote')) {
    score += 10;
  }
  
  // Service type complexity
  const complexServices = ['electrical', 'plumbing', 'renovation'];
  for (const service of complexServices) {
    if (message.includes(service)) {
      score += 15;
      break;
    }
  }
  
  // Message length (longer messages often indicate serious inquiries)
  if (message.length > 100) {
    score += 10;
  }
  
  return Math.min(score, 100); // Cap at 100
}

/**
 * Send email notification (placeholder - implement based on your email service)
 */
async function sendEmailNotification(lead, apiKey) {
  // Example implementation for SendGrid, Mailgun, etc.
  // Replace with your actual email service implementation
  
  const emailContent = `
    New Lead Received!
    
    Name: ${lead.name}
    Email: ${lead.email}
    Phone: ${lead.phone}
    Service: ${lead.service}
    
    Message:
    ${lead.message}
    
    Timestamp: ${lead.timestamp}
    Lead ID: ${lead.id}
  `;
  
  // Implement actual email sending logic here
  console.log('Email notification would be sent:', emailContent);
}
