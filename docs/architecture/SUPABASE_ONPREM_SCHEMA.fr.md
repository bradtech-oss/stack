---
🏠 **[README](../../README.fr.md)** | 🗺️ **[Index Architecture](index.fr.md)** | ⬅️ **[Précédent : Paquets Fondations @quatrain](QUATRAIN_MDM_AND_STATE_MACHINE.fr.md)** | ➡️ **[Suivant : Cœur IA Hey Brad](HEY_BRAD_AI_CORE.fr.md)**
---

# Spécifications — Schéma PostgreSQL Supabase On-Premise (`@bradtech-oss/db`)

> 🌐 *English version available in [`SUPABASE_ONPREM_SCHEMA.md`](SUPABASE_ONPREM_SCHEMA.md)*

Ce document spécifie le schéma relationnel PostgreSQL, la généralisation des clés primaires 100% UUID v4 (`uid`), l'extension vectorielle `pgvector` et les politiques Row-Level Security (RLS) pour **`bradtech-oss`**.

---

## 🗄️ 1. Principes du Schéma
- **100% UUID v4 (`uid`)** : Chaque table utilise la clé primaire `uid UUID PRIMARY KEY DEFAULT gen_random_uuid()`.
- **Isolation Multi-Tenant** : Appliquée via `tenant_uid UUID REFERENCES public.tenants(uid)` et les règles RLS Supabase.
- **Support `pgvector`** : Stockage des embeddings vectoriels dans `observation_events` pour la recherche sémantique multi-modale.

---

## 📐 2. Définitions DDL des Tables

```sql
-- Extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "vector";

-- Table Tenants
CREATE TABLE public.tenants (
  uid UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL, -- ex: 'mas-baudouin'
  name TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Table Réalités (Parcelles, Bassins, Élevages, Silos)
CREATE TABLE public.realities (
  uid UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_uid UUID NOT NULL REFERENCES public.tenants(uid) ON DELETE CASCADE,
  kind TEXT NOT NULL CHECK (kind IN ('plot', 'pond', 'barn', 'storage')),
  name TEXT NOT NULL,
  geometry JSONB, -- Représentation GeoJSON
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Table Équipements (@quatrain/mdm)
CREATE TABLE public.devices (
  uid UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_uid UUID NOT NULL REFERENCES public.tenants(uid) ON DELETE CASCADE,
  serial_number TEXT UNIQUE NOT NULL,
  model_name TEXT NOT NULL,
  hardware_revision TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'AVAILABLE',
  installed_reality_uid UUID REFERENCES public.realities(uid) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Événements d'Observation Multi-Modaux & Embeddings
CREATE TABLE public.observation_events (
  uid UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_uid UUID NOT NULL REFERENCES public.tenants(uid) ON DELETE CASCADE,
  reality_uid UUID REFERENCES public.realities(uid) ON DELETE SET NULL,
  source_type TEXT NOT NULL CHECK (source_type IN ('human', 'ugv', 'uav', 'satellite')),
  media_url TEXT NOT NULL,
  embedding vector(1536), -- Embedding multi-modal Modaka / OpenAI
  metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
  captured_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);
```

---
🏠 **[README](../../README.fr.md)** | 🗺️ **[Index Architecture](index.fr.md)** | ⬅️ **[Précédent : Paquets Fondations @quatrain](QUATRAIN_MDM_AND_STATE_MACHINE.fr.md)** | ➡️ **[Suivant : Cœur IA Hey Brad](HEY_BRAD_AI_CORE.fr.md)**
