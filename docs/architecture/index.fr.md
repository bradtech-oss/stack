# Index de la Documentation d'Architecture — bradtech-oss

> 🌐 *English version available in [`index.md`](file:///Users/crapougnax/CODE/BRAD2026/bradtech-oss/docs/architecture/index.md)*

Ce document définit l'ordre de lecture recommandé pour appréhender l'ensemble de l'architecture, du modèle de données, de l'ontologie multi-modale, du cœur IA et des infrastructures du monorepo **`bradtech-oss`**.

---

## 📚 Ordre de Lecture Recommandé

```mermaid
graph TD
    A[1. ARCHITECTURE.md - Vision Globale] --> B[2. ROADMAP.md - Jalons Principaux]
    B --> C[3. AUGUST_2026_SPRINT_ROADMAP.md - Sprints d'Août 2026 & Sessions 2-3h]
    C --> D[4. SIDE_ROADMAP_AND_UX.md - Side Roadmap & UX PWA]
    D --> E[5. LOCAL_FIRST_AND_QUALITY_GATES.md - Local-First & Quality Gates SonarQube]
    E --> F[6. DATA_ONTOLOGY_AND_MULTIMODAL.md - Ontologie des Données & Multi-Modal]
    F --> G[7. QUATRAIN_MDM_AND_STATE_MACHINE.md - Paquets Fondations]
    G --> H[8. SUPABASE_ONPREM_SCHEMA.md - Base de Données PostgreSQL]
    H --> I[9. HEY_BRAD_AI_CORE.md - Cœur IA Modaka & OKF]
    I --> J[10. DATA_SYNC_AND_HOT_SWAP.md - Sync ETL & Remplacement à Chaud]
    J --> K[11. SOVEREIGN_LORAWAN_AND_DEPLOYMENT_CLI.md - LoRaWAN & Provisioning CLI]
    K --> L[12. IAC_TERRAFORM_HELM_ARGOCD_PODMAN.md - Recettes IaC Cloud & Edge]
```

---

## 📋 Table des Matières Détaillée

### 1. Vision & Cadre Général
1. 📐 **[Vue d'Ensemble & Principes Directeurs](file:///Users/crapougnax/CODE/BRAD2026/bradtech-oss/docs/architecture/ARCHITECTURE.fr.md)** (`ARCHITECTURE.fr.md`)
2. 🗺️ **[Feuille de Route Globale & Jalons](file:///Users/crapougnax/CODE/BRAD2026/bradtech-oss/docs/architecture/ROADMAP.fr.md)** (`ROADMAP.fr.md`)
3. 🗓️ **[Planning Détaillé d'Août 2026 (Sprints & Sessions de 2-3h)](file:///Users/crapougnax/CODE/BRAD2026/bradtech-oss/docs/architecture/AUGUST_2026_SPRINT_ROADMAP.fr.md)** (`AUGUST_2026_SPRINT_ROADMAP.fr.md`)
4. 🎯 **[Side Roadmap : Paquets Quatrain, Curation Bookworm, Hey Brad & UX PWA](file:///Users/crapougnax/CODE/BRAD2026/bradtech-oss/docs/architecture/SIDE_ROADMAP_AND_UX.fr.md)** (`SIDE_ROADMAP_AND_UX.fr.md`)

### 2. Architecture Local-First, Quality Gates & Ontologie des Données
5. 📱 **[Architecture Local-First, Quality Gates SonarQube & Outillage CI/CD](file:///Users/crapougnax/CODE/BRAD2026/bradtech-oss/docs/architecture/LOCAL_FIRST_AND_QUALITY_GATES.fr.md)** (`LOCAL_FIRST_AND_QUALITY_GATES.fr.md`)
6. 🏛️ **[Ontologie Structurée des Données & Observations Multi-Modales](file:///Users/crapougnax/CODE/BRAD2026/bradtech-oss/docs/architecture/DATA_ONTOLOGY_AND_MULTIMODAL.fr.md)** (`DATA_ONTOLOGY_AND_MULTIMODAL.fr.md`)
7. 📦 **[Spécifications `@quatrain/mdm` & `@quatrain/state-machine`](file:///Users/crapougnax/CODE/BRAD2026/bradtech-oss/docs/architecture/QUATRAIN_MDM_AND_STATE_MACHINE.fr.md)** (`QUATRAIN_MDM_AND_STATE_MACHINE.fr.md`)

### 3. Données, Synchronisation & Intelligence Artificielle
8. 🗄️ **[Schéma Supabase On-Premise PostgreSQL & RLS](file:///Users/crapougnax/CODE/BRAD2026/bradtech-oss/docs/architecture/SUPABASE_ONPREM_SCHEMA.fr.md)** (`SUPABASE_ONPREM_SCHEMA.fr.md`)
9. 🤖 **[Cœur IA "Hey Brad" (Moteur Modaka & Repositories OKF)](file:///Users/crapougnax/CODE/BRAD2026/bradtech-oss/docs/architecture/HEY_BRAD_AI_CORE.fr.md)** (`HEY_BRAD_AI_CORE.fr.md`)
10. 🔄 **[Moulinettes ETL, Synchronisation Bi-Système & Remplacement à Chaud (*Hot Swap*)](file:///Users/crapougnax/CODE/BRAD2026/bradtech-oss/docs/architecture/DATA_SYNC_AND_HOT_SWAP.fr.md)** (`DATA_SYNC_AND_HOT_SWAP.fr.md`)

### 4. Infrastructures, Souveraineté & Déploiement Cloud/Edge
11. 🛰️ **[Infrastructure LoRaWAN Souveraine & Outil CLI de Provisioning](file:///Users/crapougnax/CODE/BRAD2026/bradtech-oss/docs/architecture/SOVEREIGN_LORAWAN_AND_DEPLOYMENT_CLI.fr.md)** (`SOVEREIGN_LORAWAN_AND_DEPLOYMENT_CLI.fr.md`)
12. 🐳 **[Recettes IaC : Terraform, Helm, ArgoCD & Podman](file:///Users/crapougnax/CODE/BRAD2026/bradtech-oss/docs/architecture/IAC_TERRAFORM_HELM_ARGOCD_PODMAN.fr.md)** (`IAC_TERRAFORM_HELM_ARGOCD_PODMAN.fr.md`)
