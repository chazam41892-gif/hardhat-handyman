-- Database schema for Cloudflare D1
-- This creates the leads table for storing contact form submissions

CREATE TABLE IF NOT EXISTS leads (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT NOT NULL,
    service TEXT,
    message TEXT NOT NULL,
    timestamp TEXT NOT NULL,
    source TEXT DEFAULT 'website',
    status TEXT DEFAULT 'new',
    lead_score INTEGER DEFAULT 0,
    assigned_to TEXT,
    notes TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Index for faster queries
CREATE INDEX IF NOT EXISTS idx_email ON leads(email);
CREATE INDEX IF NOT EXISTS idx_status ON leads(status);
CREATE INDEX IF NOT EXISTS idx_timestamp ON leads(timestamp);
CREATE INDEX IF NOT EXISTS idx_lead_score ON leads(lead_score DESC);

-- To create this database in Cloudflare D1:
-- 1. Login to Cloudflare Dashboard
-- 2. Go to Workers & Pages > D1
-- 3. Create a new database: hardhat-handyman-leads
-- 4. Run this schema using wrangler CLI:
--    wrangler d1 execute hardhat-handyman-leads --file=./schema.sql
