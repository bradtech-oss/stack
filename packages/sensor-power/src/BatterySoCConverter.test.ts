import { describe, expect, it } from 'bun:test'
import { BatterySoCConverter } from './BatterySoCConverter'

describe('BatterySoCConverter Unit Tests', () => {
   const converter = new BatterySoCConverter()

   it('should interpolate Li-Ion voltage correctly into percentage and volts', () => {
      const results = converter.convert({ voltageMv: 3850 })

      expect(results).toHaveLength(2)

      const voltage = results.find((r) => r.metric === 'okf:power/battery/voltage')
      expect(voltage?.value).toBe(3.85)
      expect(voltage?.unit).toBe('V')

      const pct = results.find((r) => r.metric === 'okf:power/battery/percentage')
      expect(pct?.value).toBeGreaterThan(50)
      expect(pct?.value).toBeLessThan(70)
      expect(pct?.unit).toBe('%')
      expect(pct?.metadata?.healthState).toBe('good')
   })

   it('should detect brownout risk below critical voltage', () => {
      const results = converter.convert({ voltageMv: 3250 })
      const pct = results.find((r) => r.metric === 'okf:power/battery/percentage')
      expect(pct?.metadata?.isBrownoutRisk).toBe(true)
      expect(pct?.metadata?.healthState).toBe('critical')
   })
})
