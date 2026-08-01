# Specifications — Supabase On-Premise PostgreSQL Schema & RLS

> 🌐 *Version française disponible dans [`SUPABASE_ONPREM_SCHEMA.fr.md`](file:///Users/crapougnax/CODE/BRAD2026/bradtech-oss/docs/architecture/SUPABASE_ONPREM_SCHEMA.fr.md)*

This document describes the PostgreSQL database architecture running on the self-hosted **Supabase On-Premise** instance for **bradtech-oss**.

---

## 🗄️ 1. Core Data Modeling Principles

1. **UUID v4 Primary Keys (`uid`)**: All relational tables strictly enforce `uid UUID PRIMARY KEY DEFAULT gen_random_uuid()`.
2. **Row-Level Security (RLS)**: RLS is systematically enabled on all public schema tables.
3. **`pgvector` Vector Indexing**: The `vector` extension is enabled for storing high-dimensional embeddings for the **Hey Brad** AI engine.

---

## 📐 2. Primary Relational Database Schema

```sql
-- Enable vector search extension for RAG AI embeddings
CREATE EXTENSION IF NOT EXISTS vector;

-- 1. Tenants / Organizations Table
CREATE TABLE public.tenants (
  uid UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

ALTER TABLE public.tenants ENABLE ROW LEVEL SECURITY;

-- 2. Hardware Devices Table (Based on @quatrain/mdm)
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

-- 3. Domain Operational Realities Table (Agricultural Plots, Ponds, Barns, Silos)
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

-- 4. Telemetry Raw Measurements Table
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

-- 5. Knowledge Documents & Vector Embeddings Table (Bookworm Knowledge Base)
CREATE TABLE public.knowledge_documents (
  uid UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  category TEXT NOT NULL,
  content TEXT NOT NULL,
  embedding vector(1536), -- OpenAI / Custom Embedding Dimension
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

ALTER TABLE public.knowledge_documents ENABLE ROW LEVEL SECURITY;
```
