# WaterMetering Dashboard - Plateforme IoT

Plateforme IoT intelligente de gestion et d'analyse prédictive des compteurs d'eau basée sur la vision artificielle et le Machine Learning.

## 🚀 Fonctionnalités

- ✅ Dashboard temps réel avec KPIs
- ✅ Carte interactive des compteurs (Mapbox)
- ✅ Gestion complète des compteurs
- ✅ Système d'alertes en temps réel
- ✅ Gestion des interventions techniques
- ✅ Analytics et rapports avancés
- ✅ Prédictions IA (ML)
- ✅ Multi-utilisateurs avec rôles (RBAC)
- ✅ WebSocket pour notifications temps réel

## 📋 Prérequis

- Node.js 16+ 
- npm ou yarn
- Token Mapbox (pour la carte)

## 🛠️ Installation

```bash
# Installer les dépendances
npm install

# Configurer les variables d'environnement
# Éditer le fichier .env avec vos configurations

# Démarrer le serveur de développement
npm start
```

L'application sera accessible sur `http://localhost:3000`

## 📁 Structure du projet

```
water-metering-dashboard/
├── public/              # Fichiers publics
├── src/
│   ├── components/      # Composants React réutilisables
│   │   ├── layout/      # Layout (Sidebar, Header)
│   │   ├── dashboard/   # Composants dashboard
│   │   ├── map/         # Carte interactive
│   │   ├── meters/      # Gestion compteurs
│   │   ├── alerts/      # Gestion alertes
│   │   └── ...
│   ├── pages/           # Pages principales
│   ├── services/        # Services API et WebSocket
│   ├── context/         # Context React (Auth)
│   ├── utils/           # Utilitaires
│   ├── App.jsx          # Composant principal
│   └── index.js         # Point d'entrée
└── package.json
```

## 🔧 Configuration

### Variables d'environnement (.env)

```env
REACT_APP_API_URL=https://api.watermetering.com/api
REACT_APP_WS_URL=https://api.watermetering.com
REACT_APP_MAPBOX_TOKEN=your_mapbox_token_here
```

### Token Mapbox

1. Créer un compte sur [Mapbox](https://www.mapbox.com/)
2. Obtenir un token d'accès
3. Ajouter le token dans `.env`

## 📦 Build pour production

```bash
npm run build
```

Les fichiers optimisés seront dans le dossier `build/`

## 🎨 Technologies utilisées

- **Frontend:** React 18, Material-UI
- **Graphiques:** Recharts
- **Cartes:** Mapbox GL, React Map GL
- **État:** React Context API
- **HTTP:** Axios
- **WebSocket:** Socket.io-client
- **Routing:** React Router v6
- **Dates:** date-fns

## 👥 Rôles utilisateurs

- **Super Admin:** Accès complet
- **Gestionnaire:** Gestion de son site
- **Technicien:** Interventions terrain
- **Client:** Consultation uniquement
- **Auditeur:** Lecture + logs

## 📄 Licence

Propriétaire - © 2025 WaterMetering

## 👨‍💻 Auteur

Projet de Fin d'Études - 3ème année IoT
