import { describe, expect, it } from 'bun:test'
import { AcousticWeatherConverter } from './AcousticWeatherConverter'

describe('AcousticWeatherConverter Unit Tests', () => {
   const converter = new AcousticWeatherConverter()

   it('should detect acoustic rain and wind buffeting from frequency bands', () => {
      const results = converter.convert({
         highFrequencyEnergyRms: -50.0,
         lowFrequencyEnergyRms: -40.0,
      })

      expect(results).toHaveLength(2)

      const rain = results.find((r) => r.metric === 'okf:environment/acoustic/rain_impact_score')
      expect(rain?.value).toBeGreaterThan(30)
      expect(rain?.metadata?.isAcousticRainDetected).toBe(true)

      const wind = results.find((r) => r.metric === 'okf:environment/acoustic/wind_buffeting_score')
      expect(wind?.value).toBeGreaterThan(30)
      expect(wind?.metadata?.isTurbulenceDetected).toBe(true)
   })
})
