const express = require('express');
const promClient = require('prom-client');

const app = express();
const PORT = process.env.PORT || 3000;

// Create Prometheus Registry
const register = new promClient.Registry();
promClient.collectDefaultMetrics({ register, prefix: 'app_' });

// Custom Metrics
const httpRequestsTotal = new promClient.Counter({
  name: 'http_requests_total',
  help: 'Total HTTP requests',
  labelNames: ['method', 'route', 'status_code'],
  registers: [register]
});

const httpRequestDuration = new promClient.Histogram({
  name: 'http_request_duration_seconds',
  help: 'HTTP request duration',
  labelNames: ['method', 'route', 'status_code'],
  buckets: [0.001, 0.005, 0.01, 0.05, 0.1, 0.5, 1, 2, 5],
  registers: [register]
});

// Middleware
app.use(express.json());

app.use((req, res, next) => {
  const start = Date.now();
  res.on('finish', () => {
    const duration = (Date.now() - start) / 1000;
    const route = req.route?.path || req.path;
    
    httpRequestsTotal.inc({
      method: req.method,
      route: route,
      status_code: res.statusCode
    });
    
    httpRequestDuration.observe({
      method: req.method,
      route: route,
      status_code: res.statusCode
    }, duration);
  });
  next();
});

// Routes
app.get('/', (req, res) => {
  res.json({
    message: 'DevSecOps Pipeline Observatory',
    version: '1.0.0',
    status: 'healthy'
  });
});

app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

app.get('/api/users', async (req, res) => {
  // Simulate DB query
  await new Promise(resolve => setTimeout(resolve, Math.random() * 100));
  res.json({
    users: [
      { id: 1, name: 'Alice', role: 'admin' },
      { id: 2, name: 'Bob', role: 'user' }
    ]
  });
});

app.post('/api/orders', async (req, res) => {
  const { items, total } = req.body;
  if (!items || !total) {
    return res.status(400).json({ error: 'Missing fields' });
  }
  await new Promise(resolve => setTimeout(resolve, Math.random() * 200));
  res.status(201).json({
    orderId: Math.floor(Math.random() * 10000),
    status: 'confirmed',
    total
  });
});

// Metrics endpoint
app.get('/metrics', async (req, res) => {
  res.set('Content-Type', register.contentType);
  res.end(await register.metrics());
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Metrics: http://localhost:${PORT}/metrics`);
});

module.exports = app;