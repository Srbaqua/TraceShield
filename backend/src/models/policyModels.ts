import { getDatabase } from "../logger/mongoClient"

export async function getPolicies() {
  const db = await getDatabase()
  return db.collection("governancePolicies").find().toArray()
}