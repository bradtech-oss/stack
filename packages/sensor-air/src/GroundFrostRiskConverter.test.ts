import { describe, expect, it } from 'bun:test'
import { GroundFrostRiskConverter } from './GroundFrostRiskConverter'

describe('GroundFrostRiskConverter Unit Tests', () => {
   const converter = new GroundFrostRiskConverter()

   it('should detect severe frost condition when wet bulb temperature drops below 0°C', () => {
      const results = converter.convert({
         canopyTemperature: -1.5,
         canopyHumidity: 85.0,
      })

      expect(results).toHaveLength(2)

      const tw = results.find((r) => r.metric === 'okf:agronomy/microclimate/wet_bulb_temperature')
      expect(tw?.value).toBeLessThan(0)

      const risk = results.find((r) => r.metric === 'okf:agronomy/risk/frost_index')
      expect(risk?.value).toBe(3)
      expect(risk?.metadata?.frostState).toBe('severe')
   })

   it('should report zero frost risk under warm conditions', () => {
      const results = converter.convert({
         canopyTemperature: 18.0,
         canopyHumidity: 50.0,
      })

      const risk = results.find((r) => r.metric === 'okf:agronomy/risk/frost_index')
      expect(risk?.value).toBe(0)
   })
})
