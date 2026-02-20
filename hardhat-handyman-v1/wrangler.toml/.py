import asyncio
import json
import os
import smtplib
import logging
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from dataclasses import dataclass, field, asdict
from typing import List, Dict, Any, Optional
from datetime import datetime
from concurrent.futures import ThreadPoolExecutor
from collections import deque
import threading
import csv
import io

"""
AI Lead Generation Swarm System
- Input Layer: Data ingestion from multiple sources
- Memory Layer: Shared state & coordination between agents
- Output Layer: Email list compilation and delivery
"""


# ─── Configuration ───────────────────────────────────────────────────────────

RECIPIENT_EMAILS = [
    "chazam41892@gmail.com",
    "metanoiaunlimited418@gmail.com",
]

SMTP_HOST = os.getenv("SMTP_HOST", "smtp.gmail.com")
SMTP_PORT = int(os.getenv("SMTP_PORT", "587"))
SMTP_USER = os.getenv("SMTP_USER", "")  # Set your sender email
SMTP_PASS = os.getenv("SMTP_PASS", "")  # Set your app password

logging.basicConfig(level=logging.INFO, format="%(asctime)s [%(name)s] %(message)s")
logger = logging.getLogger("LeadGenSwarm")


# ─── Data Models ─────────────────────────────────────────────────────────────

@dataclass
class Lead:
    name: str
    email: str
    phone: str = ""
    company: str = ""
    source: str = ""
    score: float = 0.0
    tags: List[str] = field(default_factory=list)
    timestamp: str = field(default_factory=lambda: datetime.utcnow().isoformat())
    status: str = "new"  # new, qualified, contacted, converted, rejected


@dataclass
class AgentMessage:
    sender: str
    receiver: str  # agent name or "broadcast"
    content: Any
    msg_type: str  # "lead", "command", "status", "query"
    timestamp: str = field(default_factory=lambda: datetime.utcnow().isoformat())


# ─── MEMORY LAYER (Shared State & Message Bus) ──────────────────────────────

class MemoryLayer:
    """
    Central shared memory and communication bus for all agents.
    Handles inter-agent messaging, lead deduplication, and persistent state.
    """

    def __init__(self):
        self._lock = threading.Lock()
        self._leads: Dict[str, Lead] = {}  # keyed by email for dedup
        self._message_queues: Dict[str, asyncio.Queue] = {}
        self._broadcast_queue: asyncio.Queue = asyncio.Queue()
        self._agent_status: Dict[str, Dict] = {}
        self._event_log: deque = deque(maxlen=10000)
        logger.info("MemoryLayer initialized.")

    def register_agent(self, agent_name: str):
        with self._lock:
            self._message_queues[agent_name] = asyncio.Queue()
            self._agent_status[agent_name] = {"state": "idle", "last_active": None}
            logger.info(f"Agent registered: {agent_name}")

    async def send_message(self, message: AgentMessage):
        self._event_log.append(message)
        if message.receiver == "broadcast":
            for name, q in self._message_queues.items():
                if name != message.sender:
                    await q.put(message)
        elif message.receiver in self._message_queues:
            await self._message_queues[message.receiver].put(message)

    async def receive_message(self, agent_name: str, timeout: float = 1.0) -> Optional[AgentMessage]:
        try:
            return await asyncio.wait_for(
                self._message_queues[agent_name].get(), timeout=timeout
            )
        except asyncio.TimeoutError:
            return None

    def store_lead(self, lead: Lead) -> bool:
        """Store lead, returns True if new, False if duplicate."""
        with self._lock:
            if lead.email in self._leads:
                existing = self._leads[lead.email]
                existing.score = max(existing.score, lead.score)
                existing.tags = list(set(existing.tags + lead.tags))
                return False
            self._leads[lead.email] = lead
            return True

    def get_all_leads(self) -> List[Lead]:
        with self._lock:
            return list(self._leads.values())

    def get_qualified_leads(self, min_score: float = 0.5) -> List[Lead]:
        with self._lock:
            return [l for l in self._leads.values() if l.score >= min_score]

    def update_agent_status(self, agent_name: str, state: str):
        with self._lock:
            self._agent_status[agent_name] = {
                "state": state,
                "last_active": datetime.utcnow().isoformat(),
            }

    def get_swarm_status(self) -> Dict:
        with self._lock:
            return {
                "agents": dict(self._agent_status),
                "total_leads": len(self._leads),
                "qualified_leads": len([l for l in self._leads.values() if l.score >= 0.5]),
                "event_count": len(self._event_log),
            }


