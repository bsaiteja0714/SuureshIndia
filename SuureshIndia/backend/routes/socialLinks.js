const express = require('express');
const { client } = require('../utils/sanityClient');
const auth = require('../middleware/auth');

const router = express.Router();

// Public: GET social links
router.get('/', async (req, res) => {
  try {
    const links = await client.fetch('*[_type == "socialLinks"][0]');
    res.json(links || {});
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Admin: UPDATE / UPSERT social links
router.put('/', auth, async (req, res) => {
  try {
    const existing = await client.fetch('*[_type == "socialLinks"][0]');
    const { linkedin, facebook, instagram, twitter, youtube, whatsapp, whatsappMessage, generalEmail } = req.body;

    const fields = {};
    if (linkedin !== undefined) fields.linkedin = linkedin;
    if (facebook !== undefined) fields.facebook = facebook;
    if (instagram !== undefined) fields.instagram = instagram;
    if (twitter !== undefined) fields.twitter = twitter;
    if (youtube !== undefined) fields.youtube = youtube;
    if (whatsapp !== undefined) fields.whatsapp = whatsapp;
    if (whatsappMessage !== undefined) fields.whatsappMessage = whatsappMessage;
    if (generalEmail !== undefined) fields.generalEmail = generalEmail;

    let saved;
    if (existing) {
      saved = await client.patch(existing._id).set(fields).commit();
    } else {
      saved = await client.create({ _type: 'socialLinks', ...fields });
    }
    res.json(saved);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

module.exports = router;
