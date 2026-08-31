# Session Log: Workspace Scope Refinement - Remove Apps Directory

- **Date**: 2026-08-31
- **Agent/Engine**: Antigravity AI / Gemini 3.5 Flash
- **License**: AGPL-v3 (Copyright (C) 2026 Olivier Lépine <olivier@lepine.fr>)

## 📝 Actions Performed
1. **Removed Apps Workspace Directory (`apps/`)**:
   - Deleted `apps/api`, `apps/backoffice`, and `apps/mobile` from `bradtech-oss/stack`.
   - Updated `package.json` to exclude `"apps/*"` from `workspaces`.
2. **Maintained Focus on Core Open Source Packages**:
   - Retained and verified all domain packages in `packages/*` (`types`, `ontologies`, `sensor`, `sensor-air`, `sensor-soil`, `sensor-weather`, `sensor-power`, `sensor-acoustic`, `sensor-lorawan`, `db`, `sync-engine`, `hey-brad`).
   - Retained sovereign infrastructure recipes in `infra/*`.

## 🧪 Verification & Stability Audit
- Build status: **Pass**
- Unit tests: **45 passed / 0 failed** across 23 test files (231 expect assertions)
