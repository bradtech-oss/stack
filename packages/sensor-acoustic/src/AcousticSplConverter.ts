import { BaseSensorConverter, type ConversionContext, type ConversionOutput } from '@bradtech/sensor'

/**
 * Raw digital microphone audio inputs.
 */
export interface AcousticInput {
   /** Root Mean Square (RMS) audio energy in digital decibels relative to Full Scale ($\text{dBFS}$) */
   rmsDbfs: number
   /** Peak audio energy in digital decibels relative to Full Scale ($\text{dBFS}$) */
   peakDbfs?: number
   /** Microphone acoustic sensitivity offset (defaults to -26 dBFS @ 94 dB SPL) */
   microphoneSensitivityDbfs?: number
}

/**
 * Acoustic Sound Pressure Level (SPL) Converter.
 *
 * Converts raw digital MEMS microphone audio energy ($\text{dBFS}$) into physical Sound Pressure Level ($L_p$ in $\text{dBA SPL}$):
 * $$L_p = \text{RMS}_{dBFS} + 94 - S_{mic}$$
 */
export class AcousticSplConverter extends BaseSensorConverter<AcousticInput> {
   /** Sensor domain family classification */
   readonly sensorFamily = 'acoustic'
   /** Unique algorithmic model code */
   readonly modelCode = 'acoustic-spl-dba-evaluator'
   /** Algorithm semver version */
   readonly modelVersion = '1.0.0'
   /** Human-readable model description */
   readonly description = 'Microphone digital RMS to physical Sound Pressure Level (dBA SPL) converter'

   /**
    * Converts raw digital microphone decibels into physical Sound Pressure Level (dBA) with acoustic environment classification.
    *
    * @param raw - Object containing RMS and peak dBFS readings.
    * @param _context - Optional environmental context.
    * @returns Array containing the Sound Pressure Level metric in dBA.
    */
   convert(raw: AcousticInput, _context?: ConversionContext): ConversionOutput[] {
      // Standard calibrated conversion: SPL (dBA) = raw_dBFS + 94 - sensitivity
      const sensitivity = raw.microphoneSensitivityDbfs ?? -26.0
      const dbaSpl = raw.rmsDbfs + 94.0 - sensitivity

      const clamped = this.clampWithConfidence(dbaSpl, 20, 130, 25, 110)

      return [
         {
            metric: 'okf:environment/acoustic/sound_pressure_level',
            value: clamped.value,
            unit: 'dBA',
            qudtUri: 'qudt:unit/DeciB_A',
            confidence: clamped.confidence,
            metadata: {
               rmsDbfs: raw.rmsDbfs,
               peakDbfs: raw.peakDbfs,
               noiseEnvironment: clamped.value < 35 ? 'quiet_nature' : clamped.value < 55 ? 'moderate' : clamped.value < 75 ? 'noisy' : 'severe_noise',
            },
         },
      ]
   }
}
