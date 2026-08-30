/**
 * Canonical IoT hardware and weather data vendor identifiers.
 */
export type HardwareVendor =
   | 'brad'
   | 'weenat'
   | 'sencrop'
   | 'davis'
   | 'netatmo'
   | 'metos'
   | 'sentek'
   | 'meter_group'
   | 'irrometer'
   | 'accuweather'
   | 'meteofrance'
   | 'openmeteo'
   | 'ecmwf'

/**
 * Base metadata contract ensuring schema, vendor, and interface traceability
 * across polymorphic DataPoint metadata objects.
 */
export interface BaseMetadataInterface {
   /**
    * Fully qualified interface contract or schema URI
    * @example '@bradtech/types:ComputedMetadataInterface', '@bradtech/types:VendorStationMetadataInterface'
    */
   interface: string
   /** Hardware manufacturer or data provider vendor */
   vendor?: HardwareVendor | (string & {})
   /** Specific commercial hardware model name (e.g. 'Weenat Weather Station', 'Sencrop Raincrop', 'Brad Probe v2.5') */
   vendorModel?: string
   /** External hardware identifier or station ID in the vendor's cloud system */
   vendorDeviceId?: string
   /** ISO 8601 timestamp when telemetry was synced from the vendor cloud API */
   vendorSyncedAt?: string | Date
   /** Ingestion integration channel */
   integrationType?: 'lorawan' | 'cellular' | 'cloud_api' | 'manual_import'
   [key: string]: any
}

/**
 * Metadata contract for computed / derived agronomic metrics
 */
export interface ComputedMetadataInterface extends BaseMetadataInterface {
   interface: '@bradtech/types:ComputedMetadataInterface'
   /** Algorithmic model URI or code: e.g. models/mildiou-milos, models/fao56-et0 */
   model: string
   /** Semantic version: e.g. 2.1.0 */
   version: string
   /** Provider name / URI: e.g. inrae.fr, rimpro.cloud, internal */
   provider?: string
   /** Calculation inputs / thresholds */
   parameters?: Record<string, any>
   /** Array of source DataPoint IDs used as inputs */
   inputDataPoints?: string[]
   /** Exact computation execution timestamp */
   computedAt?: string | Date
   /** Model execution latency in ms */
   executionTimeMs?: number
}

/**
 * Metadata contract for physical LoRaWAN radio uplinks
 */
export interface LoRaWanMetadataInterface extends BaseMetadataInterface {
   interface: '@bradtech/types:LoRaWanMetadataInterface'
   protocol: 'lorawan'
   fPort?: number
   fCnt?: number
   rssi?: number
   snr?: number
   gateway?: string
   gatewayCount?: number
   frequency?: number
   dataRate?: number
   qudt?: string
   firmwareVersion?: string
   sensorSource?: string
   sensorModel?: string
}

/**
 * Metadata contract for third-party connected weather stations and external agricultural probe APIs
 * (Weenat, Sencrop, Davis Instruments, Netatmo, Pessl Metos, Sentek, Meter Group)
 */
export interface VendorStationMetadataInterface extends BaseMetadataInterface {
   interface: '@bradtech/types:VendorStationMetadataInterface'
   /** Target third-party vendor */
   vendor: HardwareVendor | (string & {})
   /** Specific station or sensor model (e.g. 'Weenat Rain Weather Station', 'Sencrop Raincrop', 'Davis Vantage Pro 2 Plus') */
   vendorModel?: string
   /** Vendor cloud station UUID or serial */
   vendorDeviceId: string
   /** External sensor channel identifier or API key */
   vendorChannel?: string
   /** Vendor battery percentage or hardware health status */
   batteryPercentage?: number
   /** GPS latitude of the vendor station */
   latitude?: number
   /** GPS longitude of the vendor station */
   longitude?: number
   /** Elevation in meters */
   altitude?: number
   /** Raw payload received from vendor webhook or REST API */
   rawPayload?: Record<string, any>
}

/**
 * Metadata contract for cellular / GSM telemetry
 */
export interface CellularMetadataInterface extends BaseMetadataInterface {
   interface: '@bradtech/types:CellularMetadataInterface'
   protocol: 'cellular'
   operator?: string
   csq?: number
   rsrp?: number
   rsrq?: number
   cellId?: string
   ip?: string
   qudt?: string
}

/**
 * Metadata contract for virtual weather forecasts (AccuWeather, Open-Meteo, ECMWF, Météo-France)
 */
export interface WeatherForecastMetadataInterface extends BaseMetadataInterface {
   interface: '@bradtech/types:WeatherForecastMetadataInterface'
   source: 'accuweather' | 'open-meteo' | 'ecmwf' | 'meteo-france' | string
   locationKey?: string
   forecastHorizonHours?: number
   modelRunAt?: string | Date
   qudt?: string
}
