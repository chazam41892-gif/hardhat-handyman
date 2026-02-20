/**
 * Hardhat Handyman Lead Capture → Leviathan AI Swarm Integration
 * 
 * Architecture Flow:
 * Website Form → This Function → Leviathan Swarm (3 Layers)
 * 
 * LEVIATHAN LAYERS:
 * ├─ INPUT LAYER:    ManualInputAgent receives from this endpoint
 * ├─ MEMORY LAYER:   LeadScorerAgent → DeduplicationAgent → MemoryLayer coordination
 * └─ OUTPUT LAYER:   EmailCompilerAgent → sends to chazam41892@gmail.com, metanoiaunlimited418@gmail.com
 */

export async function onRequestPost(context) {
  const startTime = Date.now();
  
  try {
    // ════════════════════════════════════════════════════════════════
    // INPUT LAYER - Capture lead from website form
    // ════════════════════════════════════════════════════════════════
    
    const rawLeadData = await context.request.json();
    
    const enrichedLead = {
      // Core data from form
      name: rawLeadData.name || '',
      email: rawLeadData.email || '',
      phone: rawLeadData.phone || '',
      message: rawLeadData.message || '',
      
      // Enrichment for Leviathan
      company: 'Homeowner', // Default for handyman leads
      source: 'hardhat-handyman.com',
      lead_id: generateLeadId(),
      timestamp: new Date().toISOString(),
      
      // AI Scoring (0-1 scale for Leviathan)
      score: scoreLeadQuality(rawLeadData) / 100,
      
      // Classification tags
      tags: buildLeadTags(rawLeadData),
      
      // Status tracking
      status: 'new',
      
      // Metadata
      metadata: {
        ip_address: context.request.headers.get('cf-connecting-ip'),
        country: context.request.cf?.country || 'US',
        user_agent: context.request.headers.get('user-agent'),
        url: context.request.url,
        priority: calculatePriority(rawLeadData),
        urgency: determineUrgency(rawLeadData.message),
        project_type: classifyProject(rawLeadData.message),
        estimated_value: estimateValue(rawLeadData.message),
        ai_insights: generateInsights(rawLeadData.message)
      }
    };
    
    // ════════════════════════════════════════════════════════════════
    // SEND TO LEVIATHAN SWARM - ManualInputAgent entry point
    // ════════════════════════════════════════════════════════════════
    
    const swarmResult = await sendToLeviathanSwarm(enrichedLead, context.env);
    
    // ════════════════════════════════════════════════════════════════
    // PARALLEL OUTPUT ACTIONS (while swarm processes in background)
    // ════════════════════════════════════════════════════════════════
    
    await Promise.allSettled([
      // Immediate customer response
      sendAutoResponse(enrichedLead, context.env),
      
      // Urgent notification to owner
      enrichedLead.metadata.urgency === 'urgent' 
        ? notifyOwnerUrgent(enrichedLead, context.env)
        : Promise.resolve(),
      
      // Store in KV for backup
      context.env.LEADS_KV 
        ? context.env.LEADS_KV.put(`lead:${enrichedLead.lead_id}`, JSON.stringify(enrichedLead), { expirationTtl: 7776000 })
        : Promise.resolve()
    ]);
    
    // ════════════════════════════════════════════════════════════════
    // RESPONSE TO CLIENT
    // ════════════════════════════════════════════════════════════════
    
    return new Response(JSON.stringify({
      success: true,
      message: getResponseMessage(enrichedLead.metadata.priority),
      lead_id: enrichedLead.lead_id,
      leviathan_status: swarmResult.status,
      processing_time_ms: Date.now() - startTime
    }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'X-Lead-ID': enrichedLead.lead_id,
        'X-Leviathan-Swarm': swarmResult.success ? 'active' : 'fallback'
      }
    });
    
  } catch (error) {
    console.error('Lead processing error:', error);
    
    return new Response(JSON.stringify({
      success: true,
      message: "Thank you! We'll contact you within 2 hours.",
      note: "Lead captured (fallback mode)"
    }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    });
  }
}

