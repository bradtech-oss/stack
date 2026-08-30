# `@bradtech/sensor-soil`

Multi-depth capacitive volumetric water content (VWC), soil matric water potential ($pF$ / kPa), electrical conductivity (EC), and soil temperature converters for the Brad IoT sensor micro-framework.

---

## 🎯 Overview

The `@bradtech/sensor-soil` package provides soil physics converters calibrated for agricultural and viticultural soils:

- **`SoilMoistureConverter`**: Converts multi-depth capacitive readings (10cm, 20cm, 30cm, 60cm, etc.) into Volumetric Water Content (VWC %), with support for soil texture presets (clay, loam, sand) and plot-specific linear regressions ($y = \text{slope} \cdot x + \text{intercept}$).
- **`SoilWaterPotentialConverter`**: Computes soil matric water potential ($\text{kPa}$ and $pF = \log_{10}(|\text{hPa}|)$) via the van Genuchten water retention curve.
- **`SoilTemperatureConverter`**: Converts multi-depth soil temperature sensors.
- **`SoilElectricalConductivityConverter`**: Normalizes bulk soil electrical conductivity ($\text{mS/m}$) to standard 25°C temperature.

---

## 📦 Installation

```bash
bun add @bradtech/sensor-soil
```

---

## 📄 License & Copyright

GNU AGPL-v3 — Copyright (C) 2026 Olivier Lépine <olivier@lepine.fr>
