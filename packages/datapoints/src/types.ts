import type { BaseObjectType } from '@quatrain/core'

/**
 * Supported data kind categories for agronomic and telemetry datapoints.
 */
export type DataPointKind = 'measured' | 'forecast' | 'computed'

/**
 * Canonical DataPoint domain interface conforming to Quatrain BaseObjectType.
 */
export interface DataPointType extends BaseObjectType {
   /** Device identifier or URN (e.g. '8c1f645490100016', 'probes/b25s004'). */
   device: string
   /** Plot identifier or URN (e.g. 'plots/parcelle-nord'). */
   plot?: string
   /** Organization / Company identifier (e.g. 'companies/domaine-alpha'). */
   company?: string
   /** Canonical OKF metric identifier (e.g. 'okf:agronomy/soil/vwc_calibrated'). */
   metric: string
   /** Numerical value of the measurement. */
   value: number
   /** Unit of measurement (e.g. '%', '°C', 'hPa', 'mm'). */
   unit: string
   /** Kind of measurement: 'measured' (raw physical), 'forecast' (predictive), 'computed' (derived algorithm). */
   kind: DataPointKind
   /** Confidence score between 0.0 and 1.0. */
   confidence: number
   /** Timestamp when the physical phenomenon occurred or was measured. */
   timestamp: Date | string
   /** Timestamp when the measurement was ingested and recorded. */
   recordedat?: Date | string
   /** Extensible contextual metadata (raw payloads, FPort, SNR, RSSI, algorithm parameters). */
   metadata?: Record<string, any>
}

/**
 * Query filter options for retrieving timeseries timelines.
 */
export interface TimelineQueryOptions {
   /** Filter by device identifier. */
   device?: string
   /** Filter by plot identifier. */
   plot?: string
   /** Filter by company identifier. */
   company?: string
   /** Filter by metric identifier (exact match or list). */
   metric?: string
   /** Filter by measurement kind. */
   kind?: DataPointKind
   /** Start timestamp boundary (inclusive). */
   from?: Date | string
   /** End timestamp boundary (inclusive). */
   to?: Date | string
   /** Sorting direction by timestamp ('asc' or 'desc', defaults to 'desc'). */
   order?: 'asc' | 'desc'
   /** Maximum number of records to return (defaults to 100). */
   limit?: number
   /** Page number for pagination (1-indexed). */
   page?: number
}
