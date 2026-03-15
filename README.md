# Trace Shield

**Trace Shield** is an autonomous governance and security layer designed to monitor, analyze, and control the behavior of distributed systems and AI‑driven services.

Modern infrastructures rely on APIs, microservices, and increasingly autonomous AI agents. These systems can behave unpredictably due to misconfigurations, abnormal traffic patterns, or malicious requests.

Argus Sentinel acts as a **Digital Immune System** for backend infrastructure. It observes system activity, detects abnormal patterns, intercepts suspicious requests, and enforces governance policies in real time.

---

## Architecture Overview

Trace Shield follows a multi-stage governance pipeline:

1.  **Intercept**: Requestly captures outgoing API traffic.
2.  **Evaluate**: Argus Sentinel (the governance brain) runs an AI-powered sequential pipeline.
3.  **Reason**: Agents (Auditor, Risk, Policy) decompose and trace the request logic.
4.  **Enforce**: Governance decisions (ALLOW, BLOCK, MONITOR) are applied.
5.  **Audit**: Decisions, reasoning traces, and audit logs are persisted for review.

```
Client / Frontend
       │
       ▼
Requestly (Interception Edge)
       │
       ▼
Argus Sentinel Gateway (Backend)
       │
       ▼
AI Governance Brain (IQ AI ADK)
       │
       ├─ Auditor Agent (Anomaly Detection)
       ├─ Risk Agent (Scoring & Analysis)
       ├─ Policy Agent (Rule Matching)
       └─ Decision Engine
       │
       ▼
Result (Decision + Reasoning Trace)
       │
       ├─ Execution Trace (Step-by-step logic)
       ├─ AI Suggested Rules (Dynamic Policy Generation)
       └─ MCP Integration (System-wide tool access)
       │
       ▼
Persistance
       │
       ├─ MongoDB (Governance Logs)
       └─ SOC Dashboard (Visualization & Control)
```

---

## Core Components

### Argus Sentinel (Backend)
The central intelligence layer. It hosts the **Sequential Agent Pipeline**, which uses Google Gemini to evaluate incoming requests against both static JSON policies and dynamic AI-driven risk assessments.

### SOC Dashboard (Frontend)
A real-time monitoring and control interface built with Next.js and shadcn/ui.
- **Real-time Stats:** Global view of blocked, monitored, and high-risk events.
- **Governance Logs:** Detailed audit trail of every intercepted request.
- **Execution Tracing:** Visual breakdown of the AI's step-by-step reasoning for each decision.
- **AI Suggested Rules:** Automatically generates potential new security rules based on detected anomalies.
- **MCP Integration:** Extends the sentinel's capabilities with Model Context Protocol (MCP) integrations for wider system control.

### Requestly Interceptor
An edge-level interceptor that hooks into the browser's `fetch` API. It pauses requests to wait for Argus Sentinel's decision, ensuring that unauthorized traffic never reaches the backend. Requestly provides the critical enforcement layer that makes governance "active" rather than just "passive."

### Nullshot Policy Collaboration
Nullshot is the collaborative engine where governance rules are born. It allows security teams, developers, and stakeholders to:
- **Define** complex governance policies in a human-readable way.
- **Collaborate** on rule changes and logic before they are deployed to the Sentinel.
- **Visualize** how rules interact with real-world traffic patterns.

---

## Project Structure

```
TraceShield (Argus Sentinel)
│
├── backend
│   ├── src
│   │   ├── agents           # IQ AI agents (Auditor, Risk, Policy, Sequential)
│   │   ├── governance       # Decision engine and rule evaluators
│   │   ├── logger           # MongoDB governance event logging
│   │   ├── policies         # JSON policy registry
│   │   ├── routes           # Express API routes (logs, stats, governance)
│   │   └── server.ts        # Express Server & Intercept endpoints
│   ├── .env                 # Environment variables (MONGO_URI, GOOGLE_API_KEY)
│   └── package.json
│
└── dashboard
    ├── app
    │   ├── layout.tsx       # Root layout with Requestly Interceptor initialization
    │   └── page.tsx         # Main Dashboard & Transaction Simulator
    ├── components           # Enhanced UI: Trace viewers, Pipeline status, and MCP panels
    └── package.json
```

## Running the Project

### 1. Prerequisites
- **Node.js** (v18+)
- **MongoDB Atlas** (connection string needed in .env)
- **Google AI API Key** (for Gemini execution)

### 2. Start the Backend

Navigate to the `backend` directory, install dependencies, and start the development server:

```bash
cd backend
npm install
npm run dev
```
The backend will run on `http://localhost:5000`.

### 3. Start the SOC Dashboard

In a new terminal, navigate to the `dashboard` directory:

```bash
cd dashboard
npm install
npm run dev
```
The dashboard will run on `http://localhost:3000`.

### 4. Direct Interception
The dashboard includes a **Transaction Simulator**. Any transfer submitted there is automatically routed through the Argus Sentinel interceptor on port 5000 for governance evaluation before being allowed through to the target service.

