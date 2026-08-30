# `@bradtech/sensor-acoustic`

Digital I2S acoustic sensing, dBA sound pressure level (SPL), and acoustic rain/wind spectrum converters for the Brad IoT sensor micro-framework.

---

## 🎯 Overview

The `@bradtech/sensor-acoustic` package processes digital microphone telemetry:

- **`AcousticSplConverter`**: Converts raw digital full-scale dBFS measurements into A-weighted Sound Pressure Level ($\text{dBA SPL}$), evaluates ambient noise classifications (`quiet`, `moderate`, `noisy`, `industrial`), and monitors probe environmental disturbance.
- **`AcousticWeatherConverter`**: Performs spectral analysis over acoustic frequency bands to detect acoustic precipitation impact and wind buffeting noise.

---

## 📦 Installation

```bash
bun add @bradtech/sensor-acoustic
```

---

## 📄 License & Copyright

GNU AGPL-v3 — Copyright (C) 2026 Olivier Lépine <olivier@lepine.fr>
