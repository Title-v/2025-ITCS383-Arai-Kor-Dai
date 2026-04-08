const request = require('supertest');
const app = require('../server');
const db = require('../db');

const testEmail = `notiftest_${Date.now()}@test.com`;
let userId;

beforeAll(async () => {
  // Create a test user
  const res = await request(app)
    .post('/api/users/register')
    .send({
      firstName: 'Notif',
      lastName: 'Tester',
      email: testEmail,
      password: 'password123',
    });
  userId = res.body.userId;

  // Insert a test notification
  await db.query(
    `INSERT INTO notifications (user_id, message, type, is_read) VALUES ($1, $2, $3, $4)`,
    [userId, 'Test notification message', 'info', 0]
  );
});

afterAll(async () => {
  if (userId) {
    await db.query('DELETE FROM notifications WHERE user_id = $1', [userId]);
    await db.query('DELETE FROM users WHERE id = $1', [userId]);
  }
  await db.end();
});

describe('GET /api/notifications/:userId', () => {
  it('should return user notifications', async () => {
    const res = await request(app)
      .get(`/api/notifications/${userId}`);

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeGreaterThanOrEqual(1);
    expect(res.body[0]).toHaveProperty('message');
    expect(res.body[0]).toHaveProperty('type');
    expect(res.body[0]).toHaveProperty('is_read');
  });
});

describe('PATCH /api/notifications/:userId/read-all', () => {
  it('should mark all notifications as read', async () => {
    const res = await request(app)
      .patch(`/api/notifications/${userId}/read-all`);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);

    // Verify they are marked as read
    const check = await request(app)
      .get(`/api/notifications/${userId}`);
    const unread = check.body.filter(n => n.is_read === 0);
    expect(unread.length).toBe(0);
  });
});
