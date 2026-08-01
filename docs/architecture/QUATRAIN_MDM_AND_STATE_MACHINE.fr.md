# Spécifications — `@quatrain/mdm` & `@quatrain/state-machine`

> 🌐 *English version available in [`QUATRAIN_MDM_AND_STATE_MACHINE.md`](file:///Users/crapougnax/CODE/BRAD2026/bradtech-oss/docs/architecture/QUATRAIN_MDM_AND_STATE_MACHINE.md)*

Ce document définit les spécifications techniques des deux paquets fondations développés au sein du projet **bradtech-oss** et destinés à enrichir l'écosystème **Quatrain Core**.

---

## 📦 1. `@quatrain/mdm` (Master Data Management)

### Rôle
Fournir un modèle de données universel, typé, abstrait et extensible pour la gestion des équipements (*Devices*), composants informatiques/électroniques (*PCB, Enclosure, PowerSupply*) et capteurs (*Sensors*).

### Structure des Types Principaux

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

## ⚙️ 2. `@quatrain/state-machine` (Automate à États Finis)

### Rôle
Proposer un moteur réactif de Machine à États Fini (FSM) pour régir les transitions d'état valides des équipements et des réalités d'exploitation (*Realities*).

### A. États des Équipements (*Device States*)
```text
[Planned] ---> [Ordered] ---> [Available] ---> [Associated] <---> [Maintenance]
                                   |                 |
                                   v                 v
                              [Scrapped]          [Ko]
```

### B. États des Réalités Métier (*Reality States*)
Le paquet prend en charge les différentes typologies d'exploitation :
- 🌾 **Parcelles Agricoles** (*Plot*) : `Uncultivated`, `Seeded`, `Growing`, `Harvesting`, `Fallow`
- 🐟 **Bassins d'Aquaculture** (*Pond*) : `Preparing`, `Stocked`, `Monitoring`, `Harvesting`, `Empty`
- 🐔 **Bâtiments d'Élevage** (*Barn*) : `SanitaryBreak`, `Populated`, `Brooding`, `Depopulating`
- 🌾 **Silos & Stockages** (*Storage*) : `Empty`, `Filling`, `Stored`, `Aerating`, `Emptying`

### Exemple d'utilisation de l'API
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
