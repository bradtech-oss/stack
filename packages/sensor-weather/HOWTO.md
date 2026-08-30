# HOWTO: Using `@bradtech/sensor-weather`

This guide explains how to convert weather station sensor signals (Rain, Wind, Solar, Pressure).

---

## 1. Converting Rain Gauge Tipping Bucket Pulses

```typescript
import { RainGaugeConverter } from '@bradtech/sensor-weather'

const rainConverter = new RainGaugeConverter()

// 15 tips over a 15-minute interval with standard 0.2mm bucket resolution
const outputs = rainConverter.convert({
   tipCount: 15,
   bucketResolutionMm: 0.2,
   intervalMinutes: 15,
})

for (const out of outputs) {
   console.log(`${out.metric}: ${out.value} ${out.unit}`)
}
// Outputs:
// okf:weather/rain/accumulation: 3.0 mm
// okf:weather/rain/rate: 12.0 mm/h
```

---

## 2. Converting Wind Speed & Direction to Compass Cardinal

```typescript
import { WindConverter } from '@bradtech/sensor-weather'

const windConverter = new WindConverter()

const results = windConverter.convert({
   speedMetersPerSecond: 6.5,
   directionDegrees: 225, // South-West
   gustSpeedMetersPerSecond: 11.2,
})

console.log('Wind Speed:', results[0].value, results[0].unit) // 23.4 km/h
console.log('Cardinal Direction:', results[1].metadata?.cardinal) // 'SW'
console.log('Wind Gust:', results[2].value, results[2].unit) // 40.32 km/h
```

---

## 3. Converting Solar Irradiance to Photosynthetic PAR PPFD

```typescript
import { SolarRadiationConverter } from '@bradtech/sensor-weather'

const solarConverter = new SolarRadiationConverter()

const solarOutputs = solarConverter.convert({
   solarIrradianceWattsPerMeter2: 850,
})

console.log('Solar Radiation:', solarOutputs[0].value, 'W/m²') // 850 W/m²
console.log('PAR PPFD:', solarOutputs[1].value, 'µmol/m²/s')   // ~1717 µmol/m²/s
```

---

## 📄 License & Copyright

GNU AGPL-v3 — Copyright (C) 2026 Olivier Lépine <olivier@lepine.fr>
