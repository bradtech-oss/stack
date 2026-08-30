import { describe, expect, it } from 'bun:test'
import { WindConverter } from './WindConverter'

describe('WindConverter Unit Tests', () => {
   const converter = new WindConverter()

   it('should convert wind speed in m/s to km/h and map direction to cardinal', () => {
      const results = converter.convert({ speedMs: 10.0, directionDegrees: 45.0 })

      expect(results).toHaveLength(2)

      const speed = results.find((r) => r.metric === 'okf:weather/wind/speed')
      expect(speed?.value).toBe(36.0) // 10 m/s = 36 km/h
      expect(speed?.unit).toBe('km/h')
      expect(speed?.metadata?.beaufortScale).toBe(5)

      const dir = results.find((r) => r.metric === 'okf:weather/wind/direction')
      expect(dir?.value).toBe(45.0)
      expect(dir?.metadata?.cardinal).toBe('NE')
   })
})
