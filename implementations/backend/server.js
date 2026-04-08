const express = require('express');
const cors    = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

// ── Routes
app.use('/api/users',         require('./routes/users'));        // register, login
app.use('/api/user',          require('./routes/users'));        // dashboard calls /api/user/profile/:id and /api/user/stats/:id
app.use('/api/shipments',     require('./routes/shipments'));
app.use('/api/notifications', require('./routes/notifications'));
app.use('/api/activity',      require('./routes/activity'));

// ── Auto-initialize database tables on startup
const db = require('./db');
async function initDB() {
  try {
    await db.query(`
      CREATE TABLE IF NOT EXISTS users (
        id         SERIAL PRIMARY KEY,
        name       VARCHAR(100) NOT NULL,
        email      VARCHAR(100) UNIQUE,
        role       VARCHAR(50)  DEFAULT 'member',
        password   VARCHAR(255),
        address    VARCHAR(255) DEFAULT NULL,
        created_at TIMESTAMP    DEFAULT CURRENT_TIMESTAMP
      );
      CREATE TABLE IF NOT EXISTS shipments (
        id               SERIAL PRIMARY KEY,
        user_id          INT          NOT NULL,
        tracking_number  VARCHAR(50)  UNIQUE NOT NULL,
        recipient        VARCHAR(100),
        origin           VARCHAR(100),
        destination      VARCHAR(100),
        status           VARCHAR(50)  DEFAULT 'pending',
        eta              DATE,
        last_update      VARCHAR(150),
        amount           DECIMAL(10,2) DEFAULT 0.00,
        type             VARCHAR(50)  DEFAULT 'Parcel',
        service          VARCHAR(50)  DEFAULT 'Standard',
        weight           VARCHAR(30)  DEFAULT NULL,
        dims             VARCHAR(60)  DEFAULT NULL,
        contents         VARCHAR(255) DEFAULT NULL,
        insurance        SMALLINT     DEFAULT 0,
        handling         VARCHAR(120) DEFAULT 'None',
        created_at       TIMESTAMP    DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id)
      );
      CREATE TABLE IF NOT EXISTS payments (
        id         SERIAL PRIMARY KEY,
        user_id    INT          NOT NULL,
        shipment_id INT,
        amount     DECIMAL(10,2) DEFAULT 0.00,
        method     VARCHAR(50)  DEFAULT 'EasySlip',
        created_at TIMESTAMP    DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id)
      );
      CREATE TABLE IF NOT EXISTS notifications (
        id         SERIAL PRIMARY KEY,
        user_id    INT          NOT NULL,
        message    TEXT,
        type       VARCHAR(30)  DEFAULT 'info',
        is_read    SMALLINT     DEFAULT 0,
        created_at TIMESTAMP    DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id)
      );
      CREATE TABLE IF NOT EXISTS activity_log (
        id         SERIAL PRIMARY KEY,
        user_id    INT          NOT NULL,
        type       VARCHAR(50),
        title      VARCHAR(200),
        subtitle   VARCHAR(200),
        created_at TIMESTAMP    DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id)
      );
    `);
    console.log('Database tables initialized.');
  } catch (e) {
    console.error('DB init error:', e.message);
  }
}
initDB();

// Export app for testing (supertest)
module.exports = app;

// Only start listening if run directly (not imported by tests)
if (require.main === module) {
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => console.log(`API running on port ${PORT}`));
}
