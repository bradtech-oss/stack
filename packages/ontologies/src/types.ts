/**
 * Core type definitions for @bradtech/ontologies (OKF v0.1 Agricultural Lexicon)
 */

export type SupportedLanguage = 'fr' | 'en' | 'es' | 'it' | 'de'

export type LanguageMap = Partial<Record<SupportedLanguage, string>>

export type OntologyDomain = 'soils' | 'irrigations' | 'crops' | 'crop-covers'

export interface OntologyStandards {
   eppo?: string
   agrovoc?: string
   inrae?: string
   usda?: string
   wrb?: string
   icid?: string
   telepac_rpg?: string[]
   [key: string]: unknown
}

export interface BaseOntologyItem {
   type: string
   id: string
   title: string
   description: string
   tags: string[]
   translations: LanguageMap
   standards?: OntologyStandards
   bodyMarkdown?: string
   timestamp?: string
}

export interface SoilPhysics {
   fieldCapacityPoint: number // % Volumetric Soil Moisture (Capacité au champ)
   temporaryWiltingPoint: number // % Volumetric Soil Moisture (Point de stress)
   permanentWiltingPoint: number // % Volumetric Soil Moisture (Point de flétrissement permanent)
   bulkDensityKgM3: number // kg/m³
   clayPercentageApprox?: number
   sandPercentageApprox?: number
   siltPercentageApprox?: number
}

export interface SoilOntologyItem extends BaseOntologyItem {
   type: 'soil'
   physics: SoilPhysics
}

export interface IrrigationEngineering {
   method: string
   applicationEfficiency: number // e.g. 0.90 for drip, 0.75 for sprinkler
   wettingPatternFraction: number // fraction of soil surface wetted (0.2 to 1.0)
}

export interface IrrigationOntologyItem extends BaseOntologyItem {
   type: 'irrigation'
   engineering: IrrigationEngineering
}

export interface CropAgronomy {
   rootDepthMaxCm: number
   kcInitial: number
   kcMid: number
   kcEnd: number
   baseTemperatureGdd: number // Base temperature for Growing Degree Days (°C)
   waterRequirementMmAnnual?: number
}

export interface CropOntologyItem extends BaseOntologyItem {
   type: 'crop'
   category: string // e.g. 'viticulture', 'aromatics', 'arboriculture', 'cereals'
   scientificName?: string
   agronomy: CropAgronomy
}

export interface CropCoverEffects {
   soilProtectionFactor: number // 0.0 to 1.0
   waterCompetitionIndex: number // 0.0 (negligible) to 1.0 (high competition)
   nitrogenFixation: boolean
}

export interface CropCoverOntologyItem extends BaseOntologyItem {
   type: 'crop-cover'
   effects: CropCoverEffects
}

export type AnyOntologyItem =
   | SoilOntologyItem
   | IrrigationOntologyItem
   | CropOntologyItem
   | CropCoverOntologyItem
   | BaseOntologyItem

export interface FlatSelectOption {
   id: string
   label: string
   description?: string
   standards?: OntologyStandards
}

export interface HierarchyNode<T = AnyOntologyItem> {
   item: T
   children: HierarchyNode<T>[]
}

export interface OntologyLookupResult {
   item: AnyOntologyItem
   domain: OntologyDomain
   matchedBy: 'id' | 'eppo' | 'agrovoc' | 'telepac' | 'alias'
}
