# PostgreSQL 16 MDM Database Container

> Platform: Podman / Docker OCI Multi-Arch Container (`linux/amd64`, `linux/arm64`)  
> Base Image: `postgres:16-alpine`  
> License: AGPL-3.0-or-later

---

## 🎯 Overview

This container provides a standardized, self-contained **PostgreSQL 16** database pre-loaded with the **Brad Technology Master Data Management (MDM)** schema and initial seed data for hardware vendors, catalog device types, and physical inventory units.

Database tables and indexes are automatically initialized on the first container launch via `/docker-entrypoint-initdb.d/` (`01-schema.sql` and `02-seed.sql`).

---

## 🚀 Quick Start

### Build Image
```bash
podman build -t bradtech-postgres:0.5.0 -f containers/postgres/Containerfile .
```

### Launch Container
```bash
# Using helper script
./containers/podman-up.sh

# Or using Podman Compose
podman compose -f containers/postgres/compose.yaml up -d
```

---

## ⚙️ Configuration & Environment Variables

| Variable | Default Value | Description |
| :--- | :--- | :--- |
| `POSTGRES_DB` | `bradtech_db` | Primary database name |
| `POSTGRES_USER` | `brad` | Database superuser username |
| `POSTGRES_PASSWORD` | `bradpass` | Database superuser password |
| `PGPORT` | `5432` | Internal container listen port |

---

## 🔗 Endpoints & Connectivity

- **PostgreSQL Connection String (Host)**: `postgres://brad:bradpass@localhost:54322/bradtech_db`
- **PostgreSQL Internal Port**: `5432` (mapped to host port `54322` to prevent conflicts with local macOS PostgreSQL daemons)
- **Adminer Web Visualizer**: `http://localhost:8080` (Server: `bradtech-postgres`)
