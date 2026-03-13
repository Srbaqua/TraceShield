import express from "express"
import cors from "cors"
import governanceRoutes from "./routes/governanceRoutes"
import axios from "axios"
import { evaluateRequest } from "./governance/decisionEngine";
import { analyzeWithAI } from "./agents/aiAuditorAgent";
import { logGovernanceEvent } from "./logger/governanceLogger";
import logsRoute from "./routes/logsRoute";
const app = express()

app.use(cors())
app.use(express.json())

app.use("/governance", governanceRoutes)
app.use("/governance", logsRoute);
app.get("/", (req, res) => {
  res.send("Argus Sentinel Governance Engine Running")
})


app.post("/intercept/transfer", async (req, res) => {

  const requestData = req.body;

  console.log("Argus intercepted request:", requestData);

const aiAnalysis = analyzeWithAI(requestData);

console.log("AI Auditor analysis:", aiAnalysis);

const decision = evaluateRequest(requestData);
await logGovernanceEvent({
  service: "PaymentService",
  action: "transfer",
  user: requestData.user,
  amount: requestData.amount,
  decision: decision.decision,
  reason: decision.reason
});

console.log("Governance decision:", decision);

  // console.log("Governance decision:", decision);

  if (decision.decision === "BLOCK") {

    return res.status(403).json({
      status: "blocked",
      reason: decision.reason
    });

  }

  try {

    const backendResponse = await axios.post(
      "http://localhost:6000/transfer",
      requestData
    );

    res.json({
      status: "allowed",
      backendResponse: backendResponse.data
    });

  } catch (error) {

    res.status(500).json({
      status: "error",
      message: "Backend request failed"
    });

  }

});






const PORT = 5000

app.listen(PORT, () => {
  console.log(`Argus Sentinel running on port ${PORT}`)
})