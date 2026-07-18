# 🚨 CrisisCom-AI | Autonomous Disaster Communication Grid

> *Problem:* In disasters like the Latur Earthquake, official alerts are delayed. Manual communication fails.
> *Solution:* CrisisCom is an autonomous AI grid that converts raw disaster signals into clear, actionable alerts and dispatches them in *< 3 seconds* across multiple channels.

![License](https://img.shields.io/badge/License-MIT-green) ![Built with](https://img.shields.io/badge/Built%20with-n8n-red) ![AI](https://img.shields.io/badge/AI-Groq%20%7C%20Langfuse-blue) ![Status](https://img.shields.io/badge/Status-Active-success)

### 🌐 Live Demo & Architecture
*[Live Website Link Yaha Daalo]* | *[Video Demo Link Yaha Daalo]*

### ⚡ How It Works
Ingest (Webhook) -> Structure (Google Sheets) -> AI Agent (Groq - Formats Message) -> Parallel Dispatch (Gmail, Telegram, Discord) -> Trace (Langfuse)

1.  *Ingest:* Receives disaster signal via Webhook (Earthquake, Flood etc.)
2.  *Structure:* Logs and structures data in Google Sheets to avoid duplication.
3.  *AI Agent:* AI converts technical data into a calm, human-readable emergency message.
4.  *Dispatch:* Sends alert in parallel to Email, Telegram, and Discord.
5.  *Observe:* Every trace is monitored in Langfuse for 100% transparency.

### ✨ Key Features
- *< 3s Latency:* Automated parallel dispatch, no manual delay.
- *Zero Duplicate Alerts:* Google Sheets logic prevents spamming.
- *Multi-Channel:* Reaches people where they are - Email, Telegram, Discord (Scalable to SMS/WhatsApp).
- *Full Observability:* Langfuse integration to track every alert, error, and latency.
- *Low-Cost:* Runs on free-tier stack, operational cost < ₹500/month.

### 🛠️ Tech Stack
- *Orchestrator:* n8n
- *AI:* Groq (Llama 3), Langfuse for Tracing
- *Database:* Google Sheets
- *Channels:* Gmail, Telegram Bot API, Discord Webhook
- *Frontend (Dashboard):* React.js

### 📸 Screenshots
(Add your n8n workflow screenshot and alert screenshots here)
![Workflow](workflow/screenshot.png)
![Telegram Alert](screenshots/telegram-alert.png)

### 🚀 Setup
1. Import workflow/crisiscom-workflow.json into your n8n instance.
2. Connect your Google Sheets, Gmail, Telegram, Discord credentials.
3. Add your Groq and Langfuse API keys.
4. Activate the workflow.

### 🔮 Future Scope
- Integration with IMD & NDMA official APIs.
- Add SMS and WhatsApp via Twilio.
- AI Voice Call alerts for remote villages.
- Crowdsourced disaster reporting via chatbot.

---
*Built by Pooja for a safer, more connected India
