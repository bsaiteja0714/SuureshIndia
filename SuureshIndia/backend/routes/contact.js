const express = require("express");
const rateLimit = require("express-rate-limit");
const { client } = require("../utils/sanityClient");
const auth = require("../middleware/auth");

const router = express.Router();

// Rate limit: 5 submissions per IP per 15 minutes
const contactLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: {
    message:
      "Too many submissions from this IP. Please wait 15 minutes and try again.",
  },
  standardHeaders: true,
  legacyHeaders: false,
});

function mapContact(c) {
  return {
    ...c,
    phone: c.phone || "",
    companyName: c.companyName || "Not provided",
    service: c.serviceType || c.service || "Other",
    serviceType: c.serviceType || c.service || "Other",
    message: c.message || "",
    read: c.read || false,
    createdAt: c.createdAt || c._createdAt,
  };
}

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

// Public: Submit contact form
router.post("/", contactLimiter, async (req, res) => {
  try {
    const {
      name,
      email,
      phone,
      companyName,
      service,
      serviceType,
      message,
      honeypot,
    } = req.body;

    // Honeypot spam check — bots fill hidden fields
    if (honeypot) {
      return res.status(200).json({ message: "Message received!" }); // Silent discard
    }

    // Validation
    if (!name || !email || !message) {
      return res
        .status(400)
        .json({ message: "Name, Email, and Message are required." });
    }
    if (!isValidEmail(email)) {
      return res
        .status(400)
        .json({ message: "Please enter a valid email address." });
    }
    if (name.trim().length < 2) {
      return res.status(400).json({ message: "Please enter your full name." });
    }
    if (message.trim().length < 10) {
      return res
        .status(400)
        .json({ message: "Message is too short. Please provide more detail." });
    }

    const doc = {
      _type: "contactInquiry",
      name: name.trim(),
      email: email.trim().toLowerCase(),
      phone: phone || "",
      companyName: companyName || "",
      serviceType: service || serviceType || "",
      message: message.trim(),
      read: false,
      createdAt: new Date().toISOString(),
    };

    const saved = await client.create(doc);
    res.status(201).json({
      message: "Message received! We will contact you soon.",
      id: saved._id,
      ...mapContact(saved),
    });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Admin: Get all leads
router.get("/", auth, async (req, res) => {
  try {
    const contacts = await client.fetch(
      '*[_type == "contactInquiry"] | order(createdAt desc)',
    );
    res.json(contacts.map(mapContact));
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Admin: Mark as read
router.put("/:id/read", auth, async (req, res) => {
  try {
    const saved = await client
      .patch(req.params.id)
      .set({ read: true })
      .commit();
    res.json(mapContact(saved));
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Admin: Delete
router.delete("/:id", auth, async (req, res) => {
  try {
    await client.delete(req.params.id);
    res.json({ message: "Deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
