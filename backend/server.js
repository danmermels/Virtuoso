const express = require('express');
const path = require('path');
const app = express();

// Serve frontend
app.use(express.static(path.join(__dirname, 'public')));

// API
app.use(express.json());
// ... your routes ...

// Fallback to frontend for SPA routing
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public/index.html'));
});

app.listen(3000, '0.0.0.0', () => {
  console.log('Virtuoso listening on http://0.0.0.0:3000');
});
