import { Router } from "express";
import { getDatabase } from "../logger/mongoClient";

const router = Router();

router.get("/logs", async (req, res) => {

  const db = await getDatabase();

  const logs = await db
    .collection("governanceLogs")
    .find({})
    .sort({ timestamp: -1 })
    .limit(50)
    .toArray();

  res.json(logs);

});

export default router;