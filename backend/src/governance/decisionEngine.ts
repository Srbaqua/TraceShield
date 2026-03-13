import { getPolicies } from "./policyLoader";

// TODO: Add IQ AI for more robust rule checking
export function evaluateRequest(data: any) {

  const policies = getPolicies();

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