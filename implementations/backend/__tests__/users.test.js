const request = require('supertest');
const app = require('../server');
const db = require('../db');

// Generate unique email for each test run to avoid conflicts
const testEmail = `testuser_${Date.now()}@test.com`;
let createdUserId;

afterAll(async () => {
  // Clean up test data
  if (createdUserId) {
    await db.query('DELETE FROM activity_log WHERE user_id = $1', [createdUserId]);
    await db.query('DELETE FROM notifications WHERE user_id = $1', [createdUserId]);
    await db.query('DELETE FROM payments WHERE user_id = $1', [createdUserId]);
    await db.query('DELETE FROM shipments WHERE user_id = $1', [createdUserId]);
    await db.query('DELETE FROM users WHERE id = $1', [createdUserId]);
  }
  await db.end();
});

describe('POST /api/users/register', () => {
  it('should register a new user successfully', async () => {
    const res = await request(app)
      .post('/api/users/register')
      .send({
        firstName: 'Test',
        lastName: 'User',
        email: testEmail,
        password: 'password123',
      });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.userId).toBeDefined();
    expect(res.body.name).toBe('Test User');
    createdUserId = res.body.userId;
  });

  it('should reject duplicate email', async () => {
    const res = await request(app)
      .post('/api/users/register')
      .send({
        firstName: 'Test',
        lastName: 'Duplicate',
        email: testEmail,
        password: 'password123',
      });

    expect(res.status).toBe(409);
    expect(res.body.error).toContain('already registered');
  });

  it('should reject missing required fields', async () => {
    const res = await request(app)
      .post('/api/users/register')
      .send({ firstName: 'Only' });

    expect(res.status).toBe(400);
    expect(res.body.error).toContain('Missing');
  });
});

describe('POST /api/users/login', () => {
  it('should login with valid credentials', async () => {
    const res = await request(app)
      .post('/api/users/login')
      .send({ email: testEmail, password: 'password123' });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.userId).toBe(createdUserId);
    expect(res.body.name).toBe('Test User');
    expect(res.body.email).toBe(testEmail);
    expect(res.body.role).toBe('member');
  });

  it('should reject wrong password', async () => {
    const res = await request(app)
      .post('/api/users/login')
      .send({ email: testEmail, password: 'wrongpassword' });

    expect(res.status).toBe(401);
    expect(res.body.error).toContain('Invalid');
  });

  it('should reject non-existent email', async () => {
    const res = await request(app)
      .post('/api/users/login')
      .send({ email: 'nobody@test.com', password: 'password123' });

    expect(res.status).toBe(401);
  });

  it('should reject missing fields', async () => {
    const res = await request(app)
      .post('/api/users/login')
      .send({});

    expect(res.status).toBe(400);
  });
});

describe('GET /api/user/profile/:id', () => {
  it('should return user profile', async () => {
    const res = await request(app)
      .get(`/api/user/profile/${createdUserId}`);

    expect(res.status).toBe(200);
    expect(res.body.name).toBe('Test User');
    expect(res.body.email).toBe(testEmail);
    expect(res.body.role).toBe('member');
  });

  it('should return 404 for non-existent user', async () => {
    const res = await request(app)
      .get('/api/user/profile/99999');

    expect(res.status).toBe(404);
  });
});

describe('GET /api/user/stats/:id', () => {
  it('should return user stats', async () => {
    const res = await request(app)
      .get(`/api/user/stats/${createdUserId}`);

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('total');
    expect(res.body).toHaveProperty('delivered');
    expect(res.body).toHaveProperty('transit');
    expect(res.body).toHaveProperty('pending');
    expect(res.body).toHaveProperty('totalSpend');
  });
});
