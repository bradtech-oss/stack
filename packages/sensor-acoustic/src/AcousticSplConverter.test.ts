import { describe, expect, it } from 'bun:test'
import { AcousticSplConverter } from './AcousticSplConverter'

describe('AcousticSplConverter Unit Tests', () => {
   const converter = new AcousticSplConverter()

   it('should convert raw dBFS to dBA SPL', () => {
      const results = converter.convert({ rmsDbfs: -70.0 })

      expect(results).toHaveLength(1)
      expect(results[0].metric).toBe('okf:environment/acoustic/sound_pressure_level')
      expect(results[0].value).toBe(50.0) // -70 + 94 - (-26) = 50 dBA
      expect(results[0].unit).toBe('dBA')
      expect(results[0].metadata?.noiseEnvironment).toBe('moderate')
   })
})
