# 🚀 Koboo Studio - Site Web Professionnel

## 📁 Structure du Projet

Le projet a été réorganisé pour une meilleure maintenance et lisibilité :

```
koboo-main/
├── 📁 admin/                    # Panel d'administration
│   ├── admin-login.html        # Page de connexion admin
│   ├── admin-panel.html        # Panel principal d'administration
│   └── test-*.html            # Pages de test
├── 📁 assets/                   # Ressources du site
│   ├── 📁 css/                 # Feuilles de style
│   ├── 📁 js/                  # Scripts JavaScript
│   ├── 📁 images/              # Images et médias
│   └── 📁 fonts/               # Polices personnalisées
├── 📁 config/                   # Configuration backend
│   └── backend.php             # API backend
├── 📁 docs/                     # Documentation
│   ├── README_ADMIN.md         # Guide d'administration
│   ├── README_DEPLOYMENT.md    # Guide de déploiement
│   └── README_PERFORMANCE.md   # Guide d'optimisation
├── index.html                   # Page principale du site
└── README.md                    # Ce fichier
```

## 🔐 Panel d'Administration

### Accès
- **URL**: `/admin/admin-panel.html`
- **Connexion**: `/admin/admin-login.html`

### Fonctionnalités

#### 📊 Métriques en Temps Réel
- **Visiteurs** : Nombre de visiteurs actifs
- **Vues de Page** : Pages consultées
- **Temps de Fonctionnement** : Uptime du système
- **Utilisation Mémoire** : Consommation mémoire
- **Score Performance** : Indicateur global
- **Erreurs** : Erreurs système détectées
- **FPS** : Images par seconde
- **Qualité Animations** : Niveau d'optimisation

#### 📈 Graphiques de Performance
- **Graphique FPS** : Évolution des FPS en temps réel
- **Graphique Mémoire** : Utilisation mémoire
- **Graphique Performance** : Score global de performance

#### ⚡ Actions Rapides
- **Actualiser** : Mise à jour des données
- **Exporter Données** : Téléchargement des métriques
- **Optimiser** : Optimisation automatique du système
- **Sauvegarde** : Sauvegarde des données

#### 🔗 Intégration Discord
- **Statut Webhook** : Connexion Discord
- **Test Connexion** : Vérification de la connexion
- **Message Test** : Envoi de message de test
- **Voir Logs** : Consultation des logs Discord

#### 🎯 Optimisation Automatique
- **Analyse Performance** : Surveillance continue
- **Optimisation FPS** : Ajustement automatique
- **Gestion Mémoire** : Nettoyage automatique
- **Mode Diagnostic** : Surveillance détaillée

## 🛠️ Installation et Configuration

### Prérequis
- Serveur web (Apache/Nginx)
- PHP 7.4+ (pour le backend)
- Navigateur moderne avec JavaScript activé

### Installation
1. **Cloner le projet** :
   ```bash
   git clone [URL_DU_REPO]
   cd koboo-main
   ```

2. **Configurer le serveur web** :
   - Pointer le document root vers le dossier `koboo-main`
   - Activer PHP si nécessaire

3. **Configurer l'administration** :
   - Modifier `assets/js/admin-config.js` avec vos paramètres
   - Configurer le webhook Discord si nécessaire

4. **Accéder au panel admin** :
   - Ouvrir `/admin/admin-login.html`
   - Utiliser le code d'accès configuré

## 🔧 Configuration

### Fichier de Configuration Admin
```javascript
// assets/js/admin-config.js
const ADMIN_CONFIG = {
    security: {
        adminCode: "VOTRE_CODE_ADMIN",
        sessionDuration: 3600000 // 1 heure
    },
    discord: {
        webhookUrl: "VOTRE_WEBHOOK_DISCORD",
        enabled: true
    }
};
```

### Personnalisation des Graphiques
Les graphiques sont configurés dans `assets/js/chart-config.js` :
- Couleurs personnalisables
- Limite de points de données
- Options d'affichage
- Gestion des erreurs

## 📊 Utilisation des Graphiques

### Initialisation Automatique
Les graphiques se chargent automatiquement au démarrage du panel admin.

### Mise à Jour en Temps Réel
- **FPS** : Mise à jour toutes les 2 secondes
- **Mémoire** : Surveillance continue
- **Performance** : Calcul automatique du score

### Contrôles
- **Redémarrer** : `restartCharts()`
- **Actualiser** : `refreshCharts()`
- **Nettoyer** : `cleanup()`

## 🚨 Dépannage

### Graphiques ne s'affichent pas
1. Vérifier que Chart.js est chargé
2. Contrôler la console pour les erreurs
3. Vérifier que les canvas existent dans le DOM

### Métriques non mises à jour
1. Vérifier la connexion aux moniteurs
2. Contrôler les permissions JavaScript
3. Vérifier la configuration des moniteurs

### Erreurs de connexion
1. Vérifier la configuration admin
2. Contrôler la session utilisateur
3. Vérifier les logs du serveur

## 🔒 Sécurité

- **Authentification** : Code d'accès requis
- **Session** : Expiration automatique
- **Validation** : Vérification des données
- **Logs** : Traçabilité des actions

## 📈 Performance

### Optimisations Automatiques
- **FPS Faible** : Réduction des animations
- **Mémoire Élevée** : Nettoyage automatique
- **Erreurs** : Mode diagnostic activé
- **Performance Faible** : Mode économie activé

### Surveillance Continue
- Métriques en temps réel
- Alertes automatiques
- Optimisations adaptatives
- Historique des performances

## 🤝 Contribution

1. **Fork** le projet
2. **Créer** une branche feature
3. **Commiter** vos changements
4. **Pousser** vers la branche
5. **Créer** une Pull Request

## 📄 Licence

Ce projet est sous licence [VOTRE_LICENCE].

## 📞 Support

Pour toute question ou problème :
- **Issues** : Créer une issue sur GitHub
- **Documentation** : Consulter les guides dans `/docs/`
- **Admin** : Utiliser le panel d'administration

---

**Développé avec ❤️ par Mayu & Jack Studio**
