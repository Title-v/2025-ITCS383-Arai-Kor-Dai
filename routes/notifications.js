const router = require('express').Router();
const db     = require('../db');

// GET /api/notifications/:userId
router.get('/:userId', async (req, res) => {
  try {
    const [rows] = await db.query(
      `SELECT id, message, type, is_read, created_at
       FROM notifications WHERE user_id = ?
       ORDER BY created_at DESC LIMIT 10`,
      [req.params.userId]
    );
    res.json(rows);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// PATCH /api/notifications/:userId/read-all
router.patch('/:userId/read-all', async (req, res) => {
  try {
    await db.query(
      `UPDATE notifications SET is_read = 1 WHERE user_id = ?`,
      [req.params.userId]
    );
    res.json({ success: true });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

module.exports = router;