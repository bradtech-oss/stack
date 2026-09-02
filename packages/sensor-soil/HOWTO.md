# HOWTO: Using `@bradtech/sensor-soil`

This guide explains how to convert multi-depth capacitive soil moisture readings, leverage soil textures, derive matric water potential ($pF$), and replay raw capacitance with updated calibration models.

---

## 🌾 1. Why Soil Texture Matters

A raw capacitive sensor measures dielectric permittivity, not directly water volume. Soil texture (`sand`, `loam`, `clay`, `silt`, `peat`) determines:
1. **Calibration Slope & Intercept**: Relates raw capacitive frequency/voltage to Volumetric Water Content ($VWC\,\%$).
2. **Water Retention & Availability ($pF$)**: Relates $VWC\,\%$ to root-suction tension using the **Mualem-van Genuchten** hydraulic model.

---

## 🧪 2. Converting Capacitive Soil Moisture with Plot Linear Regression

```typescript
import { SoilMoistureConverter } from '@bradtech/sensor-soil'

const converter = new SoilMoistureConverter()

// Raw capacitive reading from Brad soil probe at 10cm depth
const rawMoisture = 28.5

// Plot context with custom laboratory calibration curve (y = slope * raw + intercept)
const outputs = converter.convert(
   {
      rawValue: rawMoisture,
      depthCm: 10,
      soilTemperature: 18.2, // thermal drift compensation
   },
   {
      soilTexture: 'clay',
      soilLinearRegression: {
         slope: 1.12,
         intercept: 0.8,
         modelLabel: 'Lab Core Sample 2026-05 - Argilo-Calcaire',
      },
   }
)

console.log(outputs[0].metric) // 'okf:soil/moisture/10cm'
console.log(outputs[0].value)  // 32.72 %
console.log(outputs[0].metadata?.rawInput) // 28.5 (Raw capacitance preserved!)
```

---

## 💧 3. Deriving Matric Potential & $pF$ Hydraulic Curve

```typescript
import { SoilWaterPotentialConverter } from '@bradtech/sensor-soil'

const wpConverter = new SoilWaterPotentialConverter()

// Convert 22% VWC into matric suction and pF based on soil texture
const results = wpConverter.convert(
   {
      vwcPercent: 22.0,
      depthCm: 10,
   },
   {
      soilTexture: 'clay',
   }
)

for (const out of results) {
   console.log(`${out.metric}: ${out.value} ${out.unit}`)
}
// Outputs:
// okf:soil/potential/matric/10cm: -142.6 kPa (Matric suction)
// okf:soil/potential/pf/10cm: 3.16 pF (Readily Available Water - Comfort zone)
```

---

## 🔁 4. Preserving Raw Capacitance & Historical Model Replay

**Are raw capacitance measurements preserved?**  
**YES.** Every `DataPoint` emitted by the pipeline retains the immutable `rawInput` (dielectric permittivity / frequency / voltage) in its root and metadata fields.

When agronomic research, soil coring, or lab calibration delivers an improved model in the future, the **`ReplayEngine`** from `@bradtech/sensor` can reprocess historical raw DataPoints without information loss:

```typescript
import { ReplayEngine } from '@bradtech/sensor'
import { SoilMoistureConverter } from '@bradtech/sensor-soil'

// 1. Fetch historical raw datapoints from PostgreSQL
const historicalDataPoints = await fetchHistoricalRawDataPoints('probes/b25s004', 'okf:soil/moisture/10cm')

// 2. Initialize updated converter with refined calibration
const newConverter = new SoilMoistureConverter()
const newPlotContext = {
   soilTexture: 'clay',
   soilLinearRegression: { slope: 1.18, intercept: 1.05, modelLabel: 'INRAE 2027 Refined Model' },
}

// 3. Replay historical data to generate versioned computed DataPoints
const recomputedDataPoints = ReplayEngine.replay(
   historicalDataPoints,
   newConverter,
   newPlotContext
)

console.log(`Recomputed ${recomputedDataPoints.length} datapoints with updated calibration!`)
```

---

## ⚡ 5. Temperature-Compensated Electrical Conductivity (EC)

```typescript
import { SoilElectricalConductivityConverter } from '@bradtech/sensor-soil'

const ecConverter = new SoilElectricalConductivityConverter()

const ecResults = ecConverter.convert({
   bulkEcMsCm: 1.45,
   depthCm: 10,
})

console.log('Normalized EC @ 25°C:', ecResults[0].value, ecResults[0].unit)
```

---

## 📄 License & Copyright

GNU AGPL-v3 — Copyright (C) 2026 Olivier Lépine <olivier@lepine.fr>