# ─── INPUT LAYER (Data Feed Agents) ─────────────────────────────────────────

class BaseAgent:
    """Base class for all swarm agents."""

    def __init__(self, name: str, memory: MemoryLayer):
        self.name = name
        self.memory = memory
        self.memory.register_agent(name)
        self.running = False
        self.logger = logging.getLogger(f"Agent.{name}")

    async def broadcast(self, content: Any, msg_type: str = "status"):
        await self.memory.send_message(AgentMessage(
            sender=self.name,
            receiver="broadcast",
            content=content,
            msg_type=msg_type,
        ))

    async def send_to(self, receiver: str, content: Any, msg_type: str = "lead"):
        await self.memory.send_message(AgentMessage(
            sender=self.name,
            receiver=receiver,
            content=content,
            msg_type=msg_type,
        ))

    async def listen(self, timeout: float = 0.5) -> Optional[AgentMessage]:
        return await self.memory.receive_message(self.name, timeout)

    async def run(self):
        raise NotImplementedError


class WebScraperAgent(BaseAgent):
    """Ingests leads from web data feeds (placeholder for real scraping)."""

    def __init__(self, memory: MemoryLayer, data_sources: List[Dict] = None):
        super().__init__("web_scraper", memory)
        self.data_sources = data_sources or []

    async def run(self):
        self.running = True
        self.memory.update_agent_status(self.name, "running")
        self.logger.info("Web scraper agent started.")

        # Simulate ingesting from data sources
        for source in self.data_sources:
            leads = self._parse_source(source)
            for lead in leads:
                is_new = self.memory.store_lead(lead)
                if is_new:
                    await self.send_to("lead_scorer", asdict(lead), msg_type="lead")
                    self.logger.info(f"New lead ingested: {lead.email}")
            await asyncio.sleep(0.1)

        await self.broadcast(f"{self.name} finished ingesting {len(self.data_sources)} sources")
        self.memory.update_agent_status(self.name, "done")

    def _parse_source(self, source: Dict) -> List[Lead]:
        """Parse a data source dict into Lead objects."""
        leads = []
        for entry in source.get("entries", []):
            leads.append(Lead(
                name=entry.get("name", ""),
                email=entry.get("email", ""),
                phone=entry.get("phone", ""),
                company=entry.get("company", ""),
                source=source.get("source_name", "web"),
                tags=entry.get("tags", []),
            ))
        return leads


class CsvImportAgent(BaseAgent):
    """Ingests leads from CSV file paths or CSV strings."""

    def __init__(self, memory: MemoryLayer, csv_paths: List[str] = None):
        super().__init__("csv_importer", memory)
        self.csv_paths = csv_paths or []

    async def run(self):
        self.running = True
        self.memory.update_agent_status(self.name, "running")
        self.logger.info("CSV import agent started.")

        for path in self.csv_paths:
            try:
                leads = self._load_csv(path)
                for lead in leads:
                    is_new = self.memory.store_lead(lead)
                    if is_new:
                        await self.send_to("lead_scorer", asdict(lead), msg_type="lead")
                        self.logger.info(f"CSV lead ingested: {lead.email}")
            except Exception as e:
                self.logger.error(f"Error loading CSV {path}: {e}")
            await asyncio.sleep(0.1)

        await self.broadcast(f"{self.name} finished importing CSVs")
        self.memory.update_agent_status(self.name, "done")

    def _load_csv(self, path: str) -> List[Lead]:
        leads = []
        with open(path, "r", newline="", encoding="utf-8") as f:
            reader = csv.DictReader(f)
            for row in reader:
                leads.append(Lead(
                    name=row.get("name", ""),
                    email=row.get("email", ""),
                    phone=row.get("phone", ""),
                    company=row.get("company", ""),
                    source="csv_import",
                    tags=row.get("tags", "").split(",") if row.get("tags") else [],
                ))
        return leads


