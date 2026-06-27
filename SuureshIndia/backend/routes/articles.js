const express = require('express');
const { client } = require('../utils/sanityClient');
const auth    = require('../middleware/auth');

const router = express.Router();

// Public: GET all published articles
router.get('/', async (req, res) => {
  try {
    const articles = await client.fetch('*[_type == "article" && published == true] | order(publishDate desc)');
    // Map 'description' to 'desc' for frontend compatibility
    const mapped = articles.map(a => ({ ...a, desc: a.description }));
    res.json(mapped);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// Admin: GET all articles (including unpublished)
router.get('/all', auth, async (req, res) => {
  try {
    const articles = await client.fetch('*[_type == "article"] | order(publishDate desc)');
    const mapped = articles.map(a => ({ ...a, desc: a.description }));
    res.json(mapped);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// Public: GET single article
router.get('/:id', async (req, res) => {
  try {
    const article = await client.fetch('*[_type == "article" && _id == $id][0]', { id: req.params.id });
    if (!article) return res.status(404).json({ message: 'Not found' });
    res.json({ ...article, desc: article.description });
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// Admin: CREATE article
router.post('/', auth, async (req, res) => {
  try {
    const { title, category, description, desc, content, published, publishDate } = req.body;
    const finalDesc = description || desc || '';
    const isPublished = published !== undefined ? published : true;
    const finalDate = publishDate || new Date().toISOString().split('T')[0];

    const slugValue = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

    const doc = {
      _type: 'article',
      title,
      slug: { _type: 'slug', current: slugValue },
      category,
      description: finalDesc,
      content,
      published: isPublished,
      publishDate: finalDate,
    };

    const article = await client.create(doc);
    res.status(201).json({ ...article, desc: article.description });
  } catch (err) { res.status(400).json({ message: err.message }); }
});

// Admin: UPDATE article
router.put('/:id', auth, async (req, res) => {
  try {
    const { title, category, description, desc, content, published, publishDate } = req.body;
    const finalDesc = description || desc;

    const fields = {};
    if (title !== undefined) {
      fields.title = title;
      fields.slug = { _type: 'slug', current: title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') };
    }
    if (category !== undefined) fields.category = category;
    if (finalDesc !== undefined) fields.description = finalDesc;
    if (content !== undefined) fields.content = content;
    if (published !== undefined) fields.published = published;
    if (publishDate !== undefined) fields.publishDate = publishDate;

    const article = await client.patch(req.params.id).set(fields).commit();
    res.json({ ...article, desc: article.description });
  } catch (err) { res.status(400).json({ message: err.message }); }
});

// Admin: DELETE article
router.delete('/:id', auth, async (req, res) => {
  try {
    await client.delete(req.params.id);
    res.json({ message: 'Deleted' });
  } catch (err) { res.status(500).json({ message: err.message }); }
});

module.exports = router;
