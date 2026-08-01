# Specifications — Side Roadmap: Quatrain Core Packages, Bookworm Curation, Hey Brad & PWA UX Ecosystem

> 🌐 *Version française disponible dans [`SIDE_ROADMAP_AND_UX.fr.md`](file:///Users/crapougnax/CODE/BRAD2026/bradtech-oss/docs/architecture/SIDE_ROADMAP_AND_UX.fr.md)*

This document details the cross-cutting **Side Roadmap** for developing Quatrain foundation packages, the Bookworm OKF content curation system, the Hey Brad AI engine (Modaka SaaS), and the PWA application split (Backoffice & Mobile Apps).

---

## 🗺️ 1. Side Roadmap System Overview

```mermaid
graph TD
    subgraph 1. Quatrain Foundation Packages
        MDM[@quatrain/mdm - Master Data Management]
        FSM[@quatrain/state-machine - Finite State Machine]
    end

    subgraph 2. Bookworm Curation & Extraction (Modaka OKF)
        BookwormMaster[Bookworm Master OKF Repository] -->|Targeted Extraction & Curation| TenantModaka[Personal Modaka Instance xxx.brad.farm]
    end

    subgraph 3. Hey Brad AI Core (Modaka SaaS)
        HeyBradCore[Hey Brad Engine - Conversational & Reasoning] <--> TenantModaka
    end

    subgraph 4. PWA UX Ecosystem (Shared Astro Foundation)
        BackofficeApp[code/apps/backoffice - Desktop PC / Laptop / Tablet]
        MobileApp[code/apps/mobile - Smartphone / Tablet PWA]
    end

    MDM --> BackofficeApp
    MDM --> MobileApp
    FSM --> BackofficeApp
    FSM --> MobileApp
    HeyBradCore --> BackofficeApp
    HeyBradCore --> MobileApp
```

---

## 🎯 2. Side Roadmap Core Pillars

### Pillar 1: Quatrain Ecosystem Foundation Packages (`@quatrain/*`)
- **`@quatrain/mdm`**: Master Data Management foundation providing typed abstract definitions for `Device`, `Sensor`, `Component`, and `Reality`.
- **`@quatrain/state-machine`**: Reactive Finite State Machine (FSM) engine governing lifecycle transitions for hardware devices and physical realities (*Plots, Barns, Ponds, Silos*).

### Pillar 2: Bookworm OKF Curation & Sliced Content Extraction (Modaka Engine)
- **Master OKF Curation**: Maintaining the agronomic, livestock husbandry, and irrigation knowledge base in **OKF v0.1** specification.
- **Targeted Slicing & Initialization**: Extraction tools to slice specific OKF document subsets to initialize a tenant's personal Modaka instance (`https://<tenant>.brad.farm`).

### Pillar 3: Hey Brad AI Core (Modaka SaaS)
- Integrating the conversational assistance and inference engine derived from **Modaka SaaS**.
- Ability to execute cross-domain queries between the tenant's local OKF repository and real-time sensor telemetry.

### Pillar 4: Hybrid User Experience (Data + Cartography + Conversational Threads)
- Modular UX components allowing seamless composition within single unified views:
  - **Data Blocks** (KPI cards, real-time metrics).
  - **Cartographic Views** (interactive GIS maps, plot polygons).
  - **AI Conversational Threads** (direct chat dialog with Hey Brad).

### Pillar 5: Clean Separation of Backoffice & Mobile PWA Apps (Astro)
- **`code/apps/backoffice`**: Comprehensive administration and analytics dashboard, responsive and optimized for **Desktop PCs, Laptops, and Tablets**.
- **`code/apps/mobile`**: Standalone PWA (Progressive Web App) field application, streamlined and optimized for **Smartphones and Tablets**.
- **Shared Foundation**: 100% shared `@quatrain/mdm`, `@quatrain/state-machine`, and Quatrain CoreUX design system.
