import { BaseSensorConverter, type ConversionContext, type ConversionOutput } from '@bradtech/sensor'

/**
 * Raw anemometer and wind vane observations.
 */
export interface WindInput {
   /** Wind speed in m/s (or km/h if isKmh=true) */
   speedMs: number
   /** Compass wind azimuth direction in degrees ($0 - 360^\circ$) */
   directionDegrees?: number
   /** Flag indicating that the speed is supplied in km/h rather than m/s */
   isKmh?: boolean
}

/**
 * Weather Station Wind Anemometer & Vane Converter.
 *
 * Converts wind speed measurements into:
 * - Wind speed in km/h and m/s.
 * - Standard Beaufort wind scale index ($0 - 12$).
 * - 16-point cardinal compass direction (N, NNE, NE, ENE, E, ESE, SE, SSE, S, SSW, SW, WSW, W, WNW, NW, NNW).
 */
export class WindConverter extends BaseSensorConverter<WindInput> {
   /** Sensor domain family classification */
   readonly sensorFamily = 'weather'
   /** Unique algorithmic model code */
   readonly modelCode = 'wind-speed-vane-evaluator'
   /** Algorithm semver version */
   readonly modelVersion = '1.0.0'
   /** Human-readable model description */
   readonly description = 'Wind speed (m/s, km/h) and 16-cardinal direction vane converter'

   /** 16-point compass cardinal labels */
   private static CARDINALS = [
      'N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE',
      'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW', 'N',
   ]

   /**
    * Converts raw anemometer and wind vane readings into physical speed, Beaufort force, and compass direction.
    *
    * @param raw - Object containing wind speed and optional wind azimuth angle.
    * @param _context - Optional environmental context.
    * @returns Array containing wind speed and wind direction metrics.
    */
   convert(raw: WindInput, _context?: ConversionContext): ConversionOutput[] {
      const outputs: ConversionOutput[] = []

      // Speed conversion
      const speedMs = raw.isKmh ? raw.speedMs / 3.6 : raw.speedMs
      const speedKmh = speedMs * 3.6

      const clampedSpeed = this.clampWithConfidence(speedKmh, 0, 250, 0, 150)
      outputs.push({
         metric: 'okf:weather/wind/speed',
         value: clampedSpeed.value,
         unit: 'km/h',
         qudtUri: 'qudt:unit/KiloM-PER-HR',
         confidence: clampedSpeed.confidence,
         metadata: {
            speedMs: Number(speedMs.toFixed(2)),
            beaufortScale: this._getBeaufort(speedKmh),
         },
      })

      // Direction conversion
      if (raw.directionDegrees !== undefined) {
         const degNormalized = ((raw.directionDegrees % 360) + 360) % 360
         const cardinalIdx = Math.round(degNormalized / 22.5) % 16
         const cardinal = WindConverter.CARDINALS[cardinalIdx]

         outputs.push({
            metric: 'okf:weather/wind/direction',
            value: Number(degNormalized.toFixed(1)),
            unit: '°',
            qudtUri: 'qudt:unit/DEG',
            confidence: 1.0,
            metadata: { cardinal },
         })
      }

      return outputs
   }

   /**
    * Computes the discrete empirical Beaufort scale level from wind speed in km/h.
    *
    * @param kmh - Wind speed in km/h.
    * @returns Integer Beaufort force (0 to 12).
    */
   private _getBeaufort(kmh: number): number {
      if (kmh < 1) return 0
      if (kmh < 6) return 1
      if (kmh < 12) return 2
      if (kmh < 20) return 3
      if (kmh < 29) return 4
      if (kmh < 39) return 5
      if (kmh < 50) return 6
      if (kmh < 62) return 7
      if (kmh < 75) return 8
      if (kmh < 89) return 9
      if (kmh < 103) return 10
      if (kmh < 118) return 11
      return 12
   }
}
