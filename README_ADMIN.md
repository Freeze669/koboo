# 🔐 Admin Panel - Mayu & Jack Studio

Panel d'administration sécurisé avec analytics avancées pour le site Mayu & Jack Studio.

## 🌟 Fonctionnalités

### 🛡️ Sécurité
- **Authentification par code secret** avec hash bcrypt
- **Rate limiting** anti-brute force (5 tentatives/15min)
- **Sessions sécurisées** avec expiration automatique
- **Logging complet** de toutes les activités
- **Protection CSRF** et headers de sécurité

### 📊 Analytics Temps Réel
- **Visiteurs en direct** avec géolocalisation
- **Métriques de performance** (temps de chargement, interactions)
- **Tracking des formulaires** et conversions
- **Sessions utilisateurs** avec durée et parcours
- **Statistiques détaillées** par jour/semaine/mois

### 📈 Dashboard Interactif
- **Vue d'ensemble** avec KPI principaux
- **Graphiques dynamiques** (Chart.js)
- **Tableaux de données** avec filtres
- **Alertes en temps réel** pour nouveaux contacts
- **Interface responsive** (mobile/tablet/desktop)

### 🗄️ Base de Données
- **SQLite** pour la persistance des données
- **5 tables spécialisées** :
  - `admin_sessions` - Sessions d'administration
  - `site_visitors` - Analytics visiteurs
  - `contact_submissions` - Formulaires de contact
  - `performance_metrics` - Métriques techniques
  - `system_logs` - Logs système

## 🚀 Installation & Démarrage

### 1. Prérequis
```bash
# Vérifier Node.js (version 16+)
node --version
npm --version
```

### 2. Installation automatique (Windows)
```bash
# Double-clic sur le fichier
start_admin.bat
```

### 3. Installation manuelle
```bash
# Installer les dépendances
npm install

# Démarrer le serveur
npm start
```

### 4. Accès au panel
- **URL** : http://localhost:3001/admin
- **Code d'accès** : `MAYU_JACK_2024`
- **Port** : 3001 (configurable)

## 🎯 Utilisation

### Connexion Admin
1. Ouvrir http://localhost:3001/admin
2. Entrer le code : `MAYU_JACK_2024`
3. Accès complet au dashboard

### Navigation
- **Vue d'ensemble** - Statistiques principales
- **Visiteurs** - Analytics détaillées
- **Contacts** - Gestion des formulaires
- **Performance** - Métriques techniques
- **Sessions** - Connexions admin actives
- **Logs** - Historique système

### Tracking Automatique
Le système track automatiquement :
- ✅ Visites de pages
- ✅ Temps de session
- ✅ Soumissions de formulaires
- ✅ Clics sur boutons/liens
- ✅ Performances de chargement
- ✅ Erreurs JavaScript

## 🔧 Configuration

### Variables d'Environnement
```javascript
// Dans admin_server.js
const PORT = process.env.PORT || 3001;
const ADMIN_CODE = process.env.ADMIN_CODE || 'MAYU_JACK_2024';
```

### Base de Données
- **Fichier** : `admin_data.db` (SQLite)
- **Localisation** : Racine du projet
- **Sauvegarde** : Automatique
- **Nettoyage** : Logs > 30 jours supprimés

### Sécurité
```javascript
// Rate limiting
windowMs: 15 * 60 * 1000,  // 15 minutes
max: 5,                    // 5 tentatives max

// Session
maxAge: 24 * 60 * 60 * 1000  // 24 heures
```

## 📊 API Endpoints

### Authentification
```
POST /admin/login          - Connexion admin
POST /admin/logout         - Déconnexion
```

### Dashboard
```
GET  /admin/dashboard      - Données principales
GET  /admin/visitors       - Analytics visiteurs
GET  /admin/contacts       - Liste des contacts
GET  /admin/performance    - Métriques performance
GET  /admin/sessions       - Sessions actives
GET  /admin/logs          - Logs système
```

### Tracking Public
```
POST /track/visit         - Enregistrer visite
POST /track/contact       - Enregistrer contact
POST /track/performance   - Enregistrer métrique
```

## 🔍 Surveillance

### Métriques Collectées
- **Visiteurs** : IP, User-Agent, Pages, Durée
- **Performance** : Temps de chargement, FPS, Mémoire
- **Interactions** : Clics, Formulaires, Navigation
- **Erreurs** : JavaScript, Réseau, Serveur
- **Security** : Tentatives de connexion, Accès

### Alertes Automatiques
- Nouvelle soumission de contact
- Erreur système critique
- Tentative de connexion admin
- Performance dégradée

## 🛡️ Sécurité Avancée

### Protection Implémentée
- ✅ **Hash bcrypt** pour le code admin
- ✅ **Rate limiting** anti-brute force
- ✅ **Sessions sécurisées** HttpOnly
- ✅ **Headers de sécurité** (Helmet.js)
- ✅ **CORS** configuré
- ✅ **Validation** des entrées
- ✅ **Logging** complet

### Recommandations Production
```javascript
// HTTPS obligatoire
cookie: {
    secure: true,      // HTTPS only
    httpOnly: true,    // Pas d'accès JS
    sameSite: 'strict' // CSRF protection
}

// Variables d'environnement
ADMIN_CODE=VotreCodeSecret123!
SESSION_SECRET=ClefSecreteAleatoire456
DB_ENCRYPTION_KEY=ClefChiffrementBDD789
```

## 🎨 Personnalisation

### Thème Admin
```css
:root {
    --primary-color: #0f172a;
    --accent-color: #3b82f6;
    --success-color: #10b981;
    --warning-color: #f59e0b;
    --error-color: #ef4444;
}
```

### Ajout de Métriques
```javascript
// Dans le site principal
AdminTracker.trackPerformance('custom_metric', value, {
    category: 'user_engagement',
    action: 'video_play',
    duration: 120
});
```

## 🚀 Déploiement

### Serveur de Production
```bash
# PM2 pour la production
npm install pm2 -g
pm2 start admin_server.js --name "admin-panel"
pm2 startup
pm2 save
```

### Docker (Optionnel)
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
EXPOSE 3001
CMD ["node", "admin_server.js"]
```

## 📞 Support

### Codes d'Erreur
- **401** : Code admin incorrect
- **429** : Trop de tentatives (rate limit)
- **500** : Erreur serveur interne

### Dépannage
```bash
# Réinitialiser la base de données
rm admin_data.db
npm start

# Logs détaillés
DEBUG=* npm start

# Vérifier les ports
netstat -an | findstr :3001
```

## 📈 Statistiques

### Données Collectées
- **Visiteurs uniques** par jour/semaine/mois
- **Pages populaires** et temps de visite
- **Taux de conversion** formulaires
- **Performance** moyenne du site
- **Appareils** et navigateurs utilisés

### Rapports Disponibles
- 📊 Tableau de bord temps réel
- 📈 Graphiques de tendances
- 📋 Export des données
- 📧 Alertes par email (à venir)

---

**🎨 Mayu & Jack Studio** - Panel Admin v1.0  
*Monitoring et analytics avancées pour votre site web*
