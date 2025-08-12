import db from "#db/client";
import bcrypt from "bcrypt";

const ROUNDS = 10;

export async function createUser({ username, password }) {
  const hashed = await bcrypt.hash(password, ROUNDS);
  const {
    rows: [user],
  } = await db.query(
    `
    INSERT INTO users (username, password)
    VALUES ($1, $2)
    RETURNING id, username, password
  `,
    [username, hashed],
  );
  return user;
}

export async function getUserByUsername(username) {
  const {
    rows: [user],
  } = await db.query(
    `SELECT id, username, password FROM users WHERE username = $1`,
    [username],
  );
  return user || null;
}

export async function getUserById(id) {
  const {
    rows: [user],
  } = await db.query(
    `SELECT id, username, password FROM users WHERE id = $1`,
    [id],
  );
  return user || null;
}
