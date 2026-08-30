import { describe, expect, test } from 'bun:test'
import { resolve } from 'node:path'
import { loadOntologyCatalog, scanMarkdownFiles } from './loader'

describe('OKF Ontology Catalog Loader', () => {
   const dataDir = resolve(__dirname, '../data')

   test('scans all markdown files in data directory', () => {
      const files = scanMarkdownFiles(dataDir)
      expect(files.length).toBeGreaterThanOrEqual(20)
   })

   test('loads full catalog and indexes domains', () => {
      const catalog = loadOntologyCatalog(dataDir)
      expect(catalog.items.length).toBeGreaterThanOrEqual(20)

      const soils = catalog.byDomain.get('soils')!
      expect(soils.length).toBe(10) // 10 soil textures

      const irrigations = catalog.byDomain.get('irrigations')!
      expect(irrigations.length).toBe(4) // none, drip, gravity, sprinkler

      const crops = catalog.byDomain.get('crops')!
      expect(crops.length).toBeGreaterThanOrEqual(6)
   })

   test('indexes cross-references for EPPO, AGROVOC and TelePAC', () => {
      const catalog = loadOntologyCatalog(dataDir)

      // EPPO lookup
      const vitvi = catalog.byEppo.get('VITVI')
      expect(vitvi).toBeDefined()
      expect(vitvi?.id).toBe('vitis-vinifera')

      const lavan = catalog.byEppo.get('LAVAN')
      expect(lavan).toBeDefined()
      expect(lavan?.id).toBe('lavandula-angustifolia')

      // TelePAC RPG lookup
      const vrc = catalog.byTelepac.get('VRC')
      expect(vrc).toBeDefined()
      expect(vrc?.id).toBe('vitis-vinifera')

      // AGROVOC lookup
      const agrovoc = catalog.byAgrovoc.get('c_4219')
      expect(agrovoc).toBeDefined()
      expect(agrovoc?.id).toBe('lavandula-angustifolia')
   })
})
