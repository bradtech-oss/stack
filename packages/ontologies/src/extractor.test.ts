import { describe, expect, test } from 'bun:test'
import { resolve } from 'node:path'
import { loadOntologyCatalog } from './loader'
import {
   extractFlatList,
   extractFlatMap,
   extractHierarchy,
   lookup,
   toOpenDataJsonLd,
} from './extractor'

describe('OKF Extractor & Open Data Engine', () => {
   const catalog = loadOntologyCatalog(resolve(__dirname, '../data'))

   test('extracts multilingual flat list for soils', () => {
      const frList = extractFlatList(catalog, 'soils', 'fr')
      expect(frList.length).toBe(10)
      expect(frList.find((s) => s.id === 'clay-loam')?.label).toBe('Sol Argilo-Limoneux')

      const enList = extractFlatList(catalog, 'soils', 'en')
      expect(enList.find((s) => s.id === 'clay-loam')?.label).toBe('Clay Loam')

      const esList = extractFlatList(catalog, 'soils', 'es')
      expect(esList.find((s) => s.id === 'clay-loam')?.label).toBe('Suelo Franco Arcilloso')
   })

   test('extracts flat key-value map for form select components', () => {
      const map = extractFlatMap(catalog, 'irrigations', 'fr')
      expect(map).toEqual({
         none: 'Sans irrigation (Non irrigué)',
         drip: 'Goutte à goutte',
         gravity: 'Gravitaire',
         sprinkler: 'Aspersion',
      })
   })

   test('extracts hierarchical taxonomy tree for crops', () => {
      const tree = extractHierarchy(catalog, 'crops', 'fr')
      expect(tree.length).toBeGreaterThanOrEqual(3) // viticulture, aromatics, arboriculture, cereals
      const viticulture = tree.find((node) => node.item.id === 'viticulture')
      expect(viticulture).toBeDefined()
      expect(viticulture?.children.some((c) => c.item.id === 'vitis-vinifera')).toBe(true)
   })

   test('lookup resolves by ID, EPPO, TelePAC and AGROVOC', () => {
      // Lookup by ID
      const resId = lookup(catalog, 'vitis-vinifera')
      expect(resId).toBeDefined()
      expect(resId?.matchedBy).toBe('id')
      expect(resId?.item.title).toBe('Vigne cultivée (Vitis vinifera)')

      // Lookup by EPPO
      const resEppo = lookup(catalog, 'VITVI')
      expect(resEppo).toBeDefined()
      expect(resEppo?.matchedBy).toBe('eppo')
      expect(resEppo?.item.id).toBe('vitis-vinifera')

      // Lookup by TelePAC RPG code
      const resTelepac = lookup(catalog, 'VRC')
      expect(resTelepac).toBeDefined()
      expect(resTelepac?.matchedBy).toBe('telepac')
      expect(resTelepac?.item.id).toBe('vitis-vinifera')

      // Lookup by AGROVOC
      const resAgrovoc = lookup(catalog, 'c_4219')
      expect(resAgrovoc).toBeDefined()
      expect(resAgrovoc?.matchedBy).toBe('agrovoc')
      expect(resAgrovoc?.item.id).toBe('lavandula-angustifolia')
   })

   test('generates Open Data JSON-LD graph', () => {
      const jsonLd = toOpenDataJsonLd(catalog, 'crops')
      expect(jsonLd['@type']).toBe('DataCatalog')
      expect(jsonLd.itemListElement.length).toBeGreaterThanOrEqual(6)
      const first = jsonLd.itemListElement[0]
      expect(first['@id']).toStartWith('okf:crop/')
      expect(first.sameAs.length).toBeGreaterThan(0)
   })
})
