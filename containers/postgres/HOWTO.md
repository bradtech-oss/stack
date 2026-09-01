# HOWTO: Managing the PostgreSQL 16 MDM Database Container

Step-by-step guide for local development, data inspection, and container lifecycle operations.

---

## 1. Starting the Containers

Run the automated launcher from the repository root:
```bash
./containers/podman-up.sh
```

This will:
1. Build the multi-arch `bradtech-postgres:0.5.0` container image.
2. Create the `bradtech-net` bridge network.
3. Start `bradtech-postgres` and `bradtech-adminer`.
4. Wait for PostgreSQL readiness via `pg_isready`.
5. Display connection parameters and test query results.

---

## 2. Inspecting the Database

### Via Web Interface (Adminer)
1. Open `http://localhost:8080` in your web browser.
2. Select **System**: `PostgreSQL`.
3. Fill in:
   - **Server**: `bradtech-postgres`
   - **Username**: `brad`
   - **Password**: `bradpass`
   - **Database**: `bradtech_db`
4. Inspect tables `vendors`, `device_types`, and `devices`.

### Via Command Line (psql inside container)
```bash
podman exec -it bradtech-postgres psql -U brad -d bradtech_db
```

Sample query:
```sql
SELECT dt.name AS model, d.serial_number, d.lifecycle_state, d.network->'powerSource' AS power_source
FROM devices d
JOIN device_types dt ON d.device_type_id = dt.id;
```

---

## 3. Running Automated Database Tests

Execute the TypeScript test script against the running container:
```bash
DATABASE_URL=postgres://brad:bradpass@localhost:54322/bradtech_db bun run test:db
```

---

## 4. Stopping and Cleaning Up

```bash
# Stop containers and preserve data volume
./containers/podman-down.sh

# To also delete the persistent volume and start fresh:
podman volume rm bradtech-pgdata
```
