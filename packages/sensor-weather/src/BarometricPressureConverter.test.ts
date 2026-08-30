import { describe, expect, it } from 'bun:test'
import { BarometricPressureConverter } from './BarometricPressureConverter'

describe('BarometricPressureConverter Unit Tests', () => {
   const converter = new BarometricPressureConverter()

   it('should compute absolute pressure and sea-level QNH reduction', () => {
      const results = converter.convert({
         pressureHpa: 980.0,
         altitudeMeters: 250,
         temperatureC: 15.0,
      })

      expect(results).toHaveLength(2)

      const abs = results.find((r) => r.metric === 'okf:weather/atmosphere/pressure_absolute')
      expect(abs?.value).toBe(980.0)

      const msl = results.find((r) => r.metric === 'okf:weather/atmosphere/pressure_msl')
      expect(msl?.value).toBeGreaterThan(980.0) // Sea level is higher pressure than 250m elevation
      expect(msl?.value).toBeCloseTo(1009.4, 1)

   })
})
