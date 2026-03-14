export function negotiateDecision(auditor: any, risk: any, policy: any) {

  if (auditor.recommended_action === "BLOCK") {
    return {
      decision: "BLOCK",
      reason: "Auditor detected anomaly"
    }
  }

  if (risk.level === "HIGH") {
    return {
      decision: "MONITOR",
      reason: "High risk score detected"
    }
  }

  return policy
}