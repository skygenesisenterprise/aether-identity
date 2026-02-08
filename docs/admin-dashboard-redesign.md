# Aether Identity - Refonte Dashboard Admin (/admin/home)

## Executive Summary

Cette proposition présente une refonte complète du dashboard `/admin/home` pour en faire une **tour de contrôle IAM enterprise-grade**. L'objectif est de fournir une vue d'ensemble immédiate répondant à la question fondamentale : _"Est-ce que mon Identity est sain, sécurisé et opérationnel ?"_

---

## 🎯 Objectifs du Relooking

### Objectifs primaires

1. **Visibilité immédiate** : État de la plateforme en un coup d'œil
2. **Hiérarchie claire** : Priorisation visuelle des éléments critiques
3. **Actionabilité** : Accès rapide aux zones nécessitant attention
4. **Cohérence** : Modèle réutilisable pour toutes les pages admin

### Ce que ce dashboard n'est PAS

- ❌ Une page de configuration détaillée
- ❌ Un rapport d'audit exhaustif
- ❌ Un outil d'analytics marketing

### Ce que ce dashboard EST

- ✅ Un cockpit d'opérateur IAM
- ✅ Un point d'alerte et de surveillance
- ✅ Un hub de navigation intelligent

---

## 🧱 Nouvelle Structure Complète

### Architecture de Page

