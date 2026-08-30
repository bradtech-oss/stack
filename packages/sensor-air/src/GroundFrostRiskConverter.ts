import { BaseSensorConverter, type ConversionContext, type ConversionOutput } from '@bradtech/sensor'

/**
 * Microclimate temperature and relative humidity inputs for frost risk evaluation.
 */
export interface GroundFrostInput {
   /** Air temperature measured at plant/canopy height in °C ($T$) */
   canopyTemperature: number
   /** Relative humidity measured at plant/canopy height in % ($RH$) */
   canopyHumidity: number
}

/**
 * Radiative Ground Frost Risk & Wet-Bulb Temperature Converter.
 *
 * Implements the Roland Stull empirical formulation to compute the Psychrometric Wet-Bulb
 * Temperature ($T_w$ in °C), which is the exact physical temperature reached by plant leaves
 * and vegetative buds under radiative night cooling:
 *
 * $$T_w = T \cdot \arctan\left(0.151977 \cdot (RH + 8.313659)^{1/2}\right) + \arctan(T + RH) - \arctan(RH - 1.676331) + 0.00391838 \cdot RH^{3/2} \cdot \arctan(0.023101 \cdot RH) - 4.686035$$
 */
export class GroundFrostRiskConverter extends BaseSensorConverter<GroundFrostInput> {
   /** Sensor domain family classification */
   readonly sensorFamily = 'air'
   /** Unique algorithmic model code */
   readonly modelCode = 'ground-frost-risk-evaluator'
   /** Algorithm semver version */
   readonly modelVersion = '1.0.0'
   /** Human-readable model description */
   readonly description = 'Radiative ground frost risk and wet-bulb temperature calculator'

   /**
    * Converts canopy microclimate readings into wet-bulb temperature ($T_w$) and discrete agronomic frost severity index.
    *
    * @param raw - Object containing canopy temperature and relative humidity.
    * @param _context - Optional environmental conversion context.
    * @returns Array containing the wet-bulb temperature and the discrete frost risk index (0 to 3).
    */
   convert(raw: GroundFrostInput, _context?: ConversionContext): ConversionOutput[] {
      const T = raw.canopyTemperature
      const RH = raw.canopyHumidity

      // Stull formula for Wet Bulb Temperature (Tw in °C):
      const Tw =
         T * Math.atan(0.151977 * Math.pow(RH + 8.313659, 0.5)) +
         Math.atan(T + RH) -
         Math.atan(RH - 1.676331) +
         0.00391838 * Math.pow(RH, 1.5) * Math.atan(0.023101 * RH) -
         4.686035

      // Frost Risk Level: 0 (No risk), 1 (Monitoring, Tw < 3°C), 2 (Warning, Tw < 1°C), 3 (Severe Frost, Tw < 0°C)
      let frostRisk = 0
      if (Tw <= -0.5) frostRisk = 3
      else if (Tw <= 1.0) frostRisk = 2
      else if (Tw <= 3.0) frostRisk = 1

      const twClamped = this.clampWithConfidence(Tw, -40, 50)

      return [
         {
            metric: 'okf:agronomy/microclimate/wet_bulb_temperature',
            value: twClamped.value,
            unit: '°C',
            qudtUri: 'qudt:unit/DEG_C',
            confidence: twClamped.confidence,
         },
         {
            metric: 'okf:agronomy/risk/frost_index',
            value: frostRisk,
            unit: 'level',
            qudtUri: 'qudt:unit/UNITLESS',
            confidence: 1.0,
            metadata: {
               frostState: frostRisk === 3 ? 'severe' : frostRisk === 2 ? 'warning' : frostRisk === 1 ? 'watch' : 'none',
            },
         },
      ]
   }
}
