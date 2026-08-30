# HOWTO: Using `@bradtech/sensor-air`

This guide explains how to convert air temperature and relative humidity into agronomic indices (Foliar VPD, ET0, Ground Frost Risk).

---

## 1. Computing Canopy Temperature, Dew Point & Foliar VPD

```typescript
import { CanopyMicroclimateConverter } from '@bradtech/sensor-air'

const converter = new CanopyMicroclimateConverter()

// Convert SHT40 raw air readings
const outputs = converter.convert({
   temperatureCelsius: 24.5,
   relativeHumidityPercent: 62.0,
   solarRadiationWattsPerMeter2: 650, // optional solar adjustment
})

for (const out of outputs) {
   console.log(`${out.metric}: ${out.value} ${out.unit} (confidence: ${out.confidence})`)
}
// Outputs:
// okf:agronomy/microclimate/canopy_temperature: 24.5 °C
// okf:agronomy/microclimate/canopy_humidity: 62.0 %
// okf:agronomy/microclimate/dew_point: 16.7 °C
// okf:agronomy/microclimate/wet_bulb_temperature: 19.3 °C
// okf:agronomy/plant/foliar_vpd: 1.16 kPa
```

---

## 2. Calculating Daily Evapotranspiration ($ET_0$)

```typescript
import { EvapotranspirationConverter } from '@bradtech/sensor-air'

const etConverter = new EvapotranspirationConverter()

const results = etConverter.convert({
   tempMin: 14.0,
   tempMax: 29.5,
   tempMean: 22.0,
   solarRadiationWPerM2: 720,
   latitudeDegrees: 44.8378, // Bordeaux vineyard latitude
   dayOfYear: 195,           // July 14
   windSpeedKmh: 12.0,
})

console.log('Daily ET0:', results[0].value, results[0].unit) // ~4.8 mm/day
```

---

## 3. Detecting Ground Frost Risk

```typescript
import { GroundFrostRiskConverter } from '@bradtech/sensor-air'

const frostConverter = new GroundFrostRiskConverter()

const alerts = frostConverter.convert({
   temperatureCelsius: 1.2,
   relativeHumidityPercent: 88.0,
   windSpeedKmh: 2.0, // Low wind = high radiative frost risk
})

console.log('Frost Index:', alerts[0].value) // Severity score between 0.0 (None) and 1.0 (Critical)
```

---

## 📄 License & Copyright

GNU AGPL-v3 — Copyright (C) 2026 Olivier Lépine <olivier@lepine.fr>
