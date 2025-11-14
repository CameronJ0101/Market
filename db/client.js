import "dotenv/config";
import pg from "pg";

const isProduction = process.env.NODE_ENV === "production";

// Use a pool for better performance in Express apps
const db = new pg.Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: isProduction
    ? { rejectUnauthorized: false } // Required on most hosted Postgres services
    : false,
});

// Helpful log on connection
db.on("connect", () => {
  console.log("📦 Connected to PostgreSQL");
});

db.on("error", (err) => {
  console.error("❌ PostgreSQL error:", err);
});

export default db;
