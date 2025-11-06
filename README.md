# WoodShot - E-commerce Platforme de Bois de Chauffage

## Vue d'ensemble

WoodShot est une plateforme e-commerce complète spécialisée dans la vente de bois de chauffage. L'application offre une expérience utilisateur fluide pour l'achat de bois de chauffage avec un système d'administration complet pour la gestion des produits, commandes et utilisateurs.

## Fonctionnalités Principales

### 🛒 Fonctionnalités Utilisateur
- **Catalogue de Produits** : Navigation par catégories (chêne, hêtre, bouleau, pin, etc.)
- **Recherche et Filtres** : Recherche par type de bois, prix, disponibilité
- **Panier d'Achat** : Gestion du panier avec calcul automatique des prix
- **Système de Commandes** : Processus de commande complet avec suivi
- **Suivi de Livraison** : Suivi en temps réel des livraisons
- **Gestion des Adresses** : Sauvegarde et gestion des adresses de livraison

### 🏢 Fonctionnalités Administrateur
- **Tableau de Bord** : Vue d'ensemble des statistiques clés
- **Gestion des Produits** : CRUD complet des produits (créer, lire, modifier, supprimer)
- **Gestion des Stocks** : Mise à jour des niveaux de stock en temps réel
- **Gestion des Commandes** : Suivi et mise à jour du statut des commandes
- **Gestion des Utilisateurs** : Administration des comptes utilisateur
- **Rapports et Analytics** : Statistiques de vente et performance

## Architecture Technique

### Backend (FastAPI)
- **Framework** : FastAPI avec Python
- **Base de Données** : PostgreSQL avec SQLAlchemy ORM
- **Authentification** : JWT tokens avec gestion des rôles (admin/utilisateur)
- **API REST** : Endpoints complets pour toutes les fonctionnalités

### Frontend (React + TypeScript)
- **Framework** : React 18 avec TypeScript
- **UI Framework** : DaisyUI + Tailwind CSS
- **State Management** : Context API pour l'authentification et le panier
- **Routing** : Interface adaptative (admin/utilisateur)

### Infrastructure
- **Conteneurisation** : Docker et Docker Compose
- **Base de Données** : PostgreSQL en conteneur
- **Admin Database** : Adminer pour la gestion de la base de données

## Installation et Configuration

### Prérequis
- Docker et Docker Compose
- Node.js 18+ (pour le développement frontend)
- Python 3.9+ (pour le développement backend)

### Démarrage Rapide

1. **Cloner le repository**
   ```bash
   git clone <repository-url>
   cd woodshot
   ```

2. **Démarrer les services avec Docker**
   ```bash
   docker-compose up -d
   ```

3. **Installer les dépendances frontend**
   ```bash
   cd frontend
   npm install
   npm run dev
   ```

4. **Configuration de la base de données**
   - Accéder à Adminer : http://localhost:8081
   - Se connecter avec les credentials PostgreSQL
   - Importer le schéma depuis `database_schema.txt`

### Variables d'Environnement

Créer un fichier `.env` dans le dossier backend :
```
DATABASE_URL=postgresql://woodshot_user:wood_001@db:5432/woodshot_db
SECRET_KEY=votre-cle-secrete-jwt
```

## Structure de la Base de Données

### Tables Principales

#### Utilisateurs (`users`)
- Gestion des comptes utilisateur et administrateur
- Champs : email, mot de passe hashé, nom, prénom, téléphone, rôle admin

#### Produits (`products`)
- Catalogue des produits de bois
- Champs : nom, description, type de bois, prix, unité, stock, spécifications JSON

#### Commandes (`orders`)
- Gestion des commandes clients
- Champs : utilisateur, adresse, statut, montant total, date de livraison

#### Articles de Commande (`order_items`)
- Détail des produits dans chaque commande
- Champs : commande, produit, quantité, prix unitaire

#### Livraisons (`deliveries`)
- Suivi des livraisons
- Champs : commande, statut, coordonnées GPS, itinéraire

#### Adresses (`addresses`)
- Gestion des adresses de livraison
- Champs : utilisateur, rue, ville, code postal, pays, coordonnées GPS

