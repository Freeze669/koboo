# 🚀 MAYU & JACK STUDIO - Panel Admin Complet

## 📋 Description

Projet web complet avec panel d'administration avancé, graphiques de performance en temps réel, et système de statistiques intelligent. Optimisé pour une utilisation professionnelle avec interface moderne et responsive.

## ✨ Fonctionnalités Principales

### 🎛️ Panel d'Administration
- **Interface moderne** avec design responsive
- **Authentification sécurisée** avec gestion de session
- **Dashboard complet** avec métriques en temps réel
- **Système d'alertes** intelligent et automatique

### 📊 Graphiques de Performance
- **Graphiques FPS** en temps réel avec Chart.js
- **Graphiques mémoire** avec monitoring continu
- **Mise à jour automatique** toutes les 3 secondes
- **Interface responsive** adaptée à tous les écrans

### 📈 Statistiques Générales
- **Visiteurs et vues** avec tendances
- **Temps de fonctionnement** (uptime)
- **Utilisation mémoire** et performance
- **Système d'alertes** avec seuils configurables

### 🔧 Outils d'Administration
- **Discord Logger** intégré
- **Member Tracker** pour suivi des utilisateurs
- **Activity Monitor** pour surveillance des activités
- **Performance Monitor** pour optimisation

## 🏗️ Structure du Projet

```
koboo-main/
├── 📁 admin/                    # Panel d'administration
│   ├── admin-login.html        # Page de connexion
│   ├── admin-panel.html        # Dashboard principal
│   ├── test-statistiques.html  # Test des statistiques
│   ├── test-graphiques.html    # Test des graphiques
│   ├── test-simple.html        # Test simple
│   └── test-taille-graphiques.html # Test taille
├── 📁 assets/                   # Ressources
│   ├── 📁 css/                 # Styles
│   └── 📁 js/                  # Scripts JavaScript
│       ├── admin-config.js     # Configuration admin
│       ├── admin-stats.js      # Gestionnaire statistiques
│       ├── chart-config.js     # Configuration graphiques
│       ├── discord-logger.js   # Logger Discord
│       ├── member-tracker.js   # Suivi membres
│       ├── activity-monitor.js # Moniteur activités
│       └── discord-logging-system.js # Système logging
├── 📁 config/                   # Configuration
├── 📁 docs/                     # Documentation
└── 📁 index.html               # Page principale
```

## 🚀 Installation et Utilisation

### 1. **Cloner le Projet**
```bash
git clone https://github.com/votre-username/koboo-main.git
cd koboo-main
```

### 2. **Ouvrir dans un Navigateur**
- Ouvrir `index.html` pour le site principal
- Ouvrir `admin/admin-login.html` pour le panel admin

### 3. **Tester les Fonctionnalités**
- **Test Statistiques** : `admin/test-statistiques.html`
- **Test Graphiques** : `admin/test-graphiques.html`
- **Test Simple** : `admin/test-simple.html`

## 🧪 Pages de Test

### 📊 Test des Statistiques
- **URL** : `admin/test-statistiques.html`
- **Fonction** : Vérification complète des statistiques
- **Fonctionnalités** : Métriques en temps réel, alertes, tendances

### 📈 Test des Graphiques
- **URL** : `admin/test-graphiques.html`
- **Fonction** : Test des graphiques FPS et mémoire
- **Fonctionnalités** : Graphiques Chart.js, mises à jour automatiques

### 🔧 Test Simple
- **URL** : `admin/test-simple.html`
- **Fonction** : Test basique des composants
- **Fonctionnalités** : Vérification rapide des fonctionnalités

## 🎯 Fonctionnalités Techniques

### **AdminStatsManager**
- Gestion centralisée des statistiques
- Simulation réaliste des données
- Mise à jour automatique toutes les 3 secondes
- Système d'alertes intelligent

### **ChartManager**
- Gestion des graphiques Chart.js
- Configuration optimisée pour performance
- Mise à jour en temps réel
- Gestion des erreurs et fallbacks

### **Système d'Authentification**
- Gestion de session sécurisée
- Protection des routes admin
- Interface de connexion moderne

