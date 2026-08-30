# HOWTO: Using `@bradtech/sensor-lorawan`

This guide explains how to process ChirpStack LoRaWAN uplinks into calibrated DataPoints with `LoRaWanPipeline`.

---

## 1. Processing a ChirpStack Uplink Message into DataPoints

```typescript
import { LoRaWanPipeline, type PipelineUplinkInput } from '@bradtech/sensor-lorawan'

// Raw JSON uplink payload received via MQTT from ChirpStack
const uplinkMessage: PipelineUplinkInput = {
   deviceInfo: {
      deviceName: 'b25s004',
      devEui: '8c1f640000000004',
      tags: {
         plot: 'plot-saint-emilion-01',
         company: 'chateau-alpha',
         soilTexture: 'clay_loam',
         soilSlope: '1.05',
         soilIntercept: '-0.8',
      },
   },
   fPort: 12, // Soil Moisture @ 10cm depth
   fCnt: 142,
   data: 'AAAAQEF', // Base64 encoded Float32 LE
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

// Ingest and transform
const dataPoints = LoRaWanPipeline.process(uplinkMessage)

for (const dp of dataPoints) {
   console.log(`[${dp.kind.toUpperCase()}] ${dp.metric}: ${dp.value} ${dp.unit}`)
   console.log(`  Device: ${dp.device}, Plot: ${dp.plot}`)
   console.log(`  Metadata:`, dp.metadata)
}
// Outputs:
// [MEASURED] okf:radio/lorawan/rssi: -82 dBm
// [MEASURED] okf:radio/lorawan/snr: 9.2 dB
// [MEASURED] okf:soil/moisture/10cm: 25.4 % (sensorSource: 'Brad soil sensor', converterClass: 'SoilMoistureConverter')
// [COMPUTED] okf:soil/potential/pf/10cm: 2.82 pF (Derived water retention index)
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
