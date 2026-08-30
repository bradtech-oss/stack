# `@bradtech/sensor`

Foundational sensor abstraction, conversion interfaces, registry, singleton facade, and historical replay engine for the Brad IoT sensor micro-framework.

---

## 🎯 Overview

The `@bradtech/sensor` package provides the core domain abstractions and engine for converting raw telemetry signals (LoRaWAN payloads, voltage measurements, sensor registers) into strongly-typed, traceable, and calibrated **OKF (Open Knowledge Format) DataPoints**.

### Key Architectural Components:
- **`BaseSensorConverter<TRaw, TContext>`**: Abstract base class providing confidence clamping, metadata injection, and semantic tagging.
- **`ConverterRegistry`**: Global static registry indexing converters by `family:modelCode`.
- **`Sensor`**: Singleton facade inheriting from `@quatrain/core` with pluggable adapters and logging.
- **`ReplayEngine`**: Deterministic batch processor for replaying historical raw sensor records into newly computed DataPoints with complete lineage and audit trail.

---

## 📦 Installation

```bash
bun add @bradtech/sensor
```

---

## 📄 License & Copyright

GNU AGPL-v3 — Copyright (C) 2026 Olivier Lépine <olivier@lepine.fr>
