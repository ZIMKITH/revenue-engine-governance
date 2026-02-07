# The Clean-Signal Revenue Engine

![Architecture](https://img.shields.io/badge/Architecture-Event--Driven_Middleware-blueviolet?style=for-the-badge)
![Orchestrator](https://img.shields.io/badge/Orchestrator-n8n-FF6B6B?style=for-the-badge&logo=n8n&logoColor=white)
![Compute](https://img.shields.io/badge/Compute-Google_Cloud_Functions-4285F4?style=for-the-badge&logo=google-cloud&logoColor=white)
![Logic](https://img.shields.io/badge/Logic_Core-Python_3.10-3776AB?style=for-the-badge&logo=python&logoColor=white)
![Normalization](https://img.shields.io/badge/Normalization-JavaScript_(ES6)-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)
![Status](https://img.shields.io/badge/Governance-Strict_Audit_Mode-success?style=for-the-badge)

> **A serverless, "Glass Box" middleware designed to enforce strict data hygiene and deterministic governance between enrichment sources and Enterprise Systems of Record.**

System Overview
The Clean-Signal Revenue Engine is a "Glass Box" architectural pattern designed to solve the Data Integrity & Poisoning problem in modern AI-driven GTM stacks.

Unlike standard automation wrappers that blindly inject data, this system acts as a Logic Firewall. It intercepts high-velocity payloads from enrichment sources (Clay, Clearbit), performs deterministic sanitization and risk analysis, and only commits validated data to the CRM (HubSpot).

Key Architectural Principle: Trust but Verify. We decouple data ingestion from data commitment using a strict governance layer.

The Problem: Downstream Data Pollution
In high-velocity GTM architectures, Speed often compromises Safety. Automated enrichment pipelines frequently introduce Toxic Data Assets into the System of Record (SoR):

Unstructured Noise: Raw legal entity suffixes (Inc., LLC, GmbH) break deduplication logic.
Risk Exposure: High-risk entities (Bankruptcies, Litigation, Sanctions) enter the sales pipeline undetected.
LLM Hallucinations: Downstream AI agents ingest dirty context, leading to inaccurate generation and reputational damage.
The result: Technical debt, broken data lineage, and compliance failures.

The Solution: Deterministic Glass Box Middleware
This project implements a Governance-First Architecture. It is not a probabilistic AI wrapper; it is a deterministic auditing system.

The Architecture Stack
Orchestrator: n8n Self-Hosted – Manages the event bus and workflow state.
Compute : Python 3.10 on Google Cloud Functions (Serverless) – Performs heuristic risk analysis.
Normalization: JavaScript  – Handles Regex-based string sanitization.
System of Record: HubSpot CRM (via API v3).
Audit Log: Airtable / Postgres – Provides immutable transaction logs for compliance.

Data Flow Architecture
1. Ingestion Layer (Event Bus)
Trigger: Webhook  receives JSON payloads from enrichment providers.
Protocol: Asynchronous processing to handle high-concurrency bursts without blocking the source.

2. The Laundromat
Technology: JavaScript Node.
Function: Executes Regex-based sanitization to strip legal entity suffixes and standardize formatting.
Input: "Acme Corp Inc."
Output: "Acme" (Ready for fuzzy matching/deduplication).

3. The Logic Firewall (Risk Analysis Microservice)
Technology: Python (Google Cloud Functions).
Function: Scans unstructured text (News, Descriptions) for risk vectors using a Root-Word Heuristic Engine.
Risk Roots: bankrupt, fraud, investigat, litigat, sanction.
Output: Returns a binary CLEAN or QUARANTINE status with a descriptive reason code.

4. Governance Routing & Auditing
Path A (Clean): Data is batched and committed to HubSpot via the CRM API.
Path B (Quarantine): Risky data is routed to an Exception Log (Airtable) for Human-in-the-Loop (HITL) review.
Audit Trail: Every transaction—whether accepted or rejected—is logged with a timestamp and decision rationale to ensure full Data Lineage.


About the Architect
Zimkitha Ntshikaniso is an AI Solutions Architect specializing in GTM Systems Architecture and Glass Box Middleware.

I build systems that make AI safe for the Enterprise. My focus is on Operational Reliability, Data Governance, and Deterministic Workflows.


   graph TD
    %% Nodes
    A[<b>Ingestion Layer</b><br/><i>Webhook Event Bus</i>] 
    -->|Raw JSON Payload| B(<b>Normalization Module</b><br/><i>JavaScript Node</i>)
    
    B -->|Sanitized Data| C{<b>Logic Firewall</b><br/><i>Python / GCP Serverless</i>}
    
    C -->|Status: CLEAN| D[<b>System of Record</b><br/><i>HubSpot CRM API</i>]
    C -->|Status: QUARANTINE| E[<b>Audit Trail</b><br/><i>Airtable Governance Log</i>]
    
    %% Styling
    style A fill:#e1f5fe,stroke:#01579b,stroke-width:2px,rx:5,ry:5
    style B fill:#fff9c4,stroke:#fbc02d,stroke-width:2px,rx:5,ry:5
    style C fill:#ffebee,stroke:#c62828,stroke-width:4px,rx:5,ry:5
    style D fill:#e8f5e9,stroke:#2e7d32,stroke-width:2px,rx:5,ry:5
    style E fill:#f3e5f5,stroke:#7b1fa2,stroke-width:2px,stroke-dasharray: 5 5,rx:5,ry:5
    
    %% Link Styling
    linkStyle 0 stroke:#607d8b,stroke-width:2px;
    linkStyle 1 stroke:#607d8b,stroke-width:2px;
    linkStyle 2 stroke:#2e7d32,stroke-width:2px,stroke-dasharray: 0;
    linkStyle 3 stroke:#c62828,stroke-width:2px,stroke-dasharray: 5 5;
