---
🏠 **[README](../../README.md)** | 🗺️ **[Architecture Index](index.md)** | ⬅️ **[Previous: Data Ontology & Multi-Modal](DATA_ONTOLOGY_AND_MULTIMODAL.md)** | ➡️ **[Next: Supabase On-Premise Schema](SUPABASE_ONPREM_SCHEMA.md)**
---

# Specifications — `@quatrain/mdm` & `@quatrain/state-machine` Packages

> 🌐 *Version française disponible dans [`QUATRAIN_MDM_AND_STATE_MACHINE.fr.md`](QUATRAIN_MDM_AND_STATE_MACHINE.fr.md)*

This document specifies the design, entity structures, and state transition contracts for the two foundational open-source Quatrain packages: `@quatrain/mdm` and `@quatrain/state-machine`.

---

## 📦 1. `@quatrain/mdm` (Master Data Management)

`@quatrain/mdm` provides an abstract, domain-agnostic taxonomy modeling physical hardware and environmental realities.

### Core Entities:
- **`Device`**: Physical IoT hardware asset (e.g. Probe, Weather Station, Gateway).
- **`PCB`**: Printed Circuit Board hardware revision identifier.
- **`Enclosure`**: Mechanical casing specification.
- **`Sensor`**: Individual physical or virtual transducer component.
- **`Accessory`**: External peripheral (solar panel, external antenna, battery pack).
- **`Reality`**: Physical domain location bound to devices (*Plot, Pond, Barn, Silo*).

### TypeScript Definition Example:
```typescript
export interface DeviceEntity {
  uid: string // UUID v4
  tenantId: string
  serialNumber: string
  modelName: string
  hardwareRevision: string
  status: DeviceStatus
  installedAt?: string
  lastSeenAt?: string
  sensors: SensorEntity[]
}
```

---

## ⚙️ 2. `@quatrain/state-machine` (Universal Finite State Machine)

`@quatrain/state-machine` implements a reactive, strongly typed state machine engine governing lifecycle transitions for hardware devices and physical realities.

### Device Lifecycle States:
- `PLANNED` -> `ORDERED` -> `AVAILABLE` -> `ASSOCIATED` <-> `MAINTENANCE` -> `KO` -> `SCRAPPED`

### State Transition Diagram:
```text
[PLANNED] ---> [ORDERED] ---> [AVAILABLE] ---> [ASSOCIATED] <---> [MAINTENANCE]
                                   |                 |
                                   v                 v
                                [SCRAPPED]         [KO]
```

### Reality Lifecycle States:
- Physical realities (*Plots, Barns, Ponds*) support state transitions (e.g. *Preparation, Active Growth, Harvest, Fallow, Dormant*) based on telemetry data triggers.

---
🏠 **[README](../../README.md)** | 🗺️ **[Architecture Index](index.md)** | ⬅️ **[Previous: Data Ontology & Multi-Modal](DATA_ONTOLOGY_AND_MULTIMODAL.md)** | ➡️ **[Next: Supabase On-Premise Schema](SUPABASE_ONPREM_SCHEMA.md)**