```
┌─────────────────────────────────────────────────────────────────┐
│ HEADER CONTEXTUEL                                               │
│ [Authority] [Workspace] [Role + Privilege] [Last Active]       │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│ SECTION 1: PLATFORM STATUS (PRIORITÉ CRITIQUE)                  │
│ ┌─────────────────────────────────────────────────────────────┐ │
│ │ [System Health] [Security Score] [Alerts Banner]           │ │
│ └─────────────────────────────────────────────────────────────┘ │
│                                                                 │
│ SECTION 2: SECURITY POSTURE (PRIORITÉ HAUTE)                    │
│ ┌────────────────────┐ ┌─────────────────────────────────────┐  │
│ │ Identity Metrics   │ │ Security Overview                   │  │
│ │ [5 KPI Cards]      │ │ [MFA] [Score] [Flagged] [Risks]    │  │
│ └────────────────────┘ └─────────────────────────────────────┘  │
│                                                                 │
│ SECTION 3: OPERATIONAL ACTIVITY (PRIORITÉ MOYENNE)              │
│ ┌─────────────────────────────┐ ┌────────────────────────────┐  │
│ │ Real-time Activity Feed     │ │ Quick Actions & Shortcuts  │  │
│ │ [Timeline events]           │ │ [Action buttons + links]   │  │
│ └─────────────────────────────┘ └────────────────────────────┘  │
│                                                                 │
│ SECTION 4: ADMIN OPERATIONS (PRIORITÉ STANDARD)                 │
│ ┌─────────────────────────────────────────────────────────────┐ │
│ │ Recent Changes │ Pending Reviews │ System Updates           │ │
│ └─────────────────────────────────────────────────────────────┘ │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## 🎨 Description UI/UX Détaillée

### 1. HEADER CONTEXTUEL

**Rôle** : Ancrage contextuel immédiat

| Élément     | Type                        | Donnée source                       |
| ----------- | --------------------------- | ----------------------------------- |
| Authority   | Badge + Label               | `contextData.authority`             |
| Workspace   | Badge + Label               | `contextData.workspace`             |
| Role        | Badge + Privilege indicator | `contextData.role` + `isPrivileged` |
| Last Active | Timestamp                   | `contextData.lastLogin`             |

**Composant** : `ContextOverview` (existant - conservé)

**Intention visuelle** :

- Barre compacte en haut de page
- Information toujours visible sans scroll
- Badge "Privileged" en amber/orange si applicable

---

### 2. PLATFORM STATUS (Section Critique)

**Rôle** : État de santé global de la plateforme

#### 2.1 System Health Card

```typescript
interface SystemHealthSummary {
  status: "healthy" | "degraded" | "critical";
  uptime: string;
  components: {
    total: number;
    healthy: number;
    degraded: number;
    critical: number;
  };
  lastCheck: string;
}
```

**Composant** : `SystemHealthWidget` (nouveau)

- Barre de progression colorée (vert/amber/rouge)
- Compteur de composants par état
- Lien vers `/admin/platform/system`

#### 2.2 Security Score Card

```typescript
interface SecurityScoreSummary {
  score: number; // 0-100
  trend: "up" | "down" | "stable";
  previousScore: number;
  criticalFindings: number;
}
```

**Composant** : `SecurityScoreWidget` (nouveau)

- Cercle de progression avec score central
- Indicateur de tendance (flèche + delta)
- Badge critique si score < 70

#### 2.3 Active Alerts Banner

```typescript
interface ActiveAlert {
  id: string;
  severity: "critical" | "high" | "medium" | "low";
  category: "security" | "system" | "policy" | "compliance";
  title: string;
  timestamp: string;
  actionRequired: boolean;
}
```

**Composant** : `AlertsBanner` (nouveau)

- Bandeau défilant ou liste compacte
- Priorisation : Critical > High > Medium
- Bouton "View All" vers page alerts dédiée

---

### 3. SECURITY POSTURE (Section Haute Priorité)

#### 3.1 Identity Metrics Grid

**Rôle** : KPIs clés en visuel immédiat

| Métrique            | Source                           | Variante    | Action associée        |
| ------------------- | -------------------------------- | ----------- | ---------------------- |
| Total Users         | `metricsData.totalUsers`         | default     | Lien vers directory    |
| Active Users        | `metricsData.activeUsers`        | accent      | Lien vers analytics    |
| Pending Invites     | `metricsData.pendingInvitations` | warning     | Action: Review invites |
| Dormant Accounts    | `metricsData.dormantAccounts`    | warning     | Action: Audit accounts |
| Privileged Accounts | `metricsData.privilegedAccounts` | destructive | Action: Review access  |

**Composant** : `MetricCard` (existant - conservé)

**Améliorations** :

- Ajout d'icônes cliquables avec tooltips
- Badges d'alerte sur les valeurs critiques
- Tendance sur 7 jours (sparkline minimal)

#### 3.2 Security Overview Panel

**Rôle** : Synthèse sécurité avec profondeur

```typescript
interface SecurityOverview {
  mfaAdoptionRate: number;
  flaggedIdentities: number;
  securityScore: number;
  recentChanges: PolicyChange[];
  riskIndicators: {
    highRiskUsers: number;
    failedLogins24h: number;
    anomalousActivities: number;
  };
}
```

**Composant** : `SecurityPosture` (existant - enrichi)

**Sous-sections** :

1. **MFA Adoption** - Barre de progression avec %
2. **Flagged Identities** - Badge avec lien vers review
3. **Recent Changes** - Timeline compacte (3 derniers)
4. **Risk Indicators** - Mini-cards horizontales

---

### 4. OPERATIONAL ACTIVITY (Section Moyenne Priorité)

#### 4.1 Real-time Activity Feed

**Rôle** : Visibilité temps réel des opérations

**Types d'événements affichés** :

- `login` - Authentifications (succès/échec)
- `role_change` - Modifications de rôles
- `provisioning` - Création/modification utilisateurs
- `integration` - Sync externes (SCIM, OIDC)
- `audit` - Événements de sécurité

**Composant** : `ActivityFeed` (existant - conservé)

**Améliorations** :

- Filtrage rapide par type (tabs ou dropdown)
- Pagination ou "Load More"
- Highlight des événements critiques
- Lien "View Full Audit Log" → `/admin/audit`

#### 4.2 Quick Actions Panel

**Rôle** : Navigation rapide vers actions fréquentes

**Catégories d'actions** :

| Catégorie      | Actions                                    | Scope requis         |
| -------------- | ------------------------------------------ | -------------------- |
| **Identity**   | Invite User, Review Access, Reset Password | admin:users:write    |
| **Security**   | Force MFA, Revoke Sessions, Block User     | admin:security:write |
| **Platform**   | View Logs, Run Diagnostics, System Status  | admin:system:read    |
| **Compliance** | Export Audit, Generate Report              | admin:audit:read     |

**Composant** : `QuickActions` (existant - restructuré)

**Nouvelle structure** :

- Groupées par catégorie avec headers
- Icônes contextuelles
- Tooltips avec descriptions
- Disable si scope insuffisant

---

### 5. ADMIN OPERATIONS (Section Standard)

#### 5.1 Recent Changes Panel

```typescript
interface RecentChange {
  id: string;
  type: "policy" | "access" | "role" | "system";
  description: string;
  actor: string;
  timestamp: string;
  severity: "normal" | "high" | "critical";
}
```

**Composant** : `RecentChangesList` (nouveau)

- Timeline verticale compacte
- 5 dernières modifications
- Lien vers l'objet modifié

#### 5.2 Pending Reviews Panel

```typescript
interface PendingReview {
  id: string;
  type: "access_request" | "role_assignment" | "policy_change";
  requester: string;
  description: string;
  requestedAt: string;
  priority: "low" | "medium" | "high";
}
```

**Composant** : `PendingReviewsList` (nouveau)

- Liste avec badges de priorité
- Actions rapides (Approve/Reject)
- Compteur dans le header

#### 5.3 System Updates Panel

**Rôle** : Visibilité mises à jour disponibles

**Composant** : `SystemUpdatesWidget` (nouveau)

- Badge "Available" ou "Up to date"
- Liste des mises à jour en attente
- Bouton "Install" ou "Schedule"

---

## 🔌 Mapping vers l'Existant

### Données Réutilisées (depuis page.tsx actuel)

| Nouveau Composant | Données Source | Type                   |
| ----------------- | -------------- | ---------------------- |
| `ContextOverview` | `contextData`  | Intégralité            |
| `MetricCard` (5x) | `metricsData`  | Intégralité            |
| `SecurityPosture` | `securityData` | Intégralité            |
| `ActivityFeed`    | `activityData` | Intégralité            |
| `QuickActions`    | -              | Structure refactorisée |

### Données Enrichies (depuis autres pages)

| Source Page                | Données Empruntées                | Utilisation         |
| -------------------------- | --------------------------------- | ------------------- |
| `/admin/platform/system`   | `SystemHealth`, `ComponentHealth` | Widget état système |
| `/admin/platform/system`   | `SystemUpdate`                    | Panel mises à jour  |
| `/admin/platform/policy`   | `PolicyStats`                     | Score compliance    |
| `/admin/platform/identity` | `IdentityEngineConfig`            | Version moteur      |

### Nouvelles Données (mock → API)

| Donnée            | Structure                                               | Endpoint suggéré             |
| ----------------- | ------------------------------------------------------- | ---------------------------- |
| `ActiveAlert[]`   | `{id, severity, category, title, timestamp}`            | `GET /alerts/active`         |
| `PendingReview[]` | `{id, type, requester, priority}`                       | `GET /reviews/pending`       |
| `RiskIndicators`  | `{highRiskUsers, failedLogins24h, anomalousActivities}` | `GET /security/risk-summary` |

---

## 🔐 Notes de Sécurité & Scopes

### Matrice de Visibilité

| Section         | Composant           | Scope Admin    | Scope Superadmin |
| --------------- | ------------------- | -------------- | ---------------- |
| Header          | ContextOverview     | ✅             | ✅               |
| Platform Status | SystemHealthWidget  | ✅ (read-only) | ✅               |
| Platform Status | SecurityScoreWidget | ✅             | ✅               |
| Platform Status | AlertsBanner        | ✅             | ✅               |
| Security        | Identity Metrics    | ✅             | ✅               |
| Security        | Security Overview   | ✅             | ✅               |
| Operations      | Activity Feed       | ✅             | ✅               |
| Operations      | Quick Actions       | ✅ (limité)    | ✅ (complet)     |
| Admin Ops       | Pending Reviews     | ❌             | ✅               |
| Admin Ops       | System Updates      | ❌             | ✅ (actions)     |

### Comportement Conditionnel

```typescript
// Superadmin : voit tout + actions critiques
// Admin : voit tout sauf pending reviews + actions limitées

