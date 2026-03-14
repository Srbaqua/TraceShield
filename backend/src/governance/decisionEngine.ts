import { getPolicies } from "../models/policyModels"

export async function evaluateRequest(requestData: any) {

  const policies = await getPolicies()

  for (const policy of policies) {

    const fieldValue = requestData[policy.field]

    if (policy.operator === ">" && fieldValue > policy.value) {
      return {
        decision: policy.action,
        reason: `Policy triggered: ${policy.name}`
      }
    }

    if (policy.operator === "<" && fieldValue < policy.value) {
      return {
        decision: policy.action,
        reason: `Policy triggered: ${policy.name}`
      }
    }

    if (policy.operator === "==" && fieldValue === policy.value) {
      return {
        decision: policy.action,
        reason: `Policy triggered: ${policy.name}`
      }
    }
  }

  return {
    decision: "ALLOW",
    reason: "No governance rule triggered"
  }
}