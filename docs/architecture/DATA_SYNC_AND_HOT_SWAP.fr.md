# Spécifications — Moulinettes de Conversion, Synchronisation & Remplacement à Chaud (*Hot Swap*)

> 🌐 *English version available in [`DATA_SYNC_AND_HOT_SWAP.md`](file:///Users/crapougnax/CODE/BRAD2026/bradtech-oss/docs/architecture/DATA_SYNC_AND_HOT_SWAP.md)*

> [!IMPORTANT]
> **Objectif Stratégique :** Garantir que le projet **bradtech-oss** évolue en observation continue du projet vivant [`Brad/apps/backoffice-ui`](file:///Users/crapougnax/CODE/BRAD2026/Brad/apps/backoffice-ui), et fournir un moteur d'ETL/synchronisation temps réel permettant un **remplacement à chaud** sans interruption de service lorsque bradtech-oss atteindra sa pleine maturité.

---

## 🔄 1. Principes de la Synchronisation Bi-Système

Pendant la phase de transition et de montée en maturité de **bradtech-oss**, les deux systèmes fonctionneront en parallèle :

```mermaid
graph TD
    LegacyApp[Système Vivant Actuel - Brad/apps/backoffice-ui] -->|Ingestion Telemetrie| LegacyDB[(Base Legacy - Supabase/Firestore)]
    
    SyncEngine[Moteur de Synchronisation & Moulinettes ETL]
    
    LegacyDB <-->|Sync Bi-directionnelle / Change Data Capture| SyncEngine
    SyncEngine <-->|Transformation MDM & State-Machine| OSSDB[(Supabase On-Premise bradtech-oss)]
    
    OSSApp[Nouveau Backoffice - bradtech-oss] -->|GraphQL / REST| OSSDB
    
    subgraph Hot Swap Trigger
        Router[Proxy Ingress / API Router]
        Router -->|Phase 1: Shadow Traffic 100%| LegacyApp
        Router -->|Phase 1: Parallel Read| SyncEngine
        Router -.->|Phase 2: Hot Swap Cutover| OSSApp
    end
```

---

## 🛠️ 2. Moulinettes de Conversion & Pipeline ETL

Le paquet `@bradtech-oss/sync-engine` (situé dans `code/packages/sync-engine`) fournit deux modes de conversion :

### A. Moulinette Historique (*Bulk Initial Migration*)
- **Rôle** : Transférer et convertir l'ensemble des données d'historique depuis les tables legacy (`probes`, `weather-stations`, `gateways`, `keychains`, `companies`, `plots`, `probe-payloads`) vers le modèle unifié bradtech-oss.
- **Transformations appliquées** :
  1. **UUID v4 Mapping** : Génération ou conversion des identifiants vers `uid` UUID v4 avec table de correspondance d'alias.
  2. **Mapping MDM (`@quatrain/mdm`)** : Conversion des fiches `probes` et `weather-stations` en objets `Device` enrichis de leurs composants (`PCB`, `Enclosure`, `Sensors`).
  3. **Mapping Automate d'États (`@quatrain/state-machine`)** : Conversion des états textuels (`Active`, `Associated`, `Stock`) vers les états typés FSM (`Available`, `Associated`, `Maintenance`).
  4. **Mapping Réalités Agricoles/Élevages (`Realities`)** : Conversion des `plots` (parcelles) et `tenancies` en objets `Realities` (`plot`, `pond`, `barn`, `storage`).

### B. Synchronisation Temps Réel (*CDC / Realtime Mirroring*)
- **Rôle** : Rejouer en temps réel chaque nouvelle mesure radio ou modification de fiche équipement depuis l'application legacy vers bradtech-oss (et réciproquement).
- **Mécanisme** : Webhooks PostgreSQL Supabase (CDC) et Change Streams qui alimentent la file d'attente d'ingestion bradtech-oss.

---

## ⚡ 3. Stratégie de Remplacement à Chaud (*Hot Swap*)

Le basculement se déroulera selon un protocole en 3 phases sans aucune perte de données :

| Phase | Description | État des Systèmes |
| :--- | :--- | :--- |
| **Phase 1 : Shadow Execution (Ombrage)** | Les trames LoRaWAN sont ingérées par les deux systèmes. bradtech-oss calcule les états et les métriques en tâche de fond sans impacter la prod. | **Principal :** Legacy<br>**Secondaire :** bradtech-oss (Shadow) |
| **Phase 2 : Dual-Read & Verification** | Les utilisateurs peuvent consulter les deux Backoffices. Des scripts de comparaison (*reconciliation checkers*) vérifient l'exactitude stricte à 100%. | **Principal :** Legacy<br>**Secondaire :** bradtech-oss (Read-Only Prod) |
| **Phase 3 : Hot Swap Cutover (Basculement)** | Redirection de la route Ingress/DNS (`backoffice.brad.technology`) vers bradtech-oss. L'ancien système passe en mode archive read-only. | **Principal :** bradtech-oss<br>**Archive :** Legacy |
