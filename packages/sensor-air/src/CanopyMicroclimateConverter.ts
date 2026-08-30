import { BaseSensorConverter, type ConversionContext, type ConversionOutput } from '@bradtech/sensor'

/**
 * Raw input reading for canopy-level ambient microclimate.
 */
export interface CanopyAirReading {
   /** In-canopy air temperature in °C */
   temperature: number
   /** In-canopy relative humidity in % (0 - 100) */
   humidity: number
}

/**
 * In-plot Canopy Microclimate & Foliar VPD Converter.
 *
 * Computes:
 * - Direct canopy temperature (°C)
 * - Direct canopy relative humidity (%)
 * - Foliar Dew Point (°C) via Magnus-Tetens formula:
 *   $$\gamma = \frac{a \cdot T}{b + T} + \ln\left(\frac{RH}{100}\right), \quad T_{dew} = \frac{b \cdot \gamma}{a - \gamma}$$
 * - Foliar Vapor Pressure Deficit ($VPD_{canopy}$ in kPa) via Tetens saturation vapor pressure:
 *   $$e_s(T) = 0.61078 \cdot \exp\left(\frac{17.27 \cdot T}{T + 237.3}\right), \quad VPD = e_s(T) \cdot \left(1 - \frac{RH}{100}\right)$$
 */
export class CanopyMicroclimateConverter extends BaseSensorConverter<CanopyAirReading> {
   /** Sensor domain family classification */
   readonly sensorFamily = 'air'
   /** Unique algorithmic model code */
   readonly modelCode = 'canopy-microclimate-evaluator'
   /** Algorithm semver version */
   readonly modelVersion = '1.0.0'
   /** Human-readable model description */
   readonly description = 'In-plot canopy microclimate, foliar VPD, and dew point converter'

   /**
    * Converts raw canopy temperature and humidity readings into normalized microclimate and bioclimatic indicators.
    *
    * @param raw - Object containing canopy temperature and relative humidity.
    * @param _context - Optional environmental conversion context.
    * @returns Array containing temperature, humidity, dew point, and foliar VPD metrics.
    */
   convert(raw: CanopyAirReading, _context?: ConversionContext): ConversionOutput[] {
      const outputs: ConversionOutput[] = []

      // 1. Canopy Temperature
      const tempClamped = this.clampWithConfidence(raw.temperature, -40, 65, -20, 50)
      outputs.push({
         metric: 'okf:agronomy/microclimate/canopy_temperature',
         value: tempClamped.value,
         unit: '°C',
         qudtUri: 'qudt:unit/DEG_C',
         confidence: tempClamped.confidence,
      })

      // 2. Canopy Relative Humidity
      const humClamped = this.clampWithConfidence(raw.humidity, 0, 100)
      outputs.push({
         metric: 'okf:agronomy/microclimate/canopy_humidity',
         value: humClamped.value,
         unit: '%',
         qudtUri: 'qudt:unit/PERCENT',
         confidence: humClamped.confidence,
      })

      // 3. Foliar Dew Point (Magnus-Tetens)
      const T = tempClamped.value
      const RH = Math.max(0.1, humClamped.value)
      const a = 17.27
      const b = 237.7
      const gamma = (a * T) / (b + T) + Math.log(RH / 100.0)
      const dewPoint = (b * gamma) / (a - gamma)
      const dewPointClamped = this.clampWithConfidence(dewPoint, -50, 50)

      outputs.push({
         metric: 'okf:agronomy/microclimate/dew_point',
         value: dewPointClamped.value,
         unit: '°C',
         qudtUri: 'qudt:unit/DEG_C',
         confidence: Math.min(tempClamped.confidence, humClamped.confidence),
         metadata: { formula: 'Magnus-Tetens' },
      })

      // 4. Foliar Vapor Pressure Deficit (VPD in kPa)
      const es = 0.61078 * Math.exp((17.27 * T) / (T + 237.3))
      const ea = es * (RH / 100.0)
      const vpd = Math.max(0, es - ea)
      const vpdClamped = this.clampWithConfidence(vpd, 0, 10, 0, 5)

      outputs.push({
         metric: 'okf:agronomy/plant/foliar_vpd',
         value: vpdClamped.value,
         unit: 'kPa',
         qudtUri: 'qudt:unit/KiloPA',

         confidence: Math.min(tempClamped.confidence, humClamped.confidence),
         metadata: {
            saturationVaporPressureKpa: Number(es.toFixed(3)),
            actualVaporPressureKpa: Number(ea.toFixed(3)),
            transpirationStress: vpd > 2.0 ? 'high_water_stress' : vpd < 0.4 ? 'low_transpiration_fungal_risk' : 'optimal',
         },
      })

      return outputs
   }
}
