import { describe, expect, it } from 'bun:test'
import { SoilTemperatureConverter } from './SoilTemperatureConverter'

describe('SoilTemperatureConverter Unit Tests', () => {
   const converter = new SoilTemperatureConverter()

   it('should convert soil temperature for specific depth', () => {
      const results = converter.convert({ depthCm: 20, temperature: 18.4 })
      expect(results).toHaveLength(1)
      expect(results[0].metric).toBe('okf:soil/temperature/20cm')
      expect(results[0].value).toBe(18.4)
      expect(results[0].unit).toBe('°C')
   })
})
