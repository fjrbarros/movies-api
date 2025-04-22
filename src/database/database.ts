import { type Database, open } from "sqlite";
import sqlite3 from "sqlite3";

export async function initializeDatabase(): Promise<Database> {
  const db = await open({
    filename: ":memory:",
    driver: sqlite3.Database,
  });

  await db.exec(`
    CREATE TABLE IF NOT EXISTS movies (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      year TEXT,
      title TEXT,
      studios TEXT,
      producers TEXT,
      winner TEXT
    )
  `);

  await db.exec(`
    CREATE TABLE IF NOT EXISTS producer_awards (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      producer TEXT,
      interval INTEGER,
      previousWin INTEGER,
      followingWin INTEGER,
      type TEXT
    )
  `);

  return db;
}
