# HOWTO: Using `@bradtech/sensor-acoustic`

This guide explains how to convert raw digital microphone readings into dBA sound pressure levels and acoustic weather indicators.

---

## 1. Converting Digital dBFS to dBA SPL

```typescript
import { AcousticSplConverter } from '@bradtech/sensor-acoustic'

const converter = new AcousticSplConverter()

// Raw digital I2S microphone reading in -dBFS
const outputs = converter.convert({
   rawDbfs: -35.0,
   sampleDurationMs: 1000,
})

console.log('Sound Pressure Level:', outputs[0].value, outputs[0].unit) // ~59.0 dBA
console.log('Environment Class:', outputs[0].metadata?.noiseClass)     // 'moderate'
```

---

## 2. Detecting Acoustic Rain & Wind Buffeting

```typescript
import { AcousticWeatherConverter } from '@bradtech/sensor-acoustic'

const weatherConverter = new AcousticWeatherConverter()

// Frequency band energies from digital probe FFT
const results = weatherConverter.convert({
   lowBandEnergyDb: -42.0,   // High low-frequency energy indicates wind turbulence
   midBandEnergyDb: -30.0,   // High mid-frequency energy indicates rain drop impacts
   highBandEnergyDb: -45.0,
})

for (const out of results) {
   console.log(`${out.metric}: ${out.value} ${out.unit}`)
}
// Outputs:
// okf:environment/acoustic/rain_intensity: High confidence acoustic rain detected
// okf:environment/acoustic/wind_buffeting: Moderate wind buffeting
```

---

## 📄 License & Copyright

GNU AGPL-v3 — Copyright (C) 2026 Olivier Lépine <olivier@lepine.fr>
