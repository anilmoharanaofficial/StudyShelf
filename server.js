import app from "./app.js";
import database from "./config/database.js";

const PORT = process.env.PORT;

app.listen(PORT, async () => {
  await database();
  console.log(`SERVER IS RUNNING AT: localhost:${PORT}`);
});