class ManualInputAgent(BaseAgent):
    """Accepts manually added leads via API-style dict injection."""

    def __init__(self, memory: MemoryLayer):
        super().__init__("manual_input", memory)
        self._pending: List[Dict] = []

    def add_lead(self, lead_data: Dict):
        self._pending.append(lead_data)

    async def run(self):
        self.running = True
        self.memory.update_agent_status(self.name, "running")
        self.logger.info("Manual input agent started.")

        for data in self._pending:
            lead = Lead(**{k: v for k, v in data.items() if k in Lead.__dataclass_fields__})
            lead.source = lead.source or "manual"
            is_new = self.memory.store_lead(lead)
            if is_new:
                await self.send_to("lead_scorer", asdict(lead), msg_type="lead")
        self._pending.clear()

        await self.broadcast(f"{self.name} finished manual input")
        self.memory.update_agent_status(self.name, "done")


# ─── MEMORY LAYER AGENTS (Processing & Coordination) ────────────────────────

class LeadScorerAgent(BaseAgent):
    """Scores and qualifies leads. Runs continuously listening for new leads."""

    def __init__(self, memory: MemoryLayer):
        super().__init__("lead_scorer", memory)

    async def run(self):
        self.running = True
        self.memory.update_agent_status(self.name, "running")
        self.logger.info("Lead scorer agent started.")
        processed = 0

        while self.running:
            msg = await self.listen(timeout=2.0)
            if msg and msg.msg_type == "lead":
                lead_data = msg.content
                score = self._score_lead(lead_data)
                email = lead_data.get("email", "")

                # Update lead in memory
                all_leads = self.memory.get_all_leads()
                for lead in all_leads:
                    if lead.email == email:
                        lead.score = score
                        lead.status = "qualified" if score >= 0.5 else "rejected"
                        break

                processed += 1
                self.logger.info(f"Scored lead {email}: {score:.2f}")
                await self.send_to("dedup_agent", lead_data, msg_type="lead")

            elif msg and msg.msg_type == "command" and msg.content == "stop":
                break

        self.memory.update_agent_status(self.name, "done")
        self.logger.info(f"Lead scorer done. Processed {processed} leads.")

    def _score_lead(self, lead_data: Dict) -> float:
        """Simple rule-based scoring. Replace with ML model as needed."""
        score = 0.0
        if lead_data.get("email"):
            score += 0.3
        if lead_data.get("phone"):
            score += 0.2
        if lead_data.get("company"):
            score += 0.2
        if lead_data.get("name"):
            score += 0.1
        tags = lead_data.get("tags", [])
        if tags:
            score += min(0.2, len(tags) * 0.05)
        return min(score, 1.0)


class DeduplicationAgent(BaseAgent):
    """Ensures no duplicate leads pass through to output."""

    def __init__(self, memory: MemoryLayer):
        super().__init__("dedup_agent", memory)
        self._seen_emails = set()

    async def run(self):
        self.running = True
        self.memory.update_agent_status(self.name, "running")
        self.logger.info("Deduplication agent started.")

        while self.running:
            msg = await self.listen(timeout=2.0)
            if msg and msg.msg_type == "lead":
                email = msg.content.get("email", "")
                if email and email not in self._seen_emails:
                    self._seen_emails.add(email)
                    await self.send_to("email_compiler", msg.content, msg_type="lead")
            elif msg and msg.msg_type == "command" and msg.content == "stop":
                break

        self.memory.update_agent_status(self.name, "done")


# ─── OUTPUT LAYER (Email Compilation & Delivery) ─────────────────────────────

