const request = require('supertest');
const app = require('../server');
const db = require('../db');

const testEmail = `shiptest_${Date.now()}@test.com`;
let userId;
const trackId = `PO-TEST-${Date.now()}`;

beforeAll(async () => {
  // Create a test user for shipment tests
  const res = await request(app)
    .post('/api/users/register')
    .send({
      firstName: 'Ship',
      lastName: 'Tester',
      email: testEmail,
      password: 'password123',
    });
  userId = res.body.userId;
});

afterAll(async () => {
  // Clean up test data
  if (userId) {
    await db.query('DELETE FROM activity_log WHERE user_id = $1', [userId]);
    await db.query('DELETE FROM notifications WHERE user_id = $1', [userId]);
    await db.query('DELETE FROM payments WHERE user_id = $1', [userId]);
    await db.query('DELETE FROM shipments WHERE user_id = $1', [userId]);
    await db.query('DELETE FROM users WHERE id = $1', [userId]);
  }
  await db.end();
});

describe('POST /api/shipments', () => {
  it('should create a new shipment', async () => {
    const res = await request(app)
      .post('/api/shipments')
      .send({
        userId,
        trackId,
        total: '150.00',
        pkg: 'Parcel',
        svc: 'Standard',
        sname: 'Sender Name',
        sphone: '081-234-5678',
        saddr: '123 Test Road',
        sprov: 'Bangkok',
        szip: '10110',
        rname: 'Receiver Name',
        rphone: '089-876-5432',
        raddr: '456 Test Street',
        rprov: 'Chiang Mai',
        rzip: '50200',
        weight: '1.5 kg',
        dims: '20x15x10 cm',
        contents: 'Test Package',
        insurance: 'No',
        handling: 'None',
        paymentMethod: 'PromptPay',
        paymentRef: 'REF-TEST-001',
      });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.trackId).toBe(trackId);
    expect(res.body.shipmentId).toBeDefined();
  });

  it('should create shipment with insurance', async () => {
    const insTrackId = `PO-INS-${Date.now()}`;
    const res = await request(app)
      .post('/api/shipments')
      .send({
        userId,
        trackId: insTrackId,
        total: '฿200.00',
        sname: 'Sender',
        rname: 'Receiver',
        sprov: 'Bangkok',
        rprov: 'Phuket',
        weight: '2 kg',
        contents: 'Fragile items',
        insurance: 'Yes',
        handling: 'Fragile',
        paymentMethod: 'Credit Card',
      });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
  });

  it('should create shipment with missing optional fields', async () => {
    const optTrackId = `PO-OPT-${Date.now()}`;
    const res = await request(app)
      .post('/api/shipments')
      .send({
        userId,
        trackId: optTrackId,
        sname: 'Sender',
        rname: 'Receiver',
        sprov: 'Bangkok',
        rprov: 'Chonburi',
        weight: '0.5 kg',
        contents: 'Documents',
      });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
  });

  it('should reject shipment with missing required fields', async () => {
    const res = await request(app)
      .post('/api/shipments')
      .send({
        userId,
        total: '100.00',
      });

    expect(res.status).toBe(400);
    expect(res.body.error).toContain('Missing');
  });

  it('should reject shipment missing trackId', async () => {
    const res = await request(app)
      .post('/api/shipments')
      .send({
        userId,
        sname: 'S', rname: 'R', sprov: 'BKK', rprov: 'CM',
        weight: '1', contents: 'test',
      });

    expect(res.status).toBe(400);
    expect(res.body.error).toContain('trackId');
  });

  it('should reject shipment missing weight', async () => {
    const res = await request(app)
      .post('/api/shipments')
      .send({
        userId,
        trackId: 'PO-NOWEIGHT',
        sname: 'S', rname: 'R', sprov: 'BKK', rprov: 'CM',
        contents: 'test',
      });

    expect(res.status).toBe(400);
    expect(res.body.error).toContain('weight');
  });

  it('should handle total with currency symbol', async () => {
    const currTrackId = `PO-CURR-${Date.now()}`;
    const res = await request(app)
      .post('/api/shipments')
      .send({
        userId,
        trackId: currTrackId,
        total: '฿350.50',
        sname: 'Sender',
        rname: 'Receiver',
        sprov: 'Bangkok',
        rprov: 'Phuket',
        weight: '1 kg',
        contents: 'Gift',
        paymentMethod: 'Cash',
      });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
  });

  it('should reject duplicate tracking number', async () => {
    const res = await request(app)
      .post('/api/shipments')
      .send({
        userId,
        trackId, // same as first test
        sname: 'Sender',
        rname: 'Receiver',
        sprov: 'Bangkok',
        rprov: 'Chiang Mai',
        weight: '1 kg',
        contents: 'Duplicate test',
      });

    expect(res.status).toBe(500);
  });
});

