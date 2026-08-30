import { describe, expect, it } from 'bun:test'
import { SoilWaterPotentialConverter } from './SoilWaterPotentialConverter'

describe('SoilWaterPotentialConverter Unit Tests', () => {
   const converter = new SoilWaterPotentialConverter()

   it('should compute matric potential in kPa and pF from VWC', () => {
      const results = converter.convert({ depthCm: 10, vwcPercent: 25.0 })

      expect(results).toHaveLength(2)

      const kpa = results.find((r) => r.metric === 'okf:soil/potential/matric/10cm')
      expect(kpa).toBeDefined()
      expect(kpa?.value).toBeLessThan(0) // Matric potential is negative tension
      expect(kpa?.unit).toBe('kPa')

      const pf = results.find((r) => r.metric === 'okf:soil/potential/pf/10cm')
      expect(pf).toBeDefined()
      expect(pf?.value).toBeGreaterThan(1.0)
      expect(pf?.value).toBeLessThan(5.0)
      expect(pf?.unit).toBe('pF')
   })
})
