import { describe, expect, it } from 'bun:test'
import { EvapotranspirationConverter } from './EvapotranspirationConverter'

describe('EvapotranspirationConverter Unit Tests', () => {
   const converter = new EvapotranspirationConverter()

   it('should calculate realistic summer ET0 in mm/day', () => {
      const results = converter.convert({
         tempMin: 15.0,
         tempMax: 30.0,
         tempMean: 22.5,
         solarRadiationMj: 28.0,
      })

      expect(results).toHaveLength(1)
      expect(results[0].metric).toBe('okf:agronomy/evapotranspiration/et0')
      expect(results[0].unit).toBe('mm/day')
      expect(results[0].value).toBeGreaterThan(3.5)
      expect(results[0].value).toBeLessThan(7.5)
      expect(results[0].confidence).toBe(1.0)
   })
})
