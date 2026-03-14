import { getPolicies } from "../models/policyModels"

export async function evaluateRequest(requestData: any) {

  const policies = await getPolicies()

  for (const policy of policies) {

    // -----------------------------
    // Support OLD policy format
    // -----------------------------
    if (policy.field) {

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

    // -----------------------------
    // Support NEW multi-condition policies
    // -----------------------------
    if (policy.conditions && Array.isArray(policy.conditions)) {

      let match = true

      for (const condition of policy.conditions) {

        const fieldValue = requestData[condition.field]

        if (condition.operator === ">" && !(fieldValue > condition.value)) {
          match = false
        }

        if (condition.operator === "<" && !(fieldValue < condition.value)) {
          match = false
        }

        if (condition.operator === "==" && !(fieldValue === condition.value)) {
          match = false
        }

      }

      if (match) {
        return {
          decision: policy.action,
          reason: policy.reason || `Policy triggered: ${policy.name}`
        }
      }

    }

  }

  return {
    decision: "ALLOW",
    reason: "No governance rule triggered"
  }

}