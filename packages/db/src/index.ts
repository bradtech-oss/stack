/**
 * @bradtech-oss/db
 * Supabase On-Premise PostgreSQL Schema, Migration Types & RLS Utilities
 */

export interface TenantRow {
  uid: string
  slug: string
  name: string
  created_at: string
}

export interface RealityRow {
  uid: string
  tenant_uid: string
  kind: 'plot' | 'pond' | 'barn' | 'storage'
  name: string
  geometry?: Record<string, unknown>
  created_at: string
}

export function getDbVersion(): string {
  return '0.1.0'
}
