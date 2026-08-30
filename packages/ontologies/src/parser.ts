/**
 * Lightweight, zero-dependency OKF (Open Knowledge Format v0.1) Markdown & YAML parser.
 */

import type { AnyOntologyItem, BaseOntologyItem } from './types'

/**
 * Parses simple YAML frontmatter strings into a JavaScript object.
 * Supports strings, numbers, booleans, flat arrays `[a, b]`, and 1-level nested maps.
 */
export function parseYamlFrontmatter(yamlContent: string): Record<string, any> {
   const result: Record<string, any> = {}
   const lines = yamlContent.split(/\r?\n/)
   let currentParentKey: string | null = null

   for (let i = 0; i < lines.length; i++) {
      const rawLine = lines[i]
      const trimmed = rawLine.trim()

      if (!trimmed || trimmed.startsWith('#')) {
         continue
      }

      // Check indentation to determine if child of current parent
      const isIndented = /^\s{2,}/.test(rawLine)

      if (isIndented && currentParentKey) {
         const colonIndex = trimmed.indexOf(':')
         if (colonIndex !== -1) {
            const subKey = trimmed.slice(0, colonIndex).trim()
            const rawVal = trimmed.slice(colonIndex + 1).trim()
            if (!result[currentParentKey] || typeof result[currentParentKey] !== 'object') {
               result[currentParentKey] = {}
            }
            result[currentParentKey][subKey] = parseYamlValue(rawVal)
         } else if (trimmed.startsWith('- ')) {
            // Array element under parent
            if (!Array.isArray(result[currentParentKey])) {
               result[currentParentKey] = []
            }
            result[currentParentKey].push(parseYamlValue(trimmed.slice(2).trim()))
         }
         continue
      }

      // Top-level key
      const colonIndex = trimmed.indexOf(':')
      if (colonIndex === -1) {
         continue
      }

      const key = trimmed.slice(0, colonIndex).trim()
      const rawValue = trimmed.slice(colonIndex + 1).trim()

      if (rawValue === '') {
         // Parent block starting
         currentParentKey = key
         result[key] = {}
      } else {
         currentParentKey = null
         result[key] = parseYamlValue(rawValue)
      }
   }

   return result
}

function parseYamlValue(val: string): any {
   if (val === '') return null
   if (val === 'true' || val === 'yes') return true
   if (val === 'false' || val === 'no') return false
   if (val === 'null' || val === '~') return null

   // Numbers
   if (!isNaN(Number(val)) && !val.includes(' ') && val !== '') {
      return Number(val)
   }

   // Arrays format: [a, b, c]
   if (val.startsWith('[') && val.endsWith(']')) {
      const inner = val.slice(1, -1).trim()
      if (!inner) return []
      return inner
         .split(',')
         .map((item) => item.trim())
         .map((item) => {
            if (item.startsWith('"') && item.endsWith('"')) return item.slice(1, -1)
            if (item.startsWith("'") && item.endsWith("'")) return item.slice(1, -1)
            return parseYamlValue(item)
         })
   }

   // Strip surrounding quotes
   if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
      return val.slice(1, -1)
   }

   return val
}

/**
 * Parses an entire OKF Markdown file into an OntologyItem.
 */
export function parseOkfDocument(content: string): AnyOntologyItem {
   const trimmed = content.trim()

   if (!trimmed.startsWith('---')) {
      throw new Error('Invalid OKF document: Missing leading YAML frontmatter delimiter (---)')
   }

   const secondDelimiterIndex = trimmed.indexOf('\n---', 3)
   if (secondDelimiterIndex === -1) {
      throw new Error('Invalid OKF document: Missing closing YAML frontmatter delimiter (---)')
   }

   const frontmatterRaw = trimmed.slice(3, secondDelimiterIndex).trim()
   const bodyMarkdown = trimmed.slice(secondDelimiterIndex + 4).trim()

   const frontmatter = parseYamlFrontmatter(frontmatterRaw)

   if (!frontmatter.id || !frontmatter.title) {
      throw new Error(`Invalid OKF document: Mandatory "id" or "title" missing in frontmatter`)
   }

   return {
      type: frontmatter.type || 'concept',
      id: String(frontmatter.id),
      title: String(frontmatter.title),
      description: String(frontmatter.description || ''),
      tags: Array.isArray(frontmatter.tags) ? frontmatter.tags : [],
      translations: frontmatter.translations || {},
      standards: frontmatter.standards || {},
      bodyMarkdown,
      timestamp: frontmatter.timestamp,
      ...frontmatter,
   } as AnyOntologyItem
}
