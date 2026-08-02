-- Quatrain MDM / BradTech Stack - Device Types (Catalog Level Specs) & Devices (Unit Level Specs) Schema
-- PostgreSQL / Supabase On-Premise Schema

CREATE TABLE IF NOT EXISTS vendors (
   id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
   name VARCHAR(255) NOT NULL,
   sku VARCHAR(64),
   url VARCHAR(255),
   details JSONB DEFAULT '{}'::jsonb,
   created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Catalog of Device Models (Type-level specs: dimensions Map, vendor Map)
CREATE TABLE IF NOT EXISTS device_types (
   id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
   name VARCHAR(255) NOT NULL,
   sku VARCHAR(64) NOT NULL UNIQUE,
   archetype_id VARCHAR(128) NOT NULL DEFAULT 'hardware.device',
   dimensions JSONB DEFAULT '{"unitSystem": "metric"}'::jsonb,  -- TYPE-LEVEL SPEC GROUP
   vendor JSONB DEFAULT '{}'::jsonb,                            -- TYPE-LEVEL SPEC GROUP
   created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Physical Inventory Units (Unit-level specs: net Map with eth/wifi/lorawan/gsm MAC/IMEI)
CREATE TABLE IF NOT EXISTS devices (
   id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
   device_type_id UUID NOT NULL REFERENCES device_types(id) ON DELETE RESTRICT,
   serial_number VARCHAR(128) NOT NULL UNIQUE,
   name VARCHAR(255) NOT NULL,
   lifecycle_state VARCHAR(32) NOT NULL DEFAULT 'AVAILABLE',
   net JSONB DEFAULT '{}'::jsonb,                               -- UNIT-LEVEL SPEC GROUP (eth, wifi, lorawan, gsm)
   created_at TIMESTAMPTZ DEFAULT NOW()
);

-- JSONB GIN Indexes for high-performance spec group queries
CREATE INDEX IF NOT EXISTS idx_device_types_dimensions ON device_types USING GIN (dimensions);
CREATE INDEX IF NOT EXISTS idx_device_types_vendor ON device_types USING GIN (vendor);
CREATE INDEX IF NOT EXISTS idx_devices_net ON devices USING GIN (net);
CREATE INDEX IF NOT EXISTS idx_devices_serial_number ON devices (serial_number);
