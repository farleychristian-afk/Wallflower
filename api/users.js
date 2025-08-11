const express = require('express');
const router = express.Router();

// Mock data for demonstration
let users = [
  { id: 1, name: 'John Doe', email: 'john@example.com', role: 'user' },
  { id: 2, name: 'Jane Smith', email: 'jane@example.com', role: 'admin' },
  { id: 3, name: 'Bob Johnson', email: 'bob@example.com', role: 'user' }
];

// GET /api/users - Get all users
router.get('/', (req, res) => {
  const { page = 1, limit = 10, role } = req.query;
  
  let filteredUsers = users;
  if (role) {
    filteredUsers = users.filter(user => user.role === role);
  }
  
  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;
  const paginatedUsers = filteredUsers.slice(startIndex, endIndex);
  
  res.json({
    users: paginatedUsers,
    pagination: {
      page: parseInt(page),
      limit: parseInt(limit),
      total: filteredUsers.length,
      totalPages: Math.ceil(filteredUsers.length / limit)
    }
  });
});

// GET /api/users/:id - Get user by ID
router.get('/:id', (req, res) => {
  const userId = parseInt(req.params.id);
  const user = users.find(u => u.id === userId);
  
  if (!user) {
    return res.status(404).json({
      error: 'User not found',
      message: `User with ID ${userId} does not exist`
    });
  }
  
  res.json({ user });
});

// POST /api/users - Create new user
router.post('/', (req, res) => {
  const { name, email, role = 'user' } = req.body;
  
  if (!name || !email) {
    return res.status(400).json({
      error: 'Validation error',
      message: 'Name and email are required'
    });
  }
  
  // Check if email already exists
  const existingUser = users.find(u => u.email === email);
  if (existingUser) {
    return res.status(409).json({
      error: 'Conflict',
      message: 'User with this email already exists'
    });
  }
  
  const newUser = {
    id: Math.max(...users.map(u => u.id)) + 1,
    name,
    email,
    role
  };
  
  users.push(newUser);
  
  res.status(201).json({
    message: 'User created successfully',
    user: newUser
  });
});

// PUT /api/users/:id - Update user
router.put('/:id', (req, res) => {
  const userId = parseInt(req.params.id);
  const userIndex = users.findIndex(u => u.id === userId);
  
  if (userIndex === -1) {
    return res.status(404).json({
      error: 'User not found',
      message: `User with ID ${userId} does not exist`
    });
  }
  
  const { name, email, role } = req.body;
  
  if (name) users[userIndex].name = name;
  if (email) users[userIndex].email = email;
  if (role) users[userIndex].role = role;
  
  res.json({
    message: 'User updated successfully',
    user: users[userIndex]
  });
});

// DELETE /api/users/:id - Delete user
router.delete('/:id', (req, res) => {
  const userId = parseInt(req.params.id);
  const userIndex = users.findIndex(u => u.id === userId);
  
  if (userIndex === -1) {
    return res.status(404).json({
      error: 'User not found',
      message: `User with ID ${userId} does not exist`
    });
  }
  
  users.splice(userIndex, 1);
  
  res.json({
    message: 'User deleted successfully'
  });
});

module.exports = router;
