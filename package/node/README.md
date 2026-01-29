<div align="center">

# Aether Identity — Node.js SDK

[![License](https://img.shields.io/badge/license-MIT-blue?style=for-the-badge)](./LICENSE) [![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/) [![Node.js](https://img.shields.io/badge/Node.js-18+-339933?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org/)

**SDK TypeScript officiel pour intégrer Aether Identity (auth, sessions, tokens, EID, device & machine).**

[🚀 Installation](#-installation) • [⚡ Quick start](#-quick-start) • [📦 API](#-api) • [🧪 Développement](#-développement) • [📄 Licence](#-licence)

</div>

---

## 🌟 Présentation

Le package `@aether-identity/node` est le SDK Node.js/TypeScript officiel d’Aether Identity. Il expose un client unique, découpé en modules (`auth`, `session`, `user`, `token`, `eid`, `machine`, `device`) pour consommer l’API Aether Identity depuis Node.js (ou tout environnement JS disposant d’un `fetch`).

---

## 🚀 Installation

```bash
pnpm add @aether-identity/node
```

Ou avec npm :

```bash
npm i @aether-identity/node
```

## ⚡ Quick start

```ts
import { CreateIdentityClient } from "@aether-identity/node";

const client = CreateIdentityClient({
  baseUrl: "http://localhost:8080",
  clientId: "your-client-id",
});

// Exemple d’appel (selon votre backend) :
// await client.auth.login({ username: "...", password: "..." });
// const me = await client.user.me();
```

### Configuration

Le client accepte une configuration de type `IdentityClientConfig` (exportée) :

- **`baseUrl`**: URL de l’API Aether Identity (ex: `http://localhost:8080`)
- **`clientId`**: identifiant applicatif / client
- **`accessToken`** *(optionnel)*: token initial (sera stocké dans le gestionnaire de session interne)
- **`fetcher`** *(optionnel)*: implémentation `fetch` custom (utile en runtime non standard)

> Note: si `fetch` n’est pas présent (Node < 18, ou environnement sans fetch), le SDK charge dynamiquement `node-fetch`.

---

## 📦 API

Le client expose les modules suivants :

- **`client.auth`**: authentification (login/2FA, etc.)
- **`client.session`**: gestion de session
- **`client.user`**: profil / rôles utilisateur
- **`client.token`**: tokens (création/refresh selon endpoints)
- **`client.eid`**: opérations EID (vérification / statut)
- **`client.machine`**: enrollment machine + token machine
- **`client.device`**: device info / statut

Types et erreurs exportées :

- **Types**: `IdentityClientConfig`, `AuthInput`, `TokenResponse`, `SessionResponse`, `EIDVerifyInput`, etc.
- **Erreurs**: `IdentityError`, `AuthenticationError`, `AuthorizationError`, `SessionExpiredError`, `TOTPRequiredError`, `DeviceNotAvailableError`, `NetworkError`, `ServerError`

---

## 🧪 Développement

Depuis `package/node` :

```bash
pnpm install
pnpm build
pnpm test
pnpm lint
```

Mode watch (TypeScript) :

```bash
pnpm dev
```

---

## 📄 Licence

MIT — voir [`LICENSE`](./LICENSE).

