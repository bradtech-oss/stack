🏠 **[README](../../README.md)** | 🗺️ **[Architecture Index](index.md)** | ⬅️ **[Previous: Data Ontology & Multi-Modal](DATA_ONTOLOGY_AND_MULTIMODAL.md)** | ➡️ **[Next: Supabase On-Premise Schema](SUPABASE_ONPREM_SCHEMA.md)**

---

# Specifications — `@quatrain/mdm` & `@quatrain/state-machine` Packages (Quatrain Core Monorepo)

> 🌐 *Version française disponible dans [`QUATRAIN_MDM_AND_STATE_MACHINE.fr.md`](QUATRAIN_MDM_AND_STATE_MACHINE.fr.md)*

> [!IMPORTANT]
> **Repository Location:** The `@quatrain/*` foundation packages (`@quatrain/mdm` and `@quatrain/state-machine`) are maintained and developed inside the **Quatrain Core monorepo** located at `Quatrain/Core` (`packages/mdm` & `packages/state-machine`).
> They are consumed in `bradtech-oss/stack` via explicit Yarn `portal:` resolutions during local development (e.g. `"portal:../../QUATRAIN/Core/packages/mdm"`).

---

## 📦 1. `@quatrain/mdm` (Master Data Management)

`@quatrain/mdm` provides an abstract, domain-agnostic taxonomy modeling physical hardware and environmental realities inside `Quatrain/Core/packages/mdm`.

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

Located inside `Quatrain/Core/packages/state-machine`, `@quatrain/state-machine` implements a reactive, strongly typed state machine engine governing lifecycle transitions for hardware devices and physical realities.

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
