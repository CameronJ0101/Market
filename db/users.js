import db from "#db/client.js";
import bcrypt from "bcrypt";

/** Create a new user (register) */
export async function createUser({ username, password }) {
  const hashedPassword = await bcrypt.hash(password, 10);
  const { rows } = await db.query(
    `INSERT INTO users (username, password_hash)
     VALUES ($1, $2)
     RETURNING id, username, created_at;`,
    [username, hashedPassword]
  );
  return rows[0];
}

/** Get user by username (for login) */
export async function getUserByUsername(username) {
  const { rows } = await db.query(`SELECT * FROM users WHERE username = $1;`, [
    username,
  ]);
  return rows[0] || null;
}

/** Get user by ID */
export async function getUserById(id) {
  const { rows } = await db.query(
    `SELECT id, username, created_at FROM users WHERE id = $1;`,
    [id]
  );
  return rows[0] || null;
}

/** Verify user credentials (login) */
export async function verifyUser(username, password) {
  const { rows } = await db.query(`SELECT * FROM users WHERE username = $1;`, [
    username,
  ]);
  const user = rows[0];
  if (!user) return null;

  const valid = await bcrypt.compare(password, user.password_hash);
  if (!valid) return null;

  // Return user without password_hash
  return {
    id: user.id,
    username: user.username,
    created_at: user.created_at,
  };
}
