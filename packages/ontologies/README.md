# @bradtech/ontologies

> Open Knowledge Format (**OKF v0.1**) Agricultural Lexicon, Multi-level Taxonomies & Open Data Cross-Referencing Engine.
> Designed for **Brad Technology SAS**, the **OSFARM Collective**, and **Quatrain Core** / Modaka instances.

---

## 🧭 Overview

`@bradtech/ontologies` serves as the GitOps-driven single source of truth for agricultural taxonomies:
- **Soils & Textures**: 10 standard physical soil classes (INRAE / USDA / FAO WRB) with calibrated moisture thresholds (Field Capacity, Wilting Points, Bulk Density).
- **Irrigation Practices**: 4 canonical irrigation methods (Rainfed, Drip, Gravity, Sprinkler) with ICID standards and application efficiencies.
- **Crops & Cultivated Species**: Viticulture, arboriculture, aromatics, field crops, and cereals indexed to **EPPO Global Database**, **FAO AGROVOC**, and **TelePAC RPG** codes.
- **Crop Covers & Inter-Rows**: Agroecological soil cover modalities with water competition indices.

---

## 🚀 Key Features

1. **Git-First & Flat-Markdown (OKF v0.1)**: Every concept is an auditable, human- and AI-readable Markdown document with flat YAML frontmatter located under `data/`.
2. **Recursive & Flat Extraction**: Generate flat key-value dictionaries for UI select inputs (`Lexicon.getFlatMap('irrigations', 'fr')`) or full cascading hierarchical trees (`Lexicon.getHierarchy('crops', 'fr')`).
3. **Universal Cross-Standard Lookup**: Query by internal slug (`vitis-vinifera`), EPPO code (`VITVI`), TelePAC code (`VRC`), or AGROVOC URI (`c_8340`).
4. **Open Data Native**: Export directly to Schema.org / DCAT-AP compliant JSON-LD graph (`Lexicon.toOpenData()`).
5. **Zero-Dependency & Cloud-Native**: Pure TypeScript running seamlessly in Bun, Node.js, and browser/edge runtimes.

---

## 📦 Installation

```bash
bun add @bradtech/ontologies
# or
npm install @bradtech/ontologies
```

---

## 🛠️ Quick Start

```typescript
import { Lexicon } from '@bradtech/ontologies'

// 1. Get flat localized map for UI select components
const irrigationOptions = Lexicon.getFlatMap('irrigations', 'fr')
console.log(irrigationOptions)
// {
//   none: "Sans irrigation (Non irrigué)",
//   drip: "Goutte à goutte",
//   gravity: "Gravitaire",
//   sprinkler: "Aspersion"
// }

// 2. Resolve cross-references (TelePAC / EPPO -> Concept)
const result = Lexicon.lookup('VITVI')
console.log(result?.item.title) // "Vigne cultivée (Vitis vinifera)"
console.log(result?.item.agronomy.kcMid) // 0.70

// 3. Export Open Data JSON-LD graph
const jsonLd = Lexicon.toOpenData('crops')
```

---

## 📄 Documentation

For advanced recipes, custom catalogs, and integration examples, see [HOWTO.md](./HOWTO.md).