describe('GET /api/shipments/track/:trackingNumber', () => {
  it('should return shipment details by tracking number', async () => {
    const res = await request(app)
      .get(`/api/shipments/track/${trackId}`);

    expect(res.status).toBe(200);
    expect(res.body.tracking_number).toBe(trackId);
    expect(res.body.origin).toBe('Bangkok');
    expect(res.body.destination).toBe('Chiang Mai');
    expect(res.body.recipient).toBe('Receiver Name');
    expect(res.body.status).toBe('paid');
    expect(res.body).toHaveProperty('amount');
    expect(res.body).toHaveProperty('type');
    expect(res.body).toHaveProperty('service');
    expect(res.body).toHaveProperty('weight');
    expect(res.body).toHaveProperty('contents');
    expect(res.body).toHaveProperty('created_at');
  });

  it('should return 404 for non-existent tracking number', async () => {
    const res = await request(app)
      .get('/api/shipments/track/NONEXISTENT-999');

    expect(res.status).toBe(404);
    expect(res.body.error).toBe('Not found');
  });
});

describe('GET /api/shipments/recent', () => {
  it('should return recent shipments as array', async () => {
    const res = await request(app)
      .get('/api/shipments/recent');

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeLessThanOrEqual(4);
    if (res.body.length > 0) {
      expect(res.body[0]).toHaveProperty('tracking_number');
    }
  });
});

describe('GET /api/shipments/:userId', () => {
  it('should return user shipments', async () => {
    const res = await request(app)
      .get(`/api/shipments/${userId}`);

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeGreaterThanOrEqual(1);
    expect(res.body[0]).toHaveProperty('tracking_number');
    expect(res.body[0]).toHaveProperty('recipient');
    expect(res.body[0]).toHaveProperty('origin');
    expect(res.body[0]).toHaveProperty('destination');
    expect(res.body[0]).toHaveProperty('status');
  });

  it('should return empty array for user with no shipments', async () => {
    const res = await request(app)
      .get('/api/shipments/99999');

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBe(0);
  });
});

describe('GET /api/shipments/history/:userId', () => {
  it('should return shipment history with payment method', async () => {
    const res = await request(app)
      .get(`/api/shipments/history/${userId}`);

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeGreaterThanOrEqual(1);
    expect(res.body[0]).toHaveProperty('sAddr');
    expect(res.body[0]).toHaveProperty('rAddr');
    expect(res.body[0]).toHaveProperty('receiver');
    expect(res.body[0]).toHaveProperty('paymentMethod');
    expect(res.body[0]).toHaveProperty('amount');
    expect(res.body[0]).toHaveProperty('status');
  });

  it('should return empty array for user with no history', async () => {
    const res = await request(app)
      .get('/api/shipments/history/99999');

    expect(res.status).toBe(200);
    expect(res.body.length).toBe(0);
  });
});

describe('GET /api/shipments/monthly/:userId', () => {
  it('should return monthly shipment count', async () => {
    const res = await request(app)
      .get(`/api/shipments/monthly/${userId}`);

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    if (res.body.length > 0) {
      expect(res.body[0]).toHaveProperty('month');
      expect(res.body[0]).toHaveProperty('count');
    }
  });

  it('should return empty for user with no monthly data', async () => {
    const res = await request(app)
      .get('/api/shipments/monthly/99999');

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });
});