class EmailCompilerAgent(BaseAgent):
    """Collects qualified leads and compiles email list for delivery."""

    def __init__(self, memory: MemoryLayer, recipients: List[str] = None):
        super().__init__("email_compiler", memory)
        self.recipients = recipients or RECIPIENT_EMAILS
        self._compiled_leads: List[Dict] = []

    async def run(self):
        self.running = True
        self.memory.update_agent_status(self.name, "running")
        self.logger.info("Email compiler agent started.")

        while self.running:
            msg = await self.listen(timeout=2.0)
            if msg and msg.msg_type == "lead":
                self._compiled_leads.append(msg.content)
                self.logger.info(f"Lead compiled for email: {msg.content.get('email')}")
            elif msg and msg.msg_type == "command" and msg.content == "compile_and_send":
                await self._send_email_report()
                break
            elif msg and msg.msg_type == "command" and msg.content == "stop":
                break

        self.memory.update_agent_status(self.name, "done")

    async def _send_email_report(self):
        """Compile all leads and send email report."""
        # Also grab all qualified leads from memory as a safety net
        memory_leads = self.memory.get_qualified_leads(min_score=0.0)
        all_leads_map = {}
        for ld in self._compiled_leads:
            all_leads_map[ld.get("email", "")] = ld
        for lead in memory_leads:
            if lead.email not in all_leads_map:
                all_leads_map[lead.email] = asdict(lead)

        leads_list = list(all_leads_map.values())
        self.logger.info(f"Compiling report with {len(leads_list)} leads.")

        # Build email
        subject = f"Lead Generation Report - {datetime.utcnow().strftime('%Y-%m-%d %H:%M')} UTC"
        html_body = self._build_html_report(leads_list)
        csv_attachment = self._build_csv(leads_list)

        for recipient in self.recipients:
            self._send_email(recipient, subject, html_body, csv_attachment)
            self.logger.info(f"Report sent to {recipient}")

    def _build_html_report(self, leads: List[Dict]) -> str:
        swarm_status = self.memory.get_swarm_status()
        rows = ""
        for i, lead in enumerate(leads, 1):
            tags = ", ".join(lead.get("tags", []))
            rows += f"""
            <tr>
                <td>{i}</td>
                <td>{lead.get('name', '')}</td>
                <td>{lead.get('email', '')}</td>
                <td>{lead.get('phone', '')}</td>
                <td>{lead.get('company', '')}</td>
                <td>{lead.get('source', '')}</td>
                <td>{lead.get('score', 0):.2f}</td>
                <td>{lead.get('status', '')}</td>
                <td>{tags}</td>
            </tr>"""

        return f"""
        <html>
        <head>
            <style>
                body {{ font-family: Arial, sans-serif; margin: 20px; }}
                h1 {{ color: #2c3e50; }}
                h2 {{ color: #34495e; }}
                table {{ border-collapse: collapse; width: 100%; margin: 20px 0; }}
                th, td {{ border: 1px solid #ddd; padding: 8px; text-align: left; }}
                th {{ background-color: #3498db; color: white; }}
                tr:nth-child(even) {{ background-color: #f2f2f2; }}
                .stats {{ background: #ecf0f1; padding: 15px; border-radius: 5px; margin: 10px 0; }}
            </style>
        </head>
        <body>
            <h1>🏗️ Hardhat Handyman - Lead Generation Report</h1>
            <div class="stats">
                <h2>Swarm Status</h2>
                <p><strong>Total Leads:</strong> {swarm_status['total_leads']}</p>
                <p><strong>Qualified Leads:</strong> {swarm_status['qualified_leads']}</p>
                <p><strong>Active Agents:</strong> {len(swarm_status['agents'])}</p>
                <p><strong>Events Processed:</strong> {swarm_status['event_count']}</p>
            </div>
            <h2>Lead List ({len(leads)} total)</h2>
            <table>
                <tr>
                    <th>#</th><th>Name</th><th>Email</th><th>Phone</th>
                    <th>Company</th><th>Source</th><th>Score</th>
                    <th>Status</th><th>Tags</th>
                </tr>
                {rows}
            </table>
            <p><em>Generated by AI Lead Gen Swarm at {datetime.utcnow().isoformat()} UTC</em></p>
        </body>
        </html>
        """

    def _build_csv(self, leads: List[Dict]) -> str:
        output = io.StringIO()
        writer = csv.DictWriter(output, fieldnames=[
            "name", "email", "phone", "company", "source", "score", "status", "tags", "timestamp"
        ])
        writer.writeheader()
        for lead in leads:
            row = {k: lead.get(k, "") for k in writer.fieldnames}
            row["tags"] = ",".join(lead.get("tags", []))
            writer.writerow(row)
        return output.getvalue()

    def _send_email(self, recipient: str, subject: str, html_body: str, csv_data: str):
        if not SMTP_USER or not SMTP_PASS:
            self.logger.warning(
                f"SMTP not configured. Would send to {recipient}. "
                f"Set SMTP_USER and SMTP_PASS env vars."
            )
            # Save locally as fallback
            filename = f"lead_report_{datetime.utcnow().strftime('%Y%m%d_%H%M%S')}.html"
            with open(filename, "w") as f:
                f.write(html_body)
            csv_filename = filename.replace(".html", ".csv")
            with open(csv_filename, "w") as f:
                f.write(csv_data)
            self.logger.info(f"Report saved locally: {filename}, {csv_filename}")
            return

        msg = MIMEMultipart("alternative")
        msg["Subject"] = subject
        msg["From"] = SMTP_USER
        msg["To"] = recipient
        msg.attach(MIMEText(html_body, "html"))

        # Attach CSV
        csv_attachment = MIMEText(csv_data)
        csv_attachment.add_header(
            "Content-Disposition", "attachment",
            filename=f"leads_{datetime.utcnow().strftime('%Y%m%d')}.csv"
        )
        msg.attach(csv_attachment)

        try:
            with smtplib.SMTP(SMTP_HOST, SMTP_PORT) as server:
                server.starttls()
                server.login(SMTP_USER, SMTP_PASS)
                server.sendmail(SMTP_USER, recipient, msg.as_string())
        except Exception as e:
            self.logger.error(f"Failed to send email to {recipient}: {e}")


