import React, { useEffect, useState } from 'react';
import './App.css';

function App() {
  const [tasks, setTasks] = useState([]);
  const [newTitle, setNewTitle] = useState('');
  const [mode, setMode] = useState(0); // 0 = daily, 1 = monthly
  const [points, setPoints] = useState(1);

  useEffect(() => {
    fetch('/api/tasks')
      .then(res => res.json())
      .then(setTasks)
      .catch(console.error);
  }, []);

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
    }
  };

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
   }
 };

  const handleComplete = async (id) => {
    const res = await fetch(`/api/tasks/${id}/complete`, { method: 'POST' });
    if (res.ok) {
      setTasks(tasks =>
        tasks.map(t => (t.id === id ? { ...t, completed: true } : t))
      );
    }
  };

  const handleDelete = async (id) => {
    const res = await fetch(`/api/tasks/${id}`, { method: 'DELETE' });
    if (res.ok) {
      setTasks(tasks => tasks.filter(t => t.id !== id));
    }
  };

  return (
    <div className="app">
      <h1>Tasks</h1>

      <div className="task-list-container">
        {[0, 1].map(mode => (
          <div key={mode}>
            <h2>{mode === 0 ? 'Daily Tasks' : 'Monthly Tasks'}</h2>
            <ul className="task-list">
              {tasks
                .filter(task => task.mode === mode)
                .map(task => (
                  <li key={task.id} className="task-item">
                    <span className={task.completed ? 'done' : ''}>
                      {task.title}
                      <span className="task-points">[{task.points} pts]</span>
                    </span>
                    <span className="task-buttons">
                      <input
                         type="checkbox"
                         checked={task.completed}
                         onChange={() => handleToggle(task.id, !task.completed)}
                       />
                      <button onClick={() => handleDelete(task.id)}>Delete</button>
                    </span>
                  </li>
                ))}
            </ul>
          </div>
        ))}
      </div>

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
