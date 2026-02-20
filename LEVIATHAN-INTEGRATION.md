# 🤖 Leviathan AI Integration - Hardhat Handyman

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                    HARDHAT HANDYMAN WEBSITE                      │
│                   www.hardhat-handyman.com                       │
└────────────────────────┬────────────────────────────────────────┘
                         │ Contact Form Submit
                         ▼
┌─────────────────────────────────────────────────────────────────┐
│          CLOUDFLARE PAGES FUNCTION: /api/lead                    │
│  (functions/api/lead.js - Entry Point to Leviathan)             │
├─────────────────────────────────────────────────────────────────┤
│  • Captures lead data                                            │
│  • Enriches with AI scoring                                      │
│  • Classifies project type                                       │
│  • Determines urgency & priority                                 │
└────────────────────────┬────────────────────────────────────────┘
                         │ POST to Leviathan Webhook
                         ▼
┌═════════════════════════════════════════════════════════════════┐
║            LEVIATHAN AI SWARM SYSTEM                             ║
║           (leviathan-of-hashem repository)                       ║
╠═════════════════════════════════════════════════════════════════╣
║                                                                  ║
║  ┌───────────────────────────────────────────────────────────┐  ║
║  │  INPUT LAYER (Data Ingestion)                             │  ║
║  ├───────────────────────────────────────────────────────────┤  ║
║  │  ✓ ManualInputAgent     ← Receives from website          │  ║
║  │  ✓ WebScraperAgent      (other lead sources)             │  ║
║  │  ✓ CsvImportAgent       (bulk imports)                    │  ║
║  └────────────────┬──────────────────────────────────────────┘  ║
║                   │                                              ║
║                   ▼                                              ║
║  ┌───────────────────────────────────────────────────────────┐  ║
║  │  MEMORY LAYER (Processing & Coordination)                 │  ║
║  ├───────────────────────────────────────────────────────────┤  ║
║  │  ✓ MemoryLayer          (shared state & message bus)     │  ║
║  │  ✓ LeadScorerAgent      (scores 0-1, qualifies)          │  ║
║  │  ✓ DeduplicationAgent   (prevents duplicates)            │  ║
║  └────────────────┬──────────────────────────────────────────┘  ║
║                   │                                              ║
║                   ▼                                              ║
║  ┌───────────────────────────────────────────────────────────┐  ║
║  │  OUTPUT LAYER (Delivery & Reporting)                      │  ║
║  ├───────────────────────────────────────────────────────────┤  ║
║  │  ✓ EmailCompilerAgent   (compiles reports)               │  ║
║  │  ✓ Sends HTML + CSV to:                                   │  ║
║  │    • chazam41892@gmail.com                                │  ║
║  │    • metanoiaunlimited418@gmail.com                       │  ║
║  └───────────────────────────────────────────────────────────┘  ║
║                                                                  ║
╚═════════════════════════════════════════════════════════════════╝
```

## 3-Layer Architecture Explained

### Layer 1: INPUT (Data Collection)
**Purpose:** Gather leads from multiple sources

**Agents:**
- **ManualInputAgent** - Receives leads from hardhat-handyman.com
- **WebScraperAgent** - Scrapes contractor directories, lead sites
- **CsvImportAgent** - Bulk imports from spreadsheets

**Data Flow:** Each agent stores leads in MemoryLayer and sends to LeadScorerAgent

### Layer 2: MEMORY (Processing & Coordination)
**Purpose:** Centralized state management and inter-agent communication

**Components:**
- **MemoryLayer** - Thread-safe shared state, message bus, lead deduplication
- **LeadScorerAgent** - Scores leads 0-1 based on quality signals
- **DeduplicationAgent** - Ensures no duplicate leads pass through

**Data Flow:** Agents communicate via message queues, all share lead database

### Layer 3: OUTPUT (Delivery)
**Purpose:** Compile processed leads and deliver reports

**Agents:**
- **EmailCompilerAgent** - Creates HTML reports with lead details
- Sends automated emails with CSV attachments
- Recipients: Your two Gmail addresses

---

## 🔌 Integration Points

### 1. Website → Leviathan Connection

**Endpoint:** `functions/api/lead.js`

**Payload Format:**
```json
{
  "agent": "manual_input",
  "action": "add_lead",
  "lead_data": {
    "name": "John Smith",
    "email": "john@example.com",
    "phone": "555-0123",
    "company": "Homeowner",
    "source": "hardhat-handyman.com",
    "score": 0.85,
    "tags": ["roofing", "high", "urgent", "has-phone"],
    "timestamp": "2026-02-19T12:00:00Z",
    "status": "new",
    "metadata": {
      "lead_id": "HH-1234567890-ABC123",
      "priority": "high",
      "urgency": "urgent",
      "project_type": ["roofing"],
      "estimated_value": "$8,000-$30,000",
      "ai_insights": ["⚠️ WATER EMERGENCY - Priority response"]
    }
  },
  "swarm_config": {
    "auto_score": true,
    "deduplicate": true,
    "compile_email": true,
    "recipients": [
      "chazam41892@gmail.com",
      "metanoiaunlimited418@gmail.com"
    ]
  }
}
```

### 2. Environment Variables Required

Set these in Cloudflare Pages dashboard:

```bash
# Leviathan Connection
LEVIATHAN_WEBHOOK_URL="https://your-leviathan-endpoint.com/api/lead"
LEVIATHAN_API_KEY="your_api_key_here"

