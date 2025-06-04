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

const handleDelete = async (id) => {
  const res = await fetch(`/api/tasks/${id}`, { method: 'DELETE' });
  if (res.ok) {
    setTasks(tasks => tasks.filter(t => t.id !== id));
  }
};

 return (
  <div style={{ maxWidth: '600px', margin: '2rem auto', fontFamily: 'sans-serif' }}>
    <h1 style={{ textAlign: 'center' }}>Tasks</h1>

    <form onSubmit={handleSubmit} style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
      <input
        value={newTitle}
        onChange={(e) => setNewTitle(e.target.value)}
        placeholder="New task title"
        required
        style={{ flex: 1, padding: '0.5rem' }}
      />
      <button type="submit" style={{ padding: '0.5rem 1rem' }}>Add</button>
    </form>

    {tasks.length === 0 ? (
      <p style={{ textAlign: 'center', color: '#666' }}>No tasks found.</p>
    ) : (
      <ul style={{ listStyle: 'none', padding: 0 }}>
        {tasks.map(task => (
          <li
            key={task.id}
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: '0.5rem',
              marginBottom: '0.5rem',
              backgroundColor: '#f5f5f5',
              borderRadius: '4px'
            }}
          >
            <span style={{ textDecoration: task.completed ? 'line-through' : 'none' }}>
              {task.title}
            </span>
            <div>
              {!task.completed && (
                <button onClick={() => handleComplete(task.id)} style={{ marginRight: '0.5rem' }}>
                  ✅
                </button>
              )}
              <button onClick={() => handleDelete(task.id)} style={{ color: 'red' }}>
                🗑️
              </button>
            </div>
          </li>
        ))}
      </ul>
    )}
  </div>
);
}
export default App;
