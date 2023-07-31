const express = require('express');
const Blog = require('./models/Blog');
const authMiddleware = require('./authMiddleware');
const router = express.Router();

router.post('/blogs/create', authMiddleware, async (req, res) => {
  try {
    const { title, category, content, image } = req.body;
    const author = req.user.email;
    const blog = new Blog({ title, category, author, content, image, user: req.user._id });
    await blog.save();
    res.status(201).send(blog);
  } catch (error) {
    res.status(400).send(error);
  }
});

router.get('/blogs', async (req, res) => {
  try {
    const blogs = await Blog.find({});
    res.send(blogs);
  } catch (error) {
    res.status(500).send();
  }
});

router.patch('/blogs/:id', authMiddleware, async (req, res) => {
  const updates = Object.keys(req.body);
  const allowedUpdates = ['title', 'category', 'content', 'image'];
  const isValidOperation = updates.every(update => allowedUpdates.includes(update));

  if (!isValidOperation) {
    return res.status(400).send({ error: 'Invalid updates!' });
  }

  try {
    const blog = await Blog.findOne({ _id: req.params.id, user: req.user._id });

    if (!blog) {
      return res.status(404).send();
    }

    updates.forEach(update => (blog[update] = req.body[update]));
    await blog.save();
    res.send(blog);
  } catch (error) {
    res.status(400).send(error);
  }
});

router.delete('/blogs/:id', authMiddleware, async (req, res) => {
  try {
    const blog = await Blog.findOneAndDelete({ _id: req.params.id, user: req.user._id });

    if (!blog) {
      return res.status(404).send();
    }

    res.send(blog);
  } catch (error) {
    res.status(500).send();
  }
});

module.exports = router;