## 🔧 Configuration

### **Variables d'Environnement**
```javascript
// Dans admin-config.js
const ADMIN_CONFIG = {
    sessionTimeout: 3600000, // 1 heure
    maxLoginAttempts: 3,
    enableDiscordLogging: true,
    enablePerformanceMonitoring: true
};
```

### **Personnalisation des Graphiques**
```javascript
// Dans chart-config.js
const chartConfig = {
    updateInterval: 3000, // 3 secondes
    maxDataPoints: 20,
    animationDuration: 0,
    responsive: true
};
```

## 📱 Responsive Design

- **Mobile First** : Optimisé pour tous les appareils
- **CSS Grid** : Layout moderne et flexible
- **Breakpoints** : Adaptation automatique aux écrans
- **Touch Friendly** : Interface tactile optimisée

## 🚨 Système d'Alertes

### **Seuils Configurables**
- **FPS** : Alerte si < 40 FPS
- **Mémoire** : Alerte si > 85% d'utilisation
- **Performance** : Alerte si score < 70
- **Erreurs** : Alerte si > 5 erreurs

### **Types d'Alertes**
- **Warning** : Problèmes mineurs
- **Error** : Problèmes critiques
- **Info** : Informations générales

## 🔒 Sécurité

- **Session Management** : Gestion sécurisée des sessions
- **Input Validation** : Validation des entrées utilisateur
- **XSS Protection** : Protection contre les attaques XSS
- **CSRF Protection** : Protection CSRF intégrée

## 📊 Performance

- **Lazy Loading** : Chargement différé des composants
- **Optimisation Chart.js** : Configuration optimisée
- **Debouncing** : Limitation des mises à jour
- **Memory Management** : Gestion optimisée de la mémoire

## 🐛 Dépannage

### **Problèmes Courants**

#### **Graphiques ne s'affichent pas**
1. Vérifier que Chart.js est chargé
2. Contrôler la console pour les erreurs
3. Utiliser `admin/test-graphiques.html`

#### **Statistiques ne se mettent pas à jour**
1. Vérifier que `admin-stats.js` est chargé
2. Contrôler la console pour les erreurs
3. Utiliser `admin/test-statistiques.html`

#### **Problèmes de connexion admin**
1. Vérifier les chemins des fichiers
2. Contrôler la console pour les erreurs
3. Vérifier `admin/admin-login.html`

### **Logs de Débogage**
```javascript
// Activer les logs détaillés
console.log('🔍 Debug mode activé');
console.log('📊 Stats:', window.adminStatsManager?.getStats());
console.log('📈 Charts:', window.chartManager?.isInitialized);
```

## 📚 Documentation

- **GUIDE_STATISTIQUES.md** : Guide complet des statistiques
- **CORRECTION_TAILLE_GRAPHIQUES.md** : Correction des problèmes de taille
- **CORRECTION_GRAPHIC_PANEL.md** : Correction des graphiques
- **GUIDE_TEST_GRAPHIC.md** : Guide de test des graphiques

## 🤝 Contribution

1. **Fork** le projet
2. **Créer** une branche feature (`git checkout -b feature/AmazingFeature`)
3. **Commit** les changements (`git commit -m 'Add some AmazingFeature'`)
4. **Push** vers la branche (`git push origin feature/AmazingFeature`)
5. **Ouvrir** une Pull Request

## 📄 Licence

Ce projet est sous licence MIT. Voir le fichier `LICENSE` pour plus de détails.

## 📞 Support

- **Issues GitHub** : Pour signaler des bugs
- **Discussions** : Pour les questions et suggestions
- **Wiki** : Documentation détaillée

## 🎉 Remerciements

- **Chart.js** : Pour les graphiques interactifs
- **Font Awesome** : Pour les icônes
- **Communauté GitHub** : Pour le support et les contributions

---

**⭐ N'oubliez pas de mettre une étoile si ce projet vous a été utile !**

**🔗 [Voir le projet en ligne](https://votre-username.github.io/koboo-main)**
**📧 [Contacter l'équipe](mailto:contact@mayujackstudio.com)**
