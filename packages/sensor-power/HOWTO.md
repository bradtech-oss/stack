# HOWTO: Using `@bradtech/sensor-power`

This guide explains how to convert battery and solar panel voltages into health diagnostics and state-of-charge.

---

## 1. Computing Battery State-of-Charge & Brownout Risk

```typescript
import { BatterySoCConverter } from '@bradtech/sensor-power'

const batteryConverter = new BatterySoCConverter()

// Raw battery reading: 3820 mV
const outputs = batteryConverter.convert({
   voltageMilliVolts: 3820,
})

for (const out of outputs) {
   console.log(`${out.metric}: ${out.value} ${out.unit}`)
}
// Outputs:
// okf:power/battery/voltage: 3.82 V
// okf:power/battery/percentage: 72 % (HealthState: 'normal', isBrownoutRisk: false)
```

---

## 2. Detecting Low Battery Brownout Condition

```typescript
import { BatterySoCConverter } from '@bradtech/sensor-power'

const batteryConverter = new BatterySoCConverter()

// Critical battery reading: 3350 mV
const outputs = batteryConverter.convert({
   voltageMilliVolts: 3350,
})

const percentageDp = outputs.find(o => o.metric === 'okf:power/battery/percentage')
console.log('Battery %:', percentageDp?.value) // 1 %
console.log('Health State:', percentageDp?.metadata?.healthState) // 'critical'
console.log('Brownout Risk:', percentageDp?.metadata?.isBrownoutRisk) // true
```

---

## 3. Monitoring Solar Energy Harvesting

```typescript
import { SolarHarvestingConverter } from '@bradtech/sensor-power'

const solarConverter = new SolarHarvestingConverter()

const results = solarConverter.convert({
   solarMilliVolts: 5200, // Active sunlight on solar panel
})

console.log('Solar Voltage:', results[0].value, results[0].unit) // 5.2 V
console.log('Harvesting Active:', results[0].metadata?.isHarvesting) // true
```

---

## 📄 License & Copyright

GNU AGPL-v3 — Copyright (C) 2026 Olivier Lépine <olivier@lepine.fr>
