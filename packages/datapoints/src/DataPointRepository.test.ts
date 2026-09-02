import { describe, it, expect, beforeEach } from 'bun:test'
import { Backend, MockAdapter } from '@quatrain/backend'
import { DataPointRepository } from './DataPointRepository'

describe('DataPointRepository Unit Tests', () => {
   let repo: DataPointRepository

   beforeEach(() => {
      const adapter = new MockAdapter()
      Backend.addBackend(adapter, '@default', true)
      repo = new DataPointRepository(adapter)
   })

   it('should create and persist a single DataPoint', async () => {
      const dp = await repo.createDataPoint({
         device: '8c1f645490100016',
         plot: 'plots/parcelle-nord',
         metric: 'okf:agronomy/microclimate/canopy_temperature',
         value: 21.8,
         unit: '°C',
         kind: 'measured',
         confidence: 1.0,
         timestamp: '2026-09-02T10:00:00.000Z',
      })

      expect(dp).toBeDefined()
      expect(dp._.device).toBe('8c1f645490100016')
      expect(dp._.value).toBe(21.8)
      expect(dp.dataObject.uri.path).toBeDefined()
      expect(dp.dataObject.uri.path).toContain('datapoints/')
   })

   it('should batch insert multiple DataPoints', async () => {
      const count = await repo.insertMany([
         {
            device: '8c1f645490100016',
            plot: 'plots/parcelle-nord',
            metric: 'okf:agronomy/soil/vwc_15cm',
            value: 25.4,
            unit: '%',
            kind: 'measured',
            timestamp: '2026-09-02T10:00:00.000Z',
         },
         {
            device: '8c1f645490100016',
            plot: 'plots/parcelle-nord',
            metric: 'okf:agronomy/soil/vwc_30cm',
            value: 27.1,
            unit: '%',
            kind: 'measured',
            timestamp: '2026-09-02T10:00:00.000Z',
         },
      ])

      expect(count).toBe(2)
   })

   it('should query timeline using @quatrain/backend Query builder', async () => {
      await repo.insertMany([
         {
            device: 'b25s004',
            plot: 'plots/parcelle-nord',
            metric: 'okf:agronomy/microclimate/canopy_temperature',
            value: 20.0,
            unit: '°C',
            timestamp: '2026-09-02T08:00:00.000Z',
         },
         {
            device: 'b25s004',
            plot: 'plots/parcelle-nord',
            metric: 'okf:agronomy/microclimate/canopy_temperature',
            value: 24.5,
            unit: '°C',
            timestamp: '2026-09-02T12:00:00.000Z',
         },
         {
            device: 'b25s009',
            plot: 'plots/parcelle-sud',
            metric: 'okf:agronomy/microclimate/canopy_temperature',
            value: 19.5,
            unit: '°C',
            timestamp: '2026-09-02T12:00:00.000Z',
         },
      ])

      const results = await repo.getTimeline({
         device: 'b25s004',
         metric: 'okf:agronomy/microclimate/canopy_temperature',
      })

      expect(results.length).toBe(2)
      for (const item of results) {
         expect(item._.device).toBe('b25s004')
      }
   })

   it('should retrieve latest reading using getLatest()', async () => {
      await repo.createDataPoint({
         device: 'b25s004',
         metric: 'okf:agronomy/power/battery_voltage',
         value: 3650,
         unit: 'mV',
         timestamp: '2026-09-02T12:00:00.000Z',
      })

      const latest = await repo.getLatest('b25s004', 'okf:agronomy/power/battery_voltage')
      expect(latest).toBeDefined()
      expect(latest?._.value).toBe(3650)
   })
})
