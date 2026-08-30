import { describe, expect, it } from 'bun:test'
import { SoilMoistureConverter } from './SoilMoistureConverter'

describe('SoilMoistureConverter Unit Tests', () => {
   const converter = new SoilMoistureConverter()

   it('should convert raw moisture reading to VWC % with depth tag', () => {
      const results = converter.convert({ depthCm: 10, rawValue: 24.5 })

      expect(results).toHaveLength(1)
      expect(results[0].metric).toBe('okf:soil/moisture/10cm')
      expect(results[0].value).toBe(24.5)
      expect(results[0].unit).toBe('%')
      expect(results[0].confidence).toBe(1.0)
   })

   it('should adjust VWC when clay texture context is provided', () => {
      const results = converter.convert(
         { depthCm: 20, rawValue: 20.0 },
         { soilTexture: 'clay' },
      )

      expect(results[0].metric).toBe('okf:soil/moisture/20cm')
      expect(results[0].value).toBe(24.2) // 20.0 * 1.15 + 1.2 = 24.2%
      expect(results[0].metadata?.soilTexture).toBe('clay')
   })

   it('should apply custom plot linear regression model (slope & intercept) over texture preset', () => {
      const results = converter.convert(
         { depthCm: 10, rawValue: 20.0 },
         {
            soilTexture: 'clay',
            soilLinearRegression: {
               slope: 1.08,
               intercept: -0.4,
               r2: 0.985,
               modelLabel: 'Lab-Parcelle-Saint-Emilion-ArgiloCalcaire-2026',
            },
         },
      )

      expect(results[0].metric).toBe('okf:soil/moisture/10cm')
      expect(results[0].value).toBe(21.2) // 20.0 * 1.08 - 0.4 = 21.2%
      expect(results[0].metadata?.calibrationType).toBe('custom_linear_regression')
      expect(results[0].metadata?.calibrationSlope).toBe(1.08)
      expect(results[0].metadata?.calibrationIntercept).toBe(-0.4)
      expect(results[0].metadata?.customModelLabel).toBe('Lab-Parcelle-Saint-Emilion-ArgiloCalcaire-2026')
   })
})

