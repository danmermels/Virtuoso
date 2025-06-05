// backend/db.js
const Database = require('better-sqlite3');
const db = new Database('data/virtuoso.db');

db.exec(`
  CREATE TABLE IF NOT EXISTS todos (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    done BOOLEAN DEFAULT 0
	modo BOOLEAN DEFAULT 0
  );
`);

module.exports = db;