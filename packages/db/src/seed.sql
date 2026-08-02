-- Seed data for Vendors and Unified Devices with inline specification groups
INSERT INTO vendors (uid, name, sku, url, details) VALUES
  ('vendor_brad_tech', 'Brad Technology', 'BRAD-HQ', 'https://brad.technology', '{"country": "FR", "supportEmail": "support@brad.technology"}'::jsonb),
  ('vendor_eco_mills', 'EcoApparel & IoT Sensors', 'ECO-SENSORS', 'https://ecomills.example.com', '{"country": "DE", "supportEmail": "iot@ecomills.example.com"}'::jsonb),
  ('vendor_harvest_lab', 'Harvest Tech Ltd', 'HARVEST-UK', 'https://harvest-tech.example.com', '{"country": "UK", "supportEmail": "contact@harvest-tech.example.com"}'::jsonb)
ON CONFLICT (uid) DO NOTHING;

INSERT INTO devices (uid, name, sku, archetype_id, nature, lifecycle_state, dimensions, vendor_info) VALUES
  (
    'dev_probe_001',
    'Soil Moisture Probe V2',
    'BRAD-PROBE-V2-HYBRID',
    'hardware.probe',
    'physical',
    'ASSOCIATED',
    '{"heightMm": 450, "widthMm": 65, "depthMm": 65, "weightGrams": 480, "enclosureRating": "IP68"}'::jsonb,
    '{"vendorUri": "vendors/vendor_brad_tech", "vendorSku": "BRAD-PHY-PCB-HYBRID-01", "status": "ACTIVE", "releaseDate": "2025-06-01", "eolDate": "2030-12-31"}'::jsonb
  ),
  (
    'dev_gateway_001',
    'LoRaWAN Outdoor Gateway 868MHz',
    'BRAD-GW-868-OUTDOOR',
    'hardware.gateway',
    'physical',
    'AVAILABLE',
    '{"heightMm": 220, "widthMm": 180, "depthMm": 90, "weightGrams": 1250, "enclosureRating": "IP67"}'::jsonb,
    '{"vendorUri": "vendors/vendor_brad_tech", "vendorSku": "BRAD-GW-MOD-868", "status": "ACTIVE", "releaseDate": "2024-03-15", "eolDate": "2029-12-31"}'::jsonb
  ),
  (
    'dev_station_001',
    'Agri Weather Station Pro',
    'ECO-WX-STATION-PRO',
    'hardware.weather_station',
    'physical',
    'AVAILABLE',
    '{"heightMm": 850, "widthMm": 320, "depthMm": 320, "weightGrams": 3400, "enclosureRating": "IP66"}'::jsonb,
    '{"vendorUri": "vendors/vendor_eco_mills", "vendorSku": "ECO-WX-2026-X", "status": "ACTIVE", "releaseDate": "2025-01-10", "eolDate": "2031-01-01"}'::jsonb
  )
ON CONFLICT (uid) DO NOTHING;
