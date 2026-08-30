# HOWTO: Using `@bradtech/sensor`

This guide presents common usage scenarios, custom converter implementations, and historical data replay with `@bradtech/sensor`.

---

## 1. Implementing a Custom Sensor Converter

To implement a new sensor conversion algorithm, extend `BaseSensorConverter`:

```typescript
import { BaseSensorConverter, type ConversionOutput } from '@bradtech/sensor'

interface CropContext {
   canopyHeightMeters?: number
   leafAreaIndex?: number
}

export class CanopyVpdConverter extends BaseSensorConverter<{ airTemp: number; rh: number; leafTemp: number }, CropContext> {
   readonly sensorFamily = 'microclimate'
   readonly modelCode = 'canopy-vpd-calculator'
   readonly modelVersion = '1.0.0'
   readonly description = 'Calculates foliar vapor pressure deficit (VPD) in kPa'

   convert(
      raw: { airTemp: number; rh: number; leafTemp: number },
      context?: CropContext
   ): ConversionOutput[] {
      // 1. Validate / clamp input signals
      const clampedAir = this.clampWithConfidence(raw.airTemp, -30, 60)
      const clampedRh = this.clampWithConfidence(raw.rh, 0, 100)
      const clampedLeaf = this.clampWithConfidence(raw.leafTemp, -30, 60)

      // 2. Compute saturation and actual vapor pressures
      const vpsLeaf = 0.61078 * Math.exp((17.27 * clampedLeaf.value) / (clampedLeaf.value + 237.3))
      const vpsAir = 0.61078 * Math.exp((17.27 * clampedAir.value) / (clampedAir.value + 237.3))
      const vpaAir = vpsAir * (clampedRh.value / 100.0)

      const vpd = Math.max(0, vpsLeaf - vpaAir)
      const confidence = Math.min(clampedAir.confidence, clampedRh.confidence, clampedLeaf.confidence)

      return [
         {
            metric: 'okf:agronomy/plant/foliar_vpd',
            value: Number(vpd.toFixed(3)),
            unit: 'kPa',
            qudtUri: 'qudt:unit/KiloPA',
            confidence,
            metadata: {
               algorithm: 'Tetens-Monteith',
               canopyHeight: context?.canopyHeightMeters ?? 1.2,
            },
         },
      ]
   }
}
```

---

## 2. Registering and Accessing Adapters via the `Sensor` Singleton Facade

```typescript
import { Sensor } from '@bradtech/sensor'

// 1. Register adapter
Sensor.addAdapter('canopyVpd', new CanopyVpdConverter())

// 2. Check and retrieve adapter
if (Sensor.hasAdapter('canopyVpd')) {
   const adapter = Sensor.getAdapter<CanopyVpdConverter>('canopyVpd')
   const outputs = adapter.convert({ airTemp: 24.5, rh: 65, leafTemp: 23.8 })
   console.log('Computed VPD:', outputs[0].value, outputs[0].unit)
}

// 3. Or invoke directly via default adapter
Sensor.defaultAdapter = Sensor.getAdapter('canopyVpd')
const results = Sensor.convert({ airTemp: 28.0, rh: 45, leafTemp: 26.5 })
```

---

## 3. Replaying Historical Data with `ReplayEngine`

The `ReplayEngine` allows backfilling new agronomic algorithms over years of historical raw sensor readings:

```typescript
import { ConverterRegistry, ReplayEngine, type RawDataPointInput } from '@bradtech/sensor'

// Register target converter
ConverterRegistry.register(new CanopyVpdConverter())

// Historical raw records loaded from database
const rawPoints: RawDataPointInput[] = [
   {
      id: '8f0a20a6-1234-4567-89ab-cdef01234567',
      device: 'probes/b25s004',
      plot: 'plots/parcelle-nord',
      company: 'companies/domaine-dupont',
      metric: 'okf:agronomy/microclimate/canopy_temperature',
      value: 22.4,
      timestamp: '2026-06-15T14:00:00Z',
   },
]

// Execute batch deterministic replay
const computedPoints = ReplayEngine.replay(
   rawPoints,
   'microclimate',
   'canopy-vpd-calculator',
   { canopyHeightMeters: 1.5 }
)

console.log(`Generated ${computedPoints.length} computed points with full audit lineage!`)
```

---

## 📄 License & Copyright

GNU AGPL-v3 — Copyright (C) 2026 Olivier Lépine <olivier@lepine.fr>
