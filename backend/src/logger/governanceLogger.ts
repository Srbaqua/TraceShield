import { getDatabase } from "./mongoClient";

export interface GovernanceEvent {
  service: string;
  action: string;
  user: string;
  amount: number;
  decision: string;
  reason: string;
  explanation?: string; 
}

export async function logGovernanceEvent(event: GovernanceEvent) {
  try {
    const db = await getDatabase();

    const logEntry = {
      ...event,
      timestamp: new Date()
    };

    await db.collection("governanceLogs").insertOne(logEntry);
    console.log(`Governance event stored for user: ${event.user}`);

  } catch (error) {
    // 2. Catch the error so it doesn't crash the main Argus pipeline
    console.error("Failed to store governance event in MongoDB:", error);
  }
}