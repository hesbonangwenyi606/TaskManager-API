const express = require('express');
const User = require('../models/User');
const { auth, requireRole } = require('../middleware/auth');

const router = express.Router();

// current user
router.get('/me', auth, async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ error: 'Not found' });
    res.json({ user: user.toJSON() });
  } catch (err) { next(err); }
});

// list users (admin)
router.get('/', auth, requireRole('admin'), async (req, res, next) => {
  try {
    const users = await User.find().limit(100);
    res.json({ data: users.map(u => u.toJSON()) });
  } catch (err) { next(err); }
});

module.exports = router;
