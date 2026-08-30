import { defaultSensorAdapters } from './defaultAdapters'
import { BradOSCodec } from './BradOSCodec'
import type { ConversionOutput } from '@bradtech/sensor'
import type {
   CompanyUri,
   DeviceUri,
   OkfMetricUri,
   PlotUri,
} from '@bradtech/types'


/**
 * Input contract representing a normalized LoRaWAN Uplink message from ChirpStack or external Network Server.
 */
export interface PipelineUplinkInput {
   /** Device metadata and user tags attached in ChirpStack */
   deviceInfo?: {
      /** 64-bit IEEE Extended Unique Identifier in hex (e.g. "0018b20000001234") */
      devEui?: string
      /** Human device name (e.g. "b25s004" or "b26w001") */
      deviceName?: string
      /** ChirpStack Application UUID */
      applicationId?: string
      /** ChirpStack Application Name */
      applicationName?: string
      /** User tags containing tenancy, plot, soil texture, and custom linear calibration models */
      tags?: Record<string, string>
   }
   /** Alternative flat devEUI property */
   devEUI?: string
   /** LoRaWAN Application Port (FPort) indicating the physical channel */
   fPort?: number
   /** Frame uplink counter */
   fCnt?: number
   /** Base64-encoded binary payload string */
   data?: string
   /** Array of receiving gateway metadata records (RSSI, SNR, GPS) */
   rxInfo?: Array<{
      gatewayId?: string
      rssi?: number
      snr?: number
      location?: { latitude?: number; longitude?: number; altitude?: number }
   }>
   /** Transmission RF metadata (frequency in Hz, DataRate) */
   txInfo?: {
      frequency?: number
      dataRate?: number
   }
   /** ISO 8601 message publication timestamp */
   publishedAt?: string
   /** Alternative ISO 8601 message timestamp */
   time?: string
}

/**
 * Normalized output contract representing an immutable DataPoint ready for PostgreSQL storage.
 */
export interface PipelineDataPointOutput {
   /** Canonical device URI (e.g. 'probes/b25s004' or 'weather-stations/b26w001') */
   device: DeviceUri | (string & {})
   /** Canonical plot URI (e.g. 'plots/e5eadee3-...') */
   plot?: PlotUri | (string & {})
   /** Canonical company/tenant URI (e.g. 'companies/32c18f05-...') */
   company?: CompanyUri | (string & {})
   /** Canonical OKF metric identifier */
   metric: OkfMetricUri | (string & {})
   /** Calibrated numerical value */
   value: number
   /** Human-readable physical unit symbol */
   unit: string

   /** Kind indicator: 'measured' for direct sensor readings, 'computed' for agronomic algorithms */
   kind: 'measured' | 'computed'
   /** Quality and confidence score between 0.0 and 1.0 */
   confidence: number
   /** Observation timestamp */
   timestamp: string
   /** Comprehensive metadata contract */
   metadata: Record<string, any>
}

/**
 * End-to-End LoRaWAN Telemetry Ingestion & Transformation Pipeline.
 *
 * Coordinates:
 * - IEEE 754 Float32 binary decoding via `BradOSCodec`.
 * - Automatic hardware sensor attribution (SHT40, Brad soil sensor, Davis, SI1145, BMP280, MP34DT01).
 * - Routing to decoupled domain converter packages (`@bradtech/sensor-*`).
 * - Metadata enrichment with `@bradtech/types` interface tags, converter classes, and model versions.
 */
export class LoRaWanPipeline {
   private static _airConverter = defaultSensorAdapters.canopyAir
   private static _soilMoistureConverter = defaultSensorAdapters.soilMoisture
   private static _soilWpConverter = defaultSensorAdapters.soilWaterPotential
   private static _soilTempConverter = defaultSensorAdapters.soilTemperature
   private static _soilEcConverter = defaultSensorAdapters.soilEc
   private static _solarConverter = defaultSensorAdapters.solarRadiation
   private static _rainConverter = defaultSensorAdapters.rainGauge
   private static _windConverter = defaultSensorAdapters.wind
   private static _baroConverter = defaultSensorAdapters.barometricPressure
   private static _batteryConverter = defaultSensorAdapters.battery
   private static _acousticSplConverter = defaultSensorAdapters.acousticSpl
   private static _acousticWeatherConverter = defaultSensorAdapters.acousticWeather