# Email Services (for auto-responses)
SENDGRID_API_KEY="SG.xxxxxxxxxxxxxxxxxxxxxxxx"
OWNER_EMAIL="info@hardhat-handyman.com"

# SMS Notifications (for urgent leads)
TWILIO_ACCOUNT_SID="ACxxxxxxxxxxxxxxxxxxxxxxxx"
TWILIO_AUTH_TOKEN="your_auth_token"
TWILIO_PHONE="+15555551234"
OWNER_PHONE="+15555559999"
```

---

## 📊 Lead Scoring Algorithm

Matches Leviathan's scoring system (0-100, converted to 0-1):

```javascript
Base Score: 30 points

Contact Information (40 points):
  ✓ Valid phone (10+ digits)    +20
  ✓ Valid email (@domain.com)   +15
  ✓ Full name (first + last)    +5

Message Quality (30 points):
  ✓ Length > 100 chars          +15
  ✓ Length > 50 chars           +10
  ✓ Length > 20 chars           +5
  ✓ Contains question mark      +5
  ✓ Mentions budget ($)         +5
  ✓ Timeline keywords           +5

Max Score: 100 → 1.0 for Leviathan
```

---

## 🏷️ Lead Classification

### Project Types
- `roofing` - Roof, shingles, gutters
- `flooring` - Hardwood, tile, laminate
- `outdoor` - Decks, porches, patios
- `bathroom` - Bathroom remodels
- `kitchen` - Kitchen work
- `painting` - Paint, drywall
- `doors-windows` - Door/window installation
- `electrical` - Electrical work
- `plumbing` - Plumbing repairs
- `renovation` - Large remodels
- `general-handyman` - General repairs

### Priority Levels
- `high` - Urgent/emergency keywords
- `medium-high` - Large projects, renovation
- `medium` - Standard inquiry with good info
- `medium-low` - Basic inquiry

### Urgency Levels
- `urgent` - Emergency, ASAP, water damage, etc.
- `normal` - This week, soon
- `low` - Planning, considering

---

## 🤖 AI Insights Generation

The system automatically generates action insights:

```javascript
⚠️ WATER EMERGENCY → Priority response
⚡ SAFETY CONCERN → Immediate assessment
🔄 Bad Past Experience → Emphasize reliability
💰 Price Shopping → Highlight value
⭐ REFERRAL LEAD → High trust level
📅 Timeline Sensitive → Quick response
📦 Multiple Projects → Bundle opportunity
✅ Ready to Book → HOT LEAD
```

---

## 🔄 Data Flow Example

### Customer Submits Form:
```
Name: Sarah Johnson
Email: sarah@email.com  
Phone: 555-0198
Message: "Need urgent roof repair - water leaking into bedroom!"
```

### 1. Website Captures (INPUT)
```javascript
{
  name: "Sarah Johnson",
  email: "sarah@email.com",
  phone: "555-0198",
  score: 0.90,  // High score (has all info + urgent)
  tags: ["roofing", "high", "urgent", "has-phone", "has-email"],
  metadata: {
    priority: "high",
    urgency: "urgent",
    project_type: ["roofing"],
    estimated_value: "$8,000-$30,000",
    ai_insights: ["⚠️ WATER EMERGENCY"]
  }
}
```

### 2. Leviathan Processes (MEMORY)
- ManualInputAgent receives lead
- Stores in MemoryLayer
- LeadScorerAgent confirms/adjusts score
- DeduplicationAgent checks for duplicates
- Passes to EmailCompilerAgent

### 3. Leviathan Delivers (OUTPUT)
- Compiles lead into HTML report
- Attaches CSV with all lead details
- Emails sent to:
  - chazam41892@gmail.com
  - metanoiaunlimited418@gmail.com

### 4. Parallel Actions
- ✅ Customer receives auto-response email
- ✅ Owner receives urgent SMS notification
- ✅ Lead stored in Cloudflare KV (backup)

---

## 🚀 Deployment Steps

### 1. Deploy Website (Already Done)
```powershell
cd "c:\Users\chaza\OneDrive\Documents\Projects\Dev\hardhat-handyman\hardhat-handyman"
npx wrangler pages deploy . --project-name=hardhat-handyman
```

### 2. Configure Environment Variables
In Cloudflare Dashboard:
1. Go to Workers & Pages → hardhat-handyman
2. Settings → Environment variables
3. Add all variables listed above

### 3. Deploy Leviathan Swarm
```bash
# In your leviathan-of-hashem repository
python wrangler.toml/.py  # Starts the swarm locally
```

Or deploy as a web service:
- Host on Railway.app, Render.com, or Heroku
- Expose webhook endpoint
- Update `LEVIATHAN_WEBHOOK_URL` in Cloudflare

### 4. Test Integration
```powershell
# Test lead submission
$body = @{
    name = "Test User"
    email = "test@example.com"
    phone = "555-0100"
    message = "Test urgent roof repair"
} | ConvertTo-Json

