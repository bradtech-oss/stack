-- Seed data for Vendors, Device Types (Type-level specs with static electrical ratings) and Physical Devices (Unit-level specs with net Map & powerSource)

INSERT INTO vendors (id, name, sku, url, details) VALUES
  ('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'Brad Technology', 'BRAD-HQ', 'https://brad.technology', '{"country": "FR", "supportEmail": "support@brad.technology"}'::jsonb),
  ('b1ffcd88-8d0a-3ef7-aa5c-5aa8ac270a22', 'EcoApparel & IoT Sensors', 'ECO-SENSORS', 'https://ecomills.example.com', '{"country": "DE", "supportEmail": "iot@ecomills.example.com"}'::jsonb),
  ('c2aabe77-7e0f-2ef6-994b-4aa7ab160a33', 'Harvest Tech Ltd', 'HARVEST-UK', 'https://harvest-tech.example.com', '{"country": "UK", "supportEmail": "contact@harvest-tech.example.com"}'::jsonb)
ON CONFLICT (id) DO NOTHING;

-- Seed Device Types (Type-level specs: dimensions Map, vendor Map, electrical Map - static physical ratings)
INSERT INTO device_types (id, name, sku, archetype_id, dimensions, vendor, electrical) VALUES
  (
    '7711aa66-6f0e-1ef5-883a-3aa6ba050a11',
    'Soil Moisture Probe V2 Model',
    'BRAD-PROBE-V2-HYBRID',
    'hardware.probe',
    '{"unitSystem": "metric", "height": 450, "width": 65, "depth": 65, "weight": 480, "enclosureRating": "IP68"}'::jsonb,
    '{"vendorUri": "vendors/a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11", "vendorSku": "BRAD-PHY-PCB-HYBRID-01", "status": "ACTIVE", "releaseDate": "2025-06-01", "eolDate": "2030-12-31"}'::jsonb,
    '{"voltageNominalV": 3.6, "voltageMinV": 3.0, "voltageMaxV": 4.2, "currentMaxmA": 120, "powerActivemW": 432, "powerSleepuW": 18}'::jsonb
  ),
  (
    '8822bb55-5f0d-0ef4-7729-2aa5ab040a22',
    'LoRaWAN Outdoor Gateway 868MHz Model',
    'BRAD-GW-868-OUTDOOR',
    'hardware.gateway',
    '{"unitSystem": "metric", "height": 220, "width": 180, "depth": 90, "weight": 1250, "enclosureRating": "IP67"}'::jsonb,
    '{"vendorUri": "vendors/a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11", "vendorSku": "BRAD-GW-MOD-868", "status": "ACTIVE", "releaseDate": "2024-03-15", "eolDate": "2029-12-31"}'::jsonb,
    '{"voltageNominalV": 48.0, "voltageMinV": 12.0, "voltageMaxV": 54.0, "currentMaxmA": 1250, "powerActivemW": 15000, "powerSleepuW": 1200000}'::jsonb
  ),
  (
    '9933cc44-4f0c-9ef3-6618-1aa4ab030a33',
    'Agri Weather Station Pro Model',
    'ECO-WX-STATION-PRO',
    'hardware.weather_station',
    '{"unitSystem": "metric", "height": 850, "width": 320, "depth": 320, "weight": 3400, "enclosureRating": "IP66"}'::jsonb,
    '{"vendorUri": "vendors/b1ffcd88-8d0a-3ef7-aa5c-5aa8ac270a22", "vendorSku": "ECO-WX-2026-X", "status": "ACTIVE", "releaseDate": "2025-01-10", "eolDate": "2031-01-01"}'::jsonb,
    '{"voltageNominalV": 6.0, "voltageMinV": 4.5, "voltageMaxV": 7.2, "currentMaxmA": 350, "powerActivemW": 2100, "powerSleepuW": 45}'::jsonb
  )
ON CONFLICT (id) DO NOTHING;

-- Seed Physical Inventory Units (Unit-level specs: net Map carrying MAC/DevEUI/IMEI & deployment powerSource)
INSERT INTO devices (id, device_type_id, serial_number, name, lifecycle_state, net) VALUES
  (
    'd311aa66-6f0e-1ef5-883a-3aa6ba050a44',
    '7711aa66-6f0e-1ef5-883a-3aa6ba050a11',
    'SN-BRAD-PROBE-2026-0042',
    'Soil Probe #042 - Field Parcel 3',
    'ASSOCIATED',
    '{"powerSource": "BATTERY", "lorawan": {"devEui": "0018B44113AB7042", "appEui": "70B3D57ED0000001", "frequencyBand": "EU868", "activationMode": "OTAA"}}'::jsonb
  ),
  (
    'e422bb55-5f0d-0ef4-7729-2aa5ab040a55',
    '8822bb55-5f0d-0ef4-7729-2aa5ab040a22',
    'SN-BRAD-GW-2026-0108',
    'Gateway Outdoor Mast #108',
    'AVAILABLE',
    '{"powerSource": "POE", "eth": {"macAddress": "00:1B:44:11:3A:08", "speedMbps": 1000, "poeSupported": true}, "wifi": {"macAddress": "00:1B:44:11:3A:09", "supportedStandards": ["802.11n", "802.11ac"], "frequencyBands": ["2.4", "5.0"]}, "gsm": {"imei": "354892019283018", "iccid": "893301928301928301F", "technologies": ["4G", "LTE-M"]}}'::jsonb
  ),
  (
    'f533cc44-4f0c-9ef3-6618-1aa4ab030a66',
    '9933cc44-4f0c-9ef3-6618-1aa4ab030a33',
    'SN-ECO-WX-2026-0019',
    'Agri Weather Station North Station',
    'AVAILABLE',
    '{"powerSource": "SOLAR_BATTERY", "lorawan": {"devEui": "0018B44113AB7019", "appEui": "70B3D57ED0000001", "frequencyBand": "EU868", "activationMode": "OTAA"}, "gsm": {"imei": "354892019283019", "iccid": "893301928301928302F", "technologies": ["NB-IoT"]}}'::jsonb
  )
ON CONFLICT (id) DO NOTHING;
