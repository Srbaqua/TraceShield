import { getDatabase } from "../logger/mongoClient"

export async function getUserBehaviorProfile(user: string) {

  const db = await getDatabase()

  const logs = await db
    .collection("governanceLogs")
    .find({ user })
    .sort({ timestamp: -1 })
    .limit(20)
    .toArray()

  if (logs.length === 0) {
    return {
      avgAmount: 0,
      transactionCount: 0
    }
  }

  const total = logs.reduce((sum, log) => sum + log.amount, 0)

  const avgAmount = total / logs.length

  return {
    avgAmount,
    transactionCount: logs.length
  }

}