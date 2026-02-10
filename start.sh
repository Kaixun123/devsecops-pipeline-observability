#!/bin/bash

echo "======================================"
echo "DevSecOps Pipeline Observatory"
echo "======================================"

# Check Docker
if ! command -v docker &> /dev/null; then
    echo "❌ Docker not found"
    exit 1
fi

echo "✅ Docker found"

# Install app dependencies
echo "📦 Installing dependencies..."
cd apps && npm install && cd ..

# Install exporter dependencies
cd monitoring/exporters/pipeline-exporter && npm install && cd ../../..

# Start services
echo "🚀 Starting services..."
docker-compose up -d

echo ""
echo "⏳ Waiting for services..."
sleep 10

echo ""
echo "✅ Services running!"
echo ""
echo "Access:"
echo "  Grafana:    http://localhost:3001 (admin/admin)"
echo "  Prometheus: http://localhost:9090"
echo "  Apps:        http://localhost:3000"
echo ""
echo "Test:"
echo "  curl http://localhost:3000/metrics"