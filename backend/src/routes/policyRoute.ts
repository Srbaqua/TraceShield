import { Router } from "express"
import { getDatabase } from "../logger/mongoClient"

const router = Router()

router.post("/policy", async (req, res) => {

  const db = await getDatabase()

  const policy = {
    name: req.body.name,
    field: req.body.field,
    operator: req.body.operator,
    value: req.body.value,
    action: req.body.action
  }

  await db.collection("governancePolicies").insertOne(policy)

  res.json({ message: "Policy created", policy })

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