# 🔗 IEPSync

> **An IEP Goals Tracker for the Whole Team**  
> Built for the CWB Hackathon · Powered by Microsoft Azure

IEPSync is a cloud-based, multi-user Individualized Education Plan (IEP) Goals Tracker that gives parents, therapists, teachers, and school administrators one shared platform to log, track, and visualize a child's IEP goals in real time — eliminating the coordination failure at the heart of special education.

---

## 🧠 The Problem

Children with disabilities have IEPs — blueprints for their development. But once the annual meeting ends, the team works in silos. Therapists log notes in isolation. Teachers track progress in spreadsheets. Parents wait a year to find out if their child is making progress. IEPSync fixes that.

---

## ✨ Key Features

- **Multi-role dashboard** — Parent, Therapist, Teacher, and Admin views of the same live data
- **IEP document upload + AI translation** — Azure OpenAI converts clinical jargon into plain language
- **Session progress logging** — Therapists log once; parents see it the same day
- **AI-powered parent Q&A agent** — Ask anything about your child's goals in plain language
- **Smart nudges** — Azure Functions trigger alerts for overdue goal logs and mastered milestones
- **Compliance dashboard** — Admins monitor caseload health before annual reviews

---

## 🏗️ Architecture

```
Users (Parent / Therapist / Teacher / Admin)
        │
        ▼
Azure App Service (React Frontend + REST API)
        │
        ▼
Microsoft Agent Framework (Orchestration Layer)
        │
        ▼
Azure AI Foundry (Model Hub)
   ┌────┴────┬──────────────┐
   ▼         ▼              ▼
Azure     Azure AI      Azure
OpenAI    Search        Functions
                           │
                           ▼
                    Azure Cosmos DB
```

---

## 🛠️ Tech Stack

| Layer | Service |
|---|---|
| Frontend | React 18, Azure Static Web Apps |
| Backend API | Node.js + Express, Azure App Service |
| AI Orchestration | Microsoft Agent Framework |
| AI Hub | Azure AI Foundry |
| Language AI | Azure OpenAI (GPT-4o) |
| Search | Azure AI Search |
| Serverless | Azure Functions v4 |
| Database | Azure Cosmos DB (NoSQL) |

---

## 🚀 Getting Started

### Prerequisites
- Node.js 20+
- Azure CLI
- Azure subscription
- Azure OpenAI resource deployed

### 1. Clone the repo

```bash
git clone https://github.com/YOUR_USERNAME/iepsync.git
cd iepsync
```

### 2. Set up environment variables

```bash
cp .env.example .env
# Fill in your Azure credentials in .env
```

### 3. Install dependencies

```bash
# Backend
cd backend && npm install

# Frontend
cd ../frontend && npm install
```

### 4. Run locally

```bash
# Terminal 1 — Backend API
cd backend && npm run dev

# Terminal 2 — Frontend
cd frontend && npm run dev
```

Frontend runs at `http://localhost:5173`  
Backend API runs at `http://localhost:3000`

---

## 📁 Project Structure

```
iepsync/
├── frontend/               # React app (Azure Static Web Apps)
│   └── src/
│       ├── components/     # Reusable UI components
│       │   ├── auth/       # Login, role selection
│       │   ├── dashboard/  # Role-specific dashboards
│       │   ├── goals/      # Goal cards, progress bars, session logs
│       │   └── shared/     # Nav, alerts, layout
│       ├── pages/          # Route-level pages
│       ├── hooks/          # Custom React hooks
│       ├── context/        # Auth & app state context
│       └── utils/          # API client, helpers
├── backend/                # Node.js REST API (Azure App Service)
│   └── src/
│       ├── routes/         # API route handlers
│       ├── agents/         # Microsoft Agent Framework agents
│       ├── services/       # Azure service integrations
│       ├── middleware/      # Auth, error handling
│       └── config/         # Azure config & env
├── functions/              # Azure Functions (serverless)
│   ├── goalNudge/          # 30-day overdue goal reminder
│   └── weeklyDigest/       # Weekly parent progress email
└── infra/                  # Azure Bicep deployment templates
```

---

## 👥 User Roles

| Role | Capabilities |
|---|---|
| **Parent** | View plain-language goal summaries, receive milestone alerts, upload IEP documents, use AI Q&A agent |
| **Therapist** | Log session notes, update goal progress, view team activity feed |
| **Teacher** | Track classroom observations, align with therapy goals, view caseload |
| **Admin** | Full caseload compliance dashboard, manage team members, export progress reports |

---

## 📽️ Video Pitch

[Link to be added]

---

## 👤 Author

[Cristina Estampador] · [[LinkedIn URL](https://www.linkedin.com/in/cristina-estampador-ab24355/)]  
Built for the **CWB Hackathon** — Universal Design for people with disabilities.
