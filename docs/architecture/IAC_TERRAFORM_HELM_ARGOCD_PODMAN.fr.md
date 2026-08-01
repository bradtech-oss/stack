# Spécifications — IaC : Terraform, Helm, ArgoCD & Podman

> 🌐 *English version available in [`IAC_TERRAFORM_HELM_ARGOCD_PODMAN.md`](file:///Users/crapougnax/CODE/BRAD2026/bradtech-oss/docs/architecture/IAC_TERRAFORM_HELM_ARGOCD_PODMAN.md)*

> [!NOTE]
> **Normes Infrastructure-as-Code (IaC) :** Structuration des déploiements pour Cloud Public (Scaleway, AWS, GCP) et Cloud Privé / On-Premise (Proxmox, Bare-Metal K3s, OpenStack) via Terraform, Helm, ArgoCD et Podman.

---

## 🏗️ Structure du Dossier `infra/`

```text
infra/
├── terraform/                      # RECETTES TERRAFORM (PROVISIONING INFRASTRUCTURE)
│   ├── modules/
│   │   ├── k8s-cluster/            # Module provisioning Kubernetes (SKS / K3s)
│   │   ├── object-storage/         # Module S3 (Bucket stockage médias & backups)
│   │   └── supabase-onprem/        # Module provisioning VM / PostgreSQL Supabase
│   └── environments/
│       ├── public-cloud/           # Recettes Terraform Cloud Public (ex: Scaleway / AWS)
│       │   ├── main.tf
│       │   ├── variables.tf
│       │   └── terraform.tfvars.dist
│       └── private-cloud/          # Recettes Terraform Cloud Privé / Bare-Metal (ex: Proxmox / K3s)
│           ├── main.tf
│           ├── variables.tf
│           └── terraform.tfvars.dist
│
├── argocd/                         # CONFIGURATIONS ARGOCD DÉTAILLÉES (GITOPS)
│   ├── projects/
│   │   └── brad-oss-project.yaml   # AppProject ArgoCD avec règles de sécurité et RBAC
│   ├── applications/
│   │   ├── brad-oss-staging.yaml   # Application ArgoCD Staging
│   │   └── brad-oss-prod.yaml      # Application ArgoCD Production
│   └── applicationsets/
│       └── multi-cluster-appset.yaml # ApplicationSet pour déploiement multi-clusters / multi-sites
│
├── helm/                           # CHARTES HELM KUBERNETES
│   ├── brad-oss/                   # Charte Helm globale (Backoffice UI + API + Hey Brad)
│   └── supabase-onprem/            # Overrides Helm Supabase Self-Hosted
│
└── podman/                         # RECETTES PODMAN (SINGLE-NODE ON-PREMISE)
    ├── Containerfile.backoffice    # Image multi-arch non-root (USER bun)
    ├── Containerfile.api           # Image multi-arch non-root (USER bun)
    └── podman-compose.yml          # Composition complète On-Premise instantanée
```

---

## 🌍 1. Provisioning Infrastructure via Terraform

### A. Cloud Public (`infra/terraform/environments/public-cloud/`)
- Provisioning d'un cluster Kubernetes managé (ex: Scaleway SKS ou AWS EKS).
- Provisioning des buckets S3 pour les médias et backups d'archivage.
- Configuration du DNS et des IP publiques.

### B. Cloud Privé / On-Premise (`infra/terraform/environments/private-cloud/`)
- Provisioning d'infrastructures virtuelles ou Bare-Metal (ex: Proxmox VE via provider Terraform ou instances K3s sur réseau local).
- Provisioning des volumes de stockage persistants locaux (*Local Path Provisioner* / *Longhorn*).

---

## 🔄 2. GitOps Continu via ArgoCD

### Configurations ArgoCD Avancées (`infra/argocd/`)
- **`AppProject` (`projects/brad-oss-project.yaml`)** : Restreint les namespaces de destination autorisés, gère les rôles RBAC et sécurise les dépôts Git sources.
- **`ApplicationSet` (`applicationsets/multi-cluster-appset.yaml`)** : Permet le déploiement automatique de **bradtech-oss** sur plusieurs fermes ou clusters clients (*multi-tenancy edge*).
