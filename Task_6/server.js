import express from 'express';
import jwt from 'jsonwebtoken';
import cors from 'cors';

const app = express();
app.use(cors());
app.use(express.json());

const SECRET_KEY = 'your-secret-key';
const messages = [];

// Pure functions
const generateToken = (username) => jwt.sign({ username }, SECRET_KEY, { expiresIn: '1h' });
const verifyToken = (token) => jwt.verify(token, SECRET_KEY);

// Middleware for protected routes
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Token required' });

  try {
    const decoded = verifyToken(token);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(403).json({ error: 'Invalid token' });
  }
};

// Endpoints
app.post('/api/auth/login', (req, res) => {
  const { username, password } = req.body;
  // Simplified authentication (replace with real auth in production)
  if (username && password) {
    const token = generateToken(username);
    res.json({ token });
  } else {
    res.status(400).json({ error: 'Invalid credentials' });
  }
});

app.get('/api/messages', authenticateToken, (req, res) => {
  res.json(messages);
});

app.post('/api/messages', authenticateToken, (req, res) => {
  const message = req.body;
  messages.push(message);
  res.status(201).json(message);
});

app.listen(3000, () => console.log('Server running on port 3000'));