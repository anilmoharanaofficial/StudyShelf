import app from "./app.js";

const PORT = process.env.PORT;

app.listen(PORT, async () => {
  console.log(`SERVER IS RUNNING AT: localhost:${PORT}`);
});
