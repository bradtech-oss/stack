/**
 * @bradtech-oss/db
 * Supabase On-Premise PostgreSQL Schema, Migration Types & RLS Utilities
 */

export interface DeviceDimensionsMap {
  unitSystem?: 'metric' | 'imperial' | string
  height?: number
  width?: number
  depth?: number
  weight?: number
  enclosureRating?: 'IP65' | 'IP66' | 'IP67' | 'IP68' | string
}

export interface DeviceVendorMap {
  vendorUri?: string
  vendorSku?: string
  status: 'ACTIVE' | 'EOL' | 'DISCONTINUED'
  releaseDate?: string
  eolDate?: string
}

export interface DeviceElectricalMap {
  voltageNominal?: number
  voltageMin?: number
  voltageMax?: number
  currentMax?: number
  powerActive?: number
  powerSleep?: number
}

export interface DeviceEthMap {
  macAddress?: string
  speed?: number
  poeSupported?: boolean
}

export interface DeviceWifiMap {
  macAddress?: string
  supportedStandards?: string[]
  frequencyBands?: string[]
}

export interface DeviceLorawanMap {
  devEui?: string
  appEui?: string
  frequencyBand?: 'EU868' | 'US915' | 'AU915' | 'AS923' | string
  activationMode?: 'OTAA' | 'ABP' | string
}

export interface DeviceGsmMap {
  imei?: string
  iccid?: string
  technologies?: string[]
}

export interface DeviceNetworkMap {
  powerSource?: 'BATTERY' | 'SOLAR_BATTERY' | 'MAINS_AC' | 'POE' | 'DC_EXTERNAL' | string
  eth?: DeviceEthMap
  wifi?: DeviceWifiMap
  lorawan?: DeviceLorawanMap
  gsm?: DeviceGsmMap
}

// Backward compatibility alias for DeviceNetMap
export type DeviceNetMap = DeviceNetworkMap

export interface DeviceTypeRow {
  id: string
  name: string
  sku: string
  archetype_id: string
  dimensions: DeviceDimensionsMap   // Type-level spec group
  vendor: DeviceVendorMap          // Type-level spec group
  electrical: DeviceElectricalMap  // Type-level spec group
  created_at?: string
}

export interface DeviceRow {
  id: string
  device_type_id: string
  serial_number: string
  name: string
  lifecycle_state: 'AVAILABLE' | 'ASSOCIATED' | 'MAINTENANCE' | 'RETIRED' | string
  network: DeviceNetworkMap         // Unit-level spec group (eth, wifi, lorawan, gsm, powerSource)
  created_at?: string
}

export interface VendorRow {
  id: string
  name: string
  sku?: string
  url?: string
  details?: Record<string, unknown>
  created_at?: string
}

export function getDbVersion(): string {
  return '0.1.0'
}
