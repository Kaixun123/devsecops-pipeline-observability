const express = require('express');
const promClient = require('prom-client');

const app = express();
const PORT = 9091;
const register = new promClient.Registry();

// Metrics
const pipelineRuns = new promClient.Counter({
  name: 'pipeline_runs_total',
  help: 'Total pipeline runs',
  labelNames: ['status', 'branch'],
  registers: [register]
});

const pipelineDuration = new promClient.Histogram({
  name: 'pipeline_duration_seconds',
  help: 'Pipeline duration',
  labelNames: ['status'],
  buckets: [30, 60, 120, 300, 600],
  registers: [register]
});

const securityVulns = new promClient.Gauge({
  name: 'security_vulnerabilities',
  help: 'Security vulnerabilities',
  labelNames: ['severity'],
  registers: [register]
});

// Generate mock data
function generateMockData() {
  const statuses = ['success', 'failure'];
  const status = statuses[Math.floor(Math.random() * 2)];
  
  pipelineRuns.inc({ status, branch: 'main' });
  pipelineDuration.observe({ status }, 60 + Math.random() * 300);
  
  securityVulns.set({ severity: 'critical' }, Math.floor(Math.random() * 3));
  securityVulns.set({ severity: 'high' }, Math.floor(Math.random() * 8));
}

// Generate data every minute
setInterval(generateMockData, 60000);
generateMockData();

app.get('/metrics', async (req, res) => {
  res.set('Content-Type', register.contentType);
  res.end(await register.metrics());
});

app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.listen(PORT, () => {
  console.log(`Pipeline Exporter on port ${PORT}`);
});