# ─── SWARM ORCHESTRATOR ─────────────────────────────────────────────────────

class LeadGenSwarm:
    """
    Orchestrates the entire lead generation swarm.
    
    Architecture:
        INPUT LAYER  →  MEMORY LAYER  →  OUTPUT LAYER
        ───────────     ────────────     ────────────
        WebScraper   →  LeadScorer   →  EmailCompiler
        CsvImporter  →  DedupAgent       ↓
        ManualInput      ↕ (shared     Sends to:
                          memory bus)  • chazam41892@gmail.com
                                       • metanoiaunlimited418@gmail.com
    """

    def __init__(self):
        self.memory = MemoryLayer()
        self.agents: Dict[str, BaseAgent] = {}
        self._setup_agents()

    def _setup_agents(self):
        # Input Layer
        self.web_scraper = WebScraperAgent(self.memory)
        self.csv_importer = CsvImportAgent(self.memory)
        self.manual_input = ManualInputAgent(self.memory)

        # Memory Layer (Processing)
        self.lead_scorer = LeadScorerAgent(self.memory)
        self.dedup_agent = DeduplicationAgent(self.memory)

        # Output Layer
        self.email_compiler = EmailCompilerAgent(self.memory, RECIPIENT_EMAILS)

        self.agents = {
            "web_scraper": self.web_scraper,
            "csv_importer": self.csv_importer,
            "manual_input": self.manual_input,
            "lead_scorer": self.lead_scorer,
            "dedup_agent": self.dedup_agent,
            "email_compiler": self.email_compiler,
        }

    def add_data_source(self, source: Dict):
        """Add a web data source feed."""
        self.web_scraper.data_sources.append(source)

    def add_csv_path(self, path: str):
        """Add a CSV file path for import."""
        self.csv_importer.csv_paths.append(path)

    def add_manual_lead(self, lead_data: Dict):
        """Manually inject a lead."""
        self.manual_input.add_lead(lead_data)

    async def run(self):
        """Execute the full swarm pipeline in parallel."""
        logger.info("=" * 60)
        logger.info("LEAD GENERATION SWARM STARTING")
        logger.info("=" * 60)

        # Start memory-layer agents (they run continuously and listen)
        memory_tasks = [
            asyncio.create_task(self.lead_scorer.run()),
            asyncio.create_task(self.dedup_agent.run()),
            asyncio.create_task(self.email_compiler.run()),
        ]

        # Give memory agents a moment to initialize
        await asyncio.sleep(0.2)

        # Run input-layer agents in parallel
        input_tasks = [
            asyncio.create_task(self.web_scraper.run()),
            asyncio.create_task(self.csv_importer.run()),
            asyncio.create_task(self.manual_input.run()),
        ]

        # Wait for all input agents to finish
        await asyncio.gather(*input_tasks)
        logger.info("All input agents completed.")

        # Allow processing time for leads to flow through the pipeline
        await asyncio.sleep(3.0)

        # Signal email compiler to compile and send
        await self.memory.send_message(AgentMessage(
            sender="orchestrator",
            receiver="email_compiler",
            content="compile_and_send",
            msg_type="command",
        ))

        # Signal scorer and dedup to stop
        await self.memory.send_message(AgentMessage(
            sender="orchestrator",
            receiver="lead_scorer",
            content="stop",
            msg_type="command",
        ))
        await self.memory.send_message(AgentMessage(
            sender="orchestrator",
            receiver="dedup_agent",
            content="stop",
            msg_type="command",
        ))

        # Wait for all memory/output agents to finish
        await asyncio.gather(*memory_tasks)

        status = self.memory.get_swarm_status()
        logger.info("=" * 60)
        logger.info("SWARM COMPLETE")
        logger.info(f"Total Leads: {status['total_leads']}")
        logger.info(f"Qualified:   {status['qualified_leads']}")
        logger.info(f"Reports sent to: {', '.join(RECIPIENT_EMAILS)}")
        logger.info("=" * 60)

        return status


