import app from "./src/app.js";
import { connectDatabase } from "./src/db/connect.js";
import { env } from "./src/config/env.js";

async function startServer() {
  await connectDatabase();

  app.listen(env.port, () => {
    console.log(`Mundial FC API listening on http://localhost:${env.port}`);
  });
}

startServer().catch((error) => {
  console.error("Failed to start server", error);
  process.exit(1);
});
