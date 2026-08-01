# Specifications — `@quatrain/mdm` & `@quatrain/state-machine`

> 🌐 *Version française disponible dans [`QUATRAIN_MDM_AND_STATE_MACHINE.fr.md`](file:///Users/crapougnax/CODE/BRAD2026/bradtech-oss/docs/architecture/QUATRAIN_MDM_AND_STATE_MACHINE.fr.md)*

This document defines the technical specifications for the two foundation packages developed within the **bradtech-oss** project to extend the **Quatrain Core** ecosystem.

---

## 📦 1. `@quatrain/mdm` (Master Data Management)

### Purpose
Provide a domain-agnostic, strongly-typed, abstract, and extensible data model for managing devices (`Device`), electronic components (`PCB`, `Enclosure`, `PowerSupply`), and sensors (`Sensors`).

### Core Type Interface Definitions

```typescript
export interface BaseEntity {
   uid: string // UUID v4
   name: string
   tags: string[]
   metadata: Record<string, unknown> // Schema-less JSONB Attributes
   createdAt: string
   updatedAt: string
}

export interface Device extends BaseEntity {
   serialNumber: string
   deviceType: string // e.g. 'probe', 'weather_station', 'gateway'
   hardwareRevision: string
   components: DeviceComponent[]
   sensors: SensorConfig[]
}

export interface DeviceComponent extends BaseEntity {
   componentType: 'pcb' | 'enclosure' | 'powersupply' | 'accessory'
   partNumber: string
   manufacturer?: string
}

export interface SensorConfig extends BaseEntity {
   sensorType: string // e.g. 'soil_capacitance', 'soil_temperature', 'uv', 'pressure'
   depthCm?: number
   unit: string
   calibrationCoefficients?: number[]
}
```

---

## ⚙️ 2. `@quatrain/state-machine` (Universal Finite State Machine)

### Purpose
Provide a reactive Finite State Machine (FSM) engine governing valid lifecycle state transitions for devices and operational domain realities (`Realities`).

### A. Device Lifecycle States (`Device States`)
```text
[Planned] ---> [Ordered] ---> [Available] ---> [Associated] <---> [Maintenance]
                                   |                 |
                                   v                 v
                              [Scrapped]          [Ko]
```

### B. Domain Reality States (`Reality States`)
The package supports distinct operational domain types:
- 🌾 **Agricultural Plots** (*Plot*): `Uncultivated`, `Seeded`, `Growing`, `Harvesting`, `Fallow`
- 🐟 **Aquaculture Ponds** (*Pond*): `Preparing`, `Stocked`, `Monitoring`, `Harvesting`, `Empty`
- 🐔 **Livestock Barns** (*Barn*): `SanitaryBreak`, `Populated`, `Brooding`, `Depopulating`
- 🌾 **Storage Silos & Facilities** (*Storage*): `Empty`, `Filling`, `Stored`, `Aerating`, `Emptying`

### API Usage Example
```typescript
import { createStateMachine } from '@quatrain/state-machine'

const deviceFsm = createStateMachine({
   initial: 'Available',
   states: {
      Available: { on: { ASSOCIATE: 'Associated', SCRAP: 'Scrapped' } },
      Associated: { on: { DISSOCIATE: 'Available', MARK_KO: 'Ko', MAINTAIN: 'Maintenance' } },
      Maintenance: { on: { REPAIR: 'Available', SCRAP: 'Scrapped' } },
      Ko: { on: { REPAIR: 'Maintenance', SCRAP: 'Scrapped' } },
      Scrapped: { type: 'final' }
   }
})
```
