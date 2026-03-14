import { runIQWorkflow } from "./iqworkFlowAgent"
import { calculateRiskScore } from "./riskAgent"
import { evaluateRequest } from "../governance/decisionEngine"

export async function runArgusSequentialPipeline(requestData: any) {
  
  // Initialize the state object you were using
  const state: any = {}

  // 1️⃣ Auditor Agent
  const auditorResult = await runIQWorkflow(requestData)
  console.log("Auditor Agent:", auditorResult)
  state.auditor = auditorResult

  // 2️⃣ Risk Agent
  // (Assuming this might return a promise, added await just in case)
  const riskResult = await calculateRiskScore(requestData) 
  console.log("Risk Agent:", riskResult)
  state.risk = riskResult

  // 3️⃣ Policy Agent
  const policyDecision = await evaluateRequest(requestData)
  console.log("Policy Agent:", policyDecision)
  state.policy = policyDecision

  // 4️⃣ Enforcement Agent
  const aiRecommendation = state.auditor.recommended_action
  const policyDecisionResult = state.policy.decision

  let finalDecision = {
    decision: "ALLOW",
    reason: "No governance rule triggered"
  }

  if (aiRecommendation === "BLOCK" || policyDecisionResult === "BLOCK") {
    finalDecision = {
      decision: "BLOCK",
      reason: "AI or policy violation"
    }
  } else if (aiRecommendation === "MONITOR") {
    finalDecision = {
      decision: "MONITOR",
      reason: "AI recommends monitoring"
    }
  }

  console.log("Final Governance Decision:", finalDecision)
  state.finalDecision = finalDecision

  return state
}