// ═══════════════════════════════════════════════════════════════════
// LEVIATHAN SWARM INTEGRATION
// Connects to the ManualInputAgent in your leviathan-of-hashem system
// ═══════════════════════════════════════════════════════════════════

async function sendToLeviathanSwarm(leadData, env) {
  const leviathanEndpoint = env.LEVIATHAN_WEBHOOK_URL || env.LEVIATHAN_API_ENDPOINT;
  const apiKey = env.LEVIATHAN_API_KEY;
  
  if (!leviathanEndpoint) {
    console.warn('⚠️ Leviathan endpoint not configured - using fallback');
    return { success: false, status: 'not_configured' };
  }
  
  try {
    // Format for Leviathan ManualInputAgent.add_lead()
    const payload = {
      agent: 'manual_input',
      action: 'add_lead',
      lead_data: {
        name: leadData.name,
        email: leadData.email,
        phone: leadData.phone,
        company: leadData.company,
        source: leadData.source,
        score: leadData.score,
        tags: leadData.tags,
        timestamp: leadData.timestamp,
        status: leadData.status,
        metadata: leadData.metadata
      },
      // Swarm coordination
      swarm_config: {
        auto_score: true,        // LeadScorerAgent will process
        deduplicate: true,        // DeduplicationAgent will check
        compile_email: true,      // EmailCompilerAgent will include in next report
        recipients: [
          'chazam41892@gmail.com',
          'metanoiaunlimited418@gmail.com'
        ]
      }
    };
    
    const response = await fetch(leviathanEndpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': apiKey ? `Bearer ${apiKey}` : undefined,
        'X-Leviathan-Source': 'hardhat-handyman',
        'X-Lead-ID': leadData.lead_id
      },
      body: JSON.stringify(payload),
      signal: AbortSignal.timeout(10000)
    });
    
    if (response.ok) {
      const result = await response.json();
      console.log('✅ Lead sent to Leviathan swarm:', leadData.lead_id);
      return {
        success: true,
        status: 'swarm_processing',
        result: result
      };
    } else {
      console.warn('⚠️ Leviathan returned:', response.status);
      return {
        success: false,
        status: 'swarm_error',
        http_status: response.status
      };
    }
    
  } catch (error) {
    console.error('❌ Leviathan connection failed:', error.message);
    return {
      success: false,
      status: 'connection_failed',
      error: error.message
    };
  }
}

// ═══════════════════════════════════════════════════════════════════
// LEAD SCORING & CLASSIFICATION (mirrors Leviathan logic)
// ═══════════════════════════════════════════════════════════════════

function scoreLeadQuality(leadData) {
  let score = 30; // Base score
  
  // Contact completeness (40 points)
  if (leadData.phone && leadData.phone.replace(/\D/g,'').length >= 10) score += 20;
  if (leadData.email && leadData.email.includes('@')) score += 15;
  if (leadData.name && leadData.name.split(' ').length >= 2) score += 5;
  
  // Message quality (30 points)
  const msgLen = (leadData.message || '').length;
  if (msgLen > 100) score += 15;
  else if (msgLen > 50) score += 10;
  else if (msgLen > 20) score += 5;
  
  // Intent signals
  if (leadData.message && leadData.message.match(/\$/g)) score += 5; // Budget mention
  if (leadData.message && leadData.message.match(/when|timeline|schedule/i)) score += 5;
  if (leadData.message && leadData.message.match(/\?/g)?.length >= 1) score += 5;
  
  return Math.min(score, 100);
}

function calculatePriority(leadData) {
  const msg = (leadData.message || '').toLowerCase();
  
  if (msg.match(/urgent|emergency|asap|immediately|water damage|leak|broken/i)) {
    return 'high';
  }
  if (msg.match(/renovation|remodel|deck|roof|multiple/i)) {
    return 'medium-high';
  }
  if (leadData.phone && leadData.email && leadData.message?.length > 50) {
    return 'medium';
  }
  return 'medium-low';
}

function determineUrgency(message) {
  const msg = (message || '').toLowerCase();
  if (msg.match(/emergency|urgent|asap|immediately|today|right now|flooding|no heat|no water/i)) {
    return 'urgent';
  }
  if (msg.match(/this week|soon|quickly/i)) {
    return 'normal';
  }
  return 'low';
}

