import { runIQWorkflow } from "./iqworkFlowAgent"
import { calculateRiskScore } from "./riskAgent"
import { evaluateRequest } from "../governance/decisionEngine"

export async function runArgusPipeline(requestData: any) {

  // 1️ Auditor Agent (IQ AI)
  const auditorResult = await runIQWorkflow(requestData)

  console.log("Auditor Agent:", auditorResult)

  // 2️ Risk Agent
  const riskResult = calculateRiskScore(requestData)

  console.log("Risk Agent:", riskResult)

  // 3 Policy Agent
  const policyDecision = evaluateRequest(requestData)

  console.log("Policy Agent:", policyDecision)

  return {
    auditor: auditorResult,
    risk: riskResult,
    policy: policyDecision
  }
}
export function enforceDecision(pipelineResult: any) {

  // AI recommendation
  const aiRecommendation =
    pipelineResult.auditor.recommended_action

  // Policy decision
  const policyDecision =
    pipelineResult.policy.decision

  // Final governance rule
if (aiRecommendation === "BLOCK" || policyDecision === "BLOCK") {
  return { decision: "BLOCK", reason: "AI or policy violation" }
}

if (aiRecommendation === "MONITOR") {
  return { decision: "MONITOR", reason: "AI recommends monitoring" }
}

return { decision: "ALLOW", reason: "No governance rule triggered" }

}