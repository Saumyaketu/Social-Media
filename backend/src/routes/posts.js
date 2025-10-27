const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Post = require('../models/Post');

// Get all posts (public feed) -> GET /api/posts
router.get('/', async (req, res) => {
  try {
    const posts = await Post.find()
      .populate('author', 'name email')
      .sort({ createdAt: -1 });
    res.json(posts);
  } catch (err) {
    console.error('Get posts error:', err);
    res.status(500).send('Server error');
  }
});

// Create a post (protected) -> POST /api/posts
router.post('/', auth, async (req, res) => {
  try {
    const { text } = req.body;
    if (!text || !text.trim()) return res.status(400).json({ message: 'Post text required' });

    const post = new Post({ author: req.user.id, text: text.trim() });
    await post.save();
    await post.populate('author', 'name');
    res.json(post);
  } catch (err) {
    console.error('Create post error:', err);
    res.status(500).send('Server error');
  }
});

// Edit post (owner only) -> PUT /api/posts/:id
router.put('/:id', auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: 'Post not found' });
    if (post.author.toString() !== req.user.id) return res.status(403).json({ message: 'Forbidden' });

    if (typeof req.body.text === 'string' && req.body.text.trim()) {
      post.text = req.body.text.trim();
    }
    await post.save();
    res.json(post);
  } catch (err) {
    console.error('Edit post error:', err);
    res.status(500).send('Server error');
  }
});

// Delete post (owner only) -> DELETE /api/posts/:id
router.delete('/:id', auth, async (req, res) => {
  try {
    // Used findOneAndDelete to atomically delete the post 
    // by matching both the _id and the authenticated user's id (req.user.id).
    const deletedPost = await Post.findOneAndDelete({
      _id: req.params.id,
      author: req.user.id
    });

    if (!deletedPost) {
      return res.status(403).json({ message: 'Forbidden or Post not found' });
    }
    
    res.json({ message: 'Post removed' });
  } catch (err) {
    console.error('Delete post error:', err);
    res.status(500).send('Server error');
  }
});

// Toggle like -> POST /api/posts/:id/like
router.post('/:id/like', auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: 'Post not found' });

    const idx = post.likes.findIndex(l => l.toString() === req.user.id);
    if (idx === -1) {
      post.likes.push(req.user.id);
    } else {
      post.likes.splice(idx, 1);
    }
    await post.save();
    res.json({ likes: post.likes.length });
  } catch (err) {
    console.error('Like toggle error:', err);
    res.status(500).send('Server error');
  }
});

module.exports = router;
