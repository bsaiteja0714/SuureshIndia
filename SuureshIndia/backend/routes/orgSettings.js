const express = require('express');
const { client } = require('../utils/sanityClient');
const auth = require('../middleware/auth');

const router = express.Router();

// Public: GET organization settings
router.get('/', async (req, res) => {
  try {
    const settings = await client.fetch('*[_type == "organizationSettings"][0]');
    res.json(settings || {});
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Admin: UPDATE / UPSERT organization settings
router.put('/', auth, async (req, res) => {
  try {
    const existing = await client.fetch('*[_type == "organizationSettings"][0]');
    const {
      companyName, tagline, description, logoUrl, established,
      emails, phones, workingHours, offices, googleMapsEmbedUrl, registrationDetails,
    } = req.body;

    const fields = {};
    if (companyName !== undefined) fields.companyName = companyName;
    if (tagline !== undefined) fields.tagline = tagline;
    if (description !== undefined) fields.description = description;
    if (logoUrl !== undefined) fields.logoUrl = logoUrl;
    if (established !== undefined) fields.established = established;
    if (emails !== undefined) fields.emails = emails;
    if (phones !== undefined) fields.phones = phones;
    if (workingHours !== undefined) fields.workingHours = workingHours;
    if (offices !== undefined) fields.offices = offices;
    if (googleMapsEmbedUrl !== undefined) fields.googleMapsEmbedUrl = googleMapsEmbedUrl;
    if (registrationDetails !== undefined) fields.registrationDetails = registrationDetails;

    let saved;
    if (existing) {
      saved = await client.patch(existing._id).set(fields).commit();
    } else {
      saved = await client.create({ _type: 'organizationSettings', ...fields });
    }
    res.json(saved);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

module.exports = router;
