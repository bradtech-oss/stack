import { BaseSensorConverter, type ConversionContext, type ConversionOutput } from '@bradtech/sensor'

/**
 * Raw solar panel voltage input.
 */
export interface SolarHarvestingInput {
   /** Solar photovoltaic panel open-circuit / charging voltage in millivolts */
   voltageMv?: number
   /** Solar photovoltaic panel open-circuit / charging voltage in Volts */
   voltageV?: number
}

/**
 * Solar Photovoltaic Energy Harvesting & Charging State Converter.
 * Normalizes photovoltaic panel voltage and evaluates solar charging activity.
 */
export class SolarHarvestingConverter extends BaseSensorConverter<SolarHarvestingInput> {
   /** Sensor domain family classification */
   readonly sensorFamily = 'power'
   /** Unique algorithmic model code */
   readonly modelCode = 'solar-harvesting-evaluator'
   /** Algorithm semver version */
   readonly modelVersion = '1.0.0'
   /** Human-readable model description */
   readonly description = 'Solar panel harvesting voltage and active charging state converter'

   /**
    * Converts raw solar panel voltage into physical Volts with active charging state detection.
    *
    * @param raw - Object containing solar panel voltage in mV or V.
    * @param _context - Optional environmental context.
    * @returns Array containing solar voltage metric and charging status metadata.
    */
   convert(raw: SolarHarvestingInput, _context?: ConversionContext): ConversionOutput[] {
      let mV = raw.voltageMv
      if (mV === undefined && raw.voltageV !== undefined) {
         mV = raw.voltageV * 1000.0
      }

      if (mV === undefined || isNaN(mV)) {
         return []
      }

      const voltageV = Number((mV / 1000.0).toFixed(3))
      const isHarvesting = mV > 4500 // Charging active above 4.5V threshold

      return [
         {
            metric: 'okf:power/solar/voltage',
            value: voltageV,
            unit: 'V',
            qudtUri: 'qudt:unit/V',
            confidence: 1.0,
            metadata: {
               voltageMv: Math.round(mV),
               isHarvesting,
            },
         },
      ]
   }
}
