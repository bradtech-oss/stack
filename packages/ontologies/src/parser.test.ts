import { describe, expect, test } from 'bun:test'
import { parseOkfDocument, parseYamlFrontmatter } from './parser'

describe('OKF YAML & Markdown Parser', () => {
   test('parses simple key-values and arrays', () => {
      const yaml = `
type: soil
id: clay-loam
title: Argilo-limoneux
tags: [soil, texture, inrae]
standards:
  inrae: AL
  usda: Clay Loam
  wrb: Calcisol
`
      const parsed = parseYamlFrontmatter(yaml)
      expect(parsed.type).toBe('soil')
      expect(parsed.id).toBe('clay-loam')
      expect(parsed.tags).toEqual(['soil', 'texture', 'inrae'])
      expect(parsed.standards.inrae).toBe('AL')
      expect(parsed.standards.usda).toBe('Clay Loam')
   })

   test('parses full OKF markdown document with body', () => {
      const doc = `---
type: crop
id: vitis-vinifera
title: Vigne cultivée
description: Espèce de vigne cultivée pour le raisin.
tags: [viticulture, fruit]
translations:
  fr: Vigne cultivée
  en: Grapevine
  es: Vid común
standards:
  eppo: VITVI
  agrovoc: c_8340
  telepac_rpg: [VRC, VRT]
agronomy:
  rootDepthMaxCm: 200
  kcInitial: 0.3
  kcMid: 0.7
  kcEnd: 0.45
  baseTemperatureGdd: 10
---

# Agronomie de la vigne
La vigne est une liane pérenne très résistante.
`
      const result = parseOkfDocument(doc)
      expect(result.id).toBe('vitis-vinifera')
      expect(result.type).toBe('crop')
      expect(result.title).toBe('Vigne cultivée')
      expect(result.translations.en).toBe('Grapevine')
      expect(result.standards?.eppo).toBe('VITVI')
      expect(result.standards?.telepac_rpg).toEqual(['VRC', 'VRT'])
      expect((result as any).agronomy.rootDepthMaxCm).toBe(200)
      expect(result.bodyMarkdown).toContain('# Agronomie de la vigne')
   })
})
