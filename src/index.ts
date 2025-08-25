import express from "express";

const app = express();
const port: number = 3000;

app.get("/", (req, res) => {
  res.send("Hello world!");
});

// Viktigt: lägg listen sist när allt är uppsatt
app.listen(port, () => {
  console.log(`Listening to port ${port}`);
});
