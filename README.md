# bradtech-oss/stack — Brad Technology Open Source Ecosystem Monorepo

> [!NOTE]
> **License:** AGPL-v3 | **GitHub Organization:** `bradtech-oss` | **Core Engine:** Supabase On-Premise & Quatrain Core
>
> 🌐 *Version française disponible dans [`README.fr.md`](README.fr.md)*

Welcome to the **Brad Technology** open-source monorepo repository (`bradtech-oss/stack`).

This repository consolidates all application source code (`apps/*`), domain packages (`packages/*`), **Hey Brad** AI engine, sovereign embedded LoRaWAN network server (*ChirpStack + Basicstation WSS*), dual-system synchronization & hot-swap engine, custom CLI secret/configuration provisioning tools, and Infrastructure-as-Code (IaC) recipes for standalone On-Premise and Cloud deployments via **Terraform**, **ArgoCD**, **Helm**, and **Podman**.

> [!TIP]
> **Quatrain Core Resolution:** The foundational `@quatrain/mdm` and `@quatrain/state-machine` packages reside in the **Quatrain Core monorepo** (`Quatrain/Core`) and are linked in development via Yarn `portal:` resolutions.

---

## 🏗️ Monorepo Directory Structure

```text
bradtech-oss/stack/
├── README.md                       # Main English presentation
├── README.fr.md                    # Main French presentation
├── HOWTO.md                        # English practical guides & usage scenarios
├── LICENSE.md                      # AGPL-v3 License
├── AGENTS.md                       # LLM Agent instructions (English)
├── AGENTS.fr.md                    # LLM Agent instructions (French)
├── docs/                           # Architecture specifications & docs
│   ├── architecture/
│   │   ├── index.md                # 🗺️ English Architecture Index & Reading Order
│   │   ├── index.fr.md             # 🗺️ French Architecture Index & Reading Order
│   │   ├── ARCHITECTURE.md         # System Architecture Overview
│   │   ├── ROADMAP.md              # Roadmap & Milestones (1 to 6)
│   │   ├── AUGUST_2026_SPRINT_ROADMAP.md # Refined August 2026 Sprints & 2-3h Sessions
│   │   ├── SIDE_ROADMAP_AND_UX.md   # Side Roadmap: Quatrain Packages & PWA Apps
│   │   ├── LOCAL_FIRST_AND_QUALITY_GATES.md # Local-First IndexedDB & SonarQube
│   │   ├── DATA_ONTOLOGY_AND_MULTIMODAL.md # Data Ontology & Multi-Modal Specs
│   │   ├── SOVEREIGN_LORAWAN_AND_DEPLOYMENT_CLI.md # Sovereign LoRaWAN & CLI Setup Tool
│   │   ├── DATA_SYNC_AND_HOT_SWAP.md # ETL Migration, CDC Sync & Hot-Swap Strategy
│   │   ├── QUATRAIN_MDM_AND_STATE_MACHINE.md # @quatrain/mdm & @quatrain/state-machine specs (Quatrain/Core)
│   │   ├── SUPABASE_ONPREM_SCHEMA.md # Supabase PostgreSQL Schema & RLS Policies
│   │   ├── HEY_BRAD_AI_CORE.md     # Hey Brad AI RAG Engine (Bookworm + Telemetry)
│   │   └── IAC_TERRAFORM_HELM_ARGOCD_PODMAN.md # IaC Recipes (Terraform, Helm, ArgoCD, Podman)
│   └── journal/                    # AI Agent Session Logs
│
├── packages/                       # DOMAIN PACKAGES (@bradtech-oss/*)
│   ├── sync-engine/                # @bradtech-oss/sync-engine: ETL, CDC & Hot-Swap with Brad v3
│   ├── db/                         # @bradtech-oss/db: Supabase PostgreSQL Schema & Migrations
│   └── hey-brad/                   # @bradtech-oss/hey-brad: AI Assistant RAG Engine
│
├── apps/                           # APPLICATIONS
│   ├── backoffice/                 # On-Premise Backoffice UI (Astro + Quatrain CoreUX)
│   ├── mobile/                     # Field Mobile PWA App (Astro + Quatrain CoreUX)
│   └── api/                        # Telemetry Ingestion API & On-Premise Microservices
│
└── infra/                          # IAC RECIPES, SOVEREIGN LORAWAN & CLI TOOLS
    ├── lorawan-server/             # Sovereign LoRaWAN Stack (ChirpStack + Basicstation WSS)
    ├── tools/                      # CLI Setup Generator, Secrets & Gateway Archive Provisioner
    ├── terraform/                  # Terraform Modules (Public Cloud & Private Cloud / Proxmox)
    ├── argocd/                     # Detailed ArgoCD Configurations (AppProjects, AppSets)
    ├── helm/                       # Kubernetes Helm Charts
    └── podman/                     # Single-Node On-Premise Deployment (Containerfile + Compose)
```

---

## 📚 Architecture Documentation Index

👉 **[Browse Full Architecture Index & Recommended Reading Order (`docs/architecture/index.md`)](docs/architecture/index.md)**

1. 📐 **[System Architecture Overview](docs/architecture/ARCHITECTURE.md)**
2. 🗺️ **[Global Roadmap & Milestones](docs/architecture/ROADMAP.md)**
3. 🗓️ **[Refined August 2026 Sprint Roadmap](docs/architecture/AUGUST_2026_SPRINT_ROADMAP.md)**
4. 🎯 **[Side Roadmap & PWA UX Ecosystem](docs/architecture/SIDE_ROADMAP_AND_UX.md)**
5. 📱 **[Local-First Architecture & SonarQube Quality Gates](docs/architecture/LOCAL_FIRST_AND_QUALITY_GATES.md)**
6. 🏛️ **[Structured Data Ontology & Multi-Modal Observations](docs/architecture/DATA_ONTOLOGY_AND_MULTIMODAL.md)**
7. 📦 **[`@quatrain/mdm` & `@quatrain/state-machine` Packages](docs/architecture/QUATRAIN_MDM_AND_STATE_MACHINE.md)**
8. 🗄️ **[Supabase On-Premise PostgreSQL Schema & RLS](docs/architecture/SUPABASE_ONPREM_SCHEMA.md)**
9. 🤖 **[Hey Brad AI Core (Modaka Engine & OKF)](docs/architecture/HEY_BRAD_AI_CORE.md)**
10. 🔄 **[ETL Conversion, Dual-System Sync & Hot-Swap Strategy](docs/architecture/DATA_SYNC_AND_HOT_SWAP.md)**
11. 🛰️ **[Sovereign LoRaWAN Server & Deployment Setup CLI](docs/architecture/SOVEREIGN_LORAWAN_AND_DEPLOYMENT_CLI.md)**
12. 🐳 **[IaC: Terraform, Helm, ArgoCD & Podman](docs/architecture/IAC_TERRAFORM_HELM_ARGOCD_PODMAN.md)**

---

## ⚖️ License

This project is licensed under the **GNU Affero General Public License v3.0 (AGPL-v3)**. See [`LICENSE.md`](LICENSE.md).
