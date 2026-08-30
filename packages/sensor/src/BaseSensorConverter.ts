import type { ConversionContext, ConversionOutput, SensorConverterInterface } from './types'

/**
 * Abstract foundation class for all sensor converters.
 * Implements defensive physical clamping and automated confidence score degradation.
 *
 * @template TRaw - Raw sensor payload type.
 * @template TContext - Environmental and spatial context type.
 */
export abstract class BaseSensorConverter<TRaw = any, TContext extends ConversionContext = ConversionContext>
   implements SensorConverterInterface<TRaw, TContext>
{
   /** Domain sensor family classification (e.g. 'air', 'soil', 'weather', 'power', 'acoustic') */
   abstract readonly sensorFamily: string

   /** Unique machine-readable algorithmic identifier */
   abstract readonly modelCode: string

   /** Semantic version string of the algorithm implementation */
   abstract readonly modelVersion: string

   /** Detailed description of conversion algorithm */
   abstract readonly description: string

   /**
    * Executes the mathematical conversion from raw sensor signals to normalized physical outputs.
    *
    * @param raw - The raw sensor reading or observation payload.
    * @param context - Optional environmental, soil texture, or calibration parameters.
    * @returns An array of normalized physical conversion outputs.
    */
   abstract convert(raw: TRaw, context?: TContext): ConversionOutput[]

   /**
    * Clamps a numerical value within strict physical limits while calculating
    * a continuous quality confidence score (between 0.0 and 1.0).
    *
    * @param value - The input numerical reading to evaluate.
    * @param minPhysical - The absolute lower physical limit (e.g. -40°C for ambient air).
    * @param maxPhysical - The absolute upper physical limit (e.g. +70°C for ambient air).
    * @param minWarning - Optional soft lower warning threshold where confidence begins to degrade.
    * @param maxWarning - Optional soft upper warning threshold where confidence begins to degrade.
    * @returns Object containing the clamped value and the calculated confidence score.
    */
   protected clampWithConfidence(
      value: number,
      minPhysical: number,
      maxPhysical: number,
      minWarning?: number,
      maxWarning?: number,
   ): { value: number; confidence: number } {
      if (isNaN(value) || !isFinite(value)) {
         return { value: 0, confidence: 0.0 }
      }

      if (value < minPhysical) {
         return { value: minPhysical, confidence: 0.1 }
      }
      if (value > maxPhysical) {
         return { value: maxPhysical, confidence: 0.1 }
      }

      let confidence = 1.0

      if (minWarning !== undefined && value < minWarning) {
         confidence = Math.max(0.3, 1.0 - (minWarning - value) / (minWarning - minPhysical))
      } else if (maxWarning !== undefined && value > maxWarning) {
         confidence = Math.max(0.3, 1.0 - (value - maxWarning) / (maxPhysical - maxWarning))
      }

      return {
         value: Number(value.toFixed(4)),
         confidence: Number(confidence.toFixed(2)),
      }
   }
}
