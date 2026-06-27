const express = require('express');
const { client } = require('../utils/sanityClient');
const auth    = require('../middleware/auth');

const router = express.Router();

// Public: Get all approved testimonials
router.get('/approved', async (req, res) => {
  try {
    const feedback = await client.fetch('*[_type == "feedback" && approved == true] | order(createdAt desc)');
    res.json(feedback);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// Admin: Get all feedback (including unapproved)
router.get('/all', auth, async (req, res) => {
  try {
    const feedback = await client.fetch('*[_type == "feedback"] | order(createdAt desc)');
    res.json(feedback);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// Public: Submit new feedback
router.post('/', async (req, res) => {
  try {
    const { name, rating, message } = req.body;
    if (!name || !rating || !message) {
      return res.status(400).json({ message: 'Name, rating (1-5), and message are required' });
    }

    const doc = {
      _type: 'feedback',
      name,
      rating: Number(rating),
      message,
      approved: false, // Must be approved by admin before appearing on site
      createdAt: new Date().toISOString(),
    };

    const saved = await client.create(doc);
    res.status(201).json({ message: 'Feedback submitted successfully. It will display once approved by admin!', feedback: saved });
  } catch (err) { res.status(400).json({ message: err.message }); }
});

// Admin: Approve feedback
router.put('/:id/approve', auth, async (req, res) => {
  try {
    const saved = await client.patch(req.params.id).set({ approved: true }).commit();
    res.json(saved);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// Admin: Delete feedback
router.delete('/:id', auth, async (req, res) => {
  try {
    await client.delete(req.params.id);
    res.json({ message: 'Deleted' });
  } catch (err) { res.status(500).json({ message: err.message }); }
});

module.exports = router;
