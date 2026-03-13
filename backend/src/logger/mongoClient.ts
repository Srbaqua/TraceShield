import { MongoClient } from "mongodb";
require('dotenv').config()

console.log(process.env.MONGO_URI);
const uri = `${process.env.MONGO_URI}`;

const client = new MongoClient(uri);

export async function getDatabase() {
  await client.connect();
  return client.db("argusSentinel");
}