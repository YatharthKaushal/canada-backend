import { MongoClient } from "mongodb";

const uri = process.env.MONDODB;
let client;

export async function connectDB() {
  if (!client) {
    client = new MongoClient(uri, { useUnifiedTopology: true });
    await client.connect();
  }
  return client.db();
}
