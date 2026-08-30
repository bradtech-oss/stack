import type {
   CompanyUri,
   DeviceUri,
   OkfMetricUri,
   PlotUri,
   QudtUnitUri,
} from '@bradtech/types'

/**
 * Standard output record produced by a sensor converter.
 * Encapsulates the converted metric, physical value, standard unit, and quality index.
 */
export interface ConversionOutput {
   /** Canonical OKF metric identifier (e.g. 'okf:soil/moisture/10cm', 'okf:agronomy/microclimate/canopy_temperature') */
   metric: OkfMetricUri | (string & {})
   /** Calibrated, normalized physical value */
   value: number
   /** Human-readable unit symbol (e.g. '%', '°C', 'hPa', 'W/m²', 'V') */
   unit: string
   /** QUDT Semantic Web ontology URI for strict physical unit interoperability */
   qudtUri: QudtUnitUri | (string & {})
   /** Quality and confidence score between 0.0 (erroneous/degraded) and 1.0 (nominal) */
   confidence: number
   /** Supplementary calculation parameters, algorithm metadata, or intermediate variables */
   metadata?: Record<string, any>
}

/**
 * Mathematical parameters for linear regression calibration models ($y = a \cdot x + b$).
 */
export interface LinearRegressionModel {
   /** Slope coefficient ($a$ in $y = a \cdot x + b$) */
   slope: number
   /** Y-intercept offset ($b$ in $y = a \cdot x + b$) */
   intercept: number
   /** Optional coefficient of determination ($R^2$) representing model fit accuracy */
   r2?: number
   /** Optional human-readable description or laboratory calibration certificate reference */
   modelLabel?: string
}

/**
 * Environmental, spatial, and device context supplied during sensor conversion.
 */
export interface ConversionContext {
   /** Canonical device URI (e.g. 'probes/b25s004', 'weather-stations/b26w001') */
   deviceId?: DeviceUri | (string & {})
   /** Canonical plot URI (e.g. 'plots/e5eadee3-bb95-4cf0-b1f5-45db93bbfa81') */
   plotId?: PlotUri | (string & {})
   /** Canonical tenant/company URI */
   companyId?: CompanyUri | (string & {})

   /** Observation timestamp */
   timestamp?: string | Date
   /** Soil USDA textural class preset */
   soilTexture?: 'sand' | 'loam' | 'clay' | 'silt' | 'peat' | 'default'
   /** Specific custom linear regression model calibrated for the target plot */
   soilLinearRegression?: LinearRegressionModel
   /** Generic hardware or algorithm calibration key-value parameters */
   calibration?: Record<string, any>
   /** Ambient air temperature in °C for thermal compensation */
   ambientTemperature?: number
   /** Local atmospheric pressure in hPa */
   atmosphericPressureHpa?: number
   /** Elevation above sea level in meters (used for QNH and barometric reduction) */
   altitudeMeters?: number
   /** Battery chemistry classification */
   batteryChemistry?: 'li_ion' | 'lifepo4' | 'alkaline' | 'supercap'
   /** Arbitrary contextual parameters */
   [key: string]: any
}

/**
 * Universal interface contract for all Brad sensor conversion adapters.
 *
 * @template TRaw - Input payload data type (raw number, binary buffer, or composite object).
 * @template TContext - Environmental and spatial context type.
 */
export interface SensorConverterInterface<TRaw = any, TContext extends ConversionContext = ConversionContext> {
   /** Sensor domain family classification (e.g. 'air', 'soil', 'weather', 'power', 'acoustic') */
   readonly sensorFamily: string
   /** Unique machine-readable algorithmic model code (e.g. 'soil-vwc-texture-calibrated') */
   readonly modelCode: string
   /** Semantic version string of the algorithm implementation (e.g. '1.0.0') */
   readonly modelVersion: string
   /** Human-readable description of the conversion algorithm and its theoretical foundation */
   readonly description: string

   /**
    * Executes the mathematical conversion from raw sensor signals to normalized physical outputs.
    *
    * @param raw - The raw sensor reading or observation payload.
    * @param context - Optional environmental, soil texture, or calibration parameters.
    * @returns An array of normalized physical conversion outputs.
    */
   convert(raw: TRaw, context?: TContext): ConversionOutput[]
}