#### Inventaire (`inventory`)
- Gestion des stocks
- Champs : produit, quantité disponible, quantité réservée

## API Endpoints

### Authentification
- `POST /api/auth/register` - Inscription utilisateur
- `POST /api/auth/login` - Connexion utilisateur
- `GET /api/auth/me` - Informations utilisateur actuel

### Produits (Public)
- `GET /api/products` - Liste des produits avec filtres
- `GET /api/products/{id}` - Détail d'un produit

### Produits (Admin)
- `POST /api/products` - Créer un produit
- `PUT /api/admin/products/{id}` - Modifier un produit
- `DELETE /api/admin/products/{id}` - Supprimer un produit
- `PUT /api/admin/inventory/{id}` - Mettre à jour le stock

### Commandes
- `POST /api/orders` - Créer une commande
- `GET /api/orders` - Commandes de l'utilisateur
- `GET /api/orders/{id}` - Détail d'une commande

### Commandes (Admin)
- `GET /api/admin/orders` - Toutes les commandes
- `PUT /api/admin/orders/{id}/status` - Modifier le statut

### Administration
- `GET /api/admin/dashboard` - Statistiques du tableau de bord
- `GET /api/admin/users` - Liste des utilisateurs

## Développement

### Structure du Projet
```
woodshot/
├── backend/                 # API FastAPI
│   ├── main.py             # Point d'entrée de l'API
│   ├── models.py           # Modèles SQLAlchemy
│   ├── schemas.py          # Schémas Pydantic
│   ├── crud.py             # Opérations CRUD
│   ├── auth.py             # Authentification JWT
│   ├── database.py         # Configuration base de données
│   └── requirements.txt    # Dépendances Python
├── frontend/               # Application React
│   ├── src/
│   │   ├── components/     # Composants React
│   │   ├── contexts/       # Context API
│   │   └── App.tsx         # Application principale
│   └── package.json        # Dépendances Node.js
├── docker-compose.yml      # Configuration Docker
└── database_schema.txt     # Schéma complet de la base de données
```

### Scripts Disponibles

#### Backend
```bash
cd backend
pip install -r requirements.txt
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

#### Frontend
```bash
cd frontend
npm install
npm run dev          # Développement
npm run build        # Build de production
npm run preview      # Prévisualisation
```

#### Docker
```bash
docker-compose up -d          # Démarrer tous les services
docker-compose down           # Arrêter tous les services
docker-compose logs           # Voir les logs
```

## Déploiement

### Production
1. Build des images Docker optimisées
2. Configuration des variables d'environnement de production
3. Déploiement sur serveur avec reverse proxy (nginx)
4. Configuration SSL et sécurité

### Variables d'Environnement Production
```
DATABASE_URL=postgresql://user:password@host:5432/db
SECRET_KEY=production-secret-key
CORS_ORIGINS=https://yourdomain.com
```

## Sécurité

- **Authentification JWT** avec expiration des tokens
- **Validation des données** avec Pydantic
- **Protection CSRF** et **CORS** configurés
- **Hachage des mots de passe** avec bcrypt
- **Rôles utilisateur** (admin/utilisateur standard)
- **Validation des entrées** côté serveur

## Tests

### Tests Backend
```bash
cd backend
pytest tests/
```

### Tests Frontend
```bash
cd frontend
npm test
```

## Contribution

1. Fork le projet
2. Créer une branche feature (`git checkout -b feature/nouvelle-fonctionnalite`)
3. Commit les changements (`git commit -am 'Ajout nouvelle fonctionnalité'`)
4. Push la branche (`git push origin feature/nouvelle-fonctionnalite`)
5. Créer une Pull Request

## Support

Pour toute question ou problème :
- Ouvrir une issue sur GitHub
- Contacter l'équipe de développement
- Consulter la documentation API interactive sur `/docs`

## Licence

Ce projet est sous licence MIT. Voir le fichier `LICENSE` pour plus de détails.

---

**WoodShot** - Votre partenaire de confiance pour le bois de chauffage de qualité supérieure.