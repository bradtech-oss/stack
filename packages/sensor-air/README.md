# `@bradtech/sensor-air`

Crop canopy air microclimate, foliar vapor pressure deficit (VPD), reference evapotranspiration (ET0), and ground frost risk converters for the Brad IoT sensor micro-framework.

---

## 🎯 Overview

The `@bradtech/sensor-air` package converts raw SHT40 / ambient air temperature, relative humidity, solar radiation, and wind inputs into calibrated microclimatic and agronomic risk indicators:

- **`CanopyMicroclimateConverter`**: Computes canopy temperature, relative humidity, dew point, wet bulb temperature, and foliar VPD (Vapor Pressure Deficit).
- **`EvapotranspirationConverter`**: Computes FAO-56 Penman-Monteith / Hargreaves reference evapotranspiration ($ET_0$ in mm/day).
- **`GroundFrostRiskConverter`**: Detects spring frost conditions (radiative vs advective) and computes frost severity index based on wet bulb temperature.

---

## 📦 Installation

```bash
bun add @bradtech/sensor-air
```

---

## 📄 License & Copyright

GNU AGPL-v3 — Copyright (C) 2026 Olivier Lépine <olivier@lepine.fr>
