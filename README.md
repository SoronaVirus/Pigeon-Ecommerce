Vidéo de démo : https://youtu.be/NaeNg3_f9b4

# Pigeon E-Commerce Platform

Application e-commerce full-stack avec backend Spring Boot, MongoDB et frontend React.

## Table des matières

- [Technologies](#technologies)
- [Architecture](#architecture)
- [Prérequis](#prérequis)
- [Installation](#installation)
- [Configuration](#configuration)
- [Démarrage](#démarrage)
- [Comptes par défaut](#comptes-par-défaut)
- [Fonctionnalités](#fonctionnalités)
- [API Endpoints](#api-endpoints)
- [Structure du projet](#structure-du-projet)
- [Sécurité](#sécurité)
- [Tests](#tests)
- [Dépannage](#dépannage)

## Technologies

### Backend
- Java 17
- Spring Boot 3.2.1
- Spring Security (JWT)
- Spring Data MongoDB
- Maven

### Frontend
- React 18
- React Router 6
- Axios
- CSS3

### Base de données
- MongoDB 4.4+

## Architecture

```
Client (React) ←→ REST API (Spring Boot) ←→ MongoDB
     :3000              :8080              :27017
```

### Hiérarchie des rôles

```
SUPER_ADMIN (niveau 3)
    ↓
ADMIN (niveau 2)
    ↓
USER (niveau 1)
```

## Prérequis

- JDK 17 ou supérieur
- Maven 3.6+
- MongoDB 4.4+
- Node.js 14+ et npm
- Git

## Installation

### 1. Cloner le projet

```bash
git clone https://github.com/votre-repo/pigeon-ecommerce.git
cd pigeon-ecommerce
```

### 2. Installer le backend

```bash
cd backend
mvn clean install
```

### 3. Installer le frontend

```bash
cd frontend
npm install
```

## Configuration

### Backend

Fichier : `backend/src/main/resources/application.properties`

```properties
spring.application.name=pigeon
server.port=8080

spring.data.mongodb.uri=mongodb://localhost:27017/pigeon
spring.data.mongodb.database=pigeon

jwt.secret=VOTRE_SECRET_KEY_ICI
jwt.expiration=86400000

spring.web.cors.allowed-origins=http://localhost:3000
```

### Frontend

Fichier : `frontend/src/config/api.js`

```javascript
const API_BASE_URL = 'http://localhost:8080/api';
```

## Démarrage

### 1. Démarrer MongoDB

```bash
mongod
```

### 2. Démarrer le backend

```bash
cd backend
mvn spring-boot:run
```

Le serveur démarre sur http://localhost:8080

### 3. Démarrer le frontend

```bash
cd frontend
npm start
```

L'application s'ouvre sur http://localhost:3000

## Comptes par défaut

### Créer un utilisateur normal

1. Aller sur http://localhost:3000
2. Cliquer sur "Register"
3. Remplir le formulaire

### Créer un SUPER_ADMIN

```bash
mongosh pigeon
```

```javascript
db.users.updateOne(
  { username: "votre_username" },
  { $set: { roles: ["USER", "ADMIN", "SUPER_ADMIN"] } }
)
```

### Créer un ADMIN

```bash
mongosh pigeon
```

```javascript
db.users.updateOne(
  { username: "votre_username" },
  { $set: { roles: ["USER", "ADMIN"] } }
)
```

Reconnectez-vous après modification des rôles.

## Fonctionnalités

### Public (Non authentifié)

- Voir la liste des produits
- Rechercher des produits
- Voir les détails d'un produit
- Voir les catégories
- S'inscrire / Se connecter

### USER (Authentifié)

- Toutes les fonctionnalités publiques
- Passer une commande
- Voir ses commandes
- Annuler une commande PENDING

### ADMIN

- Toutes les fonctionnalités USER
- Gérer les produits (CRUD)
- Gérer les catégories (CRUD)
- Voir tous les utilisateurs
- Modifier/Désactiver les comptes USER
- Supprimer les comptes USER
- Voir toutes les commandes
- Modifier le statut des commandes
- Supprimer toutes les commandes

### SUPER_ADMIN

- Toutes les fonctionnalités ADMIN
- Donner le rôle ADMIN à un USER
- Retirer le rôle ADMIN
- Modifier les comptes ADMIN
- Désactiver les comptes ADMIN
- Supprimer les comptes ADMIN
- Supprimer les commandes orphelines

## API Endpoints

### Authentification

```
POST   /api/auth/register          Inscription
POST   /api/auth/login             Connexion
```

### Produits

```
GET    /api/products               Liste des produits (public)
GET    /api/products/{id}          Détail produit (public)
GET    /api/products/search        Recherche (public)
POST   /api/admin/products         Créer (ADMIN)
PUT    /api/admin/products/{id}    Modifier (ADMIN)
DELETE /api/admin/products/{id}    Supprimer (ADMIN)
```

### Catégories

```
GET    /api/categories             Liste (public)
POST   /api/categories             Créer (ADMIN)
PUT    /api/categories/{id}        Modifier (ADMIN)
DELETE /api/categories/{id}        Supprimer (ADMIN)
```

### Commandes

```
POST   /api/orders                      Créer (USER)
GET    /api/orders/my-orders            Mes commandes (USER)
DELETE /api/orders/{id}                 Supprimer (USER: PENDING, ADMIN: toutes)
GET    /api/admin/orders                Toutes les commandes (ADMIN)
PUT    /api/admin/orders/{id}/status    Changer statut (ADMIN)
DELETE /api/admin/orders/{id}           Supprimer (ADMIN)
```

### Utilisateurs (Admin)

```
GET    /api/admin/users                 Liste
GET    /api/admin/users/{id}            Détail
PUT    /api/admin/users/{id}            Modifier
PUT    /api/admin/users/{id}/enabled    Activer/Désactiver
PUT    /api/admin/users/{id}/roles      Changer rôles (SUPER_ADMIN)
DELETE /api/admin/users/{id}            Supprimer
```

## Structure du projet

```
pigeon-ecommerce/
├── backend/
│   ├── src/main/java/com/project/pigeon/
│   │   ├── config/           Configuration Spring Security
│   │   ├── controller/       REST Controllers
│   │   ├── dto/              Data Transfer Objects
│   │   ├── model/            Entités MongoDB
│   │   ├── repository/       Repositories MongoDB
│   │   ├── security/         JWT et authentification
│   │   ├── service/          Logique métier
│   │   └── PigeonApplication.java
│   ├── src/main/resources/
│   │   └── application.properties
│   └── pom.xml
│
└── frontend/
    ├── public/
    ├── src/
    │   ├── components/       Composants réutilisables
    │   ├── config/           Configuration API
    │   ├── pages/            Pages de l'application
    │   ├── services/         Services API
    │   ├── App.js
    │   └── App.css
    └── package.json
```

## Sécurité

### Authentification

- JWT (JSON Web Token)
- Token valide 24 heures
- Stockage dans localStorage
- Envoi automatique dans header Authorization

### Protection des routes

#### Backend
- Spring Security avec @PreAuthorize
- Vérification des rôles sur chaque endpoint
- Validation des permissions dans les services

#### Frontend
- PrivateRoute pour routes protégées
- Redirection vers /login si non authentifié
- Vérification des rôles pour afficher les boutons

### Règles de sécurité

#### SUPER_ADMIN
- Peut tout faire sauf créer d'autres SUPER_ADMIN
- Ne peut pas modifier/supprimer d'autres SUPER_ADMIN

#### ADMIN
- Ne peut pas donner le rôle ADMIN
- Ne peut pas modifier/supprimer les ADMIN et SUPER_ADMIN
- Peut gérer les USER

#### USER
- Peut supprimer ses commandes PENDING uniquement
- Ne peut pas accéder aux routes admin

### Mots de passe

- Hashage avec BCrypt
- Validation côté backend (min 6 caractères)
- Jamais stockés en clair

## Tests

### Tests manuels avec Postman

Collection Postman disponible : `Pigeon_Postman_Collection.json`

1. Importer la collection
2. Importer l'environnement : `Pigeon_Environment.json`
3. Lancer les requêtes dans l'ordre

### Tests automatiques

Script PowerShell disponible : `test_api_simple.ps1`

```bash
powershell -ExecutionPolicy Bypass -File test_api_simple.ps1
```

## Base de données

### Collections MongoDB

#### users
```javascript
{
  _id: ObjectId,
  username: String (unique),
  email: String (unique),
  password: String (hashed),
  roles: [String],
  enabled: Boolean,
  createdAt: DateTime
}
```

#### products
```javascript
{
  _id: ObjectId,
  name: String,
  description: String,
  price: Double,
  category: DBRef(Category),
  stockQuantity: Integer,
  lienImage: String,
  createdAt: DateTime
}
```

#### categories
```javascript
{
  _id: ObjectId,
  name: String
}
```

#### orders
```javascript
{
  _id: ObjectId,
  user: DBRef(User),
  produit: DBRef(Product),
  quantite: Integer,
  orderDate: DateTime,
  totalAmount: Double,
  status: String
}
```

Statuts : PENDING, PROCESSING, SHIPPED, DELIVERED

## Dépannage

### Port 8080 déjà utilisé

```bash
# Windows
netstat -ano | findstr :8080
taskkill /PID <PID> /F

# Linux/Mac
lsof -i :8080
kill -9 <PID>
```

### MongoDB ne démarre pas

```bash
# Windows
net start MongoDB

# Linux
sudo systemctl start mongod

# Mac
brew services start mongodb-community
```

### CORS errors

Vérifier que le frontend est sur le port autorisé dans `application.properties`

### JWT invalid

1. Vérifier que le secret JWT est le même
2. Vérifier que le token n'est pas expiré
3. Se reconnecter

### Rôles ne fonctionnent pas

1. Vérifier dans MongoDB : `db.users.find({username: "..."})`
2. Les rôles doivent être : `USER`, `ADMIN`, `SUPER_ADMIN`
3. Se reconnecter après modification

### Impossible de supprimer une commande

- USER : La commande doit être PENDING
- ADMIN : Peut supprimer toutes les commandes
- Vérifier les logs Spring Boot pour plus de détails

## Contribution

1. Fork le projet
2. Créer une branche (`git checkout -b feature/nouvelle-fonctionnalite`)
3. Commit (`git commit -m 'Ajout nouvelle fonctionnalité'`)
4. Push (`git push origin feature/nouvelle-fonctionnalite`)
5. Ouvrir une Pull Request

## Licence

Ce projet est sous licence MIT.
