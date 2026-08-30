import type {
   CompanyUri,
   DeviceUri,
   InterfaceContractUri,
   OkfMetricUri,
   PlotUri,
} from '@bradtech/types'
import type { ConversionContext, ConversionOutput, SensorConverterInterface } from './types'

/**
 * Input contract for historical raw data points to be replayed.
 */
export interface RawDataPointInput {
   /** Unique UUID of the source raw data point */
   id: string
   /** Canonical device URI (e.g. 'probes/b25s004') */
   device: DeviceUri | (string & {})
   /** Canonical plot URI (e.g. 'plots/e5eadee3-...') */
   plot?: PlotUri | (string & {})
   /** Canonical company URI (e.g. 'companies/32c18f05-...') */
   company?: CompanyUri | (string & {})
   /** Raw metric identifier */
   metric: OkfMetricUri | (string & {})
   /** Raw numerical measurement value */
   value: number
   /** Time of observation */
   timestamp: string | Date
   /** Original measurement metadata */
   metadata?: Record<string, any>
}

/**
 * Output contract representing a newly computed data point with complete lineage and audit trail.
 */
export interface ComputedDataPointOutput {
   /** Canonical device URI */
   device: DeviceUri | (string & {})
   /** Canonical plot URI */
   plot?: PlotUri | (string & {})
   /** Canonical company URI */
   company?: CompanyUri | (string & {})
   /** Computed metric identifier */
   metric: OkfMetricUri | (string & {})
   /** Derived calculated physical value */
   value: number
   /** Physical unit symbol */
   unit: string
   /** Fixed classification indicating algorithmic computation */
   kind: 'computed'
   /** Numerical confidence score */
   confidence: number
   /** Timestamp matching the source observation */
   timestamp: string | Date
   /** Comprehensive lineage metadata */
   metadata: {
      /** Quatrain metadata interface contract identifier */
      interface: InterfaceContractUri | (string & {})

      /** Algorithmic model code executed during replay */
      modelCode: string
      /** Algorithm semver version executed during replay */
      modelVersion: string
      /** Source raw data point UUID providing audit traceability */
      sourceDataPointId: string
      /** Execution parameters, calibrations, or texture presets used */
      executionParams?: Record<string, any>
      [key: string]: any
   }
}

/**
 * Deterministic Replay Engine.
 * Allows re-processing historical timeseries data points through updated or newly introduced
 * agronomic algorithms while maintaining full provenance and audit traceability.
 */
export class ReplayEngine {
   /**
    * Re-evaluates an array of raw historical DataPoints using a specified SensorConverter
    * and generates a set of fully traceable 'computed' DataPoints.
    *
    * @param dataPoints - Collection of raw input measurements.
    * @param converter - The target conversion algorithm instance to execute.
    * @param contextOverride - Optional contextual overrides (e.g. newly calibrated soil textures).
    * @returns Array of transformed computed DataPoints.
    */
   static replay(
      dataPoints: RawDataPointInput[],
      converter: SensorConverterInterface,
      contextOverride?: Partial<ConversionContext>,
   ): ComputedDataPointOutput[] {
      const results: ComputedDataPointOutput[] = []

      for (const dp of dataPoints) {
         const context: ConversionContext = {
            deviceId: dp.device,
            plotId: dp.plot,
            companyId: dp.company,
            timestamp: dp.timestamp,
            ...contextOverride,
         }

         const outputs: ConversionOutput[] = converter.convert(dp.value, context)

         for (const out of outputs) {
            results.push({
               device: dp.device,
               plot: dp.plot,
               company: dp.company,
               metric: out.metric,
               value: out.value,
               unit: out.unit,
               kind: 'computed',
               confidence: out.confidence,
               timestamp: dp.timestamp,
               metadata: {
                  interface: '@bradtech/types:ComputedMetadataInterface',
                  modelCode: converter.modelCode,
                  modelVersion: converter.modelVersion,
                  sourceDataPointId: dp.id,
                  executionParams: {
                     replayedAt: new Date().toISOString(),
                     contextUsed: context,
                     rawInput: dp.value,
                  },
                  ...out.metadata,
               },
            })
         }
      }

      return results
   }
}
