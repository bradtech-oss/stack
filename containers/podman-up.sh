#!/usr/bin/env bash
set -e

echo "🚀 Launching Podman Containers: PostgreSQL 16 + Adminer Table Visualizer..."

# Create a podman network if not exists
podman network create bradtech-net 2>/dev/null || true

# Remove old containers if running
podman rm -f bradtech-postgres bradtech-adminer 2>/dev/null || true

# Launch PostgreSQL 16
echo "🐘 Starting PostgreSQL container (port 5432)..."
podman run -d \
  --name bradtech-postgres \
  --network bradtech-net \
  -p 5432:5432 \
  -e POSTGRES_DB=bradtech_db \
  -e POSTGRES_USER=brad \
  -e POSTGRES_PASSWORD=bradpass \
  postgres:16-alpine

# Launch Adminer (Web DB Inspection Tool with default server set)
echo "🌐 Starting Adminer Web Visualizer container (port 8080)..."
podman run -d \
  --name bradtech-adminer \
  --network bradtech-net \
  -p 8080:8080 \
  -e ADMINER_DEFAULT_SERVER=bradtech-postgres \
  adminer:latest

# Wait for Postgres readiness
echo "⏳ Waiting for PostgreSQL readiness..."
for i in {1..15}; do
  if podman exec bradtech-postgres pg_isready -U brad -d bradtech_db >/dev/null 2>&1; then
    echo "✅ PostgreSQL is ready!"
    break
  fi
  sleep 1
done

# Apply schema and seed data
echo "📦 Applying schema.sql and seed.sql..."
podman exec -i bradtech-postgres psql -U brad -d bradtech_db < packages/db/src/schema.sql
podman exec -i bradtech-postgres psql -U brad -d bradtech_db < packages/db/src/seed.sql

echo "=========================================================="
echo "🎉 Podman Containers Successfully Deployed!"
echo "🐘 PostgreSQL Connection : postgres://brad:bradpass@localhost:5432/bradtech_db"
echo "🌐 Adminer DB Visualizer : http://localhost:8080"
echo "   -> System   : PostgreSQL"
echo "   -> Server   : bradtech-postgres"
echo "   -> User     : brad"
echo "   -> Password : bradpass"
echo "   -> Database : bradtech_db"
echo "=========================================================="
