🏠 **[README](../../README.fr.md)** | 🗺️ **[Index Architecture](index.fr.md)** | ⬅️ **[Précédent : LoRaWAN Souverain & CLI Setup](SOVEREIGN_LORAWAN_AND_DEPLOYMENT_CLI.fr.md)** | ➡️ **[Suivant : Index Architecture](index.fr.md)**
---

# Spécifications — Recettes d'Infrastructure-as-Code (Terraform, Helm, ArgoCD & Podman)

> 🌐 *English version available in [`IAC_TERRAFORM_HELM_ARGOCD_PODMAN.md`](IAC_TERRAFORM_HELM_ARGOCD_PODMAN.md)*

Ce document spécifie les recettes de déploiement Infrastructure-as-Code (IaC) pour les déploiements autonomes On-Premise Single-Node (*Podman Compose*) ainsi que les clusters Cloud/Edge (*Terraform, Helm, ArgoCD*).

---

## 🛠️ 1. Matrice des Cibles d'Infrastructure

| Environnement Cible | Emplacement des Recettes | Orchestrateur Principal | Sécurité & Conformité |
| :--- | :--- | :--- | :--- |
| **Edge On-Premise (Single-Node)** | `infra/podman/` | Podman Compose | Conteneurs non-root (`USER bun`), isolation des données locales |
| **Cloud Public (Scaleway / AWS / GCP)** | `infra/terraform/cloud/` | Terraform + Helm | Kubernetes géré (Kapsule/EKS), TLS Cloudflare, buckets S3 |
| **Cloud Privé (Proxmox VE)** | `infra/terraform/proxmox/` | Provider Telmate | Provisioning automatique de VM/LXContainers sur hyperviseurs |
| **Cluster Kubernetes GitOps** | `infra/argocd/` | ArgoCD AppSets | Synchronisation continue GitOps depuis `https://github.com/bradtech-oss/stack` |

---

## 🐳 2. Normes des Conteneurs Podman (`infra/podman`)
- **Nommage `Containerfile`** : Utilisation exclusive du nom `Containerfile` (centré Podman).
- **Exécution Non-Root** : Dégradation des privilèges dans les étapes finales via `USER bun` ou `USER node`.
- **Multi-Architecture** : Build systématique pour `linux/amd64` et `linux/arm64`.

---

## ☸️ 3. Configurations GitOps ArgoCD (`infra/argocd`)
Manifestes ArgoCD détaillés :
- `AppProject` : Périmètres de sécurité et namespaces cibles.
- `ApplicationSet` : Générateur matriciel déployant dynamiquement les instances clients.

---
🏠 **[README](../../README.fr.md)** | 🗺️ **[Index Architecture](index.fr.md)** | ⬅️ **[Précédent : LoRaWAN Souverain & CLI Setup](SOVEREIGN_LORAWAN_AND_DEPLOYMENT_CLI.fr.md)** | ➡️ **[Suivant : Index Architecture](index.fr.md)**
