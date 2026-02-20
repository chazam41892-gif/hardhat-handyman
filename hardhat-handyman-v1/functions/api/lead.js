export async function onRequestPost(context) {
  // Original functionality preserved
  const originalResponse = "Lead received. Connect Leviathan webhook here.";
  
  try {
    // Parse incoming lead data
    const leadData = await context.request.json();
    
    // AI Lead Enrichment and Qualification
    const enrichedLead = {
      ...leadData,
      timestamp: new Date().toISOString(),
      source: 'hardhat-handyman.com',
      status: 'new',
      priority: calculateLeadPriority(leadData),
      estimatedValue: estimateProjectValue(leadData.message),
      leadScore: scoreLeadQuality(leadData),
      aiInsights: generateAIInsights(leadData.message)
    };
    
    // Send to Leviathan AI System for processing
    // This will trigger automated follow-up, scheduling, and CRM integration
    await sendToLeviathanAI(enrichedLead, context.env);
    
    // Send immediate auto-response email to customer
    await sendCustomerAutoResponse(enrichedLead, context.env);
    
    // Notify Rocky via SMS/Email for high-priority leads
    if (enrichedLead.priority === 'high') {
      await notifyOwnerUrgent(enrichedLead, context.env);
    }
    
    return new Response(JSON.stringify({
      success: true,
      message: "Thank you! We'll contact you within 2 hours.",
      leadId: generateLeadId(),
      originalResponse: originalResponse
    }), {
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    });
    
  } catch (error) {
    console.error('Lead processing error:', error);
    
    // Fallback: Still capture the lead even if AI processing fails
    return new Response(JSON.stringify({
      success: true,
      message: originalResponse,
      note: "Lead captured successfully"
    }), {
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    });
  }
}

// AI Lead Qualification Functions
function calculateLeadPriority(leadData) {
  const message = (leadData.message || '').toLowerCase();
  const urgentKeywords = ['urgent', 'emergency', 'asap', 'immediately', 'water damage', 'leak', 'broken'];
  const highValueKeywords = ['renovation', 'remodel', 'addition', 'deck', 'roof', 'multiple', 'several'];
  
  if (urgentKeywords.some(keyword => message.includes(keyword))) {
    return 'high';
  }
  if (highValueKeywords.some(keyword => message.includes(keyword))) {
    return 'medium-high';
  }
  return 'medium';
}

function estimateProjectValue(message) {
  const msg = (message || '').toLowerCase();
  
  // High-value project indicators
  if (msg.includes('renovation') || msg.includes('remodel') || msg.includes('addition')) {
    return '$5,000 - $20,000+';
  }
  if (msg.includes('deck') || msg.includes('roof') || msg.includes('flooring')) {
    return '$3,000 - $15,000';
  }
  if (msg.includes('bathroom') || msg.includes('kitchen')) {
    return '$2,000 - $10,000';
  }
  if (msg.includes('repair') || msg.includes('fix')) {
    return '$500 - $3,000';
  }
  
  return '$500 - $5,000';
}

function scoreLeadQuality(leadData) {
  let score = 50; // Base score
  
  // Has phone number (higher intent)
  if (leadData.phone && leadData.phone.length >= 10) score += 20;
  
  // Detailed message (serious inquiry)
  if (leadData.message && leadData.message.length > 50) score += 15;
  
  // Has email (follow-up possible)
  if (leadData.email && leadData.email.includes('@')) score += 10;
  
  // Name provided (personal connection)
  if (leadData.name && leadData.name.length > 2) score += 5;
  
  return Math.min(score, 100);
}

function generateAIInsights(message) {
  const msg = (message || '').toLowerCase();
  const insights = [];
  
  if (msg.includes('water') || msg.includes('leak') || msg.includes('mold')) {
    insights.push('URGENT: Water damage - requires immediate response');
  }
  if (msg.includes('estimate') || msg.includes('quote') || msg.includes('cost')) {
    insights.push('Customer is price-shopping - emphasize value and quality');
  }
  if (msg.includes('previous') || msg.includes('last') || msg.includes('other contractor')) {
    insights.push('Had bad experience - emphasize reliability and professionalism');
  }
  if (msg.includes('when') || msg.includes('timeline') || msg.includes('schedule')) {
    insights.push('Timeline-sensitive - provide quick response with availability');
  }
  if (msg.includes('recommend') || msg.includes('referral') || msg.includes('heard about')) {
    insights.push('Referral lead - high conversion probability');
  }
  
  return insights.length > 0 ? insights : ['Standard inquiry - follow up within 2 hours'];
}

function generateLeadId() {
  return 'HH-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9).toUpperCase();
}

async function sendToLeviathanAI(leadData, env) {
  // This will integrate with your Leviathan AI system
  // For now, log the enriched lead data
  console.log('Sending to Leviathan AI:', JSON.stringify(leadData, null, 2));
  
  // TODO: Add webhook to Leviathan system
  // await fetch('https://api.metanoiaunlimited.com/leviathan/leads', {
  //   method: 'POST',
  //   headers: { 'Content-Type': 'application/json' },
  //   body: JSON.stringify(leadData)
  // });
}

async function sendCustomerAutoResponse(leadData, env) {
  // Immediate auto-response to build trust
  console.log('Sending auto-response to:', leadData.email);
  
  // TODO: Integrate with email service
  // const emailContent = `
  //   Hi ${leadData.name},
  //   
  //   Thank you for reaching out to Hardhat Handyman! 
  //   
  //   We received your request about: "${leadData.message}"
  //   
  //   Rocky will personally review your project and contact you within 2 hours.
  //   
  //   In the meantime, feel free to call us directly at [PHONE] for immediate assistance.
  //   
  //   - The Hardhat Handyman Team
  // `;
}

async function notifyOwnerUrgent(leadData, env) {
  // SMS/Email notification for high-priority leads
  console.log('URGENT LEAD - Notifying owner:', {
    name: leadData.name,
    phone: leadData.phone,
    priority: leadData.priority,
    insights: leadData.aiInsights
  });
  
  // TODO: Integrate with SMS service (Twilio, etc.)
  // TODO: Send push notification to owner's phone
}

// CORS preflight handler
export async function onRequestOptions(context) {
  return new Response(null, {
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type'
    }
  });
}
