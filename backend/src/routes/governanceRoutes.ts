import { Router } from "express"
import { analyzeRequest } from "../internceptor/requestAnalyzer"

const router = Router()

router.post("/analyze", (req, res) => {

  const requestData = req.body

  const result = analyzeRequest(requestData)

  console.log("Governance decision:", result)

  res.json({
    status: "processed",
    decision: result.decision,
    reason: result.reason
  })

})

export default router