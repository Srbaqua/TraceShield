import { AgentBuilder } from "@iqai/adk"
import { z } from "zod"

const RuleSchema = z.object({
  name: z.string(),
  field: z.string(),
  operator: z.string(),
  value: z.number(),
  action: z.string(),
  reason: z.string()
})

export async function suggestPolicyRule(data: any) {

  const { runner } = await AgentBuilder
    .create("policy_suggestion_agent")
    .withDescription("AI agent that suggests governance policies from anomalies")
    .withModel(process.env.LLM_MODEL || "gemini-2.5-flash")
    .withInstruction(`
You analyze suspicious transactions and propose a governance policy rule.

Return JSON:

{
 "name": "rule_name",
 "field": "amount",
 "operator": ">",
 "value": number,
 "action": "BLOCK",
 "reason": "why rule should exist"
}

Only propose rules when behavior is clearly suspicious.
`)
    .withOutputSchema(RuleSchema)
    .build()

  const result = await runner.ask(`
Suspicious transaction detected.

User: ${data.user}
Amount: ${data.amount}
Risk Score: ${data.riskScore}

Suggest a governance rule if appropriate.
`)

  return result
}