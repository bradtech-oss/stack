🏠 **[README](../../README.md)** | 🗺️ **[Architecture Index](index.md)** | ⬅️ **[Previous: System Architecture](ARCHITECTURE.md)** | ➡️ **[Next: August 2026 Sprint Roadmap](AUGUST_2026_SPRINT_ROADMAP.md)**
---

# Development Roadmap & Milestones — bradtech-oss

> 🌐 *Version française disponible dans [`ROADMAP.fr.md`](ROADMAP.fr.md)*

## 📅 Global Roadmap Summary

| Milestone | Title | Est. Duration | Key Deliverables |
| :--- | :--- | :---: | :--- |
| **Milestone 1** | Monorepo Foundation & Tooling | 2 Days | `` & `infra/` layout, Yarn Berry/TurboRepo, `README.md`, `HOWTO.md`, `LICENSE.md` |
| **Milestone 2** | `@quatrain/mdm` & `@quatrain/state-machine` | 4 Days | Core MDM Device model & Universal FSM engine for devices and physical realities |
| **Milestone 3** | Supabase On-Premise DB & RLS | 4 Days | 100% UUID v4 (`uid`) PostgreSQL schema, `pgvector` index, multi-tenant RLS policies |
| **Milestone 4** | On-Premise Applications (Backoffice & API) | 5 Days | Astro + CoreUX Backoffice, high-speed telemetry ingestion microservice API |
| **Milestone 5** | "Hey Brad" AI Core (RAG + Bookworm) | 4 Days | Modaka SaaS RAG engine, hybrid natural language queries (Domain Knowledge + Telemetry) |
| **Milestone 6** | IaC Recipes (Podman, Helm & ArgoCD) | 4 Days | Multi-stage non-root Podman containers, Helm Charts, and ArgoCD ApplicationSets |

---

## 🎯 Detailed Milestone Breakdowns

### Milestone 1: Monorepo Foundation
- Initialize `` and `infra/` directory hierarchies.
- Create root tooling config files: `package.json`, `turbo.json`, `.yarnrc.yml`, `tsconfig.json`.
- Core documentation setup.

### Milestone 2: Quatrain Foundation Packages
- **`@quatrain/mdm`**: Unified data model for Devices, Components, Sensors.
- **`@quatrain/state-machine`**: Reactive, strongly typed state machines.

### Milestone 3: Supabase On-Premise PostgreSQL
- Versioned SQL migrations under `packages/db/migrations/`.
- Enable `pgvector` for semantic document indexing.
- Enforce Row-Level Security (RLS) across all public tables.

### Milestone 4: Backoffice UI & Ingestion API Refactoring
- Astro web app utilizing Quatrain CoreUX components.
- Lightweight Bun/TypeScript telemetry ingestion microservice.

### Milestone 5: Hey Brad AI Core
- Semantic indexing of Bookworm agronomic manuals.
- LLM Tool-calling for sensor telemetry querying.

### Milestone 6: IaC & GitOps Deployment
- Multi-arch, non-root Podman `Containerfile` definitions (`USER bun`).
- Helm Charts and ArgoCD ApplicationSet for continuous deployment.

---
🏠 **[README](../../README.md)** | 🗺️ **[Architecture Index](index.md)** | ⬅️ **[Previous: System Architecture](ARCHITECTURE.md)** | ➡️ **[Next: August 2026 Sprint Roadmap](AUGUST_2026_SPRINT_ROADMAP.md)**
