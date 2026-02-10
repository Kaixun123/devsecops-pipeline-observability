#!/bin/bash

echo "Generating traffic to http://localhost:3000"
echo "Press Ctrl+C to stop"

while true; do
  curl -s http://localhost:3000/api/users > /dev/null
  curl -s http://localhost:3000/health > /dev/null
  sleep 1
  echo "."
done