   /**
    * Ingests a raw LoRaWAN uplink message, decodes binary payload, evaluates domain converters,
    * and returns an array of validated, strongly-typed DataPoints.
    *
    * @param uplink - Incoming ChirpStack LoRaWAN message object.
    * @returns Array of transformed DataPoints.
    */
   static process(uplink: PipelineUplinkInput): PipelineDataPointOutput[] {

      const dataPoints: PipelineDataPointOutput[] = []

      // 1. Resolve Canonical Device & Tenancy Identifiers
      const rawDeviceName = uplink.deviceInfo?.deviceName || uplink.deviceInfo?.devEui || uplink.devEUI || 'unknown'
      const deviceUri = this._buildDeviceUri(rawDeviceName)
      const plotUri = uplink.deviceInfo?.tags?.plot ? `plots/${uplink.deviceInfo.tags.plot}` : undefined
      const companyUri = uplink.deviceInfo?.tags?.company ? `companies/${uplink.deviceInfo.tags.company}` : undefined
      const timestamp = uplink.publishedAt || uplink.time || new Date().toISOString()
      const soilTexture = (uplink.deviceInfo?.tags?.soilTexture as any) || 'default'
      const rawSlope = uplink.deviceInfo?.tags?.soilSlope ? parseFloat(uplink.deviceInfo.tags.soilSlope) : undefined
      const rawIntercept = uplink.deviceInfo?.tags?.soilIntercept ? parseFloat(uplink.deviceInfo.tags.soilIntercept) : undefined
      const soilLinearRegression = (rawSlope !== undefined && rawIntercept !== undefined && !isNaN(rawSlope) && !isNaN(rawIntercept))
         ? {
              slope: rawSlope,
              intercept: rawIntercept,
              modelLabel: uplink.deviceInfo?.tags?.soilModelLabel,
           }
         : undefined

      // 2. Build LoRaWAN Radio Metadata Contract
      const bestGateway = uplink.rxInfo?.[0]
      const vendor = (uplink.deviceInfo?.tags?.vendor as any) || 'brad'
      const radioMetadata = {
         interface: '@bradtech/types:LoRaWanMetadataInterface',
         vendor,
         vendorModel: uplink.deviceInfo?.tags?.vendorModel || (rawDeviceName.startsWith('b26w') ? 'Brad Weather Station v1' : 'Brad Soil Probe v2.5'),
         vendorDeviceId: rawDeviceName,
         integrationType: 'lorawan' as const,
         devEui: uplink.deviceInfo?.devEui || uplink.devEUI,
         fPort: uplink.fPort,
         fCnt: uplink.fCnt,
         frequency: uplink.txInfo?.frequency,
         dataRate: uplink.txInfo?.dataRate,
         rssi: bestGateway?.rssi,
         snr: bestGateway?.snr,
         gatewayId: bestGateway?.gatewayId,
         gatewayCount: uplink.rxInfo?.length || 0,
      }


      // 3. Emit Network Quality DataPoints
      if (bestGateway?.rssi !== undefined) {
         dataPoints.push({
            device: deviceUri,
            plot: plotUri,
            company: companyUri,
            metric: 'okf:radio/lorawan/rssi',
            value: bestGateway.rssi,
            unit: 'dBm',
            kind: 'measured',
            confidence: 1.0,
            timestamp,
            metadata: radioMetadata,
         })
      }

      if (bestGateway?.snr !== undefined) {
         dataPoints.push({
            device: deviceUri,
            plot: plotUri,
            company: companyUri,
            metric: 'okf:radio/lorawan/snr',
            value: Number(bestGateway.snr.toFixed(1)),
            unit: 'dB',
            kind: 'measured',
            confidence: 1.0,
            timestamp,
            metadata: radioMetadata,
         })
      }

      // 4. Decode Payload via BradOSCodec
      if (!uplink.fPort || !uplink.data) {
         return dataPoints
      }

      // Special Case: FPort 1 (Boot Frame)
      if (uplink.fPort === 1) {
         const boot = BradOSCodec.decodeBootPayload(uplink.data)
         if (boot) {
            const battOutputs = LoRaWanPipeline._batteryConverter.convert({ voltageMv: boot.batteryMv })
            for (const b of battOutputs) {
               dataPoints.push({
                  device: deviceUri,
                  plot: plotUri,
                  company: companyUri,
                  metric: b.metric,
                  value: b.value,
                  unit: b.unit,
                  kind: 'measured',
                  confidence: b.confidence,
                  timestamp,
                  metadata: {
                     ...radioMetadata,
                     bootVersion: boot.version,
                     buildDoy: boot.buildDoy,
                     resetReason: boot.resetReason,
                     ...b.metadata,
                  },
               })
            }
         }
         return dataPoints
      }

      // Standard Telemetry: FPort 2 to 52
      const channel = BradOSCodec.decodeFPortChannel(uplink.fPort, uplink.data)
      if (!channel) {
         return dataPoints
      }

      const conversionOutputs: ConversionOutput[] = []

      switch (channel.channelType) {
         case 'canopy_temp': {
            const outputs = LoRaWanPipeline._runConverter(LoRaWanPipeline._airConverter, {
               temperature: channel.rawValue,
               humidity: 60.0,
            })
            const tempOut = outputs.find((o) => o.metric.includes('temperature'))
            if (tempOut) conversionOutputs.push(tempOut)
            break
         }

         case 'canopy_hum': {
            const outputs = LoRaWanPipeline._runConverter(LoRaWanPipeline._airConverter, {
               temperature: 20.0,
               humidity: channel.rawValue,
            })
            const humOut = outputs.find((o) => o.metric.includes('humidity'))
            if (humOut) conversionOutputs.push(humOut)
            break
         }

         case 'soil_moisture': {
            const vwcOut = LoRaWanPipeline._runConverter(
               LoRaWanPipeline._soilMoistureConverter,
               { depthCm: channel.depthCm || 10, rawValue: channel.rawValue },
               { soilTexture, soilLinearRegression },
            )

            conversionOutputs.push(...vwcOut)

            // Automatically compute derived pF matric potential
            if (vwcOut.length > 0) {
               const wpOut = LoRaWanPipeline._runConverter(
                  LoRaWanPipeline._soilWpConverter,
                  { depthCm: channel.depthCm || 10, vwcPercent: vwcOut[0].value },
                  { soilTexture },
               )
               conversionOutputs.push(...wpOut)
            }
            break
         }

         case 'soil_temp': {
            const tempOut = LoRaWanPipeline._runConverter(LoRaWanPipeline._soilTempConverter, {
               depthCm: channel.depthCm || 10,
               temperature: channel.rawValue,
            })
            conversionOutputs.push(...tempOut)
            break
         }

         case 'soil_ec': {
            const ecOut = LoRaWanPipeline._runConverter(LoRaWanPipeline._soilEcConverter, {
               depthCm: channel.depthCm || 10,
               bulkEcMsCm: channel.rawValue,
            })
            conversionOutputs.push(...ecOut)
            break
         }

         case 'solar': {
            const solarOut = LoRaWanPipeline._runConverter(LoRaWanPipeline._solarConverter, { irradianceWm2: channel.rawValue })
            conversionOutputs.push(...solarOut)
            break
         }

         case 'rain': {
            const rainOut = LoRaWanPipeline._runConverter(LoRaWanPipeline._rainConverter, { tipCount: channel.rawValue })
            conversionOutputs.push(...rainOut)
            break
         }

         case 'wind_speed': {
            const windOut = LoRaWanPipeline._runConverter(LoRaWanPipeline._windConverter, { speedMs: channel.rawValue })
            conversionOutputs.push(...windOut)
            break
         }

         case 'wind_dir': {
            const windDirOut = LoRaWanPipeline._runConverter(LoRaWanPipeline._windConverter, { speedMs: 0, directionDegrees: channel.rawValue })
            conversionOutputs.push(...windDirOut)
            break
         }

         case 'pressure': {
            const baroOut = LoRaWanPipeline._runConverter(LoRaWanPipeline._baroConverter, { pressureHpa: channel.rawValue })
            conversionOutputs.push(...baroOut)
            break
         }

         case 'battery': {
            const battOut = LoRaWanPipeline._runConverter(LoRaWanPipeline._batteryConverter, { voltageV: channel.rawValue })
            conversionOutputs.push(...battOut)
            break
         }

         case 'acoustic_spl': {
            const splOut = LoRaWanPipeline._runConverter(LoRaWanPipeline._acousticSplConverter, { rmsDbfs: channel.rawValue })
            conversionOutputs.push(...splOut)
            break
         }

         case 'acoustic_rain':
         case 'acoustic_wind': {
            const acWeatherOut = LoRaWanPipeline._runConverter(LoRaWanPipeline._acousticWeatherConverter, {
               highFrequencyEnergyRms: channel.channelType === 'acoustic_rain' ? channel.rawValue : -80,
               lowFrequencyEnergyRms: channel.channelType === 'acoustic_wind' ? channel.rawValue : -80,
            })
            conversionOutputs.push(...acWeatherOut)
            break
         }
      }

      // Map conversion outputs to final DataPoints
      for (const out of conversionOutputs) {
         const isDerived = out.metric.includes('potential') || out.metric.includes('par_ppfd') || out.metric.includes('percentage')

         dataPoints.push({
            device: deviceUri,
            plot: plotUri,
            company: companyUri,
            metric: out.metric,
            value: out.value,
            unit: out.unit,
            kind: isDerived ? 'computed' : 'measured',
            confidence: out.confidence,
            timestamp,
            metadata: {
               ...radioMetadata,
               sensorSource: channel.sensorSource,
               sensorModel: channel.sensorModel,
               ...out.metadata,
               interface: isDerived ? '@bradtech/types:ComputedMetadataInterface' : '@bradtech/types:LoRaWanMetadataInterface',
            },

         })
      }


      return dataPoints
   }