const canViewPendingReviews = user.role === "superadmin";
const canInstallUpdates = user.role === "superadmin";
const canForceMFA = user.scopes.includes("admin:security:write");
const canInviteUser = user.scopes.includes("admin:users:write");
```

### Éléments Masqués (si scope insuffisant)

- Section "Pending Reviews" entièrement masquée
- Actions "Install Update", "Restart Service" masquées
- Badge "Privileged" dans le header contextuel
- Données sensibles dans Activity Feed (IPs, etc.)

---

## 🧭 Règles de Cohérence (Pattern System)

### Principes de Design Réutilisables

#### 1. Hiérarchie Visuelle Standardisée

```
CRITICAL > HIGH > MEDIUM > LOW
┌─────────────────────────────────────┐
│ 🔴 CRITICAL - Alertes actives       │ → Bandeau, badges rouges
├─────────────────────────────────────┤
│ 🟠 HIGH - Métriques sécurité        │ → Cards accentuées
├─────────────────────────────────────┤
│ 🟡 MEDIUM - Activité récente        │ → Timeline standard
├─────────────────────────────────────┤
│ ⚪ LOW - Informations annexes       │ → Cards secondaires
└─────────────────────────────────────┘
```

#### 2. Pattern de Card Standard

```typescript
interface CardPattern {
  header: {
    icon: LucideIcon;
    title: string;
    badge?: string; // Compteur ou statut
    action?: "view_all" | "refresh" | "settings";
  };
  content: React.ReactNode;
  footer?: {
    link: string;
    label: string;
  };
}
```

#### 3. Pattern d'Action Standard

```typescript
interface ActionPattern {
  icon: LucideIcon;
  label: string;
  description?: string;
  href?: string;
  onClick?: () => void;
  requiredScope?: string;
  variant?: "default" | "critical" | "ghost";
}
```

#### 4. Couleurs Sémantiques

| État              | Couleur                                  | Usage                           |
| ----------------- | ---------------------------------------- | ------------------------------- |
| Healthy / Success | `text-emerald-500` / `bg-emerald-500/10` | Système OK, action réussie      |
| Warning / Caution | `text-amber-500` / `bg-amber-500/10`     | Attention requise, non critique |
| Critical / Error  | `text-red-500` / `bg-red-500/10`         | Action immédiate requise        |
| Info / Neutral    | `text-blue-500` / `bg-blue-500/10`       | Information, contexte           |
| Accent / Primary  | `text-accent` / `bg-accent/10`           | Éléments actifs, highlight      |

### Application aux Autres Pages

Ces patterns s'appliquent à :

- `/admin/platform/*` - Configuration système
- `/admin/platform/identity` - Configuration identité
- `/admin/platform/policy` - Gestion des politiques
- `/admin/integrations/*` - Intégrations externes

---

## 📋 Livrables Techniques

### Composants à Créer

#### Nouveaux Composants

1. `SystemHealthWidget` - État système compact
2. `SecurityScoreWidget` - Score sécurité visuel
3. `AlertsBanner` - Bandeau d'alertes
4. `RecentChangesList` - Modifications récentes
5. `PendingReviewsList` - Revues en attente
6. `SystemUpdatesWidget` - Widget mises à jour
7. `RiskIndicatorsGrid` - Indicateurs de risque

#### Composants Modifiés

1. `QuickActions` - Restructuration par catégories
2. `SecurityPosture` - Ajout risk indicators

#### Composants Conservés (tels quels)

1. `ContextOverview`
2. `MetricCard`
3. `ActivityFeed`

### Structure de Fichiers Proposée

```
app/components/dashboard/
├── existing/
│   ├── context-overview.tsx      [CONSERVÉ]
│   ├── metric-card.tsx            [CONSERVÉ]
│   ├── activity-feed.tsx          [CONSERVÉ]
│   ├── security-posture.tsx       [ENRICHIR]
│   └── quick-actions.tsx          [REFACTORER]
├── new/
│   ├── system-health-widget.tsx   [NOUVEAU]
│   ├── security-score-widget.tsx  [NOUVEAU]
│   ├── alerts-banner.tsx          [NOUVEAU]
│   ├── recent-changes-list.tsx    [NOUVEAU]
│   ├── pending-reviews-list.tsx   [NOUVEAU]
│   └── system-updates-widget.tsx  [NOUVEAU]
└── ui/                            [EXISTANT - inchangé]

app/app/admin/home/
└── page.tsx                       [REFONTE COMPLÈTE]
```

---

## 🎨 Maquette Textuelle (Structure HTML/JSX)

```jsx
// Structure hiérarchique complète
<div className="space-y-6">
  {/* HEADER */}
  <ContextOverview {...contextData} />

  {/* PLATFORM STATUS - CRITICAL */}
  <section className="space-y-4">
    <SectionHeader title="Platform Status" priority="critical" />
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <SystemHealthWidget />
      <SecurityScoreWidget />
      <AlertsBanner />
    </div>
  </section>

  {/* SECURITY POSTURE - HIGH */}
  <section className="space-y-4">
    <SectionHeader title="Security & Identity" priority="high" />
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      {/* Metrics - 5 colonnes */}
      <div className="lg:col-span-5">
        <IdentityMetricsGrid metrics={metricsData} />
      </div>
      {/* Security Overview - 7 colonnes */}
      <div className="lg:col-span-7">
        <SecurityPosture {...securityData} />
      </div>
    </div>
  </section>

  {/* OPERATIONAL ACTIVITY - MEDIUM */}
  <section className="space-y-4">
    <SectionHeader title="Activity & Operations" priority="medium" />
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <ActivityFeed events={activityData} className="lg:col-span-2" />
      <QuickActions className="lg:col-span-1" />
    </div>
  </section>

  {/* ADMIN OPERATIONS - CONDITIONAL */}
  {user.role === "superadmin" && (
    <section className="space-y-4">
      <SectionHeader title="Administration" priority="standard" />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <RecentChangesList />
        <PendingReviewsList />
        <SystemUpdatesWidget />
      </div>
    </section>
  )}
