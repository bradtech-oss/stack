---
🏠 **[README](../../README.md)** | 🗺️ **[Architecture Index](index.md)** | ⬅️ **[Previous: @quatrain Packages](QUATRAIN_MDM_AND_STATE_MACHINE.md)** | ➡️ **[Next: Hey Brad AI Core](HEY_BRAD_AI_CORE.md)**
---

# Specifications — Supabase On-Premise PostgreSQL Schema (`@bradtech-oss/db`)

> 🌐 *Version française disponible dans [`SUPABASE_ONPREM_SCHEMA.fr.md`](SUPABASE_ONPREM_SCHEMA.fr.md)*

This document specifies the PostgreSQL relational schema, 100% UUID v4 (`uid`) primary key enforcement, `pgvector` semantic extension, and Row-Level Security (RLS) policies for **`bradtech-oss`**.

---

## 🗄️ 1. Core Schema Principles
- **100% UUID v4 (`uid`)**: Every single table utilizes `uid UUID PRIMARY KEY DEFAULT gen_random_uuid()`.
- **Multi-Tenant Isolation**: Enforced via `tenant_uid UUID REFERENCES public.tenants(uid)` and strict Supabase RLS policies.
- **`pgvector` Support**: Vector embeddings stored in `observation_events` for semantic search and multi-modal AI querying.

---

## 📐 2. DDL Table Schema Definitions

```sql
-- Extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "vector";

-- Tenants Table
CREATE TABLE public.tenants (
  uid UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL, -- e.g. 'mas-baudouin'
  name TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Realities Table (Plots, Ponds, Barns, Silos)
CREATE TABLE public.realities (
  uid UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_uid UUID NOT NULL REFERENCES public.tenants(uid) ON DELETE CASCADE,
  kind TEXT NOT NULL CHECK (kind IN ('plot', 'pond', 'barn', 'storage')),
  name TEXT NOT NULL,
  geometry JSONB, -- GeoJSON representation
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Devices Table (@quatrain/mdm)
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

-- Multi-Modal Observation Events & Embeddings
CREATE TABLE public.observation_events (
  uid UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_uid UUID NOT NULL REFERENCES public.tenants(uid) ON DELETE CASCADE,
  reality_uid UUID REFERENCES public.realities(uid) ON DELETE SET NULL,
  source_type TEXT NOT NULL CHECK (source_type IN ('human', 'ugv', 'uav', 'satellite')),
  media_url TEXT NOT NULL,
  embedding vector(1536), -- OpenAI / Modaka multi-modal embedding
  metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
  captured_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);
```

---
🏠 **[README](../../README.md)** | 🗺️ **[Architecture Index](index.md)** | ⬅️ **[Previous: @quatrain Packages](QUATRAIN_MDM_AND_STATE_MACHINE.md)** | ➡️ **[Next: Hey Brad AI Core](HEY_BRAD_AI_CORE.md)**
