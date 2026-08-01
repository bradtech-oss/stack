# HOWTO — Guide d'Utilisation & Scénarios Brad OSS

Ce document présente les scénarios d'utilisation les plus courants pour le développement local, le déploiement sur site (*On-Premise*) via Podman, et l'intégration Kubernetes via Helm & ArgoCD.

---

## 💻 1. Développement Local

### Prérequis
- **Bun** (>= 1.1) ou **Yarn Berry** (v4)
- **Podman** ou **Docker** (pour exécuter Supabase localement)

### Installation des dépendances
```bash
cd "/Users/crapougnax/CODE/BRAD2026/Brad OSS"
yarn install
```

### Lancement de l'environnement de dev local
```bash
yarn dev
```

---

## 🐳 2. Déploiement On-Premise avec Podman Compose

Pour déployer l'intégralité du Backoffice et de l'instance Supabase sur un serveur sur site unique (*single-node*) :

```bash
cd "/Users/crapougnax/CODE/BRAD2026/Brad OSS/infra/podman"

# Construction des conteneurs multi-stage non-root
podman-compose build

# Lancement des services en arrière-plan
podman-compose up -d
```

L'application Backoffice sera accessible sur `http://localhost:3000` et la console Supabase Studio sur `http://localhost:54323`.

---

## ☸️ 3. Déploiement Kubernetes avec Helm & ArgoCD

### Validation du Template Helm
```bash
helm template infra/helm/brad-oss
```

### Déploiement GitOps ArgoCD
Appliquer le manifest d'application ArgoCD :
```bash
kubectl apply -f infra/argocd/application.yaml
```
