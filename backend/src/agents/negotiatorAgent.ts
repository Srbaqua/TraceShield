export function negotiateDecision(auditor: any, risk: any, policy: any) {

  const aiRecommendation = auditor.recommended_action
  const riskLevel = risk.level
  const policyDecision = policy.decision

  // 1️⃣ Policy always has highest priority
  if (policyDecision === "BLOCK") {
    return {
      decision: "BLOCK",
      reason: policy.reason || "Policy violation"
    }
  }

  // 2️⃣ AI says block but risk must be high
  if (aiRecommendation === "BLOCK" && riskLevel === "HIGH") {
    return {
      decision: "BLOCK",
      reason: "AI detected high risk anomaly"
    }
  }

  // 3️⃣ Monitoring case
  if (aiRecommendation === "MONITOR" || riskLevel === "MEDIUM") {
    return {
      decision: "MONITOR",
      reason: "Suspicious behavior requires monitoring"
    }
  }

  // 4️⃣ Otherwise allow
  return {
    decision: "ALLOW",
    reason: "No governance rule triggered"
  }
}