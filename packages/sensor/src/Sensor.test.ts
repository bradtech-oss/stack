import { beforeEach, describe, expect, it } from 'bun:test'
import { Core } from '@quatrain/core'
import { Sensor } from './Sensor'
import { BaseSensorConverter } from './BaseSensorConverter'
import type { ConversionContext, ConversionOutput } from './types'

class MockTempConverter extends BaseSensorConverter<number> {
   readonly sensorFamily = 'air'
   readonly modelCode = 'mock-temp-evaluator'
   readonly modelVersion = '1.0.0'
   readonly description = 'Mock temperature converter'

   convert(raw: number, _context?: ConversionContext): ConversionOutput[] {
      return [
         {
            metric: 'okf:test/temperature',
            value: raw,
            unit: '°C',
            qudtUri: 'qudt:unit/DEG_C',
            confidence: 1.0,
         },
      ]
   }
}

describe('Sensor Micro-Framework Singleton Facade Unit Tests', () => {
   beforeEach(() => {
      Sensor.reset()
   })

   it('should inherit from Quatrain Core and initialize a domain logger', () => {
      expect(Sensor.prototype).toBeInstanceOf(Core)
      expect(Sensor.logger).toBeDefined()
   })

   it('should register and retrieve an instantiated sensor adapter', () => {
      const adapter = new MockTempConverter()
      Sensor.addAdapter(adapter, 'temp')

      expect(Sensor.hasAdapter('temp')).toBe(true)
      expect(Sensor.listAdapters()).toContain('temp')

      const retrieved = Sensor.getAdapter<MockTempConverter>('temp')
      expect(retrieved).toBe(adapter)
      expect(retrieved.modelCode).toBe('mock-temp-evaluator')
   })

   it('should support setting a default adapter and executing convert directly', () => {
      const adapter = new MockTempConverter()
      Sensor.addAdapter(adapter, 'temp', true)

      expect(Sensor.defaultAdapter).toBe('temp')

      const outputs = Sensor.convert('temp', 23.5)
      expect(outputs).toHaveLength(1)
      expect(outputs[0].metric).toBe('okf:test/temperature')
      expect(outputs[0].value).toBe(23.5)
   })

   it('should throw an informative error when requesting an unknown adapter', () => {
      expect(() => Sensor.getAdapter('non-existent')).toThrow("Unknown sensor adapter alias: 'non-existent'")
   })
})
