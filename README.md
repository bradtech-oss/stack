# bradtech-oss — Brad Technology Open Source Ecosystem Monorepo

> [!NOTE]
> **License:** AGPL-v3 | **GitHub Organization:** `bradtech-oss` | **Core Engine:** Supabase On-Premise & Quatrain Core
>
> 🌐 *Version française disponible dans [`README.fr.md`](file:///Users/crapougnax/CODE/BRAD2026/bradtech-oss/README.fr.md)*

Welcome to the **Brad Technology** open-source monorepo repository (`bradtech-oss`).

This repository consolidates all application source code, domain packages, **Hey Brad** AI engine, sovereign embedded LoRaWAN network server (*ChirpStack + Basicstation WSS*), dual-system synchronization & hot-swap engine, custom CLI secret/configuration provisioning tools, and Infrastructure-as-Code (IaC) recipes for standalone On-Premise and Cloud deployments via **Terraform**, **ArgoCD**, **Helm**, and **Podman**.

---

## 🏗️ Monorepo Directory Structure

```text
bradtech-oss/
├── README.md                       # Main English presentation
├── README.fr.md                    # Main French presentation
├── HOWTO.md                        # English practical guides & usage scenarios
├── HOWTO.fr.md                     # French practical guides & usage scenarios
├── LICENSE.md                      # AGPL-v3 License
├── docs/                           # Architecture specifications & docs
│   └── architecture/
│       ├── index.md                # 🗺️ English Architecture Index & Reading Order
│       ├── index.fr.md             # 🗺️ French Architecture Index & Reading Order
│       ├── ARCHITECTURE.md         # System Architecture Overview
│       ├── ROADMAP.md              # Roadmap & Milestones (1 to 6)
│       ├── SOVEREIGN_LORAWAN_AND_DEPLOYMENT_CLI.md # Sovereign LoRaWAN & CLI Setup Tool
│       ├── DATA_SYNC_AND_HOT_SWAP.md # ETL Migration, CDC Sync & Hot-Swap Strategy
│       ├── QUATRAIN_MDM_AND_STATE_MACHINE.md # @quatrain/mdm & @quatrain/state-machine specs
│       ├── SUPABASE_ONPREM_SCHEMA.md # Supabase PostgreSQL Schema & RLS Policies
│       ├── HEY_BRAD_AI_CORE.md     # Hey Brad AI RAG Engine (Bookworm + Telemetry)
│       └── IAC_TERRAFORM_HELM_ARGOCD_PODMAN.md # IaC Recipes (Terraform, Helm, ArgoCD, Podman)
│
├── code/                           # APPLICATION CODE & DOMAIN PACKAGES
│   ├── packages/
│   │   ├── mdm/                    # @quatrain/mdm: Master Data Management (Devices & Sensors)
│   │   ├── state-machine/          # @quatrain/state-machine: Finite State Machine (Devices & Realities)
│   │   ├── sync-engine/            # @bradtech-oss/sync-engine: ETL, CDC & Hot-Swap with Brad v3
│   │   ├── db/                     # @bradtech-oss/db: Supabase PostgreSQL Schema & Migrations
│   │   └── hey-brad/               # @bradtech-oss/hey-brad: AI Assistant RAG Engine
│   └── apps/
│       ├── backoffice/             # On-Premise Backoffice UI (Astro + Quatrain CoreUX)
│       └── api/                    # Telemetry Ingestion API & On-Premise Microservices
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

👉 **[Browse Full Architecture Index & Recommended Reading Order (`docs/architecture/index.md`)](file:///Users/crapougnax/CODE/BRAD2026/bradtech-oss/docs/architecture/index.md)**

1. 📐 **[System Architecture Overview](file:///Users/crapougnax/CODE/BRAD2026/bradtech-oss/docs/architecture/ARCHITECTURE.md)**
2. 🗺️ **[Roadmap & Milestones](file:///Users/crapougnax/CODE/BRAD2026/bradtech-oss/docs/architecture/ROADMAP.md)**
3. 📦 **[`@quatrain/mdm` & `@quatrain/state-machine` Packages](file:///Users/crapougnax/CODE/BRAD2026/bradtech-oss/docs/architecture/QUATRAIN_MDM_AND_STATE_MACHINE.md)**
4. 🗄️ **[Supabase On-Premise PostgreSQL Schema & RLS](file:///Users/crapougnax/CODE/BRAD2026/bradtech-oss/docs/architecture/SUPABASE_ONPREM_SCHEMA.md)**
5. 🤖 **[Hey Brad AI Core (RAG + Bookworm)](file:///Users/crapougnax/CODE/BRAD2026/bradtech-oss/docs/architecture/HEY_BRAD_AI_CORE.md)**
6. 🔄 **[ETL Conversion, Dual-System Sync & Hot-Swap Strategy](file:///Users/crapougnax/CODE/BRAD2026/bradtech-oss/docs/architecture/DATA_SYNC_AND_HOT_SWAP.md)**
7. 🛰️ **[Sovereign LoRaWAN Server & Deployment Setup CLI](file:///Users/crapougnax/CODE/BRAD2026/bradtech-oss/docs/architecture/SOVEREIGN_LORAWAN_AND_DEPLOYMENT_CLI.md)**
8. 🐳 **[IaC: Terraform, Helm, ArgoCD & Podman](file:///Users/crapougnax/CODE/BRAD2026/bradtech-oss/docs/architecture/IAC_TERRAFORM_HELM_ARGOCD_PODMAN.md)**

---

## ⚖️ License

This project is licensed under the **GNU Affero General Public License v3.0 (AGPL-v3)**. See [`LICENSE.md`](file:///Users/crapougnax/CODE/BRAD2026/bradtech-oss/LICENSE.md).
