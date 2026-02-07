/**
 * MODULE: Governance & Normalization Core
 * ARCHITECT: Zimkitha
 * VERSION: 1.2.0 (Stable)
 * PURPOSE: Deterministic sanitization and risk analysis for GTM Ingestion.
 */

// 1. DEFENSIVE EXECUTION WRAPPER
try {
  // Input Handling: Support both n8n v0.x and v1.x data structures
  const root = $input.item.json;
  const data = root.body || root; 

  // Fail-safe extraction (Prevent "Cannot read property of undefined" errors)
  const rawName = data.company_name || data.company || "Unknown Entity"; 
  const newsSummary = (data.news_summary || data.description || "").toLowerCase();

  // 2. NORMALIZATION LAYER (The "Laundromat")
  // Regex removes legal entity suffixes to ensure clean matching in CRM
  const cleanName = rawName
    .replace(/(\s|,|\.)+(Inc|LLC|Ltd|Limited|Corp|Corporation|GmbH|Co|Pty)\.?$/i, "")
    .trim();

  // 3. LOGIC FIREWALL (The "Glass Box")
  // Strict, deterministic keyword matching. No AI probability here.
  const negativeKeywords = [
    "bankrupt", "fraud", "lawsuit", "investigation", 
    "layoff", "scandal", "sanction", "insolvency"
  ];
  
  let status = "CLEAN";
  let reason = "Passed deterministic governance checks";

  for (const word of negativeKeywords) {
    if (newsSummary.includes(word)) {
      status = "QUARANTINE";
      reason = `RISK DETECTED: Found restricted term [${word}] in news summary.`;
      break; // Fail fast
    }
  }

  // 4. STRUCTURAL OUTPUT
  return {
    ...data, 
    _meta: {
      normalized_name: cleanName,
      governance_status: status,
      governance_reason: reason,
      logic_version: "v1.2.0",
      processed_at: new Date().toISOString()
    }
  };

} catch (error) {
  // 5. FAIL-SAFE PROTOCOL
  // If the logic crashes, route to manual review rather than dropping data
  return {
    error: true,
    message: error.message,
    governance_status: "QUARANTINE",
    governance_reason: "SYSTEM ERROR: Script execution failed. Manual review required."
  };
}
