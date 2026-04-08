const router = require('express').Router();
const db     = require('../db');

// ── IMPORTANT: Specific routes MUST come before param routes (:userId, :trackingNumber)

// GET /api/shipments/recent
router.get('/recent', async (req, res) => {
  try {
    const [rows] = await db.query(
      `SELECT tracking_number FROM shipments ORDER BY created_at DESC LIMIT 4`
    );
    res.json(rows);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// GET /api/shipments/track/:trackingNumber
router.get('/track/:trackingNumber', async (req, res) => {
  try {
    const [rows] = await db.query(
      `SELECT tracking_number, status, origin, destination, recipient,
              eta, last_update, amount, type, service, weight, dims, contents, created_at
       FROM shipments WHERE tracking_number = ?`,
      [req.params.trackingNumber]
    );
    if (!rows.length) return res.status(404).json({ error: 'Not found' });
    res.json(rows[0]);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// GET /api/shipments/monthly/:userId
router.get('/monthly/:userId', async (req, res) => {
  try {
    const [rows] = await db.query(
      `SELECT DATE_FORMAT(created_at,'%b') as month, COUNT(*) as count
       FROM shipments
       WHERE user_id = ? AND created_at >= DATE_SUB(NOW(), INTERVAL 6 MONTH)
       GROUP BY MONTH(created_at), month
       ORDER BY MIN(created_at)`,
      [req.params.userId]
    );
    res.json(rows);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// GET /api/shipments/history/:userId  — full history for HistoryPage
router.get('/history/:userId', async (req, res) => {
  try {
    const [rows] = await db.query(
      `SELECT
         s.tracking_number,
         s.origin        AS sAddr,
         s.destination   AS rAddr,
         s.recipient     AS receiver,
         s.status,
         s.amount,
         s.created_at,
         p.method        AS paymentMethod
       FROM shipments s
       LEFT JOIN payments p ON p.shipment_id = s.id
       WHERE s.user_id = ?
       ORDER BY s.created_at DESC`,
      [req.params.userId]
    );
    res.json(rows);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// GET /api/shipments/:userId
router.get('/:userId', async (req, res) => {
  try {
    const [rows] = await db.query(
      `SELECT tracking_number, recipient, origin, destination, status, eta, amount, created_at
       FROM shipments WHERE user_id = ? ORDER BY created_at DESC LIMIT 20`,
      [req.params.userId]
    );
    res.json(rows);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// POST /api/shipments  — save a new shipment after payment confirmation
router.post('/', async (req, res) => {
  const {
    userId,
    trackId, total, pkg, svc,
    sname, sphone, saddr, sprov, szip,
    rname, rphone, raddr, rprov, rzip,
    weight, dims, contents, declval, insurance, handling,
    paymentMethod, paymentRef,
  } = req.body;

  // Basic validation
  const required = { trackId, sname, rname, sprov, rprov, weight, contents };
  const missing = Object.entries(required).filter(([, v]) => !v).map(([k]) => k);
  if (missing.length) {
    return res.status(400).json({ error: `Missing required fields: ${missing.join(', ')}` });
  }

  // Parse numeric amount (strips ฿ if present)
  const amount = parseFloat(String(total || '0').replace(/[^0-9.]/g, '')) || 0;

  const conn = await db.getConnection();
  try {
    await conn.beginTransaction();

    // 1. Insert shipment row
    const [shipResult] = await conn.execute(
      `INSERT INTO shipments
         (user_id, tracking_number, recipient, origin, destination,
          status, eta, last_update, amount,
          type, service, weight, dims, contents, insurance, handling)
       VALUES (?, ?, ?, ?, ?, 'paid', DATE_ADD(NOW(), INTERVAL 3 DAY), ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        userId || 1,
        trackId,
        rname,
        sprov,
        rprov,
        `Payment confirmed via ${paymentMethod || 'Unknown'}`,
        amount,
        pkg      || 'Parcel',
        svc      || 'Standard',
        weight   || null,
        dims     || null,
        contents || null,
        insurance === 'Yes' ? 1 : 0,
        handling || 'None',
      ]
    );
    const shipmentId = shipResult.insertId;

    // 2. Insert payment record
    await conn.execute(
      `INSERT INTO payments (user_id, shipment_id, amount, method)
       VALUES (?, ?, ?, ?)`,
      [userId || 1, shipmentId, amount, paymentMethod || 'Unknown']
    );

    // 3. Add activity log entry
    await conn.execute(
      `INSERT INTO activity_log (user_id, type, title, subtitle)
       VALUES (?, 'created', ?, ?)`,
      [
        userId || 1,
        `New shipment created`,
        `${trackId} · ${sprov} → ${rprov}`,
      ]
    );

    // 4. Add notification
    await conn.execute(
      `INSERT INTO notifications (user_id, message, type)
       VALUES (?, ?, 'success')`,
      [
        userId || 1,
        `Shipment ${trackId} confirmed. Estimated delivery in 3 days.`,
      ]
    );

    await conn.commit();
    res.json({ success: true, shipmentId, trackId });

  } catch (e) {
    await conn.rollback();
    console.error('Shipment save error:', e);
    res.status(500).json({ error: e.message });
  } finally {
    conn.release();
  }
});

module.exports = router;