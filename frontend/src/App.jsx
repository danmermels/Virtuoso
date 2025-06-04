import React, { useEffect, useState } from 'react';

function App() {
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    fetch('/api/tasks')
      .then(res => res.json())
      .then(setTasks)
      .catch(console.error);
  }, []);

const [newTitle, setNewTitle] = React.useState('');

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
    setTasks((tasks) => [...tasks, created]);
    setNewTitle('');
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
              {task.title} {task.completed ? '✔️' : ''}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default App;
