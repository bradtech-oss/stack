import { describe, expect, it } from 'bun:test'
import { SolarHarvestingConverter } from './SolarHarvestingConverter'

describe('SolarHarvestingConverter Unit Tests', () => {
   const converter = new SolarHarvestingConverter()

   it('should convert solar voltage and detect active harvesting state', () => {
      const results = converter.convert({ voltageMv: 5200 })

      expect(results).toHaveLength(1)
      expect(results[0].metric).toBe('okf:power/solar/voltage')
      expect(results[0].value).toBe(5.2)
      expect(results[0].metadata?.isHarvesting).toBe(true)
   })
})
