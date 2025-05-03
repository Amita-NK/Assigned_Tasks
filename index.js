const express = require('express');
const app = express();
app.use(express.json());

let notes = [];

app.get('/notes', (req, res) => {
  res.json(notes);
});

app.post('/notes', (req, res) => {
  const note = { id: notes.length + 1, content: req.body.content };
  notes.push(note);
  res.status(201).json(note);
});

app.listen(3000, () => {
  console.log('Server running at http://localhost:3000/');
});