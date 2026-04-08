const router = require('express').Router();
const db     = require('../db');
const bcrypt = require('bcrypt');

// POST /api/users/register
router.post('/register', async (req, res) => {
  const { firstName, lastName, email, password } = req.body;

  if (!firstName || !lastName || !email || !password) {
    return res.status(400).json({ error: 'Missing required fields.' });
  }

  try {
    const [existing] = await db.query(
      `SELECT id FROM users WHERE email = ?`, [email]
    );
    if (existing.length) {
      return res.status(409).json({ error: 'This email is already registered.' });
    }

    const hashed = await bcrypt.hash(password, 10);

    const [result] = await db.query(
      `INSERT INTO users (name, email, password, role)
       VALUES (?, ?, ?, 'member')`,
      [`${firstName} ${lastName}`, email, hashed]
    );

    res.json({ success: true, userId: result.insertId, name: `${firstName} ${lastName}` });

  } catch (e) {
    console.error('Register error:', e);
    res.status(500).json({ error: e.message });
  }
});

// POST /api/users/login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required.' });
  }

  try {
    const [rows] = await db.query(
      `SELECT id, name, email, password, role FROM users WHERE email = ?`, [email]
    );

    if (!rows.length) {
      return res.status(401).json({ error: 'Invalid email or password.' });
    }

    const user  = rows[0];
    const match = await bcrypt.compare(password, user.password);

    if (!match) {
      return res.status(401).json({ error: 'Invalid email or password.' });
    }

    res.json({
      success: true,
      userId:  user.id,
      name:    user.name,
      email:   user.email,
      role:    user.role,
    });

  } catch (e) {
    console.error('Login error:', e);
    res.status(500).json({ error: e.message });
  }
});

// GET profile
router.get('/profile/:id', async (req, res) => {
  try {
    const [rows] = await db.query(
      `SELECT id, name, email, role, created_at
       FROM users WHERE id = ?`,
      [req.params.id]
    );

    if (!rows.length) return res.status(404).json({ error: 'User not found.' });

    res.json(rows[0]);

  } catch (e) {
    console.error('Profile error:', e);
    res.status(500).json({ error: e.message });
  }
});

// stats
router.get('/stats/:id', async (req, res) => {
  try {
    const userId = req.params.id;

    const [[totals]] = await db.query(
      `SELECT
         COUNT(*) AS total,
         SUM(status = 'delivered') AS delivered,
         SUM(status = 'in transit') AS transit,
         SUM(status = 'pending') AS pending,
         SUM(amount) AS totalSpend
       FROM shipments
       WHERE user_id = ?`,
      [userId]
    );

    res.json({
      total: totals.total || 0,
      delivered: totals.delivered || 0,
      transit: totals.transit || 0,
      pending: totals.pending || 0,
      totalSpend: totals.totalSpend || 0,
    });

  } catch (e) {
    console.error('Stats error:', e);
    res.status(500).json({ error: e.message });
  }
});

module.exports = router;