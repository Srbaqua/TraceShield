import { getDatabase } from "./mongoClient";

export async function logGovernanceEvent(event: any) {

  const db = await getDatabase();

  const logEntry = {
    ...event,
    timestamp: new Date()
  };

  await db.collection("governanceLogs").insertOne(logEntry);

  console.log("Governance event stored:", logEntry);

}