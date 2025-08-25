import "dotenv/config";
import express from "express";
import { runDB, closeDB } from "./db/database.js"; // .js-suffix behövs för ESM i dist

const app = express();
const port: number = Number(process.env.PORT) || 3000;

app.use(express.json());

// Basroute
app.get("/", (_req, res) => res.send("Hello world!"));

// Starta DB först, sedan servern
async function start() {
  try {
    await runDB();
    app.listen(port, "0.0.0.0", () => {
      console.log(`Listening to port ${port}`);
      console.log(`Start the app: http://localhost:${port}`);
    });

    // Snäll avstängning
    process.on("SIGINT", async () => {
      console.log("Cleaning up...");
      await closeDB();
      process.exit(0);
    });
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}
start();
