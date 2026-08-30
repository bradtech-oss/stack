import { describe, expect, it } from 'bun:test'
import { BaseSensorConverter } from './BaseSensorConverter'
import { ConverterRegistry } from './ConverterRegistry'
import { ReplayEngine, type RawDataPointInput } from './ReplayEngine'
import type { ConversionContext, ConversionOutput } from './types'

class MockSoilConverter extends BaseSensorConverter<number> {
   readonly sensorFamily = 'soil'
   readonly modelCode = 'test-soil-vwc-linear'
   readonly modelVersion = '1.2.0'
   readonly description = 'Mock linear soil converter'

   convert(rawFrequency: number, context?: ConversionContext): ConversionOutput[] {
      const multiplier = (context?.calibration?.slope as number) || 0.05
      const vwc = this.clampWithConfidence(rawFrequency * multiplier, 0, 100)

      return [
         {
            metric: 'okf:soil/moisture/10cm',
            value: vwc.value,
            unit: '%',
            qudtUri: 'qudt:unit/PERCENT',
            confidence: vwc.confidence,
         },
      ]
   }
}

describe('Sensor Core & ReplayEngine Unit Tests', () => {
   it('should register and retrieve converters from ConverterRegistry', () => {
      const converter = new MockSoilConverter()
      ConverterRegistry.register(converter)

      const retrieved = ConverterRegistry.get('soil', 'test-soil-vwc-linear')
      expect(retrieved).toBeDefined()
      expect(retrieved?.modelVersion).toBe('1.2.0')

      const soilConverters = ConverterRegistry.getByFamily('soil')
      expect(soilConverters.length).toBeGreaterThanOrEqual(1)
   })

   it('should replay historical raw datapoints and generate computed datapoints with traceability', () => {
      const converter = new MockSoilConverter()
      const rawPoints: RawDataPointInput[] = [
         {
            id: 'raw-1',
            device: 'probes/b26s001',
            plot: 'plots/p1',
            company: 'companies/c1',
            metric: 'okf:raw/soil/frequency/10cm',
            value: 500,
            timestamp: '2026-08-30T10:00:00Z',
         },
      ]

      const computed = ReplayEngine.replay(rawPoints, converter, {
         calibration: { slope: 0.04 },
      })

      expect(computed).toHaveLength(1)
      expect(computed[0].metric).toBe('okf:soil/moisture/10cm')
      expect(computed[0].value).toBe(20) // 500 * 0.04 = 20%
      expect(computed[0].kind).toBe('computed')
      expect(computed[0].metadata.interface).toBe('@bradtech/types:ComputedMetadataInterface')
      expect(computed[0].metadata.modelCode).toBe('test-soil-vwc-linear')
      expect(computed[0].metadata.modelVersion).toBe('1.2.0')
      expect(computed[0].metadata.sourceDataPointId).toBe('raw-1')
   })
})
