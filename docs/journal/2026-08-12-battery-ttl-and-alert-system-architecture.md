# Session Log: Dynamic Battery TTL & Event-Driven Alert System Specification
- **Date**: 2026-08-12
- **Agent/Engine**: Antigravity AI / Gemini 3.5 Flash
- **Milestone / Sprint**: Open Source Platform Rewrite (`bradtech-oss`) - Architecture Specifications

## 📝 Actions Performed
1. **Designed Dynamic 2-Point Battery TTL Algorithm**:
   - Integrated BradOS hardware voltage limits (`4.2V` 100% full, `3.3V` 0% nominal, `3.2V` hardware cutoff).
   - Formulated 2-point time-based discharge rate estimation over a 7-day window ($\Delta P / \Delta t$) to reflect site-specific temperature, LoRaWAN Spreading Factor, and RF retransmission conditions per probe.
2. **Designed Event-Driven Alert Architecture (Cause vs Notification Decoupling)**:
   - Defined standardized alert codes (`battery.alert.90`, `battery.alert.30`, `battery.alert.15`, `battery.alert.7`).
   - Decoupled hardware/system alert cause logging (`system_alerts` table in PostgreSQL) from user-configurable multi-channel notifications (Email, SMS, App Push, Webhooks) and delivery logs (`channel_delivery_logs`).
   - Guaranteed single-alert uniqueness per threshold via unique database constraints `(device_serial_number, code)` and Redis lock tokens.
3. **Created Bilingually Synchronized Architecture Documentation**:
   - Created [`docs/architecture/BATTERY_TTL_AND_ALERT_SYSTEM.md`](../architecture/BATTERY_TTL_AND_ALERT_SYSTEM.md) (International English).
   - Created [`docs/architecture/BATTERY_TTL_AND_ALERT_SYSTEM.fr.md`](../architecture/BATTERY_TTL_AND_ALERT_SYSTEM.fr.md) (French).
   - Updated architecture indices [`docs/architecture/index.md`](../architecture/index.md) and [`docs/architecture/index.fr.md`](../architecture/index.fr.md).

## 🧪 Verification & Stability Audit
- Build status: Pass (Architecture Documentation)
- Both English & French specification documents strictly synchronized.

## 🔗 Referenced Specifications
- [Architecture Documentation Index (`docs/architecture/index.md`)](../architecture/index.md)
- [Battery TTL & Alert System Specification (`docs/architecture/BATTERY_TTL_AND_ALERT_SYSTEM.md`)](../architecture/BATTERY_TTL_AND_ALERT_SYSTEM.md)
