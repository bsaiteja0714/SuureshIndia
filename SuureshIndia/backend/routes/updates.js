const express = require("express");
const { client } = require("../utils/sanityClient");
const auth = require("../middleware/auth");

const router = express.Router();

// Helper to map Sanity governmentUpdate to expected update response
function mapUpdate(u) {
  return {
    ...u,
    category: u.source || "Other",
    summary: u.description || "",
    published: u.published !== undefined ? u.published : true,
    createdAt: u._createdAt || u.createdAt,
    adminCreated: u.adminCreated !== false,
    pinned: u.pinned || false,
    archived: u.archived || false,
  };
}

// Public: GET all published, non-archived updates, pinned first
router.get("/", async (req, res) => {
  try {
    const updates = await client.fetch(
      '*[_type == "governmentUpdate" && published != false && archived != true] | order(pinned desc, publishDate desc)',
    );
    res.json(updates.map(mapUpdate));
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Admin: GET all updates (including unpublished & archived)
router.get("/all", auth, async (req, res) => {
  try {
    const updates = await client.fetch(
      '*[_type == "governmentUpdate"] | order(pinned desc, publishDate desc)',
    );
    res.json(updates.map(mapUpdate));
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Public: GET single update by ID
router.get("/:id", async (req, res) => {
  try {
    const update = await client.fetch(
      '*[_type == "governmentUpdate" && _id == $id][0]',
      { id: req.params.id }
    );
    if (!update) {
      return res.status(404).json({ message: "Update not found" });
    }
    res.json(mapUpdate(update));
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Admin: CREATE update
router.post("/", auth, async (req, res) => {
  try {
    const {
      title,
      category,
      source,
      summary,
      description,
      link,
      published,
      publishDate,
      pinned,
      archived,
    } = req.body;

    const finalSource = category || source || "Other";
    const finalDesc = summary || description || "";
    const isPublished = published !== undefined ? published : true;
    const finalDate = publishDate || new Date().toISOString().split("T")[0];

    const doc = {
      _type: "governmentUpdate",
      title,
      description: finalDesc,
      source: finalSource,
      link: link || "",
      published: isPublished,
      publishDate: finalDate,
      adminCreated: true,
      pinned: pinned || false,
      archived: archived || false,
    };

    const saved = await client.create(doc);
    res.status(201).json(mapUpdate(saved));
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Admin: UPDATE update
router.put("/:id", auth, async (req, res) => {
  try {
    const {
      title,
      category,
      source,
      summary,
      description,
      link,
      published,
      publishDate,
      pinned,
      archived,
    } = req.body;

    const fields = {};
    if (title !== undefined) fields.title = title;
    if (category !== undefined || source !== undefined)
      fields.source = category || source;
    if (summary !== undefined || description !== undefined)
      fields.description = summary || description;
    if (link !== undefined) fields.link = link;
    if (published !== undefined) fields.published = published;
    if (publishDate !== undefined) fields.publishDate = publishDate;
    if (pinned !== undefined) fields.pinned = pinned;
    if (archived !== undefined) fields.archived = archived;

    const saved = await client.patch(req.params.id).set(fields).commit();
    res.json(mapUpdate(saved));
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Admin: DELETE update
router.delete("/:id", auth, async (req, res) => {
  try {
    await client.delete(req.params.id);
    res.json({ message: "Deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
