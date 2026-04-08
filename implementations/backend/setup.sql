-- ════════════════════════════════════════════════
--  POST OFFICE SYSTEM — FRESH DATABASE SETUP
--  This will DROP and RECREATE everything cleanly
-- ════════════════════════════════════════════════

-- ── 1. DROP & RECREATE DATABASE (fresh start)

DROP DATABASE IF EXISTS postoffice;
CREATE DATABASE postoffice;
USE postoffice;

-- ── 2. USERS TABLE
CREATE TABLE users (
  id         INT PRIMARY KEY AUTO_INCREMENT,
  name       VARCHAR(100) NOT NULL,
  email      VARCHAR(100) UNIQUE,
  role       VARCHAR(50)  DEFAULT 'member',
  password   VARCHAR(255),
  address    VARCHAR(255) DEFAULT NULL,
  created_at TIMESTAMP    DEFAULT CURRENT_TIMESTAMP
);

-- ── 3. SHIPMENTS TABLE
CREATE TABLE shipments (
  id               INT PRIMARY KEY AUTO_INCREMENT,
  user_id          INT          NOT NULL,
  tracking_number  VARCHAR(50)  UNIQUE NOT NULL,
  recipient        VARCHAR(100),
  origin           VARCHAR(100),
  destination      VARCHAR(100),
  status           VARCHAR(50)  DEFAULT 'pending',
  eta              DATE,
  last_update      VARCHAR(150),
  amount           DECIMAL(10,2) DEFAULT 0.00,
  -- Parcel details
  type             VARCHAR(50)  DEFAULT 'Parcel',
  service          VARCHAR(50)  DEFAULT 'Standard',
  weight           VARCHAR(30)  DEFAULT NULL,
  dims             VARCHAR(60)  DEFAULT NULL,
  contents         VARCHAR(255) DEFAULT NULL,
  insurance        TINYINT(1)   DEFAULT 0,
  handling         VARCHAR(120) DEFAULT 'None',
  created_at       TIMESTAMP    DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id)
);

-- ── 4. PAYMENTS TABLE
CREATE TABLE payments (
  id         INT PRIMARY KEY AUTO_INCREMENT,
  user_id    INT          NOT NULL,
  shipment_id INT,
  amount     DECIMAL(10,2) DEFAULT 0.00,
  method     VARCHAR(50)  DEFAULT 'EasySlip',
  created_at TIMESTAMP    DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id)
);

-- ── 5. NOTIFICATIONS TABLE
CREATE TABLE notifications (
  id         INT PRIMARY KEY AUTO_INCREMENT,
  user_id    INT          NOT NULL,
  message    TEXT,
  type       VARCHAR(30)  DEFAULT 'info',
  is_read    TINYINT      DEFAULT 0,
  created_at TIMESTAMP    DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id)
);

-- ── 6. ACTIVITY LOG TABLE
CREATE TABLE activity_log (
  id         INT PRIMARY KEY AUTO_INCREMENT,
  user_id    INT          NOT NULL,
  type       VARCHAR(50),
  title      VARCHAR(200),
  subtitle   VARCHAR(200),
  created_at TIMESTAMP    DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id)
);

-- ════════════════════════════════════════════════
--  TEST DATA
-- ════════════════════════════════════════════════

-- ── Users
INSERT INTO users (name, email, role) VALUES
('Somchai Jaidee', 'somchai@example.com', 'member');

-- ── Shipments
INSERT INTO shipments (user_id, tracking_number, recipient, origin, destination, status, eta, last_update, amount, type, service, weight, dims, contents, insurance, handling, created_at) VALUES
(1, 'TH-2024-0089', 'Nonthaburi Shop',  'Bangkok', 'Nonthaburi', 'in transit', '2026-03-12', 'Sorting Hub BKK',     120.00, 'Parcel',     'Standard', '1.5 kg', '20x15x10 cm', 'Electronics',    0, 'Fragile',      '2026-03-10'),
(1, 'TH-2024-0088', 'Chiang Mai Store', 'Bangkok', 'Chiang Mai', 'delivered',  '2026-03-08', 'Recipient',           320.00, 'Parcel',     'Express',  '3.2 kg', '35x25x20 cm', 'Clothing',       1, 'None',         '2026-03-08'),
(1, 'TH-2024-0087', 'Phuket Office',    'Bangkok', 'Phuket',     'processing', '2026-03-14', 'Bangkok Post Office', 200.00, 'Parcel',     'Standard', '2.0 kg', '30x20x15 cm', 'Documents',      0, 'Keep Upright', '2026-03-05'),
(1, 'TH-2024-0086', 'Khon Kaen Hub',    'Bangkok', 'Khon Kaen',  'delivered',  '2026-03-01', 'Recipient',           150.00, 'Letter',     'Registered','0.2 kg','23x16x1 cm',  'Contracts',      0, 'None',         '2026-03-01'),
(1, 'TH-2024-0085', 'Hat Yai Branch',   'Bangkok', 'Hat Yai',    'pending',    '2026-03-20', 'Awaiting pickup',     180.00, 'Parcel',     'Standard', '1.8 kg', '25x20x12 cm', 'Food Items',     0, 'Keep Dry',     '2026-02-25');

-- ── Payments
INSERT INTO payments (user_id, amount, method) VALUES
(1, 320.00, 'EasySlip'),
(1, 150.00, 'EasySlip'),
(1, 120.00, 'Credit Card');

-- ── Notifications
INSERT INTO notifications (user_id, message, type, is_read, created_at) VALUES
(1, 'TH-2024-0089 arrived at Bangkok Sorting Hub', 'info',    0, '2026-03-11 09:14:00'),
(1, 'Payment due for shipment TH-2024-0085',        'warning', 0, '2026-03-11 06:00:00'),
(1, 'TH-2024-0088 successfully delivered',          'success', 0, '2026-03-10 14:32:00'),
(1, 'New service: Same-day delivery now available', 'info',    1, '2026-03-09 10:00:00');

-- ── Activity Log
INSERT INTO activity_log (user_id, type, title, subtitle, created_at) VALUES
(1, 'arrived',   'Parcel arrived at sorting hub', 'TH-2024-0089 · Bangkok Hub',          '2026-03-11 09:14:00'),
(1, 'delivered', 'Delivery confirmed',             'TH-2024-0088 · Chiang Mai',           '2026-03-10 14:32:00'),
(1, 'payment',   'Payment received ฿320',          'TH-2024-0088 · EasySlip',             '2026-03-08 11:00:00'),
(1, 'created',   'New shipment created',           'TH-2024-0089 · Bangkok → Nonthaburi', '2026-03-10 08:00:00');

-- ── Verify everything was inserted
SELECT 'users'          AS tbl, COUNT(*) AS total FROM users
UNION ALL
SELECT 'shipments',     COUNT(*) FROM shipments
UNION ALL
SELECT 'payments',      COUNT(*) FROM payments
UNION ALL
SELECT 'notifications', COUNT(*) FROM notifications
UNION ALL
SELECT 'activity_log',  COUNT(*) FROM activity_log;