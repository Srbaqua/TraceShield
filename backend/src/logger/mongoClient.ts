// mongoClient.ts
import { MongoClient } from "mongodb";

// Fail loudly and clearly if the variable is missing
if (!process.env.MONGO_URI) {
  throw new Error("FATAL ERROR: MONGO_URI is not defined in the .env file.");
}

// Pass the raw variable, no template literals needed
const uri = process.env.MONGO_URI;
const client = new MongoClient(uri);

export async function getDatabase() {
  await client.connect();
  return client.db("argusSentinel");
}