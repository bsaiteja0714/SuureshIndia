const express = require("express");
const { client } = require("../utils/sanityClient");
const auth = require("../middleware/auth");

const router = express.Router();

function mapTeamMember(member) {
  // Handle photo asset url if photo is a Sanity image reference
  let photoUrl = member.photo;
  if (member.photo && member.photo.asset && member.photo.asset._ref) {
    const ref = member.photo.asset._ref;
    // Simple Sanity CDN url generator: image-projectid-dataset-dimensions-extension
    const parts = ref.split("-");
    if (parts.length >= 4) {
      const id = parts[1];
      const dims = parts[2];
      const ext = parts[3];
      photoUrl = `https://cdn.sanity.io/images/${client.projectId || "suureshindia"}/${client.dataset || "production"}/${id}-${dims}.${ext}`;
    }
  }
  return {
    ...member,
    qualification: member.position || member.qualification || "",
    expertise: member.expertise || "",
    photo: photoUrl || "",
    bio: member.bio || "",
    email: member.email || "",
    phone: member.phone || "",
    linkedin: member.linkedin || "",
    twitter: member.twitter || "",
    facebook: member.facebook || "",
  };
}

// GET all team members
router.get("/", async (req, res) => {
  try {
    const members = await client.fetch(
      '*[_type == "teamMember"] | order(name asc)',
    );
    res.json(members.map(mapTeamMember));
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// CREATE team member
router.post("/", auth, async (req, res) => {
  try {
    const {
      name,
      position,
      qualification,
      expertise,
      photo,
      bio,
      email,
      phone,
      linkedin,
      twitter,
      facebook,
    } = req.body;

    const finalPosition = position || qualification || "Consultant";

    const doc = {
      _type: "teamMember",
      name,
      position: finalPosition,
      expertise: expertise || "",
      photo: photo
        ? typeof photo === "string"
          ? photo
          : undefined
        : undefined, // Handled as string if URL, or handled via asset uploads
      bio: bio || "",
      email: email || "",
      phone: phone || "",
      linkedin: linkedin || "",
      twitter: twitter || "",
      facebook: facebook || "",
    };

    const saved = await client.create(doc);
    res.status(201).json(mapTeamMember(saved));
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// UPDATE team member
router.put("/:id", auth, async (req, res) => {
  try {
    const {
      name,
      position,
      qualification,
      expertise,
      photo,
      bio,
      email,
      phone,
      linkedin,
      twitter,
      facebook,
    } = req.body;

    const fields = {};
    if (name !== undefined) fields.name = name;
    if (position !== undefined || qualification !== undefined)
      fields.position = position || qualification;
    if (expertise !== undefined) fields.expertise = expertise;
    if (photo !== undefined)
      fields.photo = typeof photo === "string" ? photo : undefined;
    if (bio !== undefined) fields.bio = bio;
    if (email !== undefined) fields.email = email;
    if (phone !== undefined) fields.phone = phone;
    if (linkedin !== undefined) fields.linkedin = linkedin;
    if (twitter !== undefined) fields.twitter = twitter;
    if (facebook !== undefined) fields.facebook = facebook;

    const saved = await client.patch(req.params.id).set(fields).commit();
    res.json(mapTeamMember(saved));
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// DELETE team member
router.delete("/:id", auth, async (req, res) => {
  try {
    await client.delete(req.params.id);
    res.json({ message: "Deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
