import { useEffect } from 'react';

function App() {
  useEffect(() => {
    fetch('/api/tasks')
      .then(res => res.json())
      .then(data => console.log('Tasks:', data))
      .catch(err => console.error('API error:', err));
  }, []);

  return <h1>Hello from frontend</h1>;
}

export default App;
