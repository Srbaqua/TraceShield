import { AgentBuilder } from "@iqai/adk"
import { z } from "zod"
import dotenv from "dotenv"

import { logEventTool, blockTransactionTool } from "./governanceTools"

dotenv.config()

/**
 * Typed output schema for governance decisions
 */
const GovernanceSchema = z.object({
  anomaly_score: z.number(),
  risk_level: z.enum(["LOW", "MEDIUM", "HIGH"]),
  recommended_action: z.enum(["ALLOW", "MONITOR", "BLOCK"]),
  explanation: z.string()
})

/**
 * Argus Auditor Agent using IQ AI ADK
 */
export async function runIQWorkflow(data: any) {

  const { runner } = await AgentBuilder
    .create("argus_auditor_agent")

    .withDescription(
      "AI security auditor that analyzes backend API transactions for anomalies"
    )

    .withModel(process.env.LLM_MODEL || "gemini-2.5-flash")

    .withInstruction(`
You are an AI governance auditor responsible for protecting backend APIs.

Analyze financial transactions for potential risks.

You must determine:
- anomaly_score (0 to 10)
- risk_level (LOW, MEDIUM, HIGH)
- recommended_action (ALLOW, MONITOR, BLOCK)
- explanation
Guidelines:
Return ONLY valid JSON.
Do not include explanations outside JSON.
Do not include markdown.
Do not include text before or after JSON.
The output must strictly follow this format:

{
 "anomaly_score": number,
 "risk_level": "LOW" | "MEDIUM" | "HIGH",
 "recommended_action": "ALLOW" | "MONITOR" | "BLOCK",
 "explanation": "string"
}
Guidelines:

LOW risk:
Normal transactions within expected range.

MEDIUM risk:
Unusual behavior requiring monitoring.

HIGH risk:
Suspicious or potentially fraudulent activity.

If the transaction appears dangerous, recommend BLOCK.
If uncertain but suspicious, recommend MONITOR.
Otherwise recommend ALLOW.

If blocking is required, you may call the block_transaction tool.

`)

    .withTools(
      // logEventTool,
      blockTransactionTool
    )

    .withOutputSchema(GovernanceSchema)

    .build()

  const result = await runner.ask(`

Transaction Analysis Request

User: ${data.user}
Transaction Amount: ${data.amount}

Historical Behavior:
Average Transaction Amount: ${data.behavior?.avgAmount}
Previous Transaction Count: ${data.behavior?.transactionCount}

Determine if this transaction deviates significantly from the user's historical behavior.

Evaluate:
- anomaly_score
- risk_level
- recommended_action
- explanation
`)

  return result
}