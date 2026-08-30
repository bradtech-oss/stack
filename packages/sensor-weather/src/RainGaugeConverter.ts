import { BaseSensorConverter, type ConversionContext, type ConversionOutput } from '@bradtech/sensor'

/**
 * Pulse counter inputs from a tipping bucket rain gauge.
 */
export interface RainGaugeInput {
   /** Number of bucket tip pulses counted during the sampling interval */
   tipCount: number
   /** Sampling duration in minutes (defaults to 15 minutes) */
   intervalMinutes?: number
   /** Rain volume resolution per mechanical tip in millimeters (defaults to 0.2 mm) */
   mmPerTip?: number
}

/**
 * Tipping-Bucket Pluviometer & Rain Rate Converter.
 *
 * Converts mechanical bucket tip pulses into:
 * - Period rainfall accumulation ($\Delta P$ in mm): $\Delta P = \text{tipCount} \cdot \text{resolution}$
 * - Instantaneous rainfall precipitation rate ($I$ in mm/h): $I = \frac{\Delta P}{\Delta t} \cdot 60$
 */
export class RainGaugeConverter extends BaseSensorConverter<RainGaugeInput> {
   /** Sensor domain family classification */
   readonly sensorFamily = 'weather'
   /** Unique algorithmic model code */
   readonly modelCode = 'rain-gauge-tipping-bucket'
   /** Algorithm semver version */
   readonly modelVersion = '1.0.0'
   /** Human-readable model description */
   readonly description = 'Tipping bucket rainfall accumulation (mm) and rate (mm/h) converter'

   /**
    * Converts bucket pulses into physical rainfall accumulation (mm) and hourly intensity rate (mm/h).
    *
    * @param raw - Object containing tip pulses and interval duration.
    * @param _context - Optional environmental context.
    * @returns Array containing interval accumulation and precipitation rate metrics.
    */
   convert(raw: RainGaugeInput, _context?: ConversionContext): ConversionOutput[] {
      const resolution = raw.mmPerTip || 0.2
      const interval = raw.intervalMinutes || 15
      const totalMm = raw.tipCount * resolution
      const rateMmPerHour = (totalMm / interval) * 60.0

      const clampedTotal = this.clampWithConfidence(totalMm, 0, 500)
      const clampedRate = this.clampWithConfidence(rateMmPerHour, 0, 300)

      return [
         {
            metric: 'okf:weather/rain/accumulation',
            value: clampedTotal.value,
            unit: 'mm',
            qudtUri: 'qudt:unit/MilliM',
            confidence: clampedTotal.confidence,
            metadata: {
               tipCount: raw.tipCount,
               resolutionMm: resolution,
               intervalMinutes: interval,
            },
         },
         {
            metric: 'okf:weather/rain/rate',
            value: clampedRate.value,
            unit: 'mm/h',
            qudtUri: 'qudt:unit/MilliM-PER-HR',
            confidence: clampedRate.confidence,
            metadata: {
               rainIntensity: clampedRate.value === 0 ? 'none' : clampedRate.value < 2.5 ? 'light' : clampedRate.value < 10 ? 'moderate' : clampedRate.value < 50 ? 'heavy' : 'violent',
            },
         },
      ]
   }
}
