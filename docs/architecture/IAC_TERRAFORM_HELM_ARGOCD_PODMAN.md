---
🏠 **[README](../../README.md)** | 🗺️ **[Architecture Index](index.md)** | ⬅️ **[Previous: Sovereign LoRaWAN & CLI Setup](SOVEREIGN_LORAWAN_AND_DEPLOYMENT_CLI.md)** | ➡️ **[Next: Architecture Index](index.md)**
---

# Specifications — Infrastructure-as-Code Recipes (Terraform, Helm, ArgoCD & Podman)

> 🌐 *Version française disponible dans [`IAC_TERRAFORM_HELM_ARGOCD_PODMAN.fr.md`](IAC_TERRAFORM_HELM_ARGOCD_PODMAN.fr.md)*

This document specifies the Infrastructure-as-Code (IaC) deployment recipes supporting On-Premise Single-Node deployments (*Podman Compose*) as well as Cloud/Cluster deployments (*Terraform, Helm, ArgoCD*).

---

## 🛠️ 1. Infrastructure Target Matrix

| Target Environment | Deployment Recipe Location | Key Orchestrator | Security & Compliance |
| :--- | :--- | :--- | :--- |
| **On-Premise Edge (Single-Node)** | `infra/podman/` | Podman Compose | Non-root container execution (`USER bun`), local SQLite/Postgres data isolation |
| **Public Cloud (Scaleway / AWS / GCP)** | `infra/terraform/cloud/` | Terraform + Helm | Managed Kubernetes (Kapsule/EKS), Cloudflare TLS, S3 Storage buckets |
| **Private Cloud (Proxmox VE)** | `infra/terraform/proxmox/` | Terraform + Telmate Provider | Automated VM/LXContainer provisioning on bare-metal hardware |
| **GitOps Kubernetes Cluster** | `infra/argocd/` | ArgoCD AppSets | GitOps continuous sync driven from `https://github.com/bradtech-oss/bradtech-oss` |

---

## 🐳 2. Podman Container Standards (`infra/podman`)
- **`Containerfile` Naming**: Every container definition file uses `Containerfile` (Podman-centric).
- **Non-Root Execution**: Final image stages drop privileges using `USER bun` or `USER node`.
- **Multi-Architecture**: Built for `linux/amd64` and `linux/arm64`.

---

## ☸️ 3. ArgoCD GitOps Configurations (`infra/argocd`)
Detailed ArgoCD manifests:
- `AppProject`: Scoped permissions and target namespace restrictions.
- `ApplicationSet`: Matrix generator dynamically deploying instances for multiple client environments.

---
🏠 **[README](../../README.md)** | 🗺️ **[Architecture Index](index.md)** | ⬅️ **[Previous: Sovereign LoRaWAN & CLI Setup](SOVEREIGN_LORAWAN_AND_DEPLOYMENT_CLI.md)** | ➡️ **[Next: Architecture Index](index.md)**
