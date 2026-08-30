import { BaseSensorConverter, type ConversionContext, type ConversionOutput } from '@bradtech/sensor'

/**
 * Input parameters for matric water potential and pF calculation.
 */
export interface SoilWaterPotentialInput {
   /** Sensor depth probe location in centimeters */
   depthCm: number
   /** Volumetric water content in % (0 - 100) */
   vwcPercent: number
}

/**
 * Soil Matric Water Potential ($\Psi_m$ in kPa) & pF Retention Converter.
 *
 * Implements the Mualem-van Genuchten hydraulic retention model to relate volumetric
 * water content ($\theta$) to matric suction pressure head ($h$ in cm of water) and logarithmic pF scale:
 *
 * $$S_e = \frac{\theta - \theta_r}{\theta_s - \theta_r}, \quad m = 1 - \frac{1}{n}$$
 * $$h = \frac{1}{\alpha} \left(S_e^{-1/m} - 1\right)^{1/n}, \quad \Psi_m = -h \cdot 0.0980665 \text{ kPa}$$
 * $$pF = \log_{10}(h_{cm})$$
 */
export class SoilWaterPotentialConverter extends BaseSensorConverter<SoilWaterPotentialInput> {
   /** Sensor domain family classification */
   readonly sensorFamily = 'soil'
   /** Unique algorithmic model code */
   readonly modelCode = 'soil-water-potential-van-genuchten'
   /** Algorithm semver version */
   readonly modelVersion = '1.0.0'
   /** Human-readable model description */
   readonly description = 'Van Genuchten soil water retention and pF water potential calculator'

   /** Van Genuchten soil hydraulic retention parameters [$\alpha$, $n$, $\theta_r$, $\theta_s$] */
   private static SOIL_VG_PARAMS: Record<string, { alpha: number; n: number; thetaR: number; thetaS: number }> = {
      sand: { alpha: 0.145, n: 2.68, thetaR: 4.5, thetaS: 43.0 },
      loam: { alpha: 0.036, n: 1.56, thetaR: 7.8, thetaS: 43.0 },
      clay: { alpha: 0.008, n: 1.09, thetaR: 6.8, thetaS: 38.0 },
      silt: { alpha: 0.016, n: 1.37, thetaR: 3.4, thetaS: 46.0 },
      default: { alpha: 0.036, n: 1.56, thetaR: 7.8, thetaS: 43.0 },
   }

   /**
    * Converts volumetric water content percentage into matric water potential (kPa) and pF availability scale.
    *
    * @param raw - Object containing probe depth and VWC percentage.
    * @param context - Optional context specifying soil textural class.
    * @returns Array containing both matric potential (kPa) and pF metrics.
    */
   convert(raw: SoilWaterPotentialInput, context?: ConversionContext): ConversionOutput[] {
      const textureKey = context?.soilTexture || 'default'
      const params = SoilWaterPotentialConverter.SOIL_VG_PARAMS[textureKey] || SoilWaterPotentialConverter.SOIL_VG_PARAMS.default

      const theta = Math.min(params.thetaS - 0.1, Math.max(params.thetaR + 0.1, raw.vwcPercent))
      const Se = (theta - params.thetaR) / (params.thetaS - params.thetaR) // Effective saturation
      const m = 1.0 - 1.0 / params.n

      // Matric suction head (h in cm of water column): h = (1/alpha) * (Se^(-1/m) - 1)^(1/n)
      const hCm = (1.0 / params.alpha) * Math.pow(Math.pow(Se, -1.0 / m) - 1.0, 1.0 / params.n)

      // Convert head cm to matric potential in kPa: 1 cm H2O ≈ 0.0980665 kPa
      const potentialKpa = -(hCm * 0.0980665)

      // pF = log10(h in cm)
      const pF = Math.log10(Math.max(1.0, hCm))

      const pFClamped = this.clampWithConfidence(pF, 0, 7.0)
      const kpaClamped = this.clampWithConfidence(potentialKpa, -2000, 0)
      const depth = raw.depthCm || 10

      return [
         {
            metric: `okf:soil/potential/matric/${depth}cm`,
            value: kpaClamped.value,
            unit: 'kPa',
            qudtUri: 'qudt:unit/KiloPA',
            confidence: pFClamped.confidence,
            metadata: {
               depthCm: depth,
               soilTexture: textureKey,
            },
         },
         {
            metric: `okf:soil/potential/pf/${depth}cm`,
            value: pFClamped.value,
            unit: 'pF',
            qudtUri: 'qudt:unit/UNITLESS',
            confidence: pFClamped.confidence,
            metadata: {
               depthCm: depth,
               soilTexture: textureKey,
               waterAvailabilityState: pF < 2.0 ? 'saturated' : pF < 2.5 ? 'field_capacity' : pF < 3.8 ? 'readily_available' : pF < 4.2 ? 'water_stress' : 'wilting_point',
            },
         },
      ]
   }
}
