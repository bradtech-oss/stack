# HOWTO: Using `@bradtech/sensor-soil`

This guide explains how to convert multi-depth soil moisture readings and derive water potential ($pF$).

---

## 1. Converting Capacitive Soil Moisture with Plot Linear Regression

```typescript
import { SoilMoistureConverter } from '@bradtech/sensor-soil'

const converter = new SoilMoistureConverter()

// Raw capacitive reading from Brad soil probe at 10cm depth
const rawMoisture = 28.5

// Plot context with custom laboratory calibration curve
const outputs = converter.convert(
   {
      rawMoisturePercent: rawMoisture,
      depthCm: 10,
   },
   {
      soilTexture: 'clay_loam',
      linearRegression: {
         slope: 1.08,
         intercept: -1.5,
         modelLabel: 'Lab Core Sample 2026-05',
      },
   }
)

console.log(outputs[0].metric) // 'okf:soil/moisture/10cm'
console.log(outputs[0].value)  // 29.28 %
console.log(outputs[0].metadata?.calibrationModel) // 'custom_linear_regression'
```

---

## 2. Deriving Matric Potential & $pF$ Curve

```typescript
import { SoilWaterPotentialConverter } from '@bradtech/sensor-soil'

const wpConverter = new SoilWaterPotentialConverter()

// Convert 22% VWC into matric suction and pF
const results = wpConverter.convert({
   volumetricWaterContentPercent: 22.0,
   depthCm: 20,
   soilTexture: 'silt_loam',
})

for (const out of results) {
   console.log(`${out.metric}: ${out.value} ${out.unit}`)
}
// Outputs:
// okf:soil/potential/matric/20cm: -85.4 kPa (Tension)
// okf:soil/potential/pf/20cm: 2.94 pF (Comfort zone before wilting point at 4.2)
```

---

## 3. Temperature-Compensated Electrical Conductivity (EC)

```typescript
import { SoilElectricalConductivityConverter } from '@bradtech/sensor-soil'

const ecConverter = new SoilElectricalConductivityConverter()

const ecResults = ecConverter.convert({
   rawEcMilliSiemensPerMeter: 45.0,
   soilTemperatureCelsius: 16.5,
   depthCm: 10,
})

console.log('Normalized EC @ 25°C:', ecResults[0].value, ecResults[0].unit)
```

---

## 📄 License & Copyright

GNU AGPL-v3 — Copyright (C) 2026 Olivier Lépine <olivier@lepine.fr>
