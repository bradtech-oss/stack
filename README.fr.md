# bradtech-oss — Monorepo Écosystème Open Source Brad Technology

> [!NOTE]
> **Licence :** AGPL-v3 | **Organisation GitHub :** `bradtech-oss` | **Moteur :** Supabase On-Premise & Quatrain Core
>
> 🌐 *English version available in [`README.md`](file:///Users/crapougnax/CODE/BRAD2026/bradtech-oss/README.md)*

Bienvenue dans le monorepo des briques Open Source de **Brad Technology** (`bradtech-oss`).

Ce dépôt regroupe l'ensemble du code applicatif, des paquets du domaine, du cœur IA **Hey Brad**, du serveur LoRaWAN souverain embarqué (*ChirpStack + Basicstation WSS*), du moteur de synchronisation bi-système & remplacement à chaud (*Hot Swap*), des outils CLI de génération de configurations/clés secrètes sur-mesure, et des recettes d'Infrastructure-as-Code (IaC) pour des déploiements autonomes On-Premise et Cloud via **Terraform**, **ArgoCD**, **Helm** et **Podman**.

---

## 🏗️ Structure du Monorepo

```text
bradtech-oss/
├── README.md                       # English main presentation
├── README.fr.md                    # French main presentation
├── HOWTO.md                        # English practical guides
├── HOWTO.fr.md                     # French practical guides
├── LICENSE.md                      # AGPL-v3 License
├── docs/                           # Documentation d'architecture
│   └── architecture/
│       ├── index.md                # 🗺️ English Architecture Index
│       ├── index.fr.md             # 🗺️ French Architecture Index
│       ├── ARCHITECTURE.md         # Vue d'ensemble de l'architecture système
│       ├── ROADMAP.md              # Feuille de route & Jalons (Milestones)
│       ├── SOVEREIGN_LORAWAN_AND_DEPLOYMENT_CLI.md # LoRaWAN Souverain & Outil CLI
│       ├── DATA_SYNC_AND_HOT_SWAP.md # Moulinettes ETL, Sync Bi-Système & Hot Swap
│       ├── QUATRAIN_MDM_AND_STATE_MACHINE.md # Spécifications @quatrain/mdm & @quatrain/state-machine
│       ├── SUPABASE_ONPREM_SCHEMA.md # Modèle de base de données PostgreSQL & RLS
│       ├── HEY_BRAD_AI_CORE.md     # Cœur IA RAG (Bookworm + Télémétrie)
│       └── IAC_TERRAFORM_HELM_ARGOCD_PODMAN.md # Recettes IaC Terraform, Helm, ArgoCD & Podman
│
├── code/                           # CODE APPLICATIF & PAQUETS METIER
│   ├── packages/
│   │   ├── mdm/                    # @quatrain/mdm : Master Data Management (Devices & Capteurs)
│   │   ├── state-machine/          # @quatrain/state-machine : Automate d'états (Devices & Réalités)
│   │   ├── sync-engine/            # @bradtech-oss/sync-engine : ETL, CDC & Hot Swap avec Brad v3
│   │   ├── db/                     # @bradtech-oss/db : Schéma Supabase PostgreSQL & Migrations
│   │   └── hey-brad/               # @bradtech-oss/hey-brad : Assistant IA RAG
│   └── apps/
│       ├── backoffice/             # Backoffice On-Premise (Astro + Quatrain CoreUX)
│       └── api/                    # API Ingestion & Microservices On-Premise
│
└── infra/                          # RECETTES IAC, LORAWAN SOUVERAIN & OUTILS CLI
    ├── lorawan-server/             # Serveur LoRaWAN Souverain (ChirpStack + Basicstation WSS)
    ├── tools/                      # CLI de Génération de Déploiement, Clés & Archives Passerelles
    ├── terraform/                  # Recettes Terraform (Cloud Public & Privé / Proxmox)
    ├── argocd/                     # Configurations ArgoCD détaillées (Projects, AppSets)
    ├── helm/                       # Chartes Helm Kubernetes
    └── podman/                     # Déploiement Single-Node (Containerfile + Podman Compose)
```

---

## 📚 Index de la Documentation d'Architecture

👉 **[Consulter l'Index Général & l'Ordre de Lecture (`docs/architecture/index.fr.md`)](file:///Users/crapougnax/CODE/BRAD2026/bradtech-oss/docs/architecture/index.fr.md)**
