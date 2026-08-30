import { describe, expect, it } from 'bun:test'
import { SoilElectricalConductivityConverter } from './SoilElectricalConductivityConverter'

describe('SoilElectricalConductivityConverter Unit Tests', () => {
   const converter = new SoilElectricalConductivityConverter()

   it('should normalize EC to 25°C', () => {
      const results = converter.convert({ depthCm: 10, bulkEcMsCm: 1.5, soilTemperature: 20.0 })
      expect(results).toHaveLength(1)
      expect(results[0].metric).toBe('okf:soil/conductivity/ec/10cm')
      expect(results[0].value).toBeGreaterThan(1.5) // Cold temperature means normalized EC is higher
      expect(results[0].unit).toBe('mS/cm')
   })
})
