import React, { useEffect, useState } from 'react';

function App() {
  const [tasks, setTasks] = useState([]);
  const [newTitle, setNewTitle] = useState('');

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
      body: JSON.stringify({ title: newTitle.trim() }),
    });

    if (res.ok) {
      const created = await res.json();
      setTasks(tasks => [...tasks, created]);
      setNewTitle('');
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

  return (
    <div style={{ padding: '1rem', fontFamily: 'sans-serif' }}>
      <h1>Tasks</h1>
      <form onSubmit={handleSubmit}>
        <input
          value={newTitle}
          onChange={(e) => setNewTitle(e.target.value)}
          placeholder="New task title"
          required
        />
        <button type="submit">Add Task</button>
      </form>

      {tasks.length === 0 ? (
        <p>No tasks found.</p>
      ) : (
        <ul>
          {tasks.map(task => (
            <li key={task.id}>
              <span style={{ textDecoration: task.completed ? 'line-through' : 'none' }}>
                {task.title}
              </span>
              {!task.completed && (
                <button onClick={() => handleComplete(task.id)}>Mark as Completed</button>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default App;
