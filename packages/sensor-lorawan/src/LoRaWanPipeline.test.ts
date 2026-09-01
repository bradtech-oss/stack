import { describe, expect, it } from 'bun:test'
import { LoRaWanPipeline, type AgronomicPlotContext, type PipelineUplinkInput } from './LoRaWanPipeline'

describe('LoRaWanPipeline End-to-End Tests', () => {
   it('should process a pure LoRaWAN FPort 15 (Canopy Temperature) frame into DataPoints', () => {
      // 22.5 °C Float32 LE -> Base64: "AAAAQEF"
      const buf = Buffer.alloc(4)
      buf.writeFloatLE(22.5, 0)
      const dataBase64 = buf.toString('base64')

      // Pure LoRaWAN frame from ChirpStack (no soil or agronomic knowledge in radio payload)
      const uplink: PipelineUplinkInput = {
         deviceInfo: {
            deviceName: 'b26s001',
            devEui: '8c1f640000000001',
         },
         fPort: 15,
         fCnt: 42,
         data: dataBase64,
         rxInfo: [{ gatewayId: 'gw-1', rssi: -85, snr: 8.5 }],
         publishedAt: '2026-08-30T12:00:00Z',
      }

      // Backoffice supplies plot and tenancy context
      const agronomicContext: AgronomicPlotContext = {
         plot: 'plots/plot-alpha',
         company: 'companies/comp-1',
      }

      const dataPoints = LoRaWanPipeline.process(uplink, agronomicContext)

      expect(dataPoints.length).toBeGreaterThanOrEqual(3) // RSSI, SNR, Canopy Temp

      const tempDp = dataPoints.find((dp) => dp.metric === 'okf:agronomy/microclimate/canopy_temperature')
      expect(tempDp).toBeDefined()
      expect(tempDp?.value).toBe(22.5)
      expect(tempDp?.device).toBe('probes/b26s001')
      expect(tempDp?.plot).toBe('plots/plot-alpha')
      expect(tempDp?.company).toBe('companies/comp-1')
      expect(tempDp?.kind).toBe('measured')
      expect(tempDp?.metadata?.interface).toBe('@bradtech/types:LoRaWanMetadataInterface')
      expect(tempDp?.metadata?.vendor).toBe('brad')
      expect(tempDp?.metadata?.vendorModel).toBe('Brad Soil Probe v2.5')
      expect(tempDp?.metadata?.fPort).toBe(15)
      expect(tempDp?.metadata?.sensorSource).toBe('SHT40')
      expect(tempDp?.metadata?.converterClass).toBe('CanopyMicroclimateConverter')
      expect(tempDp?.metadata?.modelCode).toBe('canopy-microclimate-evaluator')
      expect(tempDp?.metadata?.modelVersion).toBe('1.0.0')
   })

   it('should process FPort 12 (Soil Moisture) without agronomic context using default texture', () => {
      const buf = Buffer.alloc(4)
      buf.writeFloatLE(26.0, 0) // 26% raw dielectric moisture

      const uplink: PipelineUplinkInput = {
         deviceInfo: { deviceName: 'b26s002' },
         fPort: 12,
         data: buf.toString('base64'),
      }

      // Ingesting without agronomic context (unassigned probe)
      const dataPoints = LoRaWanPipeline.process(uplink)

      const moisture = dataPoints.find((dp) => dp.metric === 'okf:soil/moisture/10cm')
      expect(moisture).toBeDefined()
      expect(moisture?.value).toBe(26.0)
      expect(moisture?.kind).toBe('measured')
      expect(moisture?.metadata?.sensorSource).toBe('Brad soil sensor')
      expect(moisture?.metadata?.converterClass).toBe('SoilMoistureConverter')
      expect(moisture?.metadata?.modelCode).toBe('soil-vwc-texture-calibrated')
      expect(moisture?.metadata?.modelVersion).toBe('1.0.0')
      expect(moisture?.metadata?.soilTexture).toBe('default')

      const pf = dataPoints.find((dp) => dp.metric === 'okf:soil/potential/pf/10cm')
      expect(pf).toBeDefined()
      expect(pf?.kind).toBe('computed')
      expect(pf?.metadata?.converterClass).toBe('SoilWaterPotentialConverter')
      expect(pf?.metadata?.modelCode).toBe('soil-water-potential-van-genuchten')
      expect(pf?.metadata?.modelVersion).toBe('1.0.0')
   })

   it('should apply Backoffice parcel-specific soil calibration and texture when associated', () => {
      const buf = Buffer.alloc(4)
      buf.writeFloatLE(20.0, 0)

      // Pure raw radio frame
      const uplink: PipelineUplinkInput = {
         deviceInfo: {
            deviceName: 'b26s003',
            devEui: '8c1f640000000003',
         },
         fPort: 12,
         data: buf.toString('base64'),
      }

      // Agronomic context resolved from Backoffice database for this probe's plot
      const agronomicContext: AgronomicPlotContext = {
         plot: 'plots/parcelle-saint-emilion',
         company: 'companies/chateau-alpha',
         soilTexture: 'clay',
         soilLinearRegression: {
            slope: 1.08,
            intercept: -0.4,
            modelLabel: 'Lab-Pedo-2026',
         },
      }

      const dataPoints = LoRaWanPipeline.process(uplink, agronomicContext)
      const moisture = dataPoints.find((dp) => dp.metric === 'okf:soil/moisture/10cm')

      expect(moisture).toBeDefined()
      expect(moisture?.value).toBe(21.2) // 20.0 * 1.08 - 0.4 = 21.2%
      expect(moisture?.plot).toBe('plots/parcelle-saint-emilion')
      expect(moisture?.company).toBe('companies/chateau-alpha')
      expect(moisture?.metadata?.calibrationType).toBe('custom_linear_regression')
      expect(moisture?.metadata?.calibrationSlope).toBe(1.08)
      expect(moisture?.metadata?.calibrationIntercept).toBe(-0.4)
      expect(moisture?.metadata?.customModelLabel).toBe('Lab-Pedo-2026')
      expect(moisture?.metadata?.soilTexture).toBe('clay')
   })
})
