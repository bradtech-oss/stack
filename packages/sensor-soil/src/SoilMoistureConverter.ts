import { BaseSensorConverter, type ConversionContext, type ConversionOutput } from '@bradtech/sensor'

/**
 * Raw input parameters for soil volumetric water content evaluation.
 */
export interface SoilMoistureInput {
   /** Sensor depth probe location in centimeters (10, 20, 30 cm) */
   depthCm: 10 | 20 | 30 | number
   /** Raw dielectric permittivity or capacitive reading from the probe */
   rawValue: number
   /** Soil temperature at the same depth in °C for thermal drift compensation */
   soilTemperature?: number
}

/**
 * Multi-depth Soil Moisture & Volumetric Water Content (VWC %) Converter.
 *
 * Implements:
 * - Texture-specific linear regression calibration curves (Sand, Loam, Clay, Silt, Peat):
 *   $$VWC = a \cdot \text{raw} + b$$
 * - Custom plot-specific laboratory calibration model overrides ($y = \text{slope} \cdot x + \text{intercept}$).
 * - Dielectric permittivity temperature compensation normalized to 20°C:
 *   $$VWC_{comp} = VWC - (T_{soil} - 20) \cdot 0.04$$
 */
export class SoilMoistureConverter extends BaseSensorConverter<SoilMoistureInput> {
   /** Sensor domain family classification */
   readonly sensorFamily = 'soil'
   /** Unique algorithmic model code */
   readonly modelCode = 'soil-vwc-texture-calibrated'
   /** Algorithm semver version */
   readonly modelVersion = '1.0.0'
   /** Human-readable model description */
   readonly description = 'Texture-calibrated multi-depth soil volumetric water content converter'

   /** Standard USDA soil texture regression coefficients [slope a, intercept b] */
   private static TEXTURE_COEFFICIENTS: Record<string, { slope: number; intercept: number }> = {
      sand: { slope: 0.92, intercept: -0.5 },
      loam: { slope: 1.0, intercept: 0.0 },
      clay: { slope: 1.15, intercept: 1.2 },
      silt: { slope: 1.05, intercept: 0.5 },
      peat: { slope: 1.25, intercept: 2.0 },
      default: { slope: 1.0, intercept: 0.0 },
   }

   /**
    * Converts raw capacitive probe readings into physical volumetric water content percentage (% VWC).
    *
    * @param raw - Raw sensor reading containing depth and uncalibrated value.
    * @param context - Optional context providing soil texture classification or custom laboratory calibration models.
    * @returns Array containing the calibrated soil moisture metric for the corresponding depth.
    */
   convert(raw: SoilMoistureInput, context?: ConversionContext): ConversionOutput[] {
      const textureKey = context?.soilTexture || 'default'
      const presetCoeff = SoilMoistureConverter.TEXTURE_COEFFICIENTS[textureKey] || SoilMoistureConverter.TEXTURE_COEFFICIENTS.default

      // Check for plot-specific custom linear regression calibration model: y = slope * x + intercept
      const customRegression = context?.soilLinearRegression || context?.calibration?.linearRegression
      const slope = typeof customRegression?.slope === 'number' ? customRegression.slope : presetCoeff.slope
      const intercept = typeof customRegression?.intercept === 'number' ? customRegression.intercept : presetCoeff.intercept
      const calibrationType = customRegression ? 'custom_linear_regression' : 'texture_preset'

      // Apply linear regression calibration: VWC (%) = a * raw + b
      let vwc = raw.rawValue * slope + intercept

      // Apply temperature compensation if soil temperature is known (standard reference at 20°C)
      if (raw.soilTemperature !== undefined) {
         const tempDelta = raw.soilTemperature - 20.0
         // Dielectric permittivity of water decreases ~0.4%/°C
         vwc = vwc - tempDelta * 0.04
      }

      // Clamp between 0% (oven dry) and 100% (free water saturation)
      const clamped = this.clampWithConfidence(vwc, 0, 100, 0, 70)
      const depth = raw.depthCm || 10

      return [
         {
            metric: `okf:soil/moisture/${depth}cm`,
            value: clamped.value,
            unit: '%',
            qudtUri: 'qudt:unit/PERCENT',
            confidence: clamped.confidence,
            metadata: {
               depthCm: depth,
               soilTexture: textureKey,
               calibrationType,
               calibrationSlope: slope,
               calibrationIntercept: intercept,
               customModelLabel: customRegression?.modelLabel,
               rawInput: raw.rawValue,
            },
         },
      ]
   }
}
