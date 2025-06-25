const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const crypto = require('crypto');
const path = require('path');
const mongoose = require('mongoose');

const app = express();
const PORT = 5000;


app.use(cors());
app.use(bodyParser.json());

mongoose.connect('mongodb://localhost:27017/urlshortener', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => {
  console.log('Connected to MongoDB');
});
const userSchema = new mongoose.Schema({
  email: { type: String, unique: true },
  password: String,
});

const linkSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  longUrl: String,
  slug: { type: String, unique: true },
  clicks: { type: Number, default: 0 },
  lastClick: Date,
});

const User = mongoose.model('User', userSchema);
const Link = mongoose.model('Link', linkSchema);


function generateSlug() {
  return crypto.randomBytes(3).toString('hex');
}
app.post('/auth/signup', async (req, res) => {
  const { email, password } = req.body;
  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Email already exists' });
    }
    const newUser = new User({ email, password });
    await newUser.save();
    res.json({ message: 'Signup successful', userId: newUser._id });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

app.post('/auth/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email, password });
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    res.json({ message: 'Login successful', userId: user._id });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});
async function authMiddleware(req, res, next) {
  const userId = req.headers['x-user-id'];
  if (!userId) {
    return res.status(401).json({ message: 'Unauthorized' });
  }
  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(401).json({ message: 'Unauthorized' });
    }
    req.userId = userId;
    next();
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
}
app.get('/links', authMiddleware, async (req, res) => {
  try {
    const userLinks = await Link.find({ userId: req.userId });
    res.json(userLinks);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

app.post('/links', authMiddleware, async (req, res) => {
  const { longUrl, slug } = req.body;
  if (!longUrl) {
    return res.status(400).json({ message: 'Long URL is required' });
  }
  let newSlug = slug && slug.trim() !== '' ? slug.trim() : generateSlug();
  try {
    const existingLink = await Link.findOne({ slug: newSlug });
    if (existingLink) {
      return res.status(400).json({ message: 'Slug already exists' });
    }
    const newLink = new Link({ userId: req.userId, longUrl, slug: newSlug });
    await newLink.save();
    res.json(newLink);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

app.put('/links/:id', authMiddleware, async (req, res) => {
  const { id } = req.params;
  const { longUrl, slug } = req.body;
  try {
    const link = await Link.findOne({ _id: id, userId: req.userId });
    if (!link) {
      return res.status(404).json({ message: 'Link not found' });
    }
    if (slug && slug !== link.slug) {
      const slugExists = await Link.findOne({ slug });
      if (slugExists) {
        return res.status(400).json({ message: 'Slug already exists' });
      }
      link.slug = slug;
    }
    if (longUrl) link.longUrl = longUrl;
    await link.save();
    res.json(link);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

app.delete('/links/:id', authMiddleware, async (req, res) => {
  const { id } = req.params;
  try {
    const link = await Link.findOneAndDelete({ _id: id, userId: req.userId });
    if (!link) {
      return res.status(404).json({ message: 'Link not found' });
    }
    res.json({ message: 'Link deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

app.get('/r/:slug', async (req, res) => {
  const { slug } = req.params;
  try {
    const link = await Link.findOne({ slug });
    if (!link) {
      return res.status(404).send('Link not found');
    }
    link.clicks += 1;
    link.lastClick = new Date();
    await link.save();
    res.redirect(link.longUrl);
  } catch (err) {
    res.status(500).send('Server error');
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
