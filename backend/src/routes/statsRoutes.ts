import { Router } from "express"
import { getDatabase } from "../logger/mongoClient"

const router = Router()

router.get("/stats", async (req, res) => {

  const db = await getDatabase()

  const total = await db.collection("governanceLogs").countDocuments()

  const blocked = await db.collection("governanceLogs")
    .countDocuments({ decision: "BLOCK" })

  const monitored = await db.collection("governanceLogs")
    .countDocuments({ decision: "MONITOR" })

  const highRisk = await db.collection("governanceLogs")
    .countDocuments({ "risk.level": "HIGH" })

  res.json({
    totalRequests: total,
    blockedRequests: blocked,
    monitoringEvents: monitored,
    highRiskEvents: highRisk
  })

})

export default router