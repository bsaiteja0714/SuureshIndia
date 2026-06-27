const express = require('express');
const { client } = require('../utils/sanityClient');
const auth = require('../middleware/auth');

const router = express.Router();

// Public: GET all services
router.get('/', async (req, res) => {
  try {
    const services = await client.fetch('*[_type == "service"]');
    res.json(services);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// Public: GET single service
router.get('/:id', async (req, res) => {
  try {
    const service = await client.fetch('*[_type == "service" && _id == $id][0]', { id: req.params.id });
    if (!service) return res.status(404).json({ message: 'Not found' });
    res.json(service);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// Admin: CREATE service
router.post('/', auth, async (req, res) => {
  try {
    const {
      title,
      description,
      iconEmoji,
      fullDescription,
      benefits,
      processFlow,
      faqs,
    } = req.body;

    const doc = {
      _type: "service",
      title,
      description,
      iconEmoji: iconEmoji || "📋",
      fullDescription: fullDescription || "",
      benefits: benefits || [],
      processFlow: processFlow || [],
      faqs: faqs || [],
    };
    const saved = await client.create(doc);
    res.status(201).json(saved);
  } catch (err) { res.status(400).json({ message: err.message }); }
});

// Admin: UPDATE service
// Admin: UPDATE service
router.put('/:id', auth, async (req, res) => {
  try {
    const {
      title,
      description,
      iconEmoji,
      fullDescription,
      benefits,
      processFlow,
      faqs,
    } = req.body;

    const fields = {};

    if (title !== undefined) fields.title = title;
    if (description !== undefined) fields.description = description;
    if (iconEmoji !== undefined) fields.iconEmoji = iconEmoji;
    if (fullDescription !== undefined) fields.fullDescription = fullDescription;
    if (benefits !== undefined) fields.benefits = benefits;
    if (processFlow !== undefined) fields.processFlow = processFlow;
    if (faqs !== undefined) fields.faqs = faqs;

    const saved = await client
      .patch(req.params.id)
      .set(fields)
      .commit();

    res.json(saved);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Admin: DELETE service
router.delete('/:id', auth, async (req, res) => {
  try {
    await client.delete(req.params.id);
    res.json({ message: 'Deleted' });
  } catch (err) { res.status(500).json({ message: err.message }); }
});

module.exports = router;
