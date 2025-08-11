const express = require('express');
const router = express.Router();

// Mock authentication data
const mockUsers = [
  { id: 1, email: 'john@example.com', password: 'password123', name: 'John Doe' },
  { id: 2, email: 'jane@example.com', password: 'password456', name: 'Jane Smith' }
];

// POST /api/auth/login - User login
router.post('/login', (req, res) => {
  const { email, password } = req.body;
  
  if (!email || !password) {
    return res.status(400).json({
      error: 'Validation error',
      message: 'Email and password are required'
    });
  }
  
  const user = mockUsers.find(u => u.email === email && u.password === password);
  
  if (!user) {
    return res.status(401).json({
      error: 'Authentication failed',
      message: 'Invalid email or password'
    });
  }
  
  // In a real app, you'd generate a JWT token here
  const token = `mock-jwt-token-${user.id}-${Date.now()}`;
  
  res.json({
    message: 'Login successful',
    token,
    user: {
      id: user.id,
      email: user.email,
      name: user.name
    }
  });
});

// POST /api/auth/register - User registration
router.post('/register', (req, res) => {
  const { email, password, name } = req.body;
  
  if (!email || !password || !name) {
    return res.status(400).json({
      error: 'Validation error',
      message: 'Email, password, and name are required'
    });
  }
  
  // Check if user already exists
  const existingUser = mockUsers.find(u => u.email === email);
  if (existingUser) {
    return res.status(409).json({
      error: 'Conflict',
      message: 'User with this email already exists'
    });
  }
  
  const newUser = {
    id: Math.max(...mockUsers.map(u => u.id)) + 1,
    email,
    password, // In a real app, you'd hash this
    name
  };
  
  mockUsers.push(newUser);
  
  res.status(201).json({
    message: 'Registration successful',
    user: {
      id: newUser.id,
      email: newUser.email,
      name: newUser.name
    }
  });
});

// POST /api/auth/logout - User logout
router.post('/logout', (req, res) => {
  // In a real app, you'd invalidate the token here
  res.json({
    message: 'Logout successful'
  });
});

// GET /api/auth/profile - Get user profile (requires authentication)
router.get('/profile', (req, res) => {
  const authHeader = req.headers.authorization;
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({
      error: 'Unauthorized',
      message: 'Authentication token required'
    });
  }
  
  const token = authHeader.substring(7);
  
  // Mock token validation
  if (!token.startsWith('mock-jwt-token-')) {
    return res.status(401).json({
      error: 'Unauthorized',
      message: 'Invalid authentication token'
    });
  }
  
  // Extract user ID from mock token
  const userId = parseInt(token.split('-')[3]);
  const user = mockUsers.find(u => u.id === userId);
  
  if (!user) {
    return res.status(401).json({
      error: 'Unauthorized',
      message: 'User not found'
    });
  }
  
  res.json({
    user: {
      id: user.id,
      email: user.email,
      name: user.name
    }
  });
});

module.exports = router;
