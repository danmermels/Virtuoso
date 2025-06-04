const express = require('express');
const Database = require('better-sqlite3');
const path = require('path');

const app = express();
const db = new Database(path.join(__dirname, 'data.db'));

// Serve frontend
app.use(express.static(path.join(__dirname, 'public')));

// API
app.use(express.json());

// ... your routes ...
// ensure table exists
db.prepare(`
  CREATE TABLE IF NOT EXISTS tasks (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    completed INTEGER NOT NULL DEFAULT 0
  )
`).run();

// GET /api/tasks - list all tasks
app.get('/api/tasks', (req, res) => {
  const tasks = db.prepare('SELECT * FROM tasks').all();
  res.json(tasks);
});

// POST /api/tasks - add a task
app.post('/api/tasks', (req, res) => {
  const { title } = req.body;
  if (!title) return res.status(400).json({ error: 'Title is required' });
  const result = db.prepare('INSERT INTO tasks (title) VALUES (?)').run(title);
  res.json({ id: result.lastInsertRowid, title, completed: 0 });
});

// Fallback to frontend for SPA routing
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public/index.html'));
});

app.use(express.json()); // Ensure you have this to parse JSON bodies

app.post('/api/tasks', (req, res) => {
  const { title } = req.body;
  if (!title) return res.status(400).json({ error: 'Title required' });

  const stmt = db.prepare('INSERT INTO tasks (title, completed) VALUES (?, ?)');
  const info = stmt.run(title, 0);

  const newTask = { id: info.lastInsertRowid, title, completed: false };
  res.status(201).json(newTask);
});


// Start server
app.listen(3000, '0.0.0.0', () => {
  console.log('Virtuoso listening on http://0.0.0.0:3000');
});
