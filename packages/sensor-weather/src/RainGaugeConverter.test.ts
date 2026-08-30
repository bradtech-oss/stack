import { describe, expect, it } from 'bun:test'
import { RainGaugeConverter } from './RainGaugeConverter'

describe('RainGaugeConverter Unit Tests', () => {
   const converter = new RainGaugeConverter()

   it('should convert bucket tips to total mm and mm/h rate', () => {
      const results = converter.convert({ tipCount: 10, intervalMinutes: 15, mmPerTip: 0.2 })

      expect(results).toHaveLength(2)

      const total = results.find((r) => r.metric === 'okf:weather/rain/accumulation')
      expect(total?.value).toBe(2.0) // 10 * 0.2 = 2.0 mm
      expect(total?.unit).toBe('mm')

      const rate = results.find((r) => r.metric === 'okf:weather/rain/rate')
      expect(rate?.value).toBe(8.0) // 2.0 mm in 15min = 8.0 mm/h
      expect(rate?.metadata?.rainIntensity).toBe('moderate')
   })
})
