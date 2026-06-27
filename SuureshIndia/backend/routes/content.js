const express = require('express');
const { client } = require('../utils/sanityClient');
const auth = require('../middleware/auth');

const router = express.Router();


// GET Home Page Content (singleton)
router.get('/homepage', async (req, res) => {
  try {
    let content = await client.fetch('*[_type == "homePageContent"][0]');
    if (!content) {
        content = await client.create({ _type: 'homePageContent', heroTitle: 'Welcome' });
    }
    res.json(content);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// Admin: UPDATE Home Page Content
router.put('/homepage', auth, async (req, res) => {
  try {
    let content = await client.fetch('*[_type == "homePageContent"][0]');
    if (!content) {
        content = await client.create({ _type: 'homePageContent', ...req.body });
    } else {
        content = await client.patch(content._id).set(req.body).commit();
    }
    res.json(content);
  } catch (err) { res.status(400).json({ message: err.message }); }
});

module.exports = router;
