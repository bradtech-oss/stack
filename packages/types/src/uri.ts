/**
 * @file uri.ts
 * @description Strongly-typed Template Literal URI patterns for devices, tenancy, agronomic metrics, and semantic ontologies.
 */

// ------------------------------------------------------------------------------------------------
// 1. Canonical Resource URIs (xxx/yyy pattern)
// ------------------------------------------------------------------------------------------------

/**
 * Canonical device URI for IoT hardware nodes.
 * @example 'probes/b25s004', 'weather-stations/b26w001'
 */
export type DeviceUri = `probes/${string}` | `weather-stations/${string}`

/**
 * Canonical plot URI.
 * @example 'plots/e5eadee3-bb95-4cf0-b1f5-45db93bbfa81'
 */
export type PlotUri = `plots/${string}`

/**
 * Canonical company / tenant URI.
 * @example 'companies/32c18f05-728b-402a-a92c-567471207e4c'
 */
export type CompanyUri = `companies/${string}`

/**
 * Canonical user URI.
 * @example 'users/7f23a109-8b65-4f32-9c12-32a45b76c891'
 */
export type UserUri = `users/${string}`

/**
 * Canonical tenancy URI.
 * @example 'tenancies/T2312S001'
 */
export type TenancyUri = `tenancies/${string}`

/**
 * Canonical LoRaWAN gateway URI.
 * @example 'gateways/b23g001'
 */
export type GatewayUri = `gateways/${string}`

/**
 * Canonical physical location / city URI.
 * @example 'locations/avignon', 'locations/bordeaux'
 */
export type LocationUri = `locations/${string}`

/**
 * Canonical agronomic or mathematical model URI.
 * @example 'models/mildiou-milos', 'models/fao56-et0'
 */
export type ModelUri = `models/${string}`

/**
 * Union of all canonical entity resource URI patterns.
 */
export type ResourceUri =
   | DeviceUri
   | PlotUri
   | CompanyUri
   | UserUri
   | TenancyUri
   | GatewayUri
   | LocationUri
   | ModelUri

// ------------------------------------------------------------------------------------------------
// 2. Open Knowledge Format (OKF) Metric URIs (okf:domain/category/item pattern)
// ------------------------------------------------------------------------------------------------

/** Canopy microclimate, foliar, evapotranspiration and frost risk metrics */
export type OkfAirMetricUri =
   | 'okf:agronomy/microclimate/canopy_temperature'
   | 'okf:agronomy/microclimate/canopy_humidity'
   | 'okf:agronomy/microclimate/dew_point'
   | 'okf:agronomy/microclimate/wet_bulb_temperature'
   | 'okf:agronomy/plant/foliar_vpd'
   | 'okf:agronomy/evapotranspiration/et0'
   | 'okf:agronomy/risk/frost_index'
   | `okf:agronomy/${string}/${string}`

/** Multi-depth soil moisture, potential, temperature and salinity metrics */
export type OkfSoilMetricUri =
   | `okf:soil/moisture/${number}cm`
   | `okf:soil/potential/matric/${number}cm`
   | `okf:soil/potential/pf/${number}cm`
   | `okf:soil/temperature/${number}cm`
   | `okf:soil/conductivity/ec/${number}cm`
   | `okf:soil/${string}/${string}`

/** Weather station meteorological metrics */
export type OkfWeatherMetricUri =
   | 'okf:weather/solar/irradiance'
   | 'okf:weather/solar/par_ppfd'
   | 'okf:weather/rain/accumulation'
   | 'okf:weather/rain/rate'
   | 'okf:weather/wind/speed'
   | 'okf:weather/wind/direction'
   | 'okf:weather/atmosphere/pressure_absolute'
   | 'okf:weather/atmosphere/pressure_msl'
   | `okf:weather/${string}/${string}`

/** Electrical and power harvesting telemetry metrics */
export type OkfPowerMetricUri =
   | 'okf:power/battery/voltage'
   | 'okf:power/battery/percentage'
   | 'okf:power/solar/voltage'
   | `okf:power/${string}/${string}`

/** Environmental acoustic spectrum and audio level metrics */
export type OkfEnvironmentMetricUri =
   | 'okf:environment/acoustic/sound_pressure_level'
   | 'okf:environment/acoustic/rain_impact_score'
   | 'okf:environment/acoustic/wind_buffeting_score'
   | `okf:environment/${string}/${string}`

/** LoRaWAN and cellular radio link telemetry metrics */
export type OkfRadioMetricUri =
   | 'okf:radio/lorawan/rssi'
   | 'okf:radio/lorawan/snr'
   | 'okf:radio/cellular/csq'
   | 'okf:radio/cellular/rsrp'
   | `okf:radio/${string}/${string}`

/**
 * Universal Open Knowledge Format (OKF) metric identifier type with strict pattern support.
 */
export type OkfMetricUri =
   | OkfAirMetricUri
   | OkfSoilMetricUri
   | OkfWeatherMetricUri
   | OkfPowerMetricUri
   | OkfEnvironmentMetricUri
   | OkfRadioMetricUri
   | `okf:${string}/${string}`
   | `okf:${string}/${string}/${string}`

// ------------------------------------------------------------------------------------------------
// 3. Semantic Web Ontologies & Interface Contracts
// ------------------------------------------------------------------------------------------------

/**
 * QUDT Semantic Unit URI (qudt:unit/...)
 * @example 'qudt:unit/DEG_C', 'qudt:unit/PERCENT', 'qudt:unit/KiloPA', 'qudt:unit/W-PER-M2'
 */
export type QudtUnitUri =
   | 'qudt:unit/DEG_C'
   | 'qudt:unit/PERCENT'
   | 'qudt:unit/KiloPA'
   | 'qudt:unit/HectoPA'
   | 'qudt:unit/W-PER-M2'
   | 'qudt:unit/MicroMOL-PER-M2-SEC'
   | 'qudt:unit/MilliM'
   | 'qudt:unit/MilliM-PER-HR'
   | 'qudt:unit/KiloM-PER-HR'
   | 'qudt:unit/DEG'
   | 'qudt:unit/V'
   | 'qudt:unit/MilliS-PER-M'
   | 'qudt:unit/DeciB_A'
   | 'qudt:unit/UNITLESS'
   | `qudt:unit/${string}`

/**
 * Quatrain / Brad metadata interface contract identifier.
 * @example '@bradtech/types:LoRaWanMetadataInterface', '@bradtech/types:ComputedMetadataInterface'
 */
export type InterfaceContractUri =
   | '@bradtech/types:LoRaWanMetadataInterface'
   | '@bradtech/types:ComputedMetadataInterface'
   | '@bradtech/types:CellularMetadataInterface'
   | '@bradtech/types:VendorStationMetadataInterface'
   | '@bradtech/types:WeatherForecastMetadataInterface'
   | '@bradtech/types:AccuWeatherMetadataInterface'
   | `@bradtech/types:${string}`

