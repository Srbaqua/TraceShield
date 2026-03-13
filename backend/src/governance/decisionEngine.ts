import policies from "../policies/policyRegistry.json";

export function evaluateRequest(data: any) {

  for (const rule of policies.rules) {

    const { field, operator, value } = rule.condition;

    const requestValue = data[field];

    if (operator === ">" && requestValue > value) {

      return {
        decision: rule.action,
        reason: rule.reason,
        triggeredRule: rule.name
      };

    }

  }

  return {
    decision: "ALLOW",
    reason: "No governance rule triggered"
  };

}