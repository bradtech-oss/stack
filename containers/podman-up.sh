#!/usr/bin/env bash
set -e

DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$DIR"

echo "=========================================================="
echo "🚀 Building & Launching BradTech PostgreSQL 16 MDM Database"
echo "📦 Image Version: bradtech-postgres:0.5.0"
echo "=========================================================="

# Source .env if present
if [ -f .env ]; then
  echo "📄 Sourcing environment variables from .env..."
  set -a
  source .env
  set +a
fi

POSTGRES_DB="${POSTGRES_DB:-bradtech_db}"
POSTGRES_USER="${POSTGRES_USER:-brad}"
POSTGRES_PASSWORD="${POSTGRES_PASSWORD:-bradpass}"
POSTGRES_PORT="${POSTGRES_PORT:-54322}"
ADMINER_PORT="${ADMINER_PORT:-8080}"

# 1. Build custom PostgreSQL container with embedded entrypoint scripts
echo "🔨 Building bradtech-postgres:0.5.0..."
podman build -t bradtech-postgres:0.5.0 -f containers/postgres/Containerfile .

# 2. Create podman network if not exists
podman network create bradtech-net 2>/dev/null || true

# 3. Clean up existing containers
echo "🧹 Stopping and removing previous containers..."
podman rm -f bradtech-postgres bradtech-adminer 2>/dev/null || true

# 4. Launch PostgreSQL 16 on host port (to avoid macOS local 5432 conflict)
echo "🐘 Starting PostgreSQL container (host:${POSTGRES_PORT} -> container:5432)..."
podman run -d \
  --name bradtech-postgres \
  --network bradtech-net \
  -p "${POSTGRES_PORT}:5432" \
  -e POSTGRES_DB="${POSTGRES_DB}" \
  -e POSTGRES_USER="${POSTGRES_USER}" \
  -e POSTGRES_PASSWORD="${POSTGRES_PASSWORD}" \
  bradtech-postgres:0.5.0

# 5. Launch Adminer Web Visualizer
echo "🌐 Starting Adminer Web Visualizer (port ${ADMINER_PORT})..."
podman run -d \
  --name bradtech-adminer \
  --network bradtech-net \
  -p "${ADMINER_PORT}:8080" \
  -e ADMINER_DEFAULT_SERVER=bradtech-postgres \
  docker.io/library/adminer:latest

# 6. Wait for PostgreSQL readiness
echo "⏳ Waiting for PostgreSQL initialization and readiness..."
READY=false
for i in {1..30}; do
  if podman exec bradtech-postgres pg_isready -U "${POSTGRES_USER}" -d "${POSTGRES_DB}" >/dev/null 2>&1; then
    READY=true
    echo "✅ PostgreSQL is ready and initialized!"
    break
  fi
  sleep 1
done

if [ "$READY" = false ]; then
  echo "❌ Error: PostgreSQL failed to become ready within 30s"
  podman logs bradtech-postgres
  exit 1
fi

# 7. Verification of auto-seeded data
echo ""
echo "🔍 Verifying auto-initialized database tables & seed records:"
podman exec bradtech-postgres psql -U "${POSTGRES_USER}" -d "${POSTGRES_DB}" -c "
SELECT 
  (SELECT count(*) FROM vendors) AS vendors_count,
  (SELECT count(*) FROM device_types) AS device_types_count,
  (SELECT count(*) FROM devices) AS devices_count;
"

echo "=========================================================="
echo "🎉 PostgreSQL 16 Container Successfully Deployed & Initialized!"
echo "🐘 Connection URI : postgres://${POSTGRES_USER}:${POSTGRES_PASSWORD}@localhost:${POSTGRES_PORT}/${POSTGRES_DB}"
echo "🌐 Adminer UI      : http://localhost:${ADMINER_PORT}"
echo "   -> System      : PostgreSQL"
echo "   -> Server      : bradtech-postgres"
echo "   -> User / Pass : ${POSTGRES_USER} / ${POSTGRES_PASSWORD}"
echo "   -> Database    : ${POSTGRES_DB}"
echo "=========================================================="
