const express = require("express");
const multer = require("multer");
const { client } = require("../utils/sanityClient");
const auth = require("../middleware/auth");

const router = express.Router();

// Configure multer to store file in memory
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
});

// GET all downloadable files
router.get("/", async (req, res) => {
  try {
    const query = `*[_type == "fileDownload"] {
      _id,
      title,
      category,
      description,
      publishDate,
      "fileUrl": file.asset->url,
      "fileName": file.asset->originalFilename
    } | order(publishDate desc)`;

    const downloads = await client.fetch(query);
    const mapped = downloads.map((d) => ({
      ...d,
      fileUrl: d.fileUrl || (d.file && d.file.assetUrl) || null,
    }));

    res.json(mapped);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Admin: Upload PDF
router.post("/upload", auth, upload.single("file"), async (req, res) => {
  try {
    const { title, category, description } = req.body;
    if (!req.file) {
      return res.status(400).json({ message: "Please upload a PDF file" });
    }

    // 1. Upload the file to Sanity Assets
    const asset = await client.assets.upload("file", req.file.buffer, {
      filename: req.file.originalname,
      contentType: req.file.mimetype,
    });

    // 2. Create the fileDownload document
    const doc = {
      _type: "fileDownload",
      title,
      category: category || "Other",
      description: description || "",
      file: {
        _type: "file",
        asset: {
          _type: "reference",
          _ref: asset._id,
        },
        assetUrl: asset.url,
      },
      publishDate: new Date().toISOString().split("T")[0],
    };

    const saved = await client.create(doc);
    res
      .status(201)
      .json({ message: "File uploaded successfully!", file: saved });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Admin: Delete file
router.delete("/:id", auth, async (req, res) => {
  try {
    await client.delete(req.params.id);
    res.json({ message: "Deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
