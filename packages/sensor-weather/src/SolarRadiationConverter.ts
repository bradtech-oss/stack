import { BaseSensorConverter, type ConversionContext, type ConversionOutput } from '@bradtech/sensor'

/**
 * Raw input reading from a solar pyranometer or photodiode.
 */
export interface SolarRadiationInput {
   /** Global broadband solar irradiance in $\text{W}/\text{m}^2$ */
   irradianceWm2: number
}

/**
 * Solar Pyranometer & Photosynthetically Active Radiation (PAR) Converter.
 *
 * Converts broadband global solar irradiance ($\text{W}/\text{m}^2$) into:
 * - Direct global solar irradiance ($\text{W}/\text{m}^2$).
 * - Photosynthetic Photon Flux Density ($PPFD$ in $\mu\text{mol}/(\text{m}^2\cdot\text{s})$) in the 400-700 nm spectral band:
 *   $$PPFD \approx \text{Irradiance} \cdot 0.45 \cdot 4.57 \approx \text{Irradiance} \cdot 2.056$$
 */
export class SolarRadiationConverter extends BaseSensorConverter<SolarRadiationInput> {
   /** Sensor domain family classification */
   readonly sensorFamily = 'weather'
   /** Unique algorithmic model code */
   readonly modelCode = 'solar-pyranometer-par-evaluator'
   /** Algorithm semver version */
   readonly modelVersion = '1.0.0'
   /** Human-readable model description */
   readonly description = 'Solar irradiance (W/m²) and PAR photon flux density (µmol/m²/s) converter'

   /**
    * Converts global solar irradiance into physical W/m² and photosynthetic photon flux density (PPFD).
    *
    * @param raw - Object containing global solar irradiance in W/m².
    * @param _context - Optional environmental context.
    * @returns Array containing irradiance and PAR PPFD metrics with daylight classification.
    */
   convert(raw: SolarRadiationInput, _context?: ConversionContext): ConversionOutput[] {
      const clamped = this.clampWithConfidence(raw.irradianceWm2, 0, 1500, 0, 1250)

      // PAR approximation: ~45% of total solar spectrum is PAR, with ~4.57 µmol/J conversion factor for sunlight
      const ppfd = clamped.value * 2.056
      const ppfdClamped = this.clampWithConfidence(ppfd, 0, 3000)

      return [
         {
            metric: 'okf:weather/solar/irradiance',
            value: clamped.value,
            unit: 'W/m²',
            qudtUri: 'qudt:unit/W-PER-M2',
            confidence: clamped.confidence,
         },
         {
            metric: 'okf:weather/solar/par_ppfd',
            value: ppfdClamped.value,
            unit: 'µmol/(m²·s)',
            qudtUri: 'qudt:unit/MicroMOL-PER-M2-SEC',
            confidence: clamped.confidence,
            metadata: {
               sunlightState: clamped.value > 800 ? 'intense_sun' : clamped.value > 200 ? 'daylight' : clamped.value > 10 ? 'overcast' : 'night',
            },
         },
      ]
   }
}
