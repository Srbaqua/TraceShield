import { AgentBuilder } from "@iqai/adk"
import dotenv from "dotenv"

dotenv.config()

export async function runIQWorkflow(data: any) {

  const workflow = await AgentBuilder
    .create("argus_governance_workflow")
    .withModel("gemini-2.5-flash")
    .withInstruction(`
You are an AI governance system that analyzes API transactions.

Return a JSON object with:
- anomaly_score
- risk_level
- recommended_action
- explanation
`)
  
  const prompt = `
User: ${data.user}
Amount: ${data.amount}
`

  const result = await workflow.ask(prompt)

//   Extract JSON
  const text = result.toString()
  const json = text.replace(/```json|```/g, "").trim()

  return JSON.parse(json)
}