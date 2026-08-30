import { BaseSensorConverter, type ConversionContext, type ConversionOutput } from '@bradtech/sensor'

/**
 * Raw barometric station pressure reading and altitude parameters.
 */
export interface BarometricPressureInput {
   /** Absolute local barometric pressure in hPa ($P_{station}$) */
   pressureHpa: number
   /** Station elevation above mean sea level in meters ($h$) */
   altitudeMeters?: number
   /** Ambient air temperature in °C for air column density correction */
   temperatureC?: number
}

/**
 * Barometric Pressure & QNH Altimetric Reduction Converter.
 *
 * Normalizes absolute station barometric pressure to Mean Sea Level (MSL / QNH)
 * using the international hypsometric barometric reduction formula:
 *
 * $$P_{sea} = P_{station} \cdot \left(1 - \frac{0.0065 \cdot h}{T_K + 0.0065 \cdot h}\right)^{-5.257}$$
 */
export class BarometricPressureConverter extends BaseSensorConverter<BarometricPressureInput> {
   /** Sensor domain family classification */
   readonly sensorFamily = 'weather'
   /** Unique algorithmic model code */
   readonly modelCode = 'barometric-pressure-qnh-normalizer'
   /** Algorithm semver version */
   readonly modelVersion = '1.0.0'
   /** Human-readable model description */
   readonly description = 'Barometric pressure (hPa) and sea-level QNH reduction converter'

   /**
    * Converts absolute barometric pressure into standard station pressure and sea-level reduced QNH.
    *
    * @param raw - Object containing absolute pressure and station altitude.
    * @param context - Optional context supplying plot elevation and ambient temperature.
    * @returns Array containing absolute pressure and sea-level reduced pressure metrics.
    */
   convert(raw: BarometricPressureInput, context?: ConversionContext): ConversionOutput[] {
      const outputs: ConversionOutput[] = []
      const clampedAbs = this.clampWithConfidence(raw.pressureHpa, 800, 1100, 870, 1085)

      outputs.push({
         metric: 'okf:weather/atmosphere/pressure_absolute',
         value: clampedAbs.value,
         unit: 'hPa',
         qudtUri: 'qudt:unit/HectoPA',
         confidence: clampedAbs.confidence,
      })

      // QNH Calculation if altitude is available
      const altitude = raw.altitudeMeters || context?.altitudeMeters
      if (altitude !== undefined) {
         const tempK = (raw.temperatureC || context?.ambientTemperature || 15.0) + 273.15
         // Hypsometric equation: P_sea = P_station * (1 - (0.0065 * h) / (T + 0.0065 * h + 273.15)) ^ (-5.257)
         const qnh = clampedAbs.value * Math.pow(1.0 - (0.0065 * altitude) / (tempK + 0.0065 * altitude), -5.257)
         const clampedQnh = this.clampWithConfidence(qnh, 850, 1100)

         outputs.push({
            metric: 'okf:weather/atmosphere/pressure_msl',
            value: clampedQnh.value,
            unit: 'hPa',
            qudtUri: 'qudt:unit/HectoPA',
            confidence: clampedQnh.confidence,
            metadata: {
               altitudeMeters: altitude,
               pressureTendency: clampedQnh.value > 1013.25 ? 'high_pressure' : 'low_pressure',
            },
         })
      }

      return outputs
   }
}
