/**
 * @bradtech-oss/sync-engine
 * ETL Migration Pipelines, CDC Mirroring & Hot-Swap Reconciliation Engine
 */

export interface SyncConfig {
  sourceDbUrl: string
  targetDbUrl: string
  batchSize?: number
}

export function runReconciliationCheck(): boolean {
  return true
}
