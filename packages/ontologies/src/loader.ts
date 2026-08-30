/**
 * OKF Knowledge Graph & Directory Loader for @bradtech/ontologies.
 */

import { readdirSync, readFileSync, statSync } from 'node:fs'
import { join, resolve } from 'node:path'
import { parseOkfDocument } from './parser'
import type {
   AnyOntologyItem,
   CropOntologyItem,
   IrrigationOntologyItem,
   OntologyDomain,
   SoilOntologyItem,
} from './types'

export interface OntologyCatalogIndex {
   items: AnyOntologyItem[]
   byId: Map<string, AnyOntologyItem>
   byDomain: Map<OntologyDomain, AnyOntologyItem[]>
   byEppo: Map<string, CropOntologyItem>
   byAgrovoc: Map<string, AnyOntologyItem>
   byTelepac: Map<string, CropOntologyItem>
}

/**
 * Builds an in-memory index from a list of parsed ontology items.
 */
export function indexOntologyItems(rawItems: AnyOntologyItem[]): OntologyCatalogIndex {
   const items: AnyOntologyItem[] = []
   const byId = new Map<string, AnyOntologyItem>()
   const byDomain = new Map<OntologyDomain, AnyOntologyItem[]>([
      ['soils', []],
      ['irrigations', []],
      ['crops', []],
      ['crop-covers', []],
   ])
   const byEppo = new Map<string, CropOntologyItem>()
   const byAgrovoc = new Map<string, AnyOntologyItem>()
   const byTelepac = new Map<string, CropOntologyItem>()

   for (const doc of rawItems) {
      if (doc.type === 'catalog' || doc.type === 'domain') {
         byId.set(doc.id, doc)
         continue
      }

      items.push(doc)
      byId.set(doc.id, doc)

      if (doc.type === 'soil') {
         byDomain.get('soils')?.push(doc as SoilOntologyItem)
      } else if (doc.type === 'irrigation') {
         byDomain.get('irrigations')?.push(doc as IrrigationOntologyItem)
      } else if (doc.type === 'crop') {
         byDomain.get('crops')?.push(doc as CropOntologyItem)
      } else if (doc.type === 'crop-cover') {
         byDomain.get('crop-covers')?.push(doc)
      }

      if (doc.standards?.eppo && doc.type === 'crop') {
         byEppo.set(doc.standards.eppo.toUpperCase(), doc as CropOntologyItem)
      }
      if (doc.standards?.agrovoc) {
         byAgrovoc.set(String(doc.standards.agrovoc), doc)
      }
      if (doc.standards?.telepac_rpg && Array.isArray(doc.standards.telepac_rpg)) {
         for (const code of doc.standards.telepac_rpg) {
            byTelepac.set(String(code).toUpperCase(), doc as CropOntologyItem)
         }
      }
   }

   return {
      items,
      byId,
      byDomain,
      byEppo,
      byAgrovoc,
      byTelepac,
   }
}

/**
 * Recursively scans a directory and returns all .md file paths.
 */
export function scanMarkdownFiles(dirPath: string): string[] {
   const results: string[] = []

   function walk(current: string) {
      const entries = readdirSync(current)
      for (const entry of entries) {
         if (entry.startsWith('.')) continue
         const fullPath = join(current, entry)
         const stat = statSync(fullPath)
         if (stat.isDirectory()) {
            walk(fullPath)
         } else if (stat.isFile() && entry.endsWith('.md')) {
            results.push(fullPath)
         }
      }
   }

   walk(dirPath)
   return results
}

/**
 * Loads and indexes all OKF documents from the specified directory.
 */
export function loadOntologyCatalog(dataPath: string): OntologyCatalogIndex {
   const targetDir = resolve(dataPath)
   const files = scanMarkdownFiles(targetDir)
   const rawItems: AnyOntologyItem[] = []

   for (const filePath of files) {
      const content = readFileSync(filePath, 'utf-8')
      try {
         const doc = parseOkfDocument(content)
         rawItems.push(doc)
      } catch (err) {
         // Skip files without valid frontmatter
      }
   }

   return indexOntologyItems(rawItems)
}
