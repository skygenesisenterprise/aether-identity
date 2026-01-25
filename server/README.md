# Aether Identity Server

Ce projet est un serveur d'authentification basé sur Go avec Gin et GORM.

## Fonctionnalités

- Authentification JWT
- Gestion des utilisateurs (CRUD)
- API versionnée (/api/v1/*)
- Base de données PostgreSQL
- Configuration via variables d'environnement

## Installation

### Prérequis

- Go 1.25.5 ou supérieur
- PostgreSQL
- Docker (optionnel)

### Configuration

Créez un fichier `.env` dans le répertoire `server/` avec les variables suivantes:

```env
JWT_SECRET=votre-cle-secrete-ici
ACCESS_TOKEN_EXP=15
REFRESH_TOKEN_EXP=720
DATABASE_URL=host=localhost user=postgres password=postgres dbname=aether_identity port=5432 sslmode=disable
PORT=8080
```

### Base de données

1. Créez une base de données PostgreSQL:
   ```sql
   CREATE DATABASE aether_identity;
   ```

2. Créez un utilisateur:
   ```sql
   CREATE USER postgres WITH PASSWORD 'postgres';
   GRANT ALL PRIVILEGES ON DATABASE aether_identity TO postgres;
   ```

### Démarrage

```bash
cd server
go run main.go
```

## API Documentation

### Authentification

#### Login
```
POST /api/v1/auth/login
```

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "expiresIn": 15
}
```

#### Register
```
POST /api/v1/auth/register
```

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "user@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "expiresIn": 15
}
```

#### Refresh Token
```
POST /api/v1/auth/refresh
```

**Request Body:**
```json
{
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Response:**
```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "expiresIn": 15
}
```

### Utilisateurs

#### Get User
```
GET /api/v1/users/:id
```

**Headers:**
```
Authorization: Bearer <access_token>
```

**Response:**
```json
{
  "id": 1,
  "name": "John Doe",
  "email": "user@example.com",
  "role": "user",
  "isActive": true,
  "createdAt": 1712345678,
  "updatedAt": 1712345678
}
```

#### Update User
```
PUT /api/v1/users/:id
```

**Headers:**
```
Authorization: Bearer <access_token>
```

**Request Body:**
```json
{
  "name": "John Doe Updated",
  "email": "new.email@example.com",
  "password": "newpassword123"
}
```

**Response:**
```json
{
  "id": 1,
  "name": "John Doe Updated",
  "email": "new.email@example.com",
  "role": "user",
  "isActive": true,
  "createdAt": 1712345678,
  "updatedAt": 1712345678
}
```

#### Delete User
```
DELETE /api/v1/users/:id
```

**Headers:**
```
Authorization: Bearer <access_token>
```

**Response:**
```json
{
  "message": "User deleted successfully"
}
```

### Santé

#### Health Check
```
GET /api/v1/health
```

**Response:**
```json
{
  "status": "healthy",
  "message": "API is running successfully",
  "version": "1.0.0"
}
```

## Structure du projet

```
server/
├── main.go                  # Point d'entrée de l'application
├── go.mod                   # Fichier de dépendances Go
├── go.sum                   # Sommes de contrôle des dépendances
├── src/
│   ├── config/              # Configuration de l'application
│   │   └── config.go        # Gestion des variables d'environnement
│   ├── controllers/         # Contrôleurs de l'API
│   │   ├── auth.go          # Contrôleurs d'authentification
│   │   ├── user.go          # Contrôleurs d'utilisateurs
│   │   └── health.go        # Contrôleur de santé
│   ├── middleware/          # Middlewares
│   │   └── auth.go          # Middleware d'authentification JWT
│   ├── model/               # Modèles de données
│   │   ├── user.go          # Modèle utilisateur
│   │   └── auth.go          # Modèles d'authentification
│   ├── routes/              # Routes de l'API
│   │   └── routes.go        # Configuration des routes
│   └── services/            # Services
│       ├── database.go      # Service de base de données
│       ├── user.go          # Service utilisateur
│       └── jwt.go           # Service JWT
└── README.md                # Documentation
```

## Déploiement

### Avec Docker

1. Construisez l'image Docker:
   ```bash
   docker build -t aether-identity-server .
   ```

2. Démarrez le conteneur:
   ```bash
   docker run -p 8080:8080 -e DATABASE_URL="host=postgres user=postgres password=postgres dbname=aether_identity port=5432 sslmode=disable" aether-identity-server
   ```

### Production

Pour un déploiement en production, assurez-vous de:

1. Configurer une clé JWT sécurisée
2. Utiliser une base de données PostgreSQL dédiée
3. Configurer HTTPS
4. Mettre en place des sauvegardes régulières
5. Configurer des logs appropriés

## Contribution

Les contributions sont les bienvenues ! Veuillez ouvrir une issue ou une pull request.

## Licence

Ce projet est sous licence MIT.
