const express = require('express');
const app = express();
const port = 5000;

app.get('/', (req, res) => {
  res.send('Welcome to the Auth Server!');
});

app.listen(port, () => {
  console.log(`Auth server is running on http://localhost:${port}`);
});