import React, { useEffect, useState } from 'react';
import './App.css';

function App() {
  // State for all tasks
  const [tasks, setTasks] = useState([]);
  // State for new task form
  const [newTitle, setNewTitle] = useState('');
  const [mode, setMode] = useState(0); // 0 = daily, 1 = monthly
  const [points, setPoints] = useState(1);
  // State for Virtuoso score (historic running total)
  const [virtuosoScore, setVirtuosoScore] = useState({ completed_total: 0, possible_total: 0 });

  // Fetch all tasks from backend, initially and every 10 seconds
  useEffect(() => {
    const fetchTasks = () => {
      fetch('/api/tasks')
        .then(res => res.json())
        .then(setTasks)
        .catch(console.error);
    };
    fetchTasks();
    const interval = setInterval(fetchTasks, 10000);
    return () => clearInterval(interval);
  }, []);

  // Fetch Virtuoso score from backend, initially and every 10 seconds
  const fetchVirtuosoScore = () => {
    fetch('/api/virtuoso-score')
      .then(res => res.json())
      .then(setVirtuosoScore)
      .catch(console.error);
  };
  useEffect(() => {
    fetchVirtuosoScore();
    const interval = setInterval(fetchVirtuosoScore, 10000);
    return () => clearInterval(interval);
  }, []);

  // Calculate today's completed and possible points from current tasks
  const dailyCompleted = tasks
    .filter(t => t.mode === 0 && t.completed)
    .reduce((sum, t) => sum + t.points, 0);
  const dailyPossible = tasks
    .filter(t => t.mode === 0)
    .reduce((sum, t) => sum + t.points, 0);

  // Calculate monthly's completed and possible points from current tasks
  const monthlyCompleted = tasks
    .filter(t => t.mode === 1 && t.completed)
    .reduce((sum, t) => sum + t.points, 0);
  const monthlyPossible = tasks
    .filter(t => t.mode === 1)
    .reduce((sum, t) => sum + t.points, 0);

  // Combine historic and today's points for display
  const totalCompleted = (virtuosoScore.completed_total || 0) + dailyCompleted;
  const totalPossible = (virtuosoScore.possible_total || 0) + dailyPossible;

  // Add a new task
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newTitle.trim()) return;
    const res = await fetch('/api/tasks', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title: newTitle.trim(), mode, points }),
    });
    if (res.ok) {
      const created = await res.json();
      setTasks((tasks) => [...tasks, created]);
      setNewTitle('');
      setPoints(1);
      setMode(0);
      fetchVirtuosoScore();
    }
  };

  // Toggle task completion
  const handleToggle = async (id, completed) => {
    const res = await fetch(`/api/tasks/${id}/complete`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ completed }),
    });
    if (res.ok) {
      setTasks(tasks =>
        tasks.map(t =>
          t.id === id ? { ...t, completed } : t
        )
      );
      fetchVirtuosoScore();
    }
  };

  // Delete a task
  const handleDelete = async (id) => {
    const res = await fetch(`/api/tasks/${id}`, { method: 'DELETE' });
    if (res.ok) {
      setTasks(tasks => tasks.filter(t => t.id !== id));
      fetchVirtuosoScore();
    }
  };

  return (
    <div className="app">
      <h1>TO DO</h1>
      {/* Virtuoso Score: running total + today's progress */}
      <div className="points-counter">
        VIRTUOSO SCORE: {totalCompleted} / {totalPossible}
      </div>
      {/* Show today's and monthly progress */}
      <div className="points-counter">
        Daily Points: {dailyCompleted} / {dailyPossible} &nbsp; - &nbsp;
        Monthly Points: {monthlyCompleted} / {monthlyPossible}
      </div>
      {/* Task lists */}
      <div className="task-list-container">
        {[0, 1].map(mode => (
          <div key={mode}>
            <h2>{mode === 0 ? 'Daily Tasks' : 'Monthly Tasks'}</h2>
            <ul className="task-list">
              {tasks
                .filter(task => task.mode === mode)
                .map(task => (
                  <li key={task.id} className="task-item">
                    {/* Task title and points */}
                    <span className={task.completed ? 'done' : ''}>
                      {task.title}
                      <span className="task-points">[{task.points} pts]</span>
                    </span>
                    {/* Completion checkbox */}
                    <input
                      type="checkbox"
                      checked={task.completed}
                      onChange={() => handleToggle(task.id, !task.completed)}
                    />
                    {/* Delete button */}
                    <span className="task-buttons">
                      <button onClick={() => handleDelete(task.id)}>Delete</button>
                    </span>
                  </li>
                ))}
            </ul>
          </div>
        ))}
      </div>
      {/* Form to add new tasks */}
      <form onSubmit={handleSubmit} className="task-form">
        <input
          value={newTitle}
          onChange={(e) => setNewTitle(e.target.value)}
          placeholder="New task title"
          required
        />
        <input
          type="number"
          value={points}
          onChange={(e) => setPoints(Number(e.target.value))}
          placeholder="Pts"
          className="points-input"
        />
        <label className="mode-checkbox">
          <input
            type="checkbox"
            checked={mode === 1}
            onChange={(e) => setMode(e.target.checked ? 1 : 0)}
          />
          Monthly
        </label>
        <button type="submit">Add</button>
      </form>
    </div>
  );
}

export default App;