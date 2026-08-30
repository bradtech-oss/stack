import { describe, expect, it } from 'bun:test'
import { SolarRadiationConverter } from './SolarRadiationConverter'

describe('SolarRadiationConverter Unit Tests', () => {
   const converter = new SolarRadiationConverter()

   it('should convert solar irradiance to W/m² and PAR PPFD', () => {
      const results = converter.convert({ irradianceWm2: 850.0 })

      expect(results).toHaveLength(2)
      expect(results[0].metric).toBe('okf:weather/solar/irradiance')
      expect(results[0].value).toBe(850.0)
      expect(results[0].unit).toBe('W/m²')

      const par = results.find((r) => r.metric === 'okf:weather/solar/par_ppfd')
      expect(par).toBeDefined()
      expect(par?.value).toBeGreaterThan(1500)
      expect(par?.metadata?.sunlightState).toBe('intense_sun')
   })
})
