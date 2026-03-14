import express from "express"
import cors from "cors"
import axios from "axios"

import governanceRoutes from "./routes/governanceRoutes"
import logsRoute from "./routes/logsRoute"

// import { runArgusPipeline, enforceDecision } from "./agents/argusOrchestrator"
import { runArgusSequentialPipeline } from "./agents/argusSequentialAgent"
import { logGovernanceEvent } from "./logger/governanceLogger"

import statsRoute from "./routes/statsRoutes"

const app = express()

app.use(cors());
app.use(express.json());

app.use("/governance", statsRoute)
app.use("/governance", governanceRoutes)
app.use("/governance", logsRoute)

app.get("/", (req, res) => {
  res.send("Argus Sentinel Governance Engine Running")
})

app.post("/intercept/transfer", async (req, res) => {

  const requestData = req.body

  console.log("Argus intercepted request:", requestData)

  try {

    // // 🔹 Run full multi‑agent governance pipeline
    // const pipeline = await runArgusPipeline(requestData)

    // // 🔹 Enforcement decision
    // const finalDecision = enforceDecision(pipeline)
    const pipeline = await runArgusSequentialPipeline(requestData)

const finalDecision = pipeline.finalDecision

    console.log("Final Governance Decision:", finalDecision)

    // 🔹 Log governance event
    // await logGovernanceEvent({
    //   service: "PaymentService",
    //   action: "transfer",
    //   user: requestData.user,
    //   amount: requestData.amount,
    //   decision: finalDecision.decision,
    //   reason: finalDecision.reason,
    //   explanation: pipeline.auditor?.explanation || "No AI explanation"
    // })

    //  BLOCK request
    if (finalDecision.decision === "BLOCK") {

      return res.status(403).json({
        status: "blocked",
        reason: finalDecision.reason
      })

    }

    // Forward to backend
    const backendResponse = await axios.post(
      "http://localhost:8000/transfer",
      requestData
    )

    res.json({
      status: "allowed",
      backendResponse: backendResponse.data
    })

  } catch (error) {

    console.error("Governance error:", error)

    res.status(500).json({
      status: "error",
      message: "Governance pipeline failed"
    })

  }

})

const PORT = 5000;

app.listen(PORT, () => {
  console.log(`Argus Sentinel running on port ${PORT}`);
});
