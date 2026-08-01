# Spécifications — Schéma Supabase On-Premise PostgreSQL & RLS

> 🌐 *English version available in [`SUPABASE_ONPREM_SCHEMA.md`](file:///Users/crapougnax/CODE/BRAD2026/bradtech-oss/docs/architecture/SUPABASE_ONPREM_SCHEMA.md)*

Ce document décrit la structure de la base de données PostgreSQL exécutée sur l'instance **Supabase On-Premise** du projet **bradtech-oss**.

---

## 🗄️ 1. Principes de Modélisation

1. **Clés Primaires UUID v4 (`uid`)** : Tous les identifiants de tables utilisent `uid UUID PRIMARY KEY DEFAULT gen_random_uuid()`.
2. **Row-Level Security (RLS)** : RLS activée systématiquement sur toutes les tables du schéma `public`.
3. **Indexation vectorielle `pgvector`** : Activation de l'extension `vector` pour le stockage des embeddings du cœur IA **Hey Brad**.

---

## 📐 2. Schéma Relationnel Principal

```sql
-- Extension pour la recherche vectorielle IA RAG
CREATE EXTENSION IF NOT EXISTS vector;

-- 1. Table des Organisations / Tenants
CREATE TABLE public.tenants (
  uid UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

ALTER TABLE public.tenants ENABLE ROW LEVEL SECURITY;

-- 2. Table des Équipements (Basée sur @quatrain/mdm)
CREATE TABLE public.devices (
  uid UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_uid UUID REFERENCES public.tenants(uid) ON DELETE CASCADE,
  serial_number TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  device_type TEXT NOT NULL, -- 'probe', 'weather_station', 'gateway'
  hardware_revision TEXT,
  metadata JSONB DEFAULT '{}'::jsonb,
  _state TEXT NOT NULL DEFAULT 'Available',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  last_seen_at TIMESTAMP WITH TIME ZONE
);

ALTER TABLE public.devices ENABLE ROW LEVEL SECURITY;

-- 3. Table des Réalités d'Exploitation (Parcelles, Bassins, Élevages, Stockages)
CREATE TABLE public.realities (
  uid UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_uid UUID REFERENCES public.tenants(uid) ON DELETE CASCADE,
  name TEXT NOT NULL,
  reality_type TEXT NOT NULL, -- 'plot', 'pond', 'barn', 'storage'
  geolocation JSONB, -- GeoJSON Point / Polygon
  _state TEXT NOT NULL DEFAULT 'Active',
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

ALTER TABLE public.realities ENABLE ROW LEVEL SECURITY;

-- 4. Table des Mesures de Télémétrie
CREATE TABLE public.telemetry_measures (
  uid UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  device_uid UUID REFERENCES public.devices(uid) ON DELETE CASCADE,
  reality_uid UUID REFERENCES public.realities(uid) ON DELETE SET NULL,
  port INTEGER NOT NULL,
  metric_name TEXT NOT NULL,
  numeric_value NUMERIC NOT NULL,
  unit TEXT,
  fcnt INTEGER,
  rssi INTEGER,
  snr NUMERIC,
  gateway_count INTEGER,
  infra_name TEXT DEFAULT 'LoraBrad',
  recorded_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.telemetry_measures ENABLE ROW LEVEL SECURITY;

-- 5. Table des Connaissances Indexées (Bookworm + RAG Embeddings)
CREATE TABLE public.knowledge_documents (
  uid UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  category TEXT NOT NULL,
  content TEXT NOT NULL,
  embedding vector(1536), -- Open-AI / Custom Embedding Dimension
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

ALTER TABLE public.knowledge_documents ENABLE ROW LEVEL SECURITY;
```