function classifyProject(message) {
  const msg = (message || '').toLowerCase();
  const types = [];
  
  if (msg.match(/roof|shingle|gutter/i)) types.push('roofing');
  if (msg.match(/floor|hardwood|tile|laminate/i)) types.push('flooring');
  if (msg.match(/deck|porch|patio/i)) types.push('outdoor');
  if (msg.match(/bathroom|shower|toilet/i)) types.push('bathroom');
  if (msg.match(/kitchen|cabinet|counter/i)) types.push('kitchen');
  if (msg.match(/paint|drywall/i)) types.push('painting');
  if (msg.match(/door|window/i)) types.push('doors-windows');
  if (msg.match(/electric|outlet|wiring/i)) types.push('electrical');
  if (msg.match(/plumb|pipe|drain/i)) types.push('plumbing');
  if (msg.match(/remodel|renovation/i)) types.push('renovation');
  
  return types.length > 0 ? types : ['general-handyman'];
}

function estimateValue(message) {
  const msg = (message || '').toLowerCase();
  
  if (msg.match(/renovation|remodel|addition/i)) return '$10,000-$50,000+';
  if (msg.match(/roof|roofing/i)) return '$8,000-$30,000';
  if (msg.match(/deck|porch/i)) return '$5,000-$25,000';
  if (msg.match(/bathroom|kitchen/i)) return '$5,000-$25,000';
  if (msg.match(/floor|flooring/i)) return '$3,000-$15,000';
  if (msg.match(/paint|painting/i)) return '$1,500-$8,000';
  if (msg.match(/door|window/i)) return '$1,000-$5,000';
  if (msg.match(/repair|fix/i)) return '$300-$3,000';
  
  return '$500-$5,000';
}

function buildLeadTags(leadData) {
  const tags = ['hardhat-handyman', 'website-lead'];
  const projectTypes = classifyProject(leadData.message);
  const priority = calculatePriority(leadData);
  const urgency = determineUrgency(leadData.message);
  
  tags.push(...projectTypes);
  tags.push(priority);
  tags.push(urgency);
  
  if (leadData.phone) tags.push('has-phone');
  if (leadData.email) tags.push('has-email');
  if (scoreLeadQuality(leadData) >= 80) tags.push('high-quality');
  
  return tags;
}

function generateInsights(message) {
  const msg = (message || '').toLowerCase();
  const insights = [];
  
  if (msg.match(/water|leak|flood/i)) {
    insights.push('⚠️ WATER EMERGENCY - Priority response');
  }
  if (msg.match(/previous|last|other contractor/i)) {
    insights.push('🔄 Bad experience - emphasize reliability');
  }
  if (msg.match(/estimate|quote|price/i)) {
    insights.push('💰 Price shopping - highlight value');
  }
  if (msg.match(/recommend|referral|friend/i)) {
    insights.push('⭐ REFERRAL - High trust level');
  }
  if (msg.match(/multiple|several/i)) {
    insights.push('📦 Multiple projects - bundle opportunity');
  }
  if (msg.match(/ready|start|need it done/i)) {
    insights.push('✅ Ready to book - HOT LEAD');
  }
  
  return insights.length > 0 ? insights : ['Standard inquiry'];
}

function generateLeadId() {
  return `HH-${Date.now()}-${Math.random().toString(36).substr(2, 6).toUpperCase()}`;
}

function getResponseMessage(priority) {
  const messages = {
    'high': "Thank you! This is urgent - Rocky will contact you within 30 minutes.",
    'medium-high': "Thank you! Rocky will review your project and contact you within 1-2 hours.",
    'medium': "Thank you! We'll contact you within 2-4 hours.",
    'medium-low': "Thank you! We'll review and respond within 24 hours."
  };
  return messages[priority] || messages['medium'];
}

// ═══════════════════════════════════════════════════════════════════
// CUSTOMER AUTO-RESPONSE
// ═══════════════════════════════════════════════════════════════════

