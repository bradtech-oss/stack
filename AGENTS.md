# LLM Agent Instructions & Guidelines — bradtech-oss

> [!IMPORTANT]
> All AI Coding Agents interacting with this workspace MUST strictly read, load, and comply with the rules outlined in this document.
>
> 🌐 *Version française disponible dans [`AGENTS.fr.md`](file:///Users/crapougnax/CODE/BRAD2026/bradtech-oss/AGENTS.fr.md)*

---

## 1. Base Guidelines & Personal Rules Pointer

All agent actions in this repository must comply with the base development principles, coding standards, international English language requirements, and personal rules defined in:
👉 **[Gist: Personal Gemini Rules & Instructions](https://gist.github.com/crapougnax/47971b85aa73dd702f4372a89858111c)**

---

## 2. Architecture Specifications Compliance

Before undertaking any development, refactoring, database migration, or infrastructure task, agents **MUST** read and respect the authoritative architecture documentation maintained under:
👉 **[Architecture Documentation Index (`docs/architecture/index.md`)](file:///Users/crapougnax/CODE/BRAD2026/bradtech-oss/docs/architecture/index.md)** *(French version: [docs/architecture/index.fr.md](file:///Users/crapougnax/CODE/BRAD2026/bradtech-oss/docs/architecture/index.fr.md))*

> [!CAUTION]
> **Bilingual Synchronization Requirement:** Whenever editing or adding architecture documents under `docs/architecture/`, agents **MUST** keep both the International English (`.md`) and French (`.fr.md`) versions strictly synchronized.

Key specifications to follow strictly:
- **Quatrain Ecosystem Core**: `@quatrain/mdm` for Master Data Management & `@quatrain/state-machine` for universal hardware/reality Finite State Machines (FSM).
- **Local-First Architecture**: 0ms local IndexedDB reads/writes for PWA apps (`code/apps/mobile` & `code/apps/backoffice`) with background sync to Supabase On-Premise.
- **Data Ontology**: Atomic `DataPoint` model (`measured` vs `computed` with `algorithmCode`, 3D geolocation with altitude, `open`/`closed` visibility, `okf:domain/category/item` URIs).
- **Modaka Engine & OKF v0.1**: Flat Open Knowledge Format Markdown repositories and tenant Open Data publishing on `https://<tenant>.brad.farm`.
- **Infrastructure-as-Code**: Non-root `Containerfile` Podman definitions (`USER bun`), multi-arch, Helm Charts, ArgoCD AppProjects/ApplicationSets, and Terraform recipes.
- **SonarQube Quality Gates**: Code coverage ≥ 80%, zero security hotspots, duplication < 3%, strict International English code/logs.

---

## 3. Session Action Journaling (`docs/journal/`)

Every development session, architectural decision, major refactoring, database migration, or release executed by AI agents **MUST be logged** in chronological Markdown files under:
👉 **[`docs/journal/`](file:///Users/crapougnax/CODE/BRAD2026/bradtech-oss/docs/journal/)**

### Journal Entry Naming Convention:
- Format: `YYYY-MM-DD-session-topic.md` (e.g., `docs/journal/2026-08-01-initial-architecture-setup.md`)

### Mandatory Journal Entry Template:
```markdown
# Session Log: [Topic Summary]
- **Date**: YYYY-MM-DD
- **Agent/Engine**: [e.g., Antigravity AI / Gemini 3.5 Flash]
- **Milestone / Sprint**: [e.g., Sprint 1 - Session 1.1]

## 📝 Actions Performed
1. List of exact modifications, file creations, and command executions.

## 🧪 Verification & Stability Audit
- Build status: [Pass / Fail]
- Unit tests: [Coverage %, Passing count]
- SonarQube Quality Gate status: [OK / Alert]

## 🔗 Referenced Specifications
- Links to relevant docs in `docs/architecture/`
```
