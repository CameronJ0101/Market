import "dotenv/config"; // Load .env variables
import app from "#app"; // Express app
import db from "#db/client"; // PostgreSQL client

const PORT = process.env.PORT || 3000;

async function startServer() {
  try {
    console.log("Connecting to database...");
    await db.connect();
    console.log("Database connected.");

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (err) {
    console.error("Error starting server:", err);
    process.exit(1); // Fail fast on startup error
  }
}

startServer();
