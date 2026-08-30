# `@bradtech/sensor-weather`

Rain gauge tipping bucket, wind anemometer & direction vane, solar radiation pyranometer (PAR PPFD), and barometric pressure converters for the Brad IoT sensor micro-framework.

---

## 🎯 Overview

The `@bradtech/sensor-weather` package provides physical weather station converters:

- **`RainGaugeConverter`**: Converts tipping bucket pulse counts into total rainfall accumulation ($\text{mm}$) and instantaneous precipitation rate ($\text{mm/h}$).
- **`WindConverter`**: Converts wind speed ($\text{m/s}$ to $\text{km/h}$) and wind direction angles into 16-point cardinal compass bearings (N, NNE, NE, etc.).
- **`SolarRadiationConverter`**: Converts raw solar irradiance ($\text{W/m}^2$) into photosynthetic active radiation ($\text{PAR PPFD}$ in $\mu\text{mol}\cdot\text{m}^{-2}\cdot\text{s}^{-1}$).
- **`BarometricPressureConverter`**: Computes absolute atmospheric pressure ($\text{hPa}$) and sea-level reduced pressure ($\text{QNH}$) via the barometric hypsometric formula.

---

## 📦 Installation

```bash
bun add @bradtech/sensor-weather
```

---

## 📄 License & Copyright

GNU AGPL-v3 — Copyright (C) 2026 Olivier Lépine <olivier@lepine.fr>
