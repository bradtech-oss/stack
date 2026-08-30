import { BaseSensorConverter, type ConversionContext, type ConversionOutput } from '@bradtech/sensor'

/**
 * Frequency sub-band acoustic energy inputs.
 */
export interface AcousticWeatherInput {
   /** High-frequency acoustic band energy (3 kHz - 8 kHz) corresponding to rain droplet impacts on enclosure */
   highFrequencyEnergyRms: number
   /** Low-frequency acoustic band energy (50 Hz - 300 Hz) corresponding to wind aerodynamic turbulence */
   lowFrequencyEnergyRms: number
}

/**
 * Acoustic Weather Detection & Turbulence Converter.
 * Evaluates rainfall impact intensity and wind turbulence buffeting from acoustic frequency spectra.
 */
export class AcousticWeatherConverter extends BaseSensorConverter<AcousticWeatherInput> {
   /** Sensor domain family classification */
   readonly sensorFamily = 'acoustic'
   /** Unique algorithmic model code */
   readonly modelCode = 'acoustic-weather-spectral-evaluator'
   /** Algorithm semver version */
   readonly modelVersion = '1.0.0'
   /** Human-readable model description */
   readonly description = 'Acoustic rain droplet impact and wind buffeting index converter'

   /**
    * Converts frequency band energies into physical rain impact scores and wind turbulence indicators.
    *
    * @param raw - Object containing high-frequency and low-frequency spectral RMS energy levels.
    * @param _context - Optional environmental context.
    * @returns Array containing rain impact score and wind buffeting score metrics.
    */
   convert(raw: AcousticWeatherInput, _context?: ConversionContext): ConversionOutput[] {
      // High frequency rain index (0-100)
      const rainIndex = Math.min(100, Math.max(0, (raw.highFrequencyEnergyRms + 80) * 1.5))
      // Low frequency wind index (0-100)
      const windIndex = Math.min(100, Math.max(0, (raw.lowFrequencyEnergyRms + 70) * 1.8))

      const rainClamped = this.clampWithConfidence(rainIndex, 0, 100)
      const windClamped = this.clampWithConfidence(windIndex, 0, 100)

      return [
         {
            metric: 'okf:environment/acoustic/rain_impact_score',
            value: rainClamped.value,
            unit: 'index',
            qudtUri: 'qudt:unit/UNITLESS',
            confidence: rainClamped.confidence,
            metadata: {
               isAcousticRainDetected: rainClamped.value > 25,
            },
         },
         {
            metric: 'okf:environment/acoustic/wind_buffeting_score',
            value: windClamped.value,
            unit: 'index',
            qudtUri: 'qudt:unit/UNITLESS',
            confidence: windClamped.confidence,
            metadata: {
               isTurbulenceDetected: windClamped.value > 30,
            },
         },
      ]
   }
}
