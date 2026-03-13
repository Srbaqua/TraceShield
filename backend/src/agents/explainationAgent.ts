export function generateExplanation(data: any, risk: any, decision: any) {

  if (decision.decision === "BLOCK") {

    return `Transaction blocked because amount (${data.amount}) exceeded policy threshold. 
Risk level was ${risk.level} with score ${risk.riskScore}.`;

  }

  return `Transaction allowed because it falls within governance policy limits and risk level is ${risk.level}.`;

}