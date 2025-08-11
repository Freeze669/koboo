# 📁 Chemins des Fichiers - Structure Réorganisée

## 🎯 Fichiers Principaux (Racine)
- `index.html` - Page principale du site
- `debug-admin.html` - Page de débogage admin
- `test-api.html` - Page de test API

## 📂 Dossier `assets/`

### 📁 `assets/css/` - Feuilles de style
- `styles.css` - Styles principaux du site
- `admin-styles.css` - Styles du panel admin
- `advanced-animations.css` - Animations avancées
- `enhanced_styles_integration.css` - Styles d'intégration

### 📁 `assets/js/` - Scripts JavaScript
- `script.js` - Script principal du site
- `chart-config.js` - Gestionnaire des graphiques Chart.js
- `admin-config.js` - Configuration du panel admin
- `admin-config-example.js` - Exemple de configuration
- `admin-config-simple.js` - Configuration simple
- `admin-info-pages.js` - Gestion des pages d'info
- `admin_server.js` - Serveur admin
- `performance-monitor.js` - Moniteur de performance
- `animation-optimizer.js` - Optimiseur d'animations
- `discord-logger.js` - Logger Discord
- `discord-logging-system.js` - Système de logging Discord
- `member-tracker.js` - Suivi des membres
- `activity-monitor.js` - Moniteur d'activité
- `site-monitor.js` - Moniteur du site

### 📁 `assets/images/` - Images
- (Dossier pour les images du projet)

### 📁 `assets/fonts/` - Polices
- (Dossier pour les polices personnalisées)

## 📂 Dossier `admin/` - Pages d'administration
- `admin-panel.html` - Panel principal d'administration
- `admin-login.html` - Page de connexion admin
- `test-graphiques.html` - Test des graphiques
- `test-admin-login.html` - Test de connexion
- `test-admin-panel.html` - Test du panel
- `test-admin.html` - Test admin simple
- `test-form-tracking.html` - Test du suivi de formulaires
- `test-github-pages.html` - Test GitHub Pages
- `test-info-pages.html` - Test des pages d'info
- `test-login-redirect.html` - Test de redirection
- `test-performance-optimized.html` - Test de performance

## 📂 Dossier `config/` - Fichiers de configuration
- `backend.php` - Backend PHP
- `go_config.json` - Configuration Go
- `package.json` - Configuration Node.js
- `go.mod` - Modules Go
- `go.sum` - Somme de contrôle Go

## 📂 Dossier `docs/` - Documentation
- `README.md` - Guide principal
- `GUIDE_ADMIN.md` - Guide du panel admin
- `README_ADMIN.md` - Documentation admin
- `README_DEPLOYMENT.md` - Guide de déploiement
- `README_INTEGRATION.md` - Guide d'intégration
- `README_PERFORMANCE.md` - Guide de performance
- `FORM_TRACKING_GUIDE.md` - Guide de suivi des formulaires
- `CORRECTIONS_APPLIQUEES.md` - Corrections appliquées
- `CORRECTIONS_GRAPHIC_PANEL.md` - Corrections du panel graphique

## 🔗 Chemins dans les fichiers HTML

### Dans `index.html` :
```html
<link rel="stylesheet" href="assets/css/styles.css">
<link rel="stylesheet" href="assets/css/admin-styles.css">
```

### Dans `admin/admin-panel.html` :
```html
<script src="../assets/js/discord-logger.js"></script>
<script src="../assets/js/member-tracker.js"></script>
<script src="../assets/js/activity-monitor.js"></script>
<script src="../assets/js/discord-logging-system.js"></script>
<script src="../assets/js/admin-config.js"></script>
<script src="../assets/js/site-monitor.js"></script>
<script src="../assets/js/admin-info-pages.js"></script>
<script src="../assets/js/performance-monitor.js"></script>
<script src="../assets/js/animation-optimizer.js"></script>
<script src="../assets/js/chart-config.js"></script>
```

### Dans `debug-admin.html` :
```html
<script src="assets/js/discord-logger.js"></script>
<script src="assets/js/member-tracker.js"></script>
<script src="assets/js/activity-monitor.js"></script>
<script src="assets/js/discord-logging-system.js"></script>
<script src="assets/js/admin-config.js"></script>
```

## ✅ Vérification des Chemins

Tous les chemins ont été corrigés pour pointer vers les nouveaux emplacements :
- **CSS** : `assets/css/`
- **JavaScript** : `assets/js/`
- **Pages admin** : `admin/`
- **Configuration** : `config/`
- **Documentation** : `docs/`

## 🚀 Accès aux Pages

- **Site principal** : `index.html`
- **Panel admin** : `admin/admin-panel.html` ✅
- **Connexion admin** : `admin/admin-login.html` ✅
- **Test des graphiques** : `admin/test-graphiques.html`
- **Débogage** : `debug-admin.html`
- **Tous les liens corrigés** : ✅ Navigation admin fonctionnelle

## 🔧 Fichiers de Configuration Importants

- **Configuration admin** : `assets/js/admin-config.js`
- **Gestionnaire de graphiques** : `assets/js/chart-config.js`
- **Configuration exemple** : `assets/js/admin-config-example.js`
- **Styles admin** : `assets/css/admin-styles.css`
