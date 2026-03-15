import { runIQWorkflow } from "./iqWorkFlowAgent"
import { calculateRiskScore } from "./riskAgent"
import { evaluateRequest } from "../governance/decisionEngine"
import { negotiateDecision } from "./negotiatorAgent"
import { createTrace, addTraceStep } from "../logger/traceLoggers"
import { getUserBehaviorProfile } from "../governance/behaviourAnalyzer"
import { suggestPolicyRule } from "./policySuggestionAgent"
import { publishPolicyToNullshot } from "../nullshot/nullshotPublisher"

export async function runArgusSequentialPipeline(requestData: any) {

  const trace = createTrace()

  const state: any = {}

  const behaviorProfile = await getUserBehaviorProfile(requestData.user)

state.behavior = behaviorProfile

if (state.suggestedRule) {

  await publishPolicyToNullshot(state.suggestedRule)

}

addTraceStep(
  trace,
  "BehaviorAnalyzer",
  "load_user_behavior",
  behaviorProfile
)

  // -----------------------------
  // 1️ Auditor Agent (IQ AI)
  // -----------------------------
const auditorResult = await runIQWorkflow({
  ...requestData,
  behavior: state.behavior
})

  addTraceStep(
    trace,
    "AuditorAgent",
    "analyze_transaction",
    auditorResult
  )

  console.log("Auditor Agent:", auditorResult)

  state.auditor = auditorResult

  // -----------------------------
  // 2️ Risk Agent
  // -----------------------------
  const riskResult = calculateRiskScore(requestData)

  addTraceStep(
    trace,
    "RiskAgent",
    "calculate_risk_score",
    riskResult
  )

  console.log("Risk Agent:", riskResult)

  state.risk = riskResult

  // -----------------------------
  // 3️ Policy Agent
  // -----------------------------
const enrichedRequest = {
  ...requestData,
  riskScore: state.risk.riskScore
}



const policyDecision = await evaluateRequest(enrichedRequest)

  addTraceStep(
    trace,
    "PolicyAgent",
    "evaluate_policy",
    policyDecision
  )

  console.log("Policy Agent:", policyDecision)

  state.policy = policyDecision

  // -----------------------------
  // 4️ Negotiator Agent
  // -----------------------------
  const negotiatedDecision = negotiateDecision(
    state.auditor,
    state.risk,
    state.policy
  )

  addTraceStep(
    trace,
    "NegotiatorAgent",
    "resolve_conflict",
    negotiatedDecision
  )
  // state.risk.level === "HIGH" && 
if (negotiatedDecision.decision === "BLOCK") {

  const suggestedRule = await suggestPolicyRule({
    user: requestData.user,
    amount: requestData.amount,
    riskScore: state.risk.riskScore
  })

  addTraceStep(
    trace,
    "PolicySuggestionAgent",
    "generate_rule",
    suggestedRule
  )

  state.suggestedRule = suggestedRule
}
  // -----------------------------
  // 5️ Enforcement Agent
  // -----------------------------
  const finalDecision = negotiatedDecision

  addTraceStep(
    trace,
    "EnforcementAgent",
    "final_decision",
    finalDecision
  )

  console.log("Final Governance Decision:", finalDecision)

  state.finalDecision = finalDecision

  return {
    state,
    finalDecision,
    trace,
    suggestedRule: state.suggestedRule
  }

}