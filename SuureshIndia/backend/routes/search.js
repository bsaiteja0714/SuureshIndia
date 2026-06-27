const express = require('express');
const { client } = require('../utils/sanityClient');

const router = express.Router();

router.get('/', async (req, res) => {
  const query = req.query.q || '';
  if (!query.trim()) {
    return res.json([]);
  }

  try {
    const groqQuery = `*[
      (_type == "article" && (title match $q || description match $q || content match $q)) ||
      (_type == "service" && (title match $q || description match $q || detailedContent match $q)) ||
      (_type == "governmentUpdate" && (title match $q || description match $q)) ||
      (_type == "complianceDeadline" && (title match $q || description match $q)) ||
      (_type == "teamMember" && (name match $q || position match $q || expertise match $q))
    ] {
      _id,
      _type,
      "title": coalesce(title, name),
      "subtitle": coalesce(category, position, source, dueDate),
      "description": coalesce(description, detailedContent, expertise)
    }`;

    const results = await client.fetch(groqQuery, { q: `*${query}*` });
    res.json(results);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