   /**
    * Executes a converter instance and injects class name, model code, and semver version into metadata.
    *
    * @param converter - Target sensor converter adapter.
    * @param raw - Input raw payload.
    * @param context - Environmental or plot calibration context.
    * @returns Enriched array of ConversionOutput objects.
    */
   private static _runConverter(
      converter: any,
      raw: any,
      context?: any,
   ): ConversionOutput[] {
      const outputs: ConversionOutput[] = converter.convert(raw, context)
      return outputs.map((out) => ({
         ...out,
         metadata: {
            converterClass: converter.constructor.name,
            modelCode: converter.modelCode,
            modelVersion: converter.modelVersion,
            ...out.metadata,
         },
      }))
   }

   /**
    * Normalizes raw hardware device names into canonical OKF device URIs.
    *
    * @param deviceName - Raw device identifier (e.g. "b25s004", "b26w001", "probes/b25s004").
    * @returns Canonical URI string formatted as `probes/<id>` or `weather-stations/<id>`.
    */
   private static _buildDeviceUri(deviceName: string): string {
      const clean = deviceName.trim().toLowerCase()
      if (clean.startsWith('probes/') || clean.startsWith('weather-stations/')) {
         return clean
      }
      if (clean.startsWith('b26w') || clean.startsWith('station')) {
         return `weather-stations/${clean}`
      }
      return `probes/${clean}`
   }
}
