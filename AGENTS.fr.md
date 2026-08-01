# Instructions & Directives pour Agents IA — bradtech-oss

> [!IMPORTANT]
> Tous les agents de codage IA interagissant avec cet espace de travail DOIVENT impérativement lire et respecter les règles énoncées dans ce document.
>
> 🌐 *English version available in [`AGENTS.md`](AGENTS.md)*

---

## 1. Directives de Base & Pointeur vers le Gist Personnel

Toutes les actions des agents dans ce dépôt doivent se conformer aux principes de développement, normes de codage, exigence de la langue anglaise internationale et règles personnelles définies dans :
👉 **[Gist: Personal Gemini Rules & Instructions](https://gist.github.com/crapougnax/47971b85aa73dd702f4372a89858111c)**

---

## 2. Conformité avec la Documentation d'Architecture

Avant d'entreprendre toute tâche de développement, de refactoring, de migration de base de données ou d'infrastructure, les agents **DOIVENT** lire et respecter la documentation d'architecture faisant autorité dans :
👉 **[Index de la Documentation d'Architecture (`docs/architecture/index.fr.md`)](docs/architecture/index.fr.md)** *(English version: [docs/architecture/index.md](docs/architecture/index.md))*

> [!CAUTION]
> **Obligation de Synchronisation Bilingue :** Lors de toute modification ou création de documents d'architecture sous `docs/architecture/`, les agents **DOIVENT** maintenir les versions en Anglais International (`.md`) et en Français (`.fr.md`) strictement synchronisées.

---

## 3. Journalisation des Actions de Session (`docs/journal/`)

Chaque session de travail, décision d'architecture, refactoring majeur, migration de base de données ou livraison exécutée par un agent IA **DOIT ÊTRE JOURNALISÉE** dans des fichiers Markdown chronologiques situés sous :
👉 **[`docs/journal/`](docs/journal/)**

### Convention de Nommage des Journaux :
- Format : `YYYY-MM-DD-session-topic.md` (ex: `docs/journal/2026-08-01-initial-architecture-setup.md`)
