import { describe, it, expect, beforeEach } from 'bun:test'
import { Backend, MockAdapter } from '@quatrain/backend'
import { DataPoint } from './DataPoint'

describe('DataPoint Model Unit Tests', () => {
   let adapter: MockAdapter

   beforeEach(() => {
      adapter = new MockAdapter()
      Backend.addBackend(adapter, '@default', true)
   })

   it('should instantiate a DataPoint model instance', async () => {
      const dp = await DataPoint.factory()

      expect(dp).toBeDefined()
      expect(dp.dataObject).toBeDefined()
   })

   it('should assign and validate strongly typed properties', async () => {
      const dp = await DataPoint.factory()

      dp._.device = '8c1f645490100016'
      dp._.plot = 'plots/parcelle-nord'
      dp._.company = 'companies/domaine-alpha'
      dp._.metric = 'okf:agronomy/soil/vwc_calibrated'
      dp._.value = 28.5
      dp._.unit = '%'
      dp._.kind = 'computed'
      dp._.confidence = 0.95
      dp._.timestamp = '2026-09-02T12:00:00.000Z'
      dp._.metadata = { fPort: 12, rawInput: 450.2 }

      expect(dp._.device).toBe('8c1f645490100016')
      expect(dp._.plot).toBe('plots/parcelle-nord')
      expect(dp._.company).toBe('companies/domaine-alpha')
      expect(dp._.metric).toBe('okf:agronomy/soil/vwc_calibrated')
      expect(dp._.value).toBe(28.5)
      expect(dp._.unit).toBe('%')
      expect(dp._.kind).toBe('computed')
      expect(dp._.confidence).toBe(0.95)
      expect(dp._.metadata.fPort).toBe(12)
   })

   it('should persist into the backend adapter and obtain a URI', async () => {
      const dp = await DataPoint.factory()
      dp._.device = '8c1f645490100016'
      dp._.metric = 'okf:agronomy/microclimate/canopy_temperature'
      dp._.value = 24.2
      dp._.unit = '°C'
      dp._.timestamp = new Date().toISOString()

      const created = await adapter.create(dp.dataObject)
      expect(created.uri.path).toBeDefined()
      expect(created.uri.path).toContain('datapoints/')
   })
})
