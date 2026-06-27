const express = require('express');
const { client } = require('../utils/sanityClient');
const auth = require('../middleware/auth');

const router = express.Router();

// Helper to generate consistent IDs
const getPublishedId = (type) => `legalPage-${type}`;
const getDraftId = (type) => `drafts.legalPage-${type}`;

// Public: GET published legal page by type
router.get('/:type', async (req, res) => {
  try {
    const { type } = req.params;
    const publishedId = getPublishedId(type);
    
    // Fetch only the published document
    const page = await client.getDocument(publishedId);
    
    // Fallback if we were using auto-generated IDs previously
    if (!page) {
      const fallback = await client.fetch(
        '*[_type == "legalPage" && pageType == $type && !(_id in path("drafts.**"))][0]',
        { type }
      );
      return res.json(fallback || null);
    }
    
    res.json(page || null);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Admin: GET legal page (draft preferred, fallback to published)
router.get('/admin/:type', auth, async (req, res) => {
  try {
    const { type } = req.params;
    const publishedId = getPublishedId(type);
    const draftId = getDraftId(type);

    const [published, draft] = await Promise.all([
      client.getDocument(publishedId),
      client.getDocument(draftId)
    ]);

    // Fallback for older documents with auto-generated IDs
    let existingPublished = published;
    if (!existingPublished) {
      existingPublished = await client.fetch(
        '*[_type == "legalPage" && pageType == $type && !(_id in path("drafts.**"))][0]',
        { type }
      );
    }

    const doc = draft || existingPublished || null;
    res.json({
      document: doc,
      hasDraft: !!draft,
      isPublished: !!existingPublished,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Admin: Save as Draft
router.put('/admin/:type', auth, async (req, res) => {
  try {
    const { type } = req.params;
    const draftId = getDraftId(type);
    const { title, subtitle, lastUpdated, contactEmail, sections } = req.body;
    
    const fields = { 
      _type: 'legalPage',
      pageType: type,
      title, 
      subtitle, 
      lastUpdated, 
      contactEmail, 
      sections 
    };

    // Create or update the draft document
    const saved = await client.createOrReplace({
      _id: draftId,
      ...fields
    });
    
    res.json(saved);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Admin: Publish
router.post('/admin/:type/publish', auth, async (req, res) => {
  try {
    const { type } = req.params;
    const draftId = getDraftId(type);
    const publishedId = getPublishedId(type);
    
    const draft = await client.getDocument(draftId);
    if (!draft) {
      return res.status(404).json({ message: "No draft found to publish" });
    }

    const { _id, _rev, _updatedAt, _createdAt, ...fields } = draft;
    
    // Create/Update published doc and delete draft in a transaction
    await client.transaction()
      .createOrReplace({ _id: publishedId, ...fields })
      .delete(draftId)
      .commit();
      
    res.json({ message: "Published successfully" });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Admin: Unpublish (Move to draft)
router.post('/admin/:type/unpublish', auth, async (req, res) => {
  try {
    const { type } = req.params;
    const draftId = getDraftId(type);
    const publishedId = getPublishedId(type);
    
    const published = await client.getDocument(publishedId);
    if (!published) {
      // Check fallback
      const fallback = await client.fetch(
        '*[_type == "legalPage" && pageType == $type && !(_id in path("drafts.**"))][0]',
        { type }
      );
      if (!fallback) {
        return res.status(404).json({ message: "No published document found" });
      }
      
      const { _id, _rev, _updatedAt, _createdAt, ...fields } = fallback;
      await client.transaction()
        .createOrReplace({ _id: draftId, ...fields })
        .delete(_id) // Delete the auto-generated ID document
        .commit();
    } else {
      const { _id, _rev, _updatedAt, _createdAt, ...fields } = published;
      await client.transaction()
        .createOrReplace({ _id: draftId, ...fields })
        .delete(publishedId)
        .commit();
    }
      
    res.json({ message: "Unpublished successfully" });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Admin: Delete (Delete both draft and published)
router.delete('/admin/:type', auth, async (req, res) => {
  try {
    const { type } = req.params;
    const draftId = getDraftId(type);
    const publishedId = getPublishedId(type);
    
    const tx = client.transaction().delete(draftId).delete(publishedId);
    
    // Delete any older fallback documents
    const fallbacks = await client.fetch(
      '*[_type == "legalPage" && pageType == $type]',
      { type }
    );
    fallbacks.forEach(doc => {
      if (doc._id !== draftId && doc._id !== publishedId) {
        tx.delete(doc._id);
      }
    });

    await tx.commit();
    res.json({ message: "Deleted successfully" });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

module.exports = router;
