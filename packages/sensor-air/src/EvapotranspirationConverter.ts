import { BaseSensorConverter, type ConversionContext, type ConversionOutput } from '@bradtech/sensor'

/**
 * Daily temperature and radiation inputs required for reference evapotranspiration computation.
 */
export interface EvapotranspirationInput {
   /** Daily minimum canopy temperature in °C ($T_{min}$) */
   tempMin: number
   /** Daily maximum canopy temperature in °C ($T_{max}$) */
   tempMax: number
   /** Daily mean canopy temperature in °C ($T_{mean}$) */
   tempMean: number
   /** Global extraterrestrial or measured solar radiation flux in $\text{MJ}/(\text{m}^2\cdot\text{day})$ ($R_a$) */
   solarRadiationMj?: number
   /** Geographic plot latitude in decimal degrees (e.g. 44.8378 for Bordeaux) */
   latitudeDegrees?: number
   /** Julian day of year ($1 - 366$) */
   dayOfYear?: number
}

/**
 * Agronomic Daily Reference Evapotranspiration ($ET_0$) Converter.
 *
 * Implements the internationally recognized FAO-56 Hargreaves-Samani temperature-radiation formulation:
 * $$ET_0 = 0.0023 \cdot (T_{mean} + 17.8) \cdot \sqrt{T_{max} - T_{min}} \cdot R_a \cdot 0.408$$
 *
 * where $0.408$ represents the inverse of the latent heat of vaporization ($\lambda^{-1}$ in $\text{mm}/(\text{MJ}\cdot\text{m}^{-2})$).
 */
export class EvapotranspirationConverter extends BaseSensorConverter<EvapotranspirationInput> {
   /** Sensor domain family classification */
   readonly sensorFamily = 'air'
   /** Unique algorithmic model code */
   readonly modelCode = 'evapotranspiration-hargreaves-fao56'
   /** Algorithm semver version */
   readonly modelVersion = '1.0.0'
   /** Human-readable model description */
   readonly description = 'FAO-56 Hargreaves-Samani daily reference evapotranspiration (ET0) calculator'

   /**
    * Converts daily temperature extremes and radiation into daily reference crop evapotranspiration ($ET_0$ in mm/day).
    *
    * @param raw - Object containing $T_{min}, T_{max}, T_{mean}$, and optional radiation $R_a$.
    * @param _context - Optional environmental context.
    * @returns Single-element array containing the $ET_0$ metric in mm/day.
    */
   convert(raw: EvapotranspirationInput, _context?: ConversionContext): ConversionOutput[] {
      const deltaT = Math.max(0, raw.tempMax - raw.tempMin)
      const tMean = raw.tempMean

      // Extraterrestrial radiation estimate (Ra) if not provided directly
      let Ra = raw.solarRadiationMj
      if (!Ra || Ra <= 0) {
         // Default approximation for temperate European agricultural latitudes (~44°N)
         Ra = 25.0
      }

      // Hargreaves-Samani equation: ET0 = 0.0023 * (Tmean + 17.8) * sqrt(Tmax - Tmin) * Ra * 0.408
      const et0 = 0.0023 * (tMean + 17.8) * Math.sqrt(deltaT) * Ra * 0.408

      const clamped = this.clampWithConfidence(et0, 0, 15, 0, 10)

      return [
         {
            metric: 'okf:agronomy/evapotranspiration/et0',
            value: clamped.value,
            unit: 'mm/day',
            qudtUri: 'qudt:unit/MilliM',
            confidence: clamped.confidence,
            metadata: {
               method: 'Hargreaves-Samani-FAO56',
               tempRange: Number(deltaT.toFixed(2)),
               radiationMj: Ra,
            },
         },
      ]
   }
}
