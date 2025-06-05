const express = require('express');
const Database = require('better-sqlite3');
const path = require('path');

const app = express();
const db = new Database(path.join(__dirname, 'data.db'));

const safePoints = points ?? 1; // defaults to 1 if undefined or null
res.json({ id: result.lastInsertRowid, title, completed: 0, mode: mode === 1 ? 1 : 0, points: safePoints });

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
    completed BOOLEAN DEFAULT 0,
	mode BOOLEAN DEFAULT 0,
	points INTEGER DEFAULT 10
  )
`).run();

// GET /api/tasks - list all tasks
app.get('/api/tasks', (req, res) => {
  const tasks = db.prepare('SELECT * FROM tasks').all();
  res.json(tasks);
});

// POST /api/tasks - add a task
app.post('/api/tasks', (req, res) => {
  const { title, mode, points } = req.body;
  const result = db
    .prepare('INSERT INTO tasks (title, completed, mode, points) VALUES (?, ?, ?, ?)')
    .run(title, 0, mode === 1 ? 1 : 0, points ?? 1);
  
  res.json({ id: result.lastInsertRowid, title, completed: 0, mode: mode === 1 ? 1 : 0, points ?? 1 });
});

// Fallback to frontend for SPA routing
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public/index.html'));
});

app.post('/api/tasks/:id/complete', (req, res) => {
  const { id } = req.params;

  const stmt = db.prepare('UPDATE tasks SET completed = 1 WHERE id = ?');
  const info = stmt.run(id);

  if (info.changes === 0) {
    return res.status(404).json({ error: 'Task not found' });
  }

  res.status(200).json({ id: Number(id), completed: true });
});

app.delete('/api/tasks/:id', (req, res) => {
  const { id } = req.params;
  const stmt = db.prepare('DELETE FROM tasks WHERE id = ?');
  stmt.run(id);
  res.status(204).end();
});

// Start server
app.listen(3000, '0.0.0.0', () => {
  console.log('Virtuoso listening on http://0.0.0.0:3000');
});
