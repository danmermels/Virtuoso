const express = require('express');
const Database = require('better-sqlite3');
const path = require('path');
const cron = require('node-cron');

const app = express();
const db = new Database(path.join(__dirname, 'data.db'));

// Ensure table exists
db.prepare(`
  CREATE TABLE IF NOT EXISTS tasks (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    completed BOOLEAN DEFAULT 0,
    mode BOOLEAN DEFAULT 0,
    points INTEGER DEFAULT 10
  )
`).run();

db.prepare(`
  CREATE TABLE IF NOT EXISTS daily_task_history (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    task_id INTEGER,
    date TEXT,
    completed INTEGER,
    points INTEGER
  )
`).run();

// Schedule a job to run every day at midnight
cron.schedule('*/10 * * * * *', () => {
  const today = new Date().toISOString().slice(0, 10);

// Get all daily tasks (mode === 0)
  const dailyTasks = db.prepare('SELECT * FROM tasks WHERE mode = 0').all();

  for (const task of dailyTasks) {
    // Record the completion state in history
    db.prepare(
      'INSERT INTO daily_task_history (task_id, date, completed, points) VALUES (?, ?, ?, ?)'
    ).run(task.id, today, task.completed ? 1 : 0, task.points);

    // Reset completion
    db.prepare('UPDATE tasks SET completed = 0 WHERE id = ?').run(task.id);
  }

  console.log('Daily tasks reset and history recorded for', today);
});

const history = db.prepare('SELECT * FROM daily_task_history ORDER BY id DESC LIMIT 5').all();
console.log('Recent history:', history);

// Serve frontend
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());

// GET /api/tasks - list all tasks.
app.get('/api/tasks', (req, res) => {
  const tasks = db.prepare('SELECT * FROM tasks').all();
  res.json(tasks);
});

// Get all daily tasks (mode === 0)
const dailyTasks = db.prepare('SELECT * FROM tasks WHERE mode = 0').all();

// POST /api/tasks - add a task
app.post('/api/tasks', (req, res) => {
  const { title, mode, points } = req.body;
  if (!title) return res.status(400).json({ error: 'Title is required' });

  const safePoints = points !== undefined && points !== null ? points : 1;
  const safeMode = mode === 1 ? 1 : 0;

  const result = db.prepare(
    'INSERT INTO tasks (title, completed, mode, points) VALUES (?, ?, ?, ?)'
  ).run(title, 0, safeMode, safePoints);

  res.json({
    id: result.lastInsertRowid,
    title,
    completed: 0,
    mode: safeMode,
    points: safePoints
  });
});

// POST /api/tasks/:id/complete - mark task as complete
app.post('/api/tasks/:id/complete', (req, res) => {
  const { id } = req.params;
  const { completed } = req.body;
    
  console.log(`Task ${id} set to completed: ${completed}`);

  const stmt = db.prepare('UPDATE tasks SET completed = ? WHERE id = ?');
  const info = stmt.run(completed ? 1 : 0, id);

  if (info.changes === 0) {
    return res.status(404).json({ error: 'Task not found' });
  }

  res.status(200).json({ id: Number(id), completed: !!completed });
});

// GET /api/daily-history/summary - get total completed and possible points
app.get('/api/daily-history/summary', (req, res) => {
  //lifetime totals
  const completed = db.prepare(
    'SELECT SUM(points) as total FROM daily_task_history WHERE completed = 1'
  ).get().total || 0;

  const possible = db.prepare(
    'SELECT SUM(points) as total FROM daily_task_history'
  ).get().total || 0;

  // today's totals
  const today = new Date().toISOString().slice(0, 10);
  const todayCompleted = db.prepare(
    'SELECT SUM(points) as total FROM daily_task_history WHERE completed = 1 AND date = ?'
  ).get(today).total || 0;

  const todayPossible = db.prepare(
    'SELECT SUM(points) as total FROM daily_task_history WHERE date = ?'
  ).get(today).total || 0;

  res.json({ 
    completed, 
    possible,
    todayCompleted,
    todayPossible
  });
});

// DELETE /api/tasks/:id - delete a task
app.delete('/api/tasks/:id', (req, res) => {
  const { id } = req.params;
  const stmt = db.prepare('DELETE FROM tasks WHERE id = ?');
  stmt.run(id);
  res.status(204).end();
});

// Fallback to frontend for SPA routing
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public/index.html'));
});

// Start server
app.listen(3000, '0.0.0.0', () => {
  console.log('Virtuoso listening on http://0.0.0.0:3000');
});
