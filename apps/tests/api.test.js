const request = require('supertest');
const app = require('../src/index');

describe('API Tests', () => {
  test('GET / returns app info', async () => {
    const res = await request(app).get('/');
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('message');
  });

  test('GET /health returns ok', async () => {
    const res = await request(app).get('/health');
    expect(res.statusCode).toBe(200);
    expect(res.body.status).toBe('ok');
  });

  test('GET /api/users returns users', async () => {
    const res = await request(app).get('/api/users');
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body.users)).toBe(true);
  });

  test('POST /api/orders creates order', async () => {
    const res = await request(app)
      .post('/api/orders')
      .send({ items: ['item1'], total: 99.99 });
    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty('orderId');
  });

  test('GET /metrics returns Prometheus metrics', async () => {
    const res = await request(app).get('/metrics');
    expect(res.statusCode).toBe(200);
    expect(res.text).toContain('http_requests_total');
  });
});