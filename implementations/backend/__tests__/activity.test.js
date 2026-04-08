const request = require('supertest');
const app = require('../server');
const db = require('../db');

const testEmail = `acttest_${Date.now()}@test.com`;
let userId;

beforeAll(async () => {
  // Create a test user
  const res = await request(app)
    .post('/api/users/register')
    .send({
      firstName: 'Activity',
      lastName: 'Tester',
      email: testEmail,
      password: 'password123',
    });
  userId = res.body.userId;

  // Insert a test activity
  await db.query(
    `INSERT INTO activity_log (user_id, type, title, subtitle) VALUES ($1, $2, $3, $4)`,
    [userId, 'created', 'Test activity', 'Test subtitle']
  );
});

afterAll(async () => {
  if (userId) {
    await db.query('DELETE FROM activity_log WHERE user_id = $1', [userId]);
    await db.query('DELETE FROM users WHERE id = $1', [userId]);
  }
  await db.end();
});

describe('GET /api/activity/:userId', () => {
  it('should return user activity log', async () => {
    const res = await request(app)
      .get(`/api/activity/${userId}`);

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeGreaterThanOrEqual(1);
    expect(res.body[0]).toHaveProperty('type');
    expect(res.body[0]).toHaveProperty('title');
    expect(res.body[0]).toHaveProperty('subtitle');
  });

  it('should return empty array for user with no activity', async () => {
    const res = await request(app)
      .get('/api/activity/99999');

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBe(0);
  });
});
