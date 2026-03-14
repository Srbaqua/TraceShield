import { Router } from "express"
import { getDatabase } from "../logger/mongoClient"

const router = Router()

router.post("/policy", async (req, res) => {

  const db = await getDatabase()

  const policy = {
    name: req.body.name,
    conditions: req.body.conditions,
    action: req.body.action,
    reason: req.body.reason
  }

  await db.collection("governancePolicies").insertOne(policy)

  res.json({
    message: "Policy created",
    policy
  })

})

router.get("/policy", async (req, res) => {

  const db = await getDatabase()

  const policies = await db
    .collection("governancePolicies")
    .find()
    .toArray()

  res.json(policies)

})

export default router