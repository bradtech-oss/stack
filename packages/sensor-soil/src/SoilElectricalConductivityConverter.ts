import { BaseSensorConverter, type ConversionContext, type ConversionOutput } from '@bradtech/sensor'

/**
 * Raw input reading for soil bulk electrical conductivity.
 */
export interface SoilEcInput {
   /** Sensor depth probe location in centimeters */
   depthCm: number
   /** Bulk electrical conductivity reading in mS/cm ($dS/m$) */
   bulkEcMsCm: number
   /** Soil temperature at probe depth in °C */
   soilTemperature?: number
}

/**
 * Soil Bulk Electrical Conductivity & Salinity Converter.
 *
 * Normalizes bulk EC readings to the international agronomic standard reference temperature of 25°C ($EC_{25}$):
 * $$EC_{25} = \frac{EC_T}{1 + 0.019 \cdot (T_{soil} - 25)}$$
 */
export class SoilElectricalConductivityConverter extends BaseSensorConverter<SoilEcInput> {
   /** Sensor domain family classification */
   readonly sensorFamily = 'soil'
   /** Unique algorithmic model code */
   readonly modelCode = 'soil-ec-temperature-normalized'
   /** Algorithm semver version */
   readonly modelVersion = '1.0.0'
   /** Human-readable model description */
   readonly description = 'Temperature-normalized soil electrical conductivity converter'

   /**
    * Converts raw bulk EC into normalized 25°C salinity metrics with agronomic salinity classification.
    *
    * @param raw - Object containing probe depth, measured EC, and soil temperature.
    * @param _context - Optional environmental context.
    * @returns Array containing the temperature-compensated EC metric in mS/cm.
    */
   convert(raw: SoilEcInput, _context?: ConversionContext): ConversionOutput[] {
      let ec25 = raw.bulkEcMsCm

      // Temperature compensation: EC_25 = EC_T / (1 + 0.019 * (T - 25))
      if (raw.soilTemperature !== undefined) {
         ec25 = raw.bulkEcMsCm / (1.0 + 0.019 * (raw.soilTemperature - 25.0))
      }

      const clamped = this.clampWithConfidence(ec25, 0, 20, 0, 10)
      const depth = raw.depthCm || 10

      return [
         {
            metric: `okf:soil/conductivity/ec/${depth}cm`,
            value: clamped.value,
            unit: 'mS/cm',
            qudtUri: 'qudt:unit/MilliS-PER-M',
            confidence: clamped.confidence,
            metadata: {
               depthCm: depth,
               salinityClass: ec25 < 2.0 ? 'non_saline' : ec25 < 4.0 ? 'slightly_saline' : 'moderately_saline',
            },
         },
      ]
   }
}