</div>
```

---

## 📊 Flux de Données

### Initial Load

```
1. Récupération contexte utilisateur (sync)
2. Parallèle :
   - Platform status
   - Security metrics
   - Activity feed (limit 10)
3. Conditionnel (superadmin) :
   - Pending reviews
   - System updates
```

### Refresh Stratégie

```
- Activity Feed : Auto-refresh toutes les 30s
- Platform Status : Auto-refresh toutes les 60s
- Security Metrics : Refresh manuel ou on-focus
- Alerts : Real-time via WebSocket (futur)
```

---

## ✅ Checklist d'Implémentation

### Phase 1 : Structure

- [ ] Créer les nouveaux composants vides
- [ ] Refactoriser `QuickActions`
- [ ] Enrichir `SecurityPosture`
- [ ] Réorganiser `page.tsx`

### Phase 2 : Données

- [ ] Mapper toutes les données existantes
- [ ] Créer les nouvelles interfaces TypeScript
- [ ] Implémenter les mocks pour nouvelles données
- [ ] Documenter les endpoints API requis

### Phase 3 : UI/UX

- [ ] Implémenter les badges de priorité
- [ ] Ajouter les tooltips et hints
- [ ] Responsive design (mobile/tablet)
- [ ] États de loading et erreur

### Phase 4 : Sécurité

- [ ] Implémenter les guards de scope
- [ ] Masquer sections conditionnelles
- [ ] Logger les accès aux actions sensibles
- [ ] Validation des permissions côté client

### Phase 5 : Cohérence

- [ ] Vérifier cohérence avec autres pages
- [ ] Documenter les patterns réutilisés
- [ ] Créer les stories Storybook (si applicable)
- [ ] Tests d'accessibilité

---

## 🚀 Prochaines Étapes Recommandées

1. **Revue design** : Valider la structure avec stakeholders
2. **Prototype** : Implémenter version mock complète
3. **Tests utilisateurs** : Observer admins/superadmins en action
4. **Itération** : Ajuster selon feedback
5. **Production** : Connecter aux vraies APIs
6. **Documentation** : Mettre à jour docs admin

---

**Document Version**: 1.0  
**Date**: 2026-02-08  
**Auteur**: Agent Aether Identity  
**Statut**: Proposition pour validation
