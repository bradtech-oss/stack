/**
 * @bradtech-oss/db
 * Supabase On-Premise PostgreSQL Schema, Migration Types & RLS Utilities
 */

export interface DeviceDimensionsMap {
  heightMm?: number
  widthMm?: number
  depthMm?: number
  weightGrams?: number
  enclosureRating?: 'IP65' | 'IP66' | 'IP67' | 'IP68' | string
}

export interface DeviceVendorInfoMap {
  vendorUri?: string
  vendorSku?: string
  status: 'ACTIVE' | 'EOL' | 'DISCONTINUED'
  releaseDate?: string
  eolDate?: string
}

export interface DeviceRow {
  uid: string
  name: string
  sku?: string
  archetype_id: string
  nature: 'physical' | 'virtual' | 'service' | 'composite' | string
  lifecycle_state: 'AVAILABLE' | 'ASSOCIATED' | 'MAINTENANCE' | 'RETIRED' | string
  dimensions: DeviceDimensionsMap
  vendor_info: DeviceVendorInfoMap
  created_at?: string
}

export interface VendorRow {
  uid: string
  name: string
  sku?: string
  url?: string
  details?: Record<string, unknown>
  created_at?: string
}

export function getDbVersion(): string {
  return '0.1.0'
}
