require('dotenv').config();
const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const OpenAI = require('openai');

const app = express();
const PORT = process.env.PORT || 3000;
const JWT_SECRET = process.env.JWT_SECRET;

app.use(cors());
app.use(express.json());

// In-memory user store (plain text passwords for demo only)
const users = [];

// Sample restaurant data with unique 'id' fields (slug format)
const restaurants = [
  {
    id: 'burger-joint',
    name: 'Burger Joint',
    description: 'Best burgers in town with fresh ingredients and secret sauce.',
    rating: 4.7,
    promo: '10% OFF',
    image: 'https://source.unsplash.com/56x56/?burger-restaurant',
  },
  {
    id: 'pizza-palace',
    name: 'Pizza Palace',
    description: 'Authentic Italian pizza with a variety of toppings.',
    rating: 4.5,
    promo: 'Free Delivery',
    image: 'https://source.unsplash.com/56x56/?pizza-restaurant',
  },
  {
    id: 'sushi-world',
    name: 'Sushi World',
    description: 'Fresh and delicious sushi prepared by expert chefs.',
    rating: 4.9,
    promo: null,
    image: 'https://source.unsplash.com/56x56/?sushi-restaurant',
  },
];

// Foods keyed by restaurant id with app1Discount and app2Discount
const restaurantFoods = {
  'burger-joint': [
    {
      name: 'Classic Burger',
      description: 'Beef patty with cheese',
      rating: 4.5,
      promo: '10% OFF',
      app1Discount: '5% OFF',
      app2Discount: '3% OFF',
      image: 'https://source.unsplash.com/56x56/?burger',
    },
    {
      name: 'Fries',
      description: 'Crispy golden fries',
      rating: 4.2,
      promo: null,
      app1Discount: '2% OFF',
      app2Discount: '1% OFF',
      image: 'https://source.unsplash.com/56x56/?fries',
    },
  ],
  'pizza-palace': [
    {
      name: 'Margherita',
      description: 'Tomato, mozzarella, basil',
      rating: 4.7,
      promo: 'Free Drink',
      app1Discount: '7% OFF',
      app2Discount: null,
      image: 'https://source.unsplash.com/56x56/?pizza',
    },
    {
      name: 'Pepperoni',
      description: 'Pepperoni and cheese',
      rating: 4.6,
      promo: null,
      app1Discount: null,
      app2Discount: '4% OFF',
      image: 'https://source.unsplash.com/56x56/?pepperoni-pizza',
    },
  ],
  'sushi-world': [
    {
      name: 'Salmon Roll',
      description: 'Fresh salmon with rice',
      rating: 4.9,
      promo: null,
      app1Discount: null,
      app2Discount: '5% OFF',
      image: 'https://source.unsplash.com/56x56/?sushi',
    },
    {
      name: 'Tuna Nigiri',
      description: 'Tuna on rice',
      rating: 4.8,
      promo: '5% OFF',
      app1Discount: '3% OFF',
      app2Discount: null,
      image: 'https://source.unsplash.com/56x56/?tuna',
    },
  ],
};

// Initialize OpenAI client with project-scoped key
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  organization: process.env.OPENAI_ORG_ID,
  project: process.env.OPENAI_PROJECT_ID,
});

// JWT authentication middleware
function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Unauthorized: No token provided' });

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ error: 'Forbidden: Invalid token' });
    req.user = user;
    next();
  });
}

// Register endpoint
app.post('/api/register', (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) return res.status(400).json({ error: 'Username and password required' });

  if (users.find(u => u.username === username)) {
    return res.status(400).json({ error: 'Username already exists' });
  }

  users.push({ username, password }); // Plain text for demo only
  res.json({ message: 'User registered successfully' });
});

// Login endpoint
app.post('/api/login', (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) return res.status(400).json({ error: 'Username and password required' });

  const user = users.find(u => u.username === username && u.password === password);
  if (!user) return res.status(401).json({ error: 'Invalid credentials' });

  const token = jwt.sign({ username }, JWT_SECRET, { expiresIn: '1h' });
  res.json({ token });
});

// Chat endpoint
app.post('/api/chat', authenticateToken, async (req, res) => {
  const { message } = req.body;
  if (!message || message.trim().length === 0) {
    return res.status(400).json({ error: 'Message is required' });
  }

  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        { role: 'system', content: 'You are a helpful assistant.' },
        { role: 'user', content: message }
      ],
      max_tokens: 500,
      temperature: 0.7,
    });

    const reply = completion.choices[0].message.content.trim();
    res.json({ reply });
  } catch (error) {
    console.error('OpenAI API error:', error);
    if (error.status === 429) {
      return res.status(429).json({ error: 'Quota exceeded. Please check your billing and quota.' });
    }
    res.status(500).json({ error: 'OpenAI API request failed' });
  }
});

// Restaurants endpoint (protected)
app.get('/api/restaurants', authenticateToken, (req, res) => {
  res.json(restaurants);
});

// Foods by restaurant endpoint (protected)
app.get('/api/restaurants/:id/foods', authenticateToken, (req, res) => {
  const id = req.params.id.toLowerCase();
  const foods = restaurantFoods[id];
  if (!foods) {
    return res.status(404).json({ error: 'Restaurant not found or no foods available' });
  }
  res.json(foods);
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

