import "dotenv/config";
import express from "express";
import { runDB, closeDB, getDB } from "./db/database.js"; // .js-suffix behövs för ESM i dist


const app = express();
const port: number = Number(process.env.PORT) || 3000;

app.use(express.json());

// Basroute
app.get("/", (_req, res) => res.send("Hello world!"));

app.get("/dbinfo", async (_req, res) => {
  try {
    const names = (await getDB().listCollections().toArray()).map(c => c.name);
    res.json({ ok: true, collections: names });
  } catch (e: any) {
    res.status(500).json({ ok: false, error: e.message });
  }
});

// UPPGIFT 4-5 här
app.get("/items/:id", (req, res) => {
  // req = inkommande begäran (params, query, headers, body)
  // res = svaret till klienten (statuskod, headers, body)
  const id = Number(req.params.id);
  if (isNaN(id)) return res.status(400).send("Not a number"); // Uppg. 5: return efter fel
  return res.json({ id, note: "OK" });
});


// Starta DB först, sedan servern
async function start() {
  try {
    // Uppg. 3: Starta databasen före app.listen() (fail fast)
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
