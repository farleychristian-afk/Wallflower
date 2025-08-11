const express = require('express');
const router = express.Router();

// Mock data for demonstration
let posts = [
  { 
    id: 1, 
    title: 'Welcome to Wallflower', 
    content: 'This is the first post on our platform.',
    authorId: 1,
    createdAt: '2023-01-01T00:00:00Z',
    updatedAt: '2023-01-01T00:00:00Z'
  },
  { 
    id: 2, 
    title: 'Getting Started Guide', 
    content: 'Here\'s how to get started with our application.',
    authorId: 2,
    createdAt: '2023-01-02T00:00:00Z',
    updatedAt: '2023-01-02T00:00:00Z'
  }
];

// GET /api/posts - Get all posts
router.get('/', (req, res) => {
  const { page = 1, limit = 10, authorId } = req.query;
  
  let filteredPosts = posts;
  if (authorId) {
    filteredPosts = posts.filter(post => post.authorId === parseInt(authorId));
  }
  
  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;
  const paginatedPosts = filteredPosts.slice(startIndex, endIndex);
  
  res.json({
    posts: paginatedPosts,
    pagination: {
      page: parseInt(page),
      limit: parseInt(limit),
      total: filteredPosts.length,
      totalPages: Math.ceil(filteredPosts.length / limit)
    }
  });
});

// GET /api/posts/:id - Get post by ID
router.get('/:id', (req, res) => {
  const postId = parseInt(req.params.id);
  const post = posts.find(p => p.id === postId);
  
  if (!post) {
    return res.status(404).json({
      error: 'Post not found',
      message: `Post with ID ${postId} does not exist`
    });
  }
  
  res.json({ post });
});

// POST /api/posts - Create new post
router.post('/', (req, res) => {
  const { title, content, authorId } = req.body;
  
  if (!title || !content || !authorId) {
    return res.status(400).json({
      error: 'Validation error',
      message: 'Title, content, and authorId are required'
    });
  }
  
  const newPost = {
    id: Math.max(...posts.map(p => p.id)) + 1,
    title,
    content,
    authorId: parseInt(authorId),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
  
  posts.push(newPost);
  
  res.status(201).json({
    message: 'Post created successfully',
    post: newPost
  });
});

// PUT /api/posts/:id - Update post
router.put('/:id', (req, res) => {
  const postId = parseInt(req.params.id);
  const postIndex = posts.findIndex(p => p.id === postId);
  
  if (postIndex === -1) {
    return res.status(404).json({
      error: 'Post not found',
      message: `Post with ID ${postId} does not exist`
    });
  }
  
  const { title, content } = req.body;
  
  if (title) posts[postIndex].title = title;
  if (content) posts[postIndex].content = content;
  posts[postIndex].updatedAt = new Date().toISOString();
  
  res.json({
    message: 'Post updated successfully',
    post: posts[postIndex]
  });
});

// DELETE /api/posts/:id - Delete post
router.delete('/:id', (req, res) => {
  const postId = parseInt(req.params.id);
  const postIndex = posts.findIndex(p => p.id === postId);
  
  if (postIndex === -1) {
    return res.status(404).json({
      error: 'Post not found',
      message: `Post with ID ${postId} does not exist`
    });
  }
  
  posts.splice(postIndex, 1);
  
  res.json({
    message: 'Post deleted successfully'
  });
});

module.exports = router;
