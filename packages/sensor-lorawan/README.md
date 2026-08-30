# `@bradtech/sensor-lorawan`

LoRaWAN ChirpStack uplink binary decoder, FPort dispatching pipeline, and pre-instantiated domain adapters for BradOS probes and weather stations.

---

## 🎯 Overview

The `@bradtech/sensor-lorawan` package acts as the bridge between LoRaWAN Network Servers (ChirpStack v4) and the Brad sensor micro-framework:

- **`BradOSCodec`**: Decodes IEEE 754 Float32 Little-Endian payload buffers, decodes 9-byte FPort 1 boot diagnostic frames, and maps BradOS FPort channels (FPort 1–52, 218–224) to physical hardware sensor sources (SHT40, Brad soil sensor, SI1145, etc.).
- **`LoRaWanPipeline`**: End-to-end ingestion pipeline transforming ChirpStack JSON uplinks into immutable, validated, and strongly-typed **DataPoints** ready for PostgreSQL / TimescaleDB storage.
- **`defaultSensorAdapters`**: Pre-instantiated singleton adapter registry ready for zero-allocation streaming execution.

---

## 📦 Installation

```bash
bun add @bradtech/sensor-lorawan
```

---

## 📄 License & Copyright

GNU AGPL-v3 — Copyright (C) 2026 Olivier Lépine <olivier@lepine.fr>
