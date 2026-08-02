-- Quatrain MDM / BradTech Stack - Unified Device Types & Physical Device Units Schema
-- PostgreSQL / Supabase On-Premise Schema

CREATE TABLE IF NOT EXISTS vendors (
   id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
   name VARCHAR(255) NOT NULL,
   sku VARCHAR(64),
   url VARCHAR(255),
   details JSONB DEFAULT '{}'::jsonb,
   created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Catalog of Device Models / Archetype Definitions (Carries SKU, dimensions Map, vendor_info Map)
CREATE TABLE IF NOT EXISTS device_types (
   id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
   name VARCHAR(255) NOT NULL,
   sku VARCHAR(64) NOT NULL UNIQUE,
   archetype_id VARCHAR(128) NOT NULL DEFAULT 'hardware.device',
   dimensions JSONB DEFAULT '{"unitSystem": "metric"}'::jsonb,
   vendor_info JSONB DEFAULT '{}'::jsonb,
   created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Physical Inventory Units (Inherits SKU/specs from device_types, carries serial_number)
CREATE TABLE IF NOT EXISTS devices (
   id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
   device_type_id UUID NOT NULL REFERENCES device_types(id) ON DELETE RESTRICT,
   serial_number VARCHAR(128) NOT NULL UNIQUE,
   name VARCHAR(255) NOT NULL,
   lifecycle_state VARCHAR(32) NOT NULL DEFAULT 'AVAILABLE',
   created_at TIMESTAMPTZ DEFAULT NOW()
);

-- JSONB GIN Indexes for high-performance device_types inline specification group queries
CREATE INDEX IF NOT EXISTS idx_device_types_dimensions ON device_types USING GIN (dimensions);
CREATE INDEX IF NOT EXISTS idx_device_types_vendor_info ON device_types USING GIN (vendor_info);
CREATE INDEX IF NOT EXISTS idx_devices_serial_number ON devices (serial_number);
