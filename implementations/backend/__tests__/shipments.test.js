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
  });

  it('should return 404 for non-existent tracking number', async () => {
    const res = await request(app)
      .get('/api/shipments/track/NONEXISTENT-999');

    expect(res.status).toBe(404);
  });
});

describe('GET /api/shipments/recent', () => {
  it('should return recent shipments', async () => {
    const res = await request(app)
      .get('/api/shipments/recent');

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });
});

describe('GET /api/shipments/:userId', () => {
  it('should return user shipments', async () => {
    const res = await request(app)
      .get(`/api/shipments/${userId}`);

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeGreaterThanOrEqual(1);
    expect(res.body[0].tracking_number).toBe(trackId);
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
  });
});

describe('GET /api/shipments/monthly/:userId', () => {
  it('should return monthly shipment count', async () => {
    const res = await request(app)
      .get(`/api/shipments/monthly/${userId}`);

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });
});
