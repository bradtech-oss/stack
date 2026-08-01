🏠 **[README](../../README.fr.md)** | 🗺️ **[Index Architecture](index.fr.md)** | ⬅️ **[Précédent : Architecture Système](ARCHITECTURE.fr.md)** | ➡️ **[Suivant : Planning Août 2026](AUGUST_2026_SPRINT_ROADMAP.fr.md)**
---

# Roadmap & Jalons de Développement — bradtech-oss

> 🌐 *English version available in [`ROADMAP.md`](ROADMAP.md)*

## 📅 Feuille de Route Globale

| Jalon | Intitulé | Durée Estimée | Livrables Clés |
| :--- | :--- | :---: | :--- |
| **Milestone 1** | Monorepo Foundation & Tooling | 2 Jours | Structure `` & `infra/`, Yarn Berry/TurboRepo, `README.md`, `HOWTO.md`, `LICENSE.md` |
| **Milestone 2** | Paquets `@quatrain/mdm` & `@quatrain/state-machine` | 4 Jours | Core MDM Device & Universal FSM Engine pour équipements et réalités métiers |
| **Milestone 3** | Supabase On-Premise DB & RLS | 4 Jours | Schéma PostgreSQL 100% UUID v4 (`uid`), index `pgvector`, politiques RLS multi-tenant |
| **Milestone 4** | Apps On-Premise (Backoffice UI & API) | 5 Jours | Backoffice Astro + CoreUX, API d'ingestion de télémétrie ultra-rapide |
| **Milestone 5** | Cœur IA "Hey Brad" (RAG + Bookworm) | 4 Jours | Assistant RAG Modaka SaaS, requêtes hybrides langage naturel (Connaissances + Télémétrie) |
| **Milestone 6** | Recettes IaC Podman & Helm / ArgoCD | 4 Jours | Conteneurs Podman multi-stage non-root, Chartes Helm et ApplicationSet ArgoCD |

---

## 🎯 Détail des Jalons (Milestones)

### Milestone 1 : Fondation du Monorepo
- Initialisation de la structure de répertoires `` et `infra/`.
- Fichiers de configuration racine : `package.json`, `turbo.json`, `.yarnrc.yml`, `tsconfig.json`.
- Documentation initiale.

### Milestone 2 : Développement des Paquets Quatrain
- **`@quatrain/mdm`** : Modèle de données unifié pour Devices, Components, Sensors.
- **`@quatrain/state-machine`** : Automates d'états réactifs et fortement typés.

### Milestone 3 : Supabase On-Premise PostgreSQL
- Migrations SQL versionnées dans `packages/db/migrations/`.
- Activation de `pgvector` pour l'indexation sémantique.
- Row-Level Security (RLS) sur toutes les tables.

### Milestone 4 : Refonte Backoffice UI & API
- Application Astro avec composants Quatrain CoreUX.
- Microservice d'ingestion léger en Bun/TypeScript.

### Milestone 5 : Cœur IA Hey Brad
- Indexation sémantique des guides métier Bookworm.
- Tool-calling LLM pour l'interrogation de télémétrie capteur.

### Milestone 6 : Déploiement IaC & GitOps
- `Containerfile` Podman (`USER bun`, multi-arch).
- Charts Helm et ApplicationSet ArgoCD pour déploiement continu.

---
🏠 **[README](../../README.fr.md)** | 🗺️ **[Index Architecture](index.fr.md)** | ⬅️ **[Précédent : Architecture Système](ARCHITECTURE.fr.md)** | ➡️ **[Suivant : Planning Août 2026](AUGUST_2026_SPRINT_ROADMAP.fr.md)**
