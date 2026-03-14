import { createTool } from "@iqai/adk"
import { z } from "zod"
import { logGovernanceEvent } from "../logger/governanceLogger"

export const logEventTool = createTool({
  name: "log_governance_event",
  description: "Store governance decisions in the database",
  schema: z.object({
    user: z.string(),
    amount: z.number(),
    decision: z.string(),
    reason: z.string(),
    explanation: z.string()
  }),

  fn: async ({ user, amount, decision, reason, explanation }) => {

    await logGovernanceEvent({
      service: "PaymentService",
      action: "transfer",
      user,
      amount,
      decision,
      reason,
      explanation
    })

    return `Governance event logged for ${user}`
  }
})
// export const logEventTool = createTool({
//   name: "log_governance_event",
//   description: "Store governance decisions in the database",

//   schema: z.object({
//     user: z.string(),
//     amount: z.number(),
//     decision: z.string(),
//     reason: z.string(),
//     explanation: z.string().optional()
//   }),

//   execute: async ({ user, amount, decision, reason, explanation }) => {

//     await logGovernanceEvent({
//       service: "PaymentService",
//       action: "transfer",
//       user,
//       amount,
//       decision,
//       reason,
//       explanation
//     })

//     return `Governance event logged for ${user}`
//   }
// })
export const blockTransactionTool = createTool({
  name: "block_transaction",
  description: "Block suspicious financial transactions",

  schema: z.object({
    user: z.string(),
    amount: z.number(),
    reason: z.string()
  }),

  fn: async ({ user, amount, reason }) => {

    return `Transaction blocked for ${user}. Reason: ${reason}`

  }
})