const express  = require('express');
const bcrypt   = require('bcryptjs');
const jwt      = require('jsonwebtoken');
const { client } = require('../utils/sanityClient');
const auth     = require('../middleware/auth');

const router = express.Router();

// POST /api/auth/login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      return res.status(400).json({ message: 'Email and password required' });

    // Fetch admin user from Sanity CMS
    const admin = await client.fetch('*[_type == "adminUser" && email == $email][0]', { email });
    if (!admin)
      return res.status(401).json({ message: 'Invalid credentials' });

    const match = await bcrypt.compare(password, admin.password);
    if (!match)
      return res.status(401).json({ message: 'Invalid credentials' });

    const token = jwt.sign(
      { id: admin._id, email: admin.email },
      process.env.JWT_SECRET,
      { expiresIn: '8h' }
    );

    res.json({ token, email: admin.email });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/auth/me  (verify token still valid)
router.get('/me', auth, (req, res) => {
  res.json({ email: req.admin.email });
});

// POST /api/auth/change-password
router.post('/change-password', auth, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    
    // Fetch current admin user
    const admin = await client.fetch('*[_type == "adminUser" && _id == $id][0]', { id: req.admin.id });
    if (!admin)
      return res.status(404).json({ message: 'Admin user not found' });

    const match = await bcrypt.compare(currentPassword, admin.password);
    if (!match) return res.status(401).json({ message: 'Current password incorrect' });

    const newHash = await bcrypt.hash(newPassword, 10);
    
    // Update password in Sanity CMS
    await client.patch(admin._id).set({ password: newHash }).commit();
    
    res.json({ message: 'Password updated successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
