/**
 * @bradtech/ontologies
 * Open Knowledge Format (OKF v0.1) Agricultural Lexicon & Taxonomies
 */

import { EMBEDDED_ONTOLOGY_ITEMS } from './embeddedData'
import { indexOntologyItems, type OntologyCatalogIndex } from './loader'
import {
   extractFlatList,
   extractFlatMap,
   extractHierarchy,
   getLocalizedLabel,
   lookup,
   toOpenDataJsonLd,
} from './extractor'
import type {
   AnyOntologyItem,
   CropAgronomy,
   CropCoverEffects,
   CropCoverOntologyItem,
   CropOntologyItem,
   FlatSelectOption,
   HierarchyNode,
   IrrigationEngineering,
   IrrigationOntologyItem,
   LanguageMap,
   OntologyDomain,
   OntologyLookupResult,
   OntologyStandards,
   SoilOntologyItem,
   SoilPhysics,
   SupportedLanguage,
} from './types'

export type {
   AnyOntologyItem,
   CropAgronomy,
   CropCoverEffects,
   CropCoverOntologyItem,
   CropOntologyItem,
   FlatSelectOption,
   HierarchyNode,
   IrrigationEngineering,
   IrrigationOntologyItem,
   LanguageMap,
   OntologyDomain,
   OntologyLookupResult,
   OntologyStandards,
   SoilOntologyItem,
   SoilPhysics,
   SupportedLanguage,
   OntologyCatalogIndex,
}

export * from './parser'
export * from './loader'
export * from './extractor'
export { EMBEDDED_ONTOLOGY_ITEMS } from './embeddedData'

/**
 * Singleton instance of the built-in Agricultural Ontology Catalog.
 * Lazily loaded on first access using statically embedded concepts (zero fs dependency).
 */
let _defaultCatalog: OntologyCatalogIndex | null = null

export function getDefaultCatalog(): OntologyCatalogIndex {
   if (!_defaultCatalog) {
      _defaultCatalog = indexOntologyItems(EMBEDDED_ONTOLOGY_ITEMS)
   }
   return _defaultCatalog
}

/**
 * Convenience helper methods using the default built-in catalog.
 */
export const Lexicon = {
   getCatalog: getDefaultCatalog,

   getFlatList(domain: OntologyDomain, lang: SupportedLanguage = 'fr'): FlatSelectOption[] {
      return extractFlatList(getDefaultCatalog(), domain, lang)
   },

   getFlatMap(domain: OntologyDomain, lang: SupportedLanguage = 'fr'): Record<string, string> {
      return extractFlatMap(getDefaultCatalog(), domain, lang)
   },

   getHierarchy(domain: OntologyDomain, lang: SupportedLanguage = 'fr'): HierarchyNode[] {
      return extractHierarchy(getDefaultCatalog(), domain, lang)
   },

   lookup(query: string): OntologyLookupResult | null {
      return lookup(getDefaultCatalog(), query)
   },

   toOpenData(domain?: OntologyDomain): Record<string, any> {
      return toOpenDataJsonLd(getDefaultCatalog(), domain)
   },
}
