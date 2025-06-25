const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const crypto = require('crypto');

const app = express();
const PORT = 5000;

app.use(express.static(__dirname)); 

app.use(cors());
app.use(bodyParser.json());
const users = [
  { id: '1', email: 'user@example.com', password: 'password' } 
];

const links = [
  { id: '1', userId: '1', longUrl: 'https://mysite.com/page', slug: 'abc123', clicks: 18 }
];

function generateId() {
  return crypto.randomBytes(8).toString('hex');
}

function generateSlug() {
  return crypto.randomBytes(3).toString('hex');
}

app.post('/auth/signup', (req, res) => {
  const { email, password } = req.body;
  if (users.find(u => u.email === email)) {
    return res.status(400).json({ message: 'Email already exists' });
  }
  const newUser = { id: generateId(), email, password };
  users.push(newUser);
  res.json({ message: 'Signup successful', userId: newUser.id });
});

app.post('/auth/login', (req, res) => {
  const { email, password } = req.body;
  const user = users.find(u => u.email === email && u.password === password);
  if (!user) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }
  res.json({ message: 'Login successful', userId: user.id });
});

// Middleware to check user by userId in header (simple auth)
function authMiddleware(req, res, next) {
  const userId = req.headers['x-user-id'];
  if (!userId || !users.find(u => u.id === userId)) {
    return res.status(401).json({ message: 'Unauthorized' });
  }
  req.userId = userId;
  next();
}

// CRUD routes for links
app.get('/links', authMiddleware, (req, res) => {
  const userLinks = links.filter(link => link.userId === req.userId);
  res.json(userLinks);
});

app.post('/links', authMiddleware, (req, res) => {
  const { longUrl, slug } = req.body;
  if (!longUrl) {
    return res.status(400).json({ message: 'Long URL is required' });
  }
  let newSlug = slug && slug.trim() !== '' ? slug.trim() : generateSlug();
  if (links.find(l => l.slug === newSlug)) {
    return res.status(400).json({ message: 'Slug already exists' });
  }
  const newLink = { id: generateId(), userId: req.userId, longUrl, slug: newSlug, clicks: 0 };
  links.push(newLink);
  res.json(newLink);
});

app.put('/links/:id', authMiddleware, (req, res) => {
  const { id } = req.params;
  const { longUrl, slug } = req.body;
  const link = links.find(l => l.id === id && l.userId === req.userId);
  if (!link) {
    return res.status(404).json({ message: 'Link not found' });
  }
  if (slug && slug !== link.slug && links.find(l => l.slug === slug)) {
    return res.status(400).json({ message: 'Slug already exists' });
  }
  if (longUrl) link.longUrl = longUrl;
  if (slug) link.slug = slug;
  res.json(link);
});

app.delete('/links/:id', authMiddleware, (req, res) => {
  const { id } = req.params;
  const index = links.findIndex(l => l.id === id && l.userId === req.userId);
  if (index === -1) {
    return res.status(404).json({ message: 'Link not found' });
  }
  links.splice(index, 1);
  res.json({ message: 'Link deleted' });
});

// Redirection route
app.get('/r/:slug', (req, res) => {
  const { slug } = req.params;
  const link = links.find(l => l.slug === slug);
  if (!link) {
    return res.status(404).send('Link not found');
  }
  link.clicks += 1;
  res.redirect(link.longUrl);
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
