import { MongoClient } from "mongodb";

const uri = "mongodb://127.0.0.1:27017";

const client = new MongoClient(uri);

export async function getDatabase() {
  await client.connect();
  return client.db("argusSentinel");
}