import React, { useEffect, useState } from 'react';
// If you’re migrating to Tailwind, you can remove or gradually phase out App.css;
// ensure index.css contains the Tailwind directives and is imported:
import './index.css'; 
// You can keep App.css for any legacy styles, but Tailwind classes are in index.css.

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

  // Combine historic, daily, and monthly points for display
  const extendedCompleted = (virtuosoScore.completed_total || 0) + dailyCompleted + monthlyCompleted;
  const extendedPossible = (virtuosoScore.possible_total || 0) + dailyPossible + monthlyPossible;

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
    <div className="app p-4 max-w-3xl mx-auto">
      {/* Example Tailwind test header; you can remove when confirmed */}
      <h1 className="text-3xl font-bold text-green-600 mb-4">Tailwind Loaded</h1>

      {/* Your existing UI below; apply Tailwind classes as needed */}
      <h1 className="text-2xl font-semibold mb-2">TO DO</h1>

      <div className="mb-4">
        <div className="text-lg font-medium">
          VIRTUOSO SCORE: {extendedCompleted} / {extendedPossible}
        </div>
        <div className="text-sm text-gray-600">
          Daily Points: {dailyCompleted} / {dailyPossible} &nbsp; - &nbsp;
          Monthly Points: {monthlyCompleted} / {monthlyPossible}
        </div>
      </div>

      {/* Task lists */}
      <div className="space-y-6 mb-20"> {/* mb-20 to leave space for floating button/form */}
        {[0, 1].map((m) => (
          <div key={m}>
            <h2 className="text-xl font-semibold mb-2">{m === 0 ? 'Daily Tasks' : 'Monthly Tasks'}</h2>
            <ul className="space-y-2">
              {tasks
                .filter(task => task.mode === m)
                .map(task => (
                  <li
                    key={task.id}
                    className="flex items-center justify-between bg-white p-3 rounded-lg shadow-sm"
                  >
                    {/* Left: task title & points */}
                    <span className={task.completed ? 'line-through text-gray-500' : 'text-gray-800'}>
                      {task.title}
                      <span className="ml-2 text-sm text-yellow-600">[{task.points} pts]</span>
                    </span>
                    {/* Middle: checkbox */}
                    <input
                      type="checkbox"
                      checked={task.completed}
                      onChange={() => handleToggle(task.id, !task.completed)}
                      className="mr-4 w-5 h-5 text-blue-600"
                    />
                    {/* Right: delete */}
                    <button
                      onClick={() => handleDelete(task.id)}
                      className="text-red-500 hover:text-red-700"
                    >
                      Delete
                    </button>
                  </li>
                ))}
            </ul>
          </div>
        ))}
      </div>

      {/* The form or floating "+" button would go here (e.g., via a separate component) */}
      {/* For now, keep your inline form at bottom: */}
      <form onSubmit={handleSubmit} className="fixed bottom-4 left-1/2 transform -translate-x-1/2 bg-white p-4 rounded-t-lg shadow-lg flex space-x-2 w-full max-w-md">
        <input
          value={newTitle}
          onChange={(e) => setNewTitle(e.target.value)}
          placeholder="New task title"
          required
          className="flex-1 border border-gray-300 rounded px-2 py-1"
        />
        <input
          type="number"
          value={points}
          onChange={(e) => setPoints(Number(e.target.value))}
          placeholder="Pts"
          className="w-16 border border-gray-300 rounded px-2 py-1"
        />
        <label className="flex items-center space-x-1">
          <input
            type="checkbox"
            checked={mode === 1}
            onChange={(e) => setMode(e.target.checked ? 1 : 0)}
            className="w-4 h-4"
          />
          <span className="text-sm">Monthly</span>
        </label>
        <button type="submit" className="bg-blue-600 text-white px-3 py-1 rounded">
          Add
        </button>
      </form>
    </div>
  );
}

export default App;
