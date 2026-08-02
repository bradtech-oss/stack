#!/usr/bin/env bash
set -e

echo "🧹 Destroying Podman Test Containers (PostgreSQL + Adminer)..."
podman rm -f bradtech-postgres bradtech-adminer 2>/dev/null || true
podman network rm bradtech-net 2>/dev/null || true
echo "✅ Podman test containers successfully destroyed!"
