/**
 * Extractor & Open Data Publisher for @bradtech/ontologies.
 */

import type { OntologyCatalogIndex } from './loader'
import type {
   AnyOntologyItem,
   FlatSelectOption,
   HierarchyNode,
   OntologyDomain,
   OntologyLookupResult,
   SupportedLanguage,
} from './types'

/**
 * Returns localized label for an ontology item given a target language with fallback.
 */
export function getLocalizedLabel(
   item: AnyOntologyItem,
   language: SupportedLanguage = 'fr',
): string {
   if (item.translations && item.translations[language]) {
      return item.translations[language]!
   }
   if (item.translations && item.translations.fr) {
      return item.translations.fr!
   }
   if (item.translations && item.translations.en) {
      return item.translations.en!
   }
   return item.title
}

/**
 * Extracts a flat list of options for a domain, localized to the specified language.
 * Ideal for rendering dropdown select components (UI/API).
 */
export function extractFlatList(
   catalog: OntologyCatalogIndex,
   domain: OntologyDomain,
   language: SupportedLanguage = 'fr',
): FlatSelectOption[] {
   const items = catalog.byDomain.get(domain) || []
   return items.map((item) => ({
      id: item.id,
      label: getLocalizedLabel(item, language),
      description: item.description,
      standards: item.standards,
   }))
}

/**
 * Extracts a key-value dictionary { id: label } for direct consumption by UI form definitions.
 */
export function extractFlatMap(
   catalog: OntologyCatalogIndex,
   domain: OntologyDomain,
   language: SupportedLanguage = 'fr',
): Record<string, string> {
   const list = extractFlatList(catalog, domain, language)
   const map: Record<string, string> = {}
   for (const opt of list) {
      map[opt.id] = opt.label
   }
   return map
}

/**
 * Extracts a hierarchical taxonomy tree for cascading selectors.
 */
export function extractHierarchy(
   catalog: OntologyCatalogIndex,
   domain: OntologyDomain,
   _language: SupportedLanguage = 'fr',
): HierarchyNode[] {
   const items = catalog.byDomain.get(domain) || []

   // If items have category or hierarchy grouping (e.g. crops by category)
   const categoryGroups = new Map<string, AnyOntologyItem[]>()

   for (const item of items) {
      const category = (item as any).category || 'general'
      if (!categoryGroups.has(category)) {
         categoryGroups.set(category, [])
      }
      categoryGroups.get(category)!.push(item)
   }

   const roots: HierarchyNode[] = []

   for (const [category, childrenItems] of categoryGroups.entries()) {
      const childrenNodes: HierarchyNode[] = childrenItems.map((child) => ({
         item: child,
         children: [],
      }))

      roots.push({
         item: {
            type: 'category',
            id: category,
            title: category.toUpperCase(),
            description: `Category: ${category}`,
            tags: [domain, category],
            translations: { fr: category, en: category },
         },
         children: childrenNodes,
      })
   }

   return roots
}

/**
 * Universal lookup that resolves any input (ID, EPPO code, TelePAC code, AGROVOC URI, or title).
 */
export function lookup(
   catalog: OntologyCatalogIndex,
   query: string,
): OntologyLookupResult | null {
   if (!query || typeof query !== 'string') return null
   const trimmed = query.trim()
   const upper = trimmed.toUpperCase()

   // 1. Exact ID match
   if (catalog.byId.has(trimmed)) {
      const item = catalog.byId.get(trimmed)!
      return { item, domain: resolveDomainOfItem(item), matchedBy: 'id' }
   }

   // 2. EPPO code match
   if (catalog.byEppo.has(upper)) {
      const item = catalog.byEppo.get(upper)!
      return { item, domain: 'crops', matchedBy: 'eppo' }
   }

   // 3. TelePAC RPG code match
   if (catalog.byTelepac.has(upper)) {
      const item = catalog.byTelepac.get(upper)!
      return { item, domain: 'crops', matchedBy: 'telepac' }
   }

   // 4. AGROVOC URI/Code match
   if (catalog.byAgrovoc.has(trimmed)) {
      const item = catalog.byAgrovoc.get(trimmed)!
      return { item, domain: resolveDomainOfItem(item), matchedBy: 'agrovoc' }
   }

   // 5. Case-insensitive title / alias scan
   for (const item of catalog.items) {
      if (item.title.toLowerCase() === trimmed.toLowerCase()) {
         return { item, domain: resolveDomainOfItem(item), matchedBy: 'alias' }
      }
      for (const trans of Object.values(item.translations || {})) {
         if (trans && trans.toLowerCase() === trimmed.toLowerCase()) {
            return { item, domain: resolveDomainOfItem(item), matchedBy: 'alias' }
         }
      }
   }

   return null
}

function resolveDomainOfItem(item: AnyOntologyItem): OntologyDomain {
   if (item.type === 'soil') return 'soils'
   if (item.type === 'irrigation') return 'irrigations'
   if (item.type === 'crop') return 'crops'
   return 'crop-covers'
}

/**
 * Converts ontology items into an Open Data Schema.org / DCAT-AP compliant JSON-LD graph.
 */
export function toOpenDataJsonLd(
   catalog: OntologyCatalogIndex,
   domain?: OntologyDomain,
): Record<string, any> {
   const targetItems = domain ? catalog.byDomain.get(domain) || [] : catalog.items

   return {
      '@context': {
         '@vocab': 'https://schema.org/',
         'okf': 'https://openknowledgeformat.org/ns/',
         'eppo': 'https://gd.eppo.int/taxon/',
         'agrovoc': 'http://aims.fao.org/aos/agrovoc/',
         'wrb': 'https://www.isric.org/explore/wrb/',
      },
      '@type': 'DataCatalog',
      'name': 'OSFARM & Brad Agricultural Taxonomies',
      'url': 'https://lexicon.osfarm.org',
      'publisher': {
         '@type': 'Organization',
         'name': 'Brad Technology SAS & OSFARM Collective',
      },
      'itemListElement': targetItems.map((item) => ({
         '@type': item.type === 'crop' ? 'Plant' : 'DefinedTerm',
         '@id': `okf:${item.type}/${item.id}`,
         'identifier': item.id,
         'name': item.title,
         'description': item.description,
         'keywords': item.tags.join(', '),
         'sameAs': [
            item.standards?.eppo ? `https://gd.eppo.int/taxon/${item.standards.eppo}` : null,
            item.standards?.agrovoc ? `http://aims.fao.org/aos/agrovoc/${item.standards.agrovoc}` : null,
         ].filter(Boolean),
      })),
   }
}
