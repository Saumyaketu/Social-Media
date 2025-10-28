const express = require('express');
const router = express.Router();
const User = require('../models/User');

// Get all users -> GET /api/users
router.get('/', async (req, res) => {
  try {
    // Select name, email, and _id, excluding the password field
    const users = await User.find().select('name email');
    res.json(users);
  } catch (err) {
    console.error('Get users error:', err);
    res.status(500).send('Server error');
  }
});

module.exports = router;