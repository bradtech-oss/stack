import { BaseSensorConverter, type ConversionContext, type ConversionOutput } from '@bradtech/sensor'

/**
 * Raw input reading for depth-specific soil temperature.
 */
export interface SoilTemperatureInput {
   /** Sensor depth probe location in centimeters (e.g. 10, 20, 30 cm) */
   depthCm: number
   /** Soil temperature in °C */
   temperature: number
}

/**
 * Multi-depth Soil Temperature Profile Converter.
 * Normalizes multi-depth soil thermistor measurements with agronomic plausibility clamping.
 */
export class SoilTemperatureConverter extends BaseSensorConverter<SoilTemperatureInput> {
   /** Sensor domain family classification */
   readonly sensorFamily = 'soil'
   /** Unique algorithmic model code */
   readonly modelCode = 'soil-temperature-evaluator'
   /** Algorithm semver version */
   readonly modelVersion = '1.0.0'
   /** Human-readable model description */
   readonly description = 'Multi-depth soil profile temperature converter'

   /**
    * Converts raw soil temperature into depth-tagged physical metric records.
    *
    * @param raw - Object containing probe depth and measured temperature.
    * @param _context - Optional environmental context.
    * @returns Array containing the depth-tagged soil temperature metric.
    */
   convert(raw: SoilTemperatureInput, _context?: ConversionContext): ConversionOutput[] {
      const depth = raw.depthCm || 10
      const clamped = this.clampWithConfidence(raw.temperature, -20, 60, -10, 45)

      return [
         {
            metric: `okf:soil/temperature/${depth}cm`,
            value: clamped.value,
            unit: '°C',
            qudtUri: 'qudt:unit/DEG_C',
            confidence: clamped.confidence,
            metadata: { depthCm: depth },
         },
      ]
   }
}
