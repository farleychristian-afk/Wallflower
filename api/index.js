const express = require('express');
const router = express.Router();

// Import route modules
const usersRoutes = require('./users');
const postsRoutes = require('./posts');
const authRoutes = require('./auth');

// API info endpoint
router.get('/', (req, res) => {
  res.json({
    message: 'Wallflower API v1.0.0',
    endpoints: {
      users: '/api/users',
      posts: '/api/posts',
      auth: '/api/auth'
    },
    timestamp: new Date().toISOString()
  });
});

// Mount route modules
router.use('/users', usersRoutes);
router.use('/posts', postsRoutes);
router.use('/auth', authRoutes);

module.exports = router;
