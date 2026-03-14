import { getDatabase } from "./mongoClient";

export interface GovernanceEvent {
  service: string;
  action: string;
  user: string;
  amount: number;
  decision: string;
  reason: string;
  explanation?: string;
  riskScore?: number;
  riskLevel?: string;
  traceId?: string;
}

export async function logGovernanceEvent(event: GovernanceEvent) {
  try {

    const db = await getDatabase();

    const logEntry = {
      ...event,
      timestamp: new Date()
    };

    await db.collection("governanceLogs").insertOne(logEntry);

    console.log(
      `Governance event stored for user: ${event.user}, traceId: ${event.traceId}`
    );

  } catch (error) {

    console.error(
      "Failed to store governance event in MongoDB:",
      error
    );

  }
}