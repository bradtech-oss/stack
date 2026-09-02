# HOWTO: Working with @bradtech/datapoints

This guide presents common patterns for storing and querying telemetry using the `DataPoint` model and `DataPointRepository`.

---

## 1. Batch Telemetry Ingestion in a Background Worker

When consuming MQTT streams (e.g. ChirpStack / LoRaWAN uplinks), use `insertMany()` to record decoded measurements:

```typescript
import { DataPointRepository } from '@bradtech/datapoints'
import type { PipelineDataPointOutput } from '@bradtech/sensor-lorawan'

export async function storeIncomingFrame(
   repo: DataPointRepository,
   decodedMetrics: PipelineDataPointOutput[],
   devEui: string,
   publishedAt: string,
) {
   const rows = decodedMetrics.map((item) => ({
      device: item.device || devEui,
      plot: item.plot,
      company: item.company,
      metric: item.metric,
      value: item.value,
      unit: item.unit,
      kind: item.kind,
      confidence: item.confidence,
      timestamp: item.measuredAt || publishedAt,
      metadata: {
         rawPayload: item.rawPayload,
         rawFPort: item.rawFPort,
         rawInput: item.rawInput,
         algorithmCode: item.algorithmCode,
         algorithmVersion: item.algorithmVersion,
      },
   }))

   const inserted = await repo.insertMany(rows)
   return inserted
}
```

---

## 2. Querying Plot Timeline for Dashboards & Charts

Use `getTimeline()` to fetch time-windowed metrics for an agronomic plot:

```typescript
import { DataPointRepository } from '@bradtech/datapoints'

const repo = new DataPointRepository()

// Fetch last 48 hours of soil moisture across all probe depths
const soilMoisture = await repo.getTimeline({
   plot: 'plots/parcelle-nord',
   from: new Date(Date.now() - 48 * 3600 * 1000),
   to: new Date(),
   order: 'asc',
   limit: 500,
})

console.log(`Found ${soilMoisture.length} soil moisture readings.`)
```

---

## 3. Querying Point-in-Time Latest Readings

Check the last known battery level or canopy temperature of a field probe:

```typescript
import { DataPointRepository } from '@bradtech/datapoints'

const repo = new DataPointRepository()

const latestBattery = await repo.getLatest('8c1f645490100016', 'okf:agronomy/power/battery_voltage')
if (latestBattery) {
   console.log(`Battery: ${latestBattery._.value} mV at ${latestBattery._.timestamp}`)
}
```
