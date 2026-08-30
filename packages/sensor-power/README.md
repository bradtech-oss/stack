# `@bradtech/sensor-power`

Lithium-Ion battery state-of-charge (SoC %), brownout risk protection, and solar harvesting power telemetry converters for the Brad IoT sensor micro-framework.

---

## 🎯 Overview

The `@bradtech/sensor-power` package monitors probe and weather station electrical power subsystems:

- **`BatterySoCConverter`**: Converts battery millivolts ($\text{mV}$) into calibrated state-of-charge percentage ($\%$) via non-linear Li-Ion / LiFePO4 discharge curves, detects critical brownout risk below 3.40V, and evaluates battery health states (`critical`, `low`, `normal`, `full`).
- **`SolarHarvestingConverter`**: Converts solar panel voltage ($\text{mV}$) and detects active MPPT harvesting state.

---

## 📦 Installation

```bash
bun add @bradtech/sensor-power
```

---

## 📄 License & Copyright

GNU AGPL-v3 — Copyright (C) 2026 Olivier Lépine <olivier@lepine.fr>
