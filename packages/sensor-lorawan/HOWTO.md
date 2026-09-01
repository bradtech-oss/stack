# HOWTO: Using `@bradtech/sensor-lorawan`

This guide explains how to process ChirpStack LoRaWAN uplinks into calibrated DataPoints with `LoRaWanPipeline`.

---

## 🏛️ Architecture: Decoupling Radio Frame from Agronomic Soil Models

> [!IMPORTANT]
> **Payload Agnosticism**: A LoRaWAN uplink packet is strictly hardware and radio-centric (devEUI, FPort, frame counter, RSSI, and raw IEEE 754 Float32 sensor readings). A physical probe **never** knows what parcel or soil type it is installed in.
> 
> **Backoffice Agronomic Context**: The Backoffice database assigns a physical probe (`devEUI`) to an agricultural parcel (`Plot`), and stores the plot's soil profile (e.g. `clay`, `sand`, `loam`) along with optional laboratory calibration models ($y = a \cdot x + b$).
>
> When ingesting an uplink, the Telemetry Worker retrieves the plot's `AgronomicPlotContext` from the database/cache and injects it into `LoRaWanPipeline.process(uplink, agronomicContext)`.

---

## 1. Processing a ChirpStack Uplink Message into DataPoints

```typescript
import {
   LoRaWanPipeline,
   type PipelineUplinkInput,
   type AgronomicPlotContext,
} from '@bradtech/sensor-lorawan'

// 1. Raw JSON uplink payload received via MQTT from ChirpStack
const uplinkMessage: PipelineUplinkInput = {
   deviceInfo: {
      deviceName: 'b25s004',
      devEui: '8c1f640000000004',
   },
   fPort: 12, // Soil Moisture @ 10cm depth (Raw Capacitance / Dielectric value)
   fCnt: 142,
   data: 'AAAAQEF', // Base64 encoded Float32 LE (e.g. 25.4)
   rxInfo: [
      {
         gatewayId: '0016c001f1122334',
         rssi: -82,
         snr: 9.2,
      },
   ],
   txInfo: {
      frequency: 868100000,
      dataRate: 0, // SF12 / 125kHz
   },
   publishedAt: '2026-08-30T18:00:00Z',
}

// 2. Agronomic Plot Context resolved from Backoffice / MDM database
const agronomicContext: AgronomicPlotContext = {
   plot: 'plots/parcelle-saint-emilion-01',
   company: 'companies/chateau-alpha',
   soilTexture: 'clay',
   soilLinearRegression: {
      slope: 1.05,
      intercept: -0.8,
      modelLabel: 'Lab-Pedo-2026',
   },
}

// 3. Ingest and transform
const dataPoints = LoRaWanPipeline.process(uplinkMessage, agronomicContext)

for (const dp of dataPoints) {
   console.log(`[${dp.kind.toUpperCase()}] ${dp.metric}: ${dp.value} ${dp.unit}`)
   console.log(`  Device: ${dp.device}, Plot: ${dp.plot}`)
   console.log(`  Metadata:`, dp.metadata)
}
// Outputs:
// [MEASURED] okf:radio/lorawan/rssi: -82 dBm
// [MEASURED] okf:radio/lorawan/snr: 9.2 dB
// [MEASURED] okf:soil/moisture/10cm: 25.87 % (sensorSource: 'Brad soil sensor', converterClass: 'SoilMoistureConverter', soilTexture: 'clay')
// [COMPUTED] okf:soil/potential/pf/10cm: 2.82 pF (Derived water retention index based on plot soil texture)
```

---

## 2. Using Pre-Instantiated Default Adapters Directly

```typescript
import { defaultSensorAdapters, registerDefaultSensorAdapters } from '@bradtech/sensor-lorawan'
import { Sensor } from '@bradtech/sensor'

// 1. Direct access without new allocations
const airConverter = defaultSensorAdapters.canopyAir
const tempResults = airConverter.convert({ temperatureCelsius: 21.0, relativeHumidityPercent: 70 })

// 2. Or register all domain adapters into the global Quatrain Sensor facade in one line
registerDefaultSensorAdapters()

const soilAdapter = Sensor.getAdapter('soilMoisture')
```

---

## 📄 License & Copyright

GNU AGPL-v3 — Copyright (C) 2026 Olivier Lépine <olivier@lepine.fr>
