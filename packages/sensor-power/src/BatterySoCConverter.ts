import { BaseSensorConverter, type ConversionContext, type ConversionOutput } from '@bradtech/sensor'

/**
 * Raw input reading for battery voltage and chemistry type.
 */
export interface BatteryInput {
   /** Direct voltage reading in millivolts (e.g. 3850 mV) */
   voltageMv?: number
   /** Direct voltage reading in Volts (e.g. 3.85 V) */
   voltageV?: number
   /** Battery chemistry classification */
   chemistry?: 'li_ion' | 'lifepo4' | 'alkaline' | 'supercap'
}

/**
 * Battery State of Charge (SoC %) and Brownout Health Converter.
 *
 * Implements non-linear Open-Circuit Voltage (OCV) curve interpolation for Lithium-Ion
 * ($\text{LiCoO}_2 / \text{NMC}$, 3.7V nominal) and Lithium Iron Phosphate ($\text{LiFePO}_4$, 3.2V nominal),
 * providing accurate percentage estimation and critical brownout warnings.
 */
export class BatterySoCConverter extends BaseSensorConverter<BatteryInput> {
   /** Sensor domain family classification */
   readonly sensorFamily = 'power'
   /** Unique algorithmic model code */
   readonly modelCode = 'battery-soc-chemistry-interpolator'
   /** Algorithm semver version */
   readonly modelVersion = '1.0.0'
   /** Human-readable model description */
   readonly description = 'Non-linear battery State-of-Charge (%) and brownout health converter'

   /** Li-Ion (3.7V nominal, 4.2V max) 11-point OCV curve: [mV, %] */
   private static LI_ION_CURVE: Array<[number, number]> = [
      [4200, 100],
      [4100, 90],
      [4000, 78],
      [3900, 65],
      [3800, 52],
      [3730, 38],
      [3680, 25],
      [3600, 15],
      [3500, 8],
      [3400, 3],
      [3200, 0],
   ]

   /** LiFePO4 (3.2V nominal, 3.65V max) OCV curve: [mV, %] */
   private static LIFEPO4_CURVE: Array<[number, number]> = [
      [3650, 100],
      [3400, 95],
      [3340, 90],
      [3320, 70],
      [3290, 40],
      [3250, 20],
      [3200, 10],
      [3000, 4],
      [2800, 0],
   ]

   /**
    * Converts raw battery voltage into calibrated Voltage (V) and State-of-Charge percentage (% SoC).
    *
    * @param raw - Object containing voltage reading in mV or V and optional chemistry.
    * @param context - Optional context providing device battery chemistry type.
    * @returns Array containing battery voltage (V) and battery percentage (%) metrics.
    */
   convert(raw: BatteryInput, context?: ConversionContext): ConversionOutput[] {
      let mV = raw.voltageMv
      if (mV === undefined && raw.voltageV !== undefined) {
         mV = raw.voltageV * 1000.0
      }

      if (mV === undefined || isNaN(mV)) {
         return []
      }

      const chemistry = raw.chemistry || context?.batteryChemistry || 'li_ion'
      const curve = chemistry === 'lifepo4' ? BatterySoCConverter.LIFEPO4_CURVE : BatterySoCConverter.LI_ION_CURVE

      // Interpolate SoC %
      let socPercent = 0
      if (mV >= curve[0][0]) {
         socPercent = 100
      } else if (mV <= curve[curve.length - 1][0]) {
         socPercent = 0
      } else {
         for (let i = 0; i < curve.length - 1; i++) {
            const [vHigh, pHigh] = curve[i]
            const [vLow, pLow] = curve[i + 1]
            if (mV <= vHigh && mV >= vLow) {
               const ratio = (mV - vLow) / (vHigh - vLow)
               socPercent = pLow + ratio * (pHigh - pLow)
               break
            }
         }
      }

      const voltageV = Number((mV / 1000.0).toFixed(3))
      const socClamped = this.clampWithConfidence(socPercent, 0, 100)
      const voltageClamped = this.clampWithConfidence(voltageV, 2.0, 5.5)

      // Brownout critical risk if voltage falls below 3.3V (Li-Ion) or 2.9V (LiFePO4)
      const brownoutThreshold = chemistry === 'lifepo4' ? 2900 : 3300
      const isBrownoutRisk = mV <= brownoutThreshold

      return [
         {
            metric: 'okf:power/battery/voltage',
            value: voltageClamped.value,
            unit: 'V',
            qudtUri: 'qudt:unit/V',
            confidence: voltageClamped.confidence,
            metadata: { voltageMv: mV, chemistry },
         },
         {
            metric: 'okf:power/battery/percentage',
            value: socClamped.value,
            unit: '%',
            qudtUri: 'qudt:unit/PERCENT',
            confidence: socClamped.confidence,
            metadata: {
               chemistry,
               isBrownoutRisk,
               brownoutRisk: isBrownoutRisk,
               healthState: isBrownoutRisk ? 'critical' : socPercent < 20 ? 'low' : 'good',
               healthStatus: isBrownoutRisk ? 'critical_depleted' : socPercent < 20 ? 'low_battery' : 'nominal',
            },
         },
      ]
   }
}

