import React, { useEffect, useState } from 'react';
import './App.css';

function App() {
  const [tasks, setTasks] = useState([]);
  const [newTitle, setNewTitle] = useState('');
  const [modo, setModo] = useState(0); // 0 = daily, 1 = monthly

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
      body: JSON.stringify({ title: newTitle.trim(), modo }),
    });
    if (res.ok) {
      const created = await res.json();
      setTasks((tasks) => [...tasks, { ...created, modo ]);
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
    <div className="app">
      <h1>Tasks</h1>
	 <form onSubmit={handleSubmit} className="task-form">
 	   <input
		 value={newTitle}
	   	 onChange={(e) => setNewTitle(e.target.value)}
		 placeholder="New task title"
		 required
	   />
	   <select value={modo} onChange={(e) => setModo(Number(e.target.value))}>
		 <option value={0}>Daily</option>
		 <option value={1}>Monthly</option>
	   </select>
	   <button type="submit">Add</button>
	 </form>

      {tasks.length === 0 ? (
        <p>No tasks found.</p>
      ) : (
        <ul className="task-list">
  {tasks.map(task => (
    <li key={task.id} className="task-item">
      <span className={task.completed ? 'done' : ''}>
        {task.title}
      </span>
      <span className="task-buttons">
        {!task.completed && (
          <button onClick={() => handleComplete(task.id)}>Complete</button>
        )}
        <button onClick={() => handleDelete(task.id)}>Delete</button>
      </span>
    </li>
  ))}
</ul>
      )}
    </div>
  );
}

export default App;
