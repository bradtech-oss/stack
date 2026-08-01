# Specifications — IaC: Terraform, Helm, ArgoCD & Podman

> 🌐 *Version française disponible dans [`IAC_TERRAFORM_HELM_ARGOCD_PODMAN.fr.md`](file:///Users/crapougnax/CODE/BRAD2026/bradtech-oss/docs/architecture/IAC_TERRAFORM_HELM_ARGOCD_PODMAN.fr.md)*

> [!NOTE]
> **Infrastructure-as-Code (IaC) Standards:** Structured deployment recipes for Public Cloud (Scaleway, AWS, GCP) and Private Cloud / On-Premise (Proxmox, Bare-Metal K3s, OpenStack) via Terraform, Helm, ArgoCD, and Podman.

---

## 🏗️ `infra/` Directory Layout

```text
infra/
├── terraform/                      # TERRAFORM RECIPES (INFRASTRUCTURE PROVISIONING)
│   ├── modules/
│   │   ├── k8s-cluster/            # Kubernetes Cluster Module (SKS / K3s / EKS)
│   │   ├── object-storage/         # S3 Object Storage Module (Media & Backups)
│   │   └── supabase-onprem/        # VM / Supabase PostgreSQL Provisioning Module
│   └── environments/
│       ├── public-cloud/           # Public Cloud Terraform Recipes (Scaleway / AWS)
│       │   ├── main.tf
│       │   ├── variables.tf
│       │   └── terraform.tfvars.dist
│       └── private-cloud/          # Private Cloud / Bare-Metal Recipes (Proxmox / K3s)
│           ├── main.tf
│           ├── variables.tf
│           └── terraform.tfvars.dist
│
├── argocd/                         # DETAILED ARGOCD CONFIGURATIONS (GITOPS)
│   ├── projects/
│   │   └── brad-oss-project.yaml   # ArgoCD AppProject with RBAC & Namespace restrictions
│   ├── applications/
│   │   ├── brad-oss-staging.yaml   # Staging ArgoCD Application
│   │   └── brad-oss-prod.yaml      # Production ArgoCD Application
│   └── applicationsets/
│       └── multi-cluster-appset.yaml # ApplicationSet for multi-cluster / edge deployments
│
├── helm/                           # KUBERNETES HELM CHARTS
│   ├── brad-oss/                   # Global Helm Chart (Backoffice UI + API + Hey Brad)
│   └── supabase-onprem/            # Self-Hosted Supabase Helm Overrides
│
└── podman/                         # PODMAN RECIPES (SINGLE-NODE ON-PREMISE)
    ├── Containerfile.backoffice    # Multi-arch non-root image (USER bun)
    ├── Containerfile.api           # Multi-arch non-root image (USER bun)
    └── podman-compose.yml          # Instant full-stack On-Premise compose file
```

---

## 🌍 1. Infrastructure Provisioning via Terraform

### A. Public Cloud (`infra/terraform/environments/public-cloud/`)
- Provisioning managed Kubernetes clusters (e.g. Scaleway SKS or AWS EKS).
- Provisioning S3 buckets for media assets and automated archival backups.
- DNS record creation and public IP allocation.

### B. Private Cloud / On-Premise (`infra/terraform/environments/private-cloud/`)
- Provisioning virtual or Bare-Metal infrastructures (e.g. Proxmox VE via Terraform provider or local network K3s nodes).
- Local persistent storage volume provisioning (*Local Path Provisioner* / *Longhorn*).

---

## 🔄 2. Continuous GitOps via ArgoCD

### Advanced ArgoCD Configurations (`infra/argocd/`)
- **`AppProject` (`projects/brad-oss-project.yaml`)**: Restricts destination namespaces, enforces RBAC roles, and locks approved source Git repositories.
- **`ApplicationSet` (`applicationsets/multi-cluster-appset.yaml`)**: Automates deployment of **bradtech-oss** across multiple farm sites or edge clusters (*multi-tenancy edge*).
