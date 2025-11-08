const express = require('express');
const Post = require('../models/Post');
const { auth } = require('../middleware/auth');

const router = express.Router();

// create post
router.post('/', auth, async (req, res, next) => {
  try {
    const { title, body, tags } = req.body;
    if (!title || !body) return res.status(400).json({ error: 'title,body required' });
    const post = await Post.create({ title, body, tags: tags||[], author: req.user.id });
    res.status(201).json({ post });
  } catch (err) { next(err); }
});

// list posts (public)
router.get('/', async (req, res, next) => {
  try {
    const { page=1, limit=10, search } = req.query;
    const q = {};
    if (search) q.$text = { $search: search };
    const skip = (Number(page)-1)*Number(limit);
    const posts = await Post.find(q).sort({ createdAt: -1 }).skip(skip).limit(Number(limit)).populate('author','name email');
    const total = await Post.countDocuments(q);
    res.json({ data: posts, meta: { page: Number(page), limit: Number(limit), total } });
  } catch (err) { next(err); }
});

// get single
router.get('/:id', async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id).populate('author','name email');
    if (!post) return res.status(404).json({ error: 'Not found' });
    res.json({ post });
  } catch (err) { next(err); }
});

// update
router.patch('/:id', auth, async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ error: 'Not found' });
    if (post.author.toString() !== req.user.id && req.user.role !== 'admin') return res.status(403).json({ error: 'Forbidden' });
    const { title, body, tags, published } = req.body;
    if (title !== undefined) post.title = title;
    if (body !== undefined) post.body = body;
    if (tags !== undefined) post.tags = tags;
    if (published !== undefined) post.published = published;
    await post.save();
    res.json({ post });
  } catch (err) { next(err); }
});

// delete
router.delete('/:id', auth, async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ error: 'Not found' });
    if (post.author.toString() !== req.user.id && req.user.role !== 'admin') return res.status(403).json({ error: 'Forbidden' });
    await post.remove();
    res.status(204).end();
  } catch (err) { next(err); }
});

module.exports = router;