Invoke-WebRequest -Uri "https://hardhat-handyman.com/api/lead" -Method POST -Body $body -ContentType "application/json"
```

---

## 📈 Future Enhancements

### Phase 2: Enhanced Agent Network
- **SalesCoordinatorAgent** - Schedules follow-up calls
- **QuoteGeneratorAgent** - Auto-generates estimates
- **CustomerNurtureAgent** - Sends educational content
- **AnalyticsAgent** - Tracks conversion metrics

### Phase 3: Mobile App Integration
Transform website → Progressive Web App (PWA):
- Real-time lead notifications
- Job scheduling interface
- Customer chat integration
- Invoice generation

### Phase 4: Voice AI Integration
- Phone call capture → speech-to-text → Leviathan
- AI voice assistant for after-hours calls
- Automated appointment booking

---

## 🆘 Troubleshooting

### Leads not reaching Leviathan?
1. Check `LEVIATHAN_WEBHOOK_URL` is set
2. Verify API key is correct
3. Check Leviathan swarm is running
4. Look for errors in Cloudflare Functions logs

### Auto-responses not sending?
1. Verify `SENDGRID_API_KEY` is set
2. Check sender email is verified in SendGrid
3. Test SendGrid API directly

### SMS notifications failing?
1. Verify Twilio credentials
2. Check phone numbers are in E.164 format (+15555551234)
3. Ensure Twilio account has credit

### Check Logs:
```powershell
# View Cloudflare Functions logs
npx wrangler pages deployment tail --project-name=hardhat-handyman
```

---

## 📞 Support

**Leviathan System:** leviathan-of-hashem repository  
**Website:** hardhat-handyman.com  
**Email Recipients:**
- chazam41892@gmail.com
- metanoiaunlimited418@gmail.com

---

**🎉 Your AI-powered lead generation system is ready!**

Every contact form submission now flows through the complete 3-layer Leviathan architecture, with intelligent scoring, deduplication, and automated delivery to your Gmail accounts.
