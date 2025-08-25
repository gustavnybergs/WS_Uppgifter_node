import { MongoClient, ServerApiVersion, Db } from "mongodb";

const uri = process.env.DB_CONNECTION_STRING;
const dbName = process.env.DB_NAME;

if (!uri || !dbName) {
  throw new Error("Saknar DB_CONNECTION_STRING eller DB_NAME i .env");
}

const client = new MongoClient(uri, {
  serverApi: { version: ServerApiVersion.v1, strict: true, deprecationErrors: true },
});

let isConnected = false;

export async function runDB(): Promise<void> {
  if (isConnected) return;
  await client.connect();
  await client.db("admin").command({ ping: 1 });
  isConnected = true;
  console.log("Db is up and running");
}

export function getDB(): Db {
  if (!isConnected) throw new Error("DB ej uppkopplad ännu");
  return client.db(dbName);
}

export async function closeDB(): Promise<void> {
  await client.close();
  isConnected = false;
  console.log("Mongodb connection closed");
}
