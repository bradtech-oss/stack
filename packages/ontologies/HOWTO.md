# HOWTO — Using @bradtech/ontologies

This guide presents the most common usage scenarios and recipes for integrating the OKF agricultural lexicon into web applications, edge nodes, and data pipelines.

---

## 1. Populating UI Select Components in Astro / React / Vue

You can extract localized flat key-value pairs directly in your server routes or form definitions:

```typescript
import { Lexicon } from '@bradtech/ontologies'

// Form Select Definition (e.g. Backoffice UI)
const soilSelectField = {
   label: 'Soil Texture',
   values: Lexicon.getFlatMap('soils', 'fr'), // or 'en', 'es', 'it', 'de'
}
```

---

## 2. Setting Default Physical Thresholds from Soil Type

When an agricultural plot is created or modified, look up the selected soil texture to automatically configure default water capacity thresholds:

```typescript
import { Lexicon, type SoilOntologyItem } from '@bradtech/ontologies'

function getThresholdsForSoil(soilSlug: string) {
   const lookupResult = Lexicon.lookup(soilSlug)
   if (!lookupResult || lookupResult.domain !== 'soils') {
      return { fieldCapacityPoint: 30, temporaryWiltingPoint: 15, permanentWiltingPoint: 12 }
   }

   const soil = lookupResult.item as SoilOntologyItem
   return {
      fieldCapacityPoint: soil.physics.fieldCapacityPoint,
      temporaryWiltingPoint: soil.physics.temporaryWiltingPoint,
      permanentWiltingPoint: soil.physics.permanentWiltingPoint,
   }
}
```

---

## 3. Parsing TelePAC / RPG Shapefile Codes into Brad Concepts

When importing farmer parcel declarations (TelePAC XML / Shapefile):

```typescript
import { Lexicon, type CropOntologyItem } from '@bradtech/ontologies'

function mapTelepacCropCode(telepacCode: string) {
   // e.g. "VRC" (Vigne Raisin de Cuve) -> Vitis vinifera
   const result = Lexicon.lookup(telepacCode)

   if (result && result.domain === 'crops') {
      const crop = result.item as CropOntologyItem
      return {
         cropId: crop.id,
         eppoCode: crop.standards?.eppo,
         kcInitial: crop.agronomy.kcInitial,
         rootDepthMaxCm: crop.agronomy.rootDepthMaxCm,
      }
   }

   return null
}
```

---

## 4. Deploying onto Modaka / OSFARM Instances

Because the `data/` directory strictly adheres to **OKF v0.1**:
1. Clone or copy `data/` into any Modaka repository root (e.g. `https://<tenant>.brad.farm` or `https://lexicon.osfarm.org`).
2. The Modaka engine will automatically render interactive documentation pages and publish the Open Data JSON-LD graph.
