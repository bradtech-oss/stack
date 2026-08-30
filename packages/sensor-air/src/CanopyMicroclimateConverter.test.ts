import { describe, expect, it } from 'bun:test'
import { CanopyMicroclimateConverter } from './CanopyMicroclimateConverter'

describe('CanopyMicroclimateConverter Unit Tests', () => {
   const converter = new CanopyMicroclimateConverter()

   it('should compute canopy temperature, humidity, dew point and foliar VPD', () => {
      const results = converter.convert({ temperature: 25.0, humidity: 60.0 })

      expect(results).toHaveLength(4)

      const temp = results.find((r) => r.metric === 'okf:agronomy/microclimate/canopy_temperature')
      expect(temp?.value).toBe(25.0)
      expect(temp?.unit).toBe('°C')
      expect(temp?.confidence).toBe(1.0)

      const hum = results.find((r) => r.metric === 'okf:agronomy/microclimate/canopy_humidity')
      expect(hum?.value).toBe(60.0)
      expect(hum?.unit).toBe('%')

      const dew = results.find((r) => r.metric === 'okf:agronomy/microclimate/dew_point')
      expect(dew).toBeDefined()
      expect(dew?.value).toBeCloseTo(16.7, 0.5)

      const vpd = results.find((r) => r.metric === 'okf:agronomy/plant/foliar_vpd')
      expect(vpd).toBeDefined()
      expect(vpd?.value).toBeGreaterThan(1.0) // ~1.26 kPa at 25°C, 60%
      expect(vpd?.unit).toBe('kPa')
   })

   it('should penalize confidence on out-of-bounds sensor values', () => {
      const results = converter.convert({ temperature: -55.0, humidity: 120.0 })
      const temp = results.find((r) => r.metric === 'okf:agronomy/microclimate/canopy_temperature')
      expect(temp?.confidence).toBe(0.1)
   })
})
