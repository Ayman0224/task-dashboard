const sqlite3 = require("sqlite3").verbose();

const db = new sqlite3.Database("./tasks.db", (err) => {
  if (err) {
    console.error("Database connection failed:", err.message);
  } else {
    console.log("Connected to SQLite database.");
  }
});
db.run(`
  CREATE TABLE IF NOT EXISTS tasks (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    description TEXT,
    status TEXT NOT NULL,
    due_date TEXT
  )
`);
db.all("PRAGMA table_info(tasks)", [], (err, rows) => {
  if (err) {
    console.error(err.message);
  } else {
    console.log(rows);
  }
});
module.exports = db;