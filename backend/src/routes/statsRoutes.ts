import { Router } from "express"
import { getDatabase } from "../logger/mongoClient"

const router = Router()

router.get("/stats", async (req, res) => {

  const db = await getDatabase()

  const totalRequests =
    await db.collection("governanceLogs").countDocuments()

  const blockedRequests =
    await db.collection("governanceLogs")
      .countDocuments({ decision: "BLOCK" })

  const monitoringEvents =
    await db.collection("governanceLogs")
      .countDocuments({ decision: "MONITOR" })

  const highRiskEvents =
    await db.collection("governanceLogs")
      .countDocuments({ "risk.level": "HIGH" })

  res.json({
    totalRequests,
    blockedRequests,
    monitoringEvents,
    highRiskEvents
  })

})

export default router