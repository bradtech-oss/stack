# @bradtech/datapoints

[![License: AGPL-3.0](https://img.shields.io/badge/License-AGPL--3.0-blue.svg)](https://www.gnu.org/licenses/agpl-3.0.en.html)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.4+-blue.svg)](https://www.typescriptlang.org/)
[![Quatrain Framework](https://img.shields.io/badge/Quatrain-1.2+-emerald.svg)](https://quatrain.dev)

> **Quatrain-powered DataPoint domain model and repository for TimescaleDB / PostgreSQL timeseries ingestion and querying.**

Part of the sovereign [Brad Open Source Agronomic Stack (`bradtech-oss`)](https://github.com/bradtech-oss/stack).

---

## 🌟 Overview

`@bradtech/datapoints` provides the canonical domain entity and high-level repository for time-indexed telemetry, environmental metrics, and derived agronomic indicators in the Brad and Quatrain ecosystems.

* **Domain Model (`DataPoint`)**: Extends Quatrain `PersistedBaseObject`, defining strongly-typed schemas, confidence scoring, and JSONB contextual metadata.
* **Repository & Mini API (`DataPointRepository`)**: Extends `BaseRepository<DataPointType>`, using the fluent `@quatrain/backend` `Query` builder for filtering, time-range scanning, and point-in-time lookups.
* **Backend Agnostic**: Connects seamlessly with `@quatrain/backend-postgres` (TimescaleDB hypertables) or any standard Quatrain backend adapter.

---

## 📦 Installation

```bash
bun add @bradtech/datapoints @quatrain/core @quatrain/backend @quatrain/backend-postgres
# or
npm install @bradtech/datapoints @quatrain/core @quatrain/backend @quatrain/backend-postgres
```

---

## 🚀 Quick Start

```typescript
import { Backend } from '@quatrain/backend'
import { PostgresAdapter } from '@quatrain/backend-postgres'
import { DataPointRepository, DataPoint } from '@bradtech/datapoints'

// 1. Initialize PostgreSQL / TimescaleDB Adapter
const postgres = new PostgresAdapter({
   config: {
      host: 'postgres.timeseries.svc.cluster.local',
      port: 5432,
      database: 'datapoints',
      user: 'brad_timeseries',
      password: process.env.DATAPOINTS_DB_PASSWORD,
   },
})
Backend.addBackend(postgres, '@default', true)

// 2. Instantiate Repository
const repo = new DataPointRepository(postgres)

// 3. Batch Ingest Telemetry
await repo.insertMany([
   {
      device: '8c1f645490100016',
      plot: 'plots/parcelle-nord',
      metric: 'okf:agronomy/soil/vwc_calibrated',
      value: 28.5,
      unit: '%',
      kind: 'computed',
      confidence: 0.98,
      timestamp: new Date().toISOString(),
   },
])

// 4. Query Timeseries Timeline
const timeline = await repo.getTimeline({
   plot: 'plots/parcelle-nord',
   metric: 'okf:agronomy/soil/vwc_calibrated',
   from: '2026-09-01T00:00:00Z',
   to: '2026-09-02T23:59:59Z',
   order: 'desc',
   limit: 50,
})
```

---

## 📖 Documentation

* 👉 [HOWTO Guide (Common Use Cases)](./HOWTO.md)

---

## 📄 License

AGPL-3.0-or-later © 2026 Olivier Lépine & Brad Technology.