# ─── MAIN ENTRYPOINT ────────────────────────────────────────────────────────

async def main():
    swarm = LeadGenSwarm()

    # ── Example Data Feeds ──
    # Feed 1: Web-scraped data
    swarm.add_data_source({
        "source_name": "contractor_directory",
        "entries": [
            {"name": "John Smith", "email": "john@smithconstruction.com",
             "phone": "555-0101", "company": "Smith Construction", "tags": ["contractor", "residential"]},
            {"name": "Maria Garcia", "email": "maria@garciabuilders.com",
             "phone": "555-0102", "company": "Garcia Builders", "tags": ["contractor", "commercial"]},
            {"name": "Robert Chen", "email": "robert@chenrenovations.com",
             "phone": "555-0103", "company": "Chen Renovations", "tags": ["renovations", "residential"]},
        ]
    })

    swarm.add_data_source({
        "source_name": "homeowner_leads",
        "entries": [
            {"name": "Sarah Johnson", "email": "sarah.j@email.com",
             "phone": "555-0201", "company": "", "tags": ["homeowner", "kitchen-remodel"]},
            {"name": "David Williams", "email": "dwilliams@email.com",
             "phone": "", "company": "", "tags": ["homeowner"]},
        ]
    })

    # Feed 2: Manual leads
    swarm.add_manual_lead({
        "name": "Mike Thompson",
        "email": "mike@thompsonhvac.com",
        "phone": "555-0301",
        "company": "Thompson HVAC",
        "tags": ["hvac", "commercial", "priority"],
    })

    swarm.add_manual_lead({
        "name": "Lisa Park",
        "email": "lisa@parkplumbing.com",
        "phone": "555-0302",
        "company": "Park Plumbing",
        "tags": ["plumbing", "residential"],
    })

    # Feed 3: CSV import (uncomment and provide path)
    # swarm.add_csv_path("leads_import.csv")

    # Run the swarm
    results = await swarm.run()
    print(json.dumps(results, indent=2))


if __name__ == "__main__":
    asyncio.run(main())