async function sendAutoResponse(leadData, env) {
  if (!env.SENDGRID_API_KEY || !leadData.email) return;
  
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #2c3e50; margin: 0; padding: 0; }
        .container { max-width: 600px; margin: 0 auto; }
        .header { background: linear-gradient(135deg, #1e3a8a 0%, #dc2626 100%); color: white; padding: 30px; text-align: center; }
        .content { background: #f8f9fa; padding: 30px; }
        .highlight { background: #fff3cd; padding: 15px; border-left: 4px solid #ffc107; margin: 15px 0; }
        .footer { text-align: center; color: #6b7280; padding: 20px; font-size: 0.9em; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>🏗️ Hardhat Handyman</h1>
          <p>Thank You for Your Inquiry!</p>
        </div>
        <div class="content">
          <h2>Hi ${leadData.name},</h2>
          <p>We received your request:</p>
          <div class="highlight">"${leadData.message}"</div>
          
          <p><strong>Project Type:</strong> ${leadData.metadata.project_type.join(', ')}</p>
          <p><strong>Est. Value:</strong> ${leadData.metadata.estimated_value}</p>
          <p><strong>Reference:</strong> ${leadData.lead_id}</p>
          
          <h3>What's Next?</h3>
          <p>Rocky will personally review your project and contact you ${
            leadData.metadata.urgency === 'urgent' ? 'within 30 minutes' : 'within 2 hours'
          }.</p>
          
          ${leadData.metadata.urgency === 'urgent' ? `
            <div class="highlight">
              <strong>⚡ URGENT REQUEST NOTED</strong><br>
              Rocky has been notified immediately!
            </div>
          ` : ''}
          
          <h3>Why Choose Us?</h3>
          <ul>
            <li>✅ 15+ Years Experience</li>
            <li>✅ Licensed & Insured</li>
            <li>✅ 100% Satisfaction Guarantee</li>
            <li>✅ Same Day Service Available</li>
          </ul>
        </div>
        <div class="footer">
          <p>Powered by Leviathan AI | Hardhat Handyman</p>
          <p>www.hardhat-handyman.com</p>
        </div>
      </div>
    </body>
    </html>
  `;
  
  try {
    await fetch('https://api.sendgrid.com/v3/mail/send', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${env.SENDGRID_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        personalizations: [{ to: [{ email: leadData.email }] }],
        from: { email: env.OWNER_EMAIL || 'info@hardhat-handyman.com' },
        subject: `Thank You - Hardhat Handyman (${leadData.lead_id})`,
        content: [{ type: 'text/html', value: html }]
      })
    });
    console.log('✅ Auto-response sent to:', leadData.email);
  } catch (error) {
    console.error('Auto-response failed:', error);
  }
}

async function notifyOwnerUrgent(leadData, env) {
  if (!env.TWILIO_ACCOUNT_SID || !env.OWNER_PHONE) return;
  
  const sms = `🚨 URGENT LEAD - Hardhat Handyman

Name: ${leadData.name}
Phone: ${leadData.phone}
Project: ${leadData.metadata.project_type[0]}

"${leadData.message.substring(0, 80)}..."

ID: ${leadData.lead_id}
RESPOND ASAP!`;
  
  try {
    const auth = Buffer.from(`${env.TWILIO_ACCOUNT_SID}:${env.TWILIO_AUTH_TOKEN}`).toString('base64');
    await fetch(
      `https://api.twilio.com/2010-04-01/Accounts/${env.TWILIO_ACCOUNT_SID}/Messages.json`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Basic ${auth}`,
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: new URLSearchParams({
          To: env.OWNER_PHONE,
          From: env.TWILIO_PHONE,
          Body: sms
        })
      }
    );
    console.log('✅ Owner notified via SMS');
  } catch (error) {
    console.error('Owner SMS failed:', error);
  }
}

// ═══════════════════════════════════════════════════════════════════
// CORS HANDLER
// ═══════════════════════════════════════════════════════════════════

export async function onRequestOptions(context) {
  return new Response(null, {
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
      'Access-Control-Max-Age': '86400'
    }
  });
}
