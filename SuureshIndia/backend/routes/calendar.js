const express  = require('express');
const { client } = require('../utils/sanityClient');
const auth     = require('../middleware/auth');

const router = express.Router();

function mapCalendar(c) {
  return {
    ...c,
    compliance: c.title || '',
    notes: c.description || '',
    dueDate: c.dueDate || '',
    category: c.category || 'General',
  };
}

// GET all calendar entries
router.get('/', async (req, res) => {
  try {
    const entries = await client.fetch('*[_type == "complianceDeadline"] | order(dueDate asc)');
    res.json(entries.map(mapCalendar));
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// CREATE calendar entry
router.post('/', auth, async (req, res) => {
  try {
    const { compliance, title, dueDate, category, notes, description } = req.body;
    const finalTitle = compliance || title || '';
    const finalDesc = notes || description || '';

    const doc = {
      _type: 'complianceDeadline',
      title: finalTitle,
      dueDate,
      category: category || 'General',
      description: finalDesc,
    };

    const saved = await client.create(doc);
    res.status(201).json(mapCalendar(saved));
  } catch (err) { res.status(400).json({ message: err.message }); }
});

// UPDATE calendar entry
router.put('/:id', auth, async (req, res) => {
  try {
    const { compliance, title, dueDate, category, notes, description } = req.body;

    const fields = {};
    if (compliance !== undefined || title !== undefined) fields.title = compliance || title;
    if (dueDate !== undefined) fields.dueDate = dueDate;
    if (category !== undefined) fields.category = category;
    if (notes !== undefined || description !== undefined) fields.description = notes || description;

    const saved = await client.patch(req.params.id).set(fields).commit();
    res.json(mapCalendar(saved));
  } catch (err) { res.status(400).json({ message: err.message }); }
});

// DELETE calendar entry
router.delete('/:id', auth, async (req, res) => {
  try {
    await client.delete(req.params.id);
    res.json({ message: 'Deleted' });
  } catch (err) { res.status(500).json({ message: err.message }); }
});

module.exports = router;
