import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI;

async function getClient() {
  try {
    let client = new MongoClient(uri);

    await client.connect();

    return client;
  } catch (e) {
    console.error(e);
  }
}

export async function logRequest(req) {
  try {
    const client = await getClient();

    const db = client.db("stuy_schedule_db");
    const collection = db.collection("logs");

    const timestamp = new Date();
    const ip = req.headers["x-forwarded-for"] || req.connection.remoteAddress;
    const method = req.method;
    const endpoint = req.url;
    const userAgent = req.headers["user-agent"];
    const referer = req.headers["referer"];

    const logData = {
      timestamp,
      ip,
      method,
      endpoint,
      userAgent,
      referer,
    };

    await collection.insertOne(logData);

    await client.close();
  } catch (e) {
    console.error(e);
  }
}
