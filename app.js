import { config } from "dotenv";
config();
import express from "express";

const app = express();

app.get("/", (req, res) => {
  res.send("Hi World");
});

export default app;
