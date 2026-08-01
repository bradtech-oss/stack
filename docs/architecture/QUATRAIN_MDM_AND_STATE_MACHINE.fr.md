---
🏠 **[README](../../README.fr.md)** | 🗺️ **[Index Architecture](index.fr.md)** | ⬅️ **[Précédent : Ontologie Données & Multi-Modal](DATA_ONTOLOGY_AND_MULTIMODAL.fr.md)** | ➡️ **[Suivant : Schéma Supabase On-Premise](SUPABASE_ONPREM_SCHEMA.fr.md)**
---

# Spécifications — Paquets `@quatrain/mdm` & `@quatrain/state-machine`

> 🌐 *English version available in [`QUATRAIN_MDM_AND_STATE_MACHINE.md`](QUATRAIN_MDM_AND_STATE_MACHINE.md)*

Ce document spécifie la conception, les structures d'entités et les contrats de transition d'états pour les deux paquets fondations Open Source Quatrain : `@quatrain/mdm` et `@quatrain/state-machine`.

---

## 📦 1. `@quatrain/mdm` (Master Data Management)

`@quatrain/mdm` fournit une taxonomie abstraite et indépendante du domaine pour modéliser les équipements matériels et les réalités environnementales.

### Entités Clés :
- **`Device`** : Équipement IoT physique (ex: Sonde, Station Météo, Passerelle).
- **`PCB`** : Identifiant de révision matérielle de la carte électronique.
- **`Enclosure`** : Spécification du boîtier mécanique.
- **`Sensor`** : Composant transducteur physique ou virtuel.
- **`Accessory`** : Périphérique externe (panneau solaire, antenne externe, batterie).
- **`Reality`** : Réalité physique rattachée aux équipements (*Parcelle, Bassin, Élevage, Silo*).

### Exemple d'interface TypeScript :
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

## ⚙️ 2. `@quatrain/state-machine` (Automate à États Universel)

`@quatrain/state-machine` régit le cycle de vie et les transitions d'états des équipements et réalités métiers.

### États du Cycle de Vie d'un Équipement :
- `PLANNED` -> `ORDERED` -> `AVAILABLE` -> `ASSOCIATED` <-> `MAINTENANCE` -> `KO` -> `SCRAPPED`

### Schéma de Transition d'États :
```text
[PLANNED] ---> [ORDERED] ---> [AVAILABLE] ---> [ASSOCIATED] <---> [MAINTENANCE]
                                   |                 |
                                   v                 v
                                [SCRAPPED]         [KO]
```

### États des Réalités Métier :
- Les réalités physiques (*Parcelles, Élevages, Bassins*) bénéficient de transitions d'états (ex: *Préparation, Croissance, Récolte, Repos*) déclenchées par les seuils de télémétrie.

---
🏠 **[README](../../README.fr.md)** | 🗺️ **[Index Architecture](index.fr.md)** | ⬅️ **[Précédent : Ontologie Données & Multi-Modal](DATA_ONTOLOGY_AND_MULTIMODAL.fr.md)** | ➡️ **[Suivant : Schéma Supabase On-Premise](SUPABASE_ONPREM_SCHEMA.fr.md)**
