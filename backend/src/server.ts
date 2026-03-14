import express from "express"
import cors from "cors"
import axios from "axios"

import governanceRoutes from "./routes/governanceRoutes"
import logsRoute from "./routes/logsRoute"
import policyRoute from "./routes/policyRoute"
import statsRoutes from "./routes/statsRoutes"

import { runArgusSequentialPipeline } from "./agents/argusSequentialAgent"
import { logGovernanceEvent } from "./logger/governanceLogger"

const app = express()

app.use(cors())
app.use(express.json())

// -----------------------------
// Routes
// -----------------------------

app.use("/governance", governanceRoutes)
app.use("/governance", logsRoute)
app.use("/governance", policyRoute)
app.use("/governance", statsRoutes)


// -----------------------------
// Health Check
// -----------------------------

app.get("/", (req, res) => {
  res.send("Argus Sentinel Governance Engine Running")
})


// -----------------------------
// Intercept API Requests
// -----------------------------

app.post("/intercept/transfer", async (req, res) => {

  try {

    const requestData = req.body

    console.log("Argus intercepted request:", requestData)

    // -----------------------------
    // Run Multi‑Agent Governance Pipeline
    // -----------------------------

    const pipeline = await runArgusSequentialPipeline(requestData)

    const finalDecision = pipeline.finalDecision
    const trace = pipeline.trace

    console.log("Final Governance Decision:", finalDecision)

    // -----------------------------
    // Store Governance Log
    // -----------------------------
await logGovernanceEvent({
  service: "PaymentService",
  action: "transfer",
  user: requestData.user,
  amount: requestData.amount,
  decision: finalDecision.decision,
  reason: finalDecision.reason,
  explanation: pipeline?.state?.auditor?.explanation || "No explanation",
  riskScore: pipeline?.state?.risk?.riskScore,
  riskLevel: pipeline?.state?.risk?.level,
  traceId: pipeline?.trace?.traceId
})

    // -----------------------------
    // If BLOCK → stop request
    // -----------------------------

    if (finalDecision.decision === "BLOCK") {

      return res.status(403).json({
        status: "blocked",
        reason: finalDecision.reason,
        trace
      })

    }

    // -----------------------------
    // If MONITOR → allow but log
    // -----------------------------

    if (finalDecision.decision === "MONITOR") {

      console.log("Transaction monitored")

    }

    // -----------------------------
    // Forward request to backend
    // -----------------------------

    const backendResponse = await axios.post(
      "http://localhost:8000/transfer",
      requestData
    )

    res.json({
      status: "allowed",
      backendResponse: backendResponse.data,
      trace
    })

  } catch (error) {

    console.error("Governance error:", error)

    res.status(500).json({
      status: "error",
      message: "Governance processing failed"
    })

  }

})


// -----------------------------
// Start Server
// -----------------------------

const PORT = 5000

app.listen(PORT, () => {
  console.log(`Argus Sentinel running on port ${PORT}`)
})