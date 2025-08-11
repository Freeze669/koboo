# 🔐 Guide d'Utilisation du Panel Administrateur

## 📋 Table des Matières

1. [Accès et Connexion](#accès-et-connexion)
2. [Interface Principale](#interface-principale)
3. [Métriques en Temps Réel](#métriques-en-temps-réel)
4. [Graphiques de Performance](#graphiques-de-performance)
5. [Actions Rapides](#actions-rapides)
6. [Intégration Discord](#intégration-discord)
7. [Optimisation Automatique](#optimisation-automatique)
8. [Dépannage](#dépannage)

## 🔑 Accès et Connexion

### Page de Connexion
- **URL** : `/admin/admin-login.html`
- **Méthode** : Code d'accès à 6 chiffres
- **Session** : Expire après 1 heure d'inactivité

### Code d'Accès
Le code d'accès est configuré dans `assets/js/admin-config.js` :
```javascript
const ADMIN_CONFIG = {
    security: {
        adminCode: "123456", // Remplacez par votre code
        sessionDuration: 3600000 // 1 heure en millisecondes
    }
};
```

### Connexion
1. Ouvrir `/admin/admin-login.html`
2. Saisir le code d'accès à 6 chiffres
3. Cliquer sur "Se connecter"
4. Redirection automatique vers le panel admin

## 🖥️ Interface Principale

### Header
- **Titre** : Panel Administrateur
- **Code d'accès** : Affiché pour référence
- **Statut session** : Indicateur de connexion
- **Bouton déconnexion** : Fermeture de session

### Navigation des Pages
- **📊 Statistiques** : Vue d'ensemble des métriques
- **👥 Utilisateurs** : Gestion des utilisateurs
- **⚡ Performances** : Détails des performances
- **🚨 Alertes** : Notifications et erreurs
- **📝 Activités** : Journal des activités
- **⚙️ Configuration** : Paramètres système

## 📊 Métriques en Temps Réel

### Cartes de Métriques
Chaque métrique est affichée dans une carte avec :
- **Icône** : Représentation visuelle
- **Valeur** : Donnée actuelle
- **Tendance** : Évolution (+/- %)
- **Statut** : Indicateur d'optimisation

### Métriques Disponibles

#### 👥 Visiteurs
- **Description** : Nombre de visiteurs actifs
- **Mise à jour** : Toutes les 2 secondes
- **Tendance** : Comparaison avec la période précédente

#### 👁️ Vues de Page
- **Description** : Pages consultées par les visiteurs
- **Mise à jour** : Temps réel
- **Tendance** : Évolution du trafic

#### ⏰ Temps de Fonctionnement
- **Description** : Uptime du système
- **Format** : HH:MM:SS
- **Mise à jour** : Continue

#### 💾 Utilisation Mémoire
- **Description** : Consommation mémoire système
- **Format** : XX MB (XX%)
- **Seuils** : Warning à 80%, Critique à 95%

#### 🎯 Score Performance
- **Description** : Indicateur global de performance
- **Échelle** : 0-100
- **Calcul** : Moyenne pondérée FPS + Mémoire + Chargement

#### ⚠️ Erreurs
- **Description** : Erreurs système détectées
- **Types** : JavaScript, Réseau, Performance
- **Tendance** : Nouvelles erreurs vs résolues

#### 🎮 FPS
- **Description** : Images par seconde
- **Objectif** : 60+ FPS
- **Optimisation** : Automatique si < 30 FPS

#### ✨ Qualité Animations
- **Description** : Niveau d'optimisation des animations
- **Échelle** : 0-100%
- **Ajustement** : Automatique selon les performances

## 📈 Graphiques de Performance

### Gestionnaire de Graphiques
Les graphiques sont gérés par `ChartManager` dans `assets/js/chart-config.js`

### Types de Graphiques

#### 📊 Graphique FPS
- **Type** : Ligne temporelle
- **Données** : FPS sur les 20 dernières mesures
- **Couleur** : Bleu (#60a5fa)
- **Échelle Y** : 0-120 FPS
- **Mise à jour** : Toutes les 2 secondes

#### 💾 Graphique Mémoire
- **Type** : Ligne temporelle
- **Données** : Utilisation mémoire en MB
- **Couleur** : Vert (#10b981)
- **Échelle Y** : 0-200 MB
- **Mise à jour** : Continue

#### 🎯 Graphique Performance
- **Type** : Ligne temporelle
- **Données** : Score de performance global
- **Couleur** : Violet (#8b5cf6)
- **Échelle Y** : 0-100
- **Mise à jour** : Calculé automatiquement

### Configuration des Graphiques

#### Options Communes
```javascript
{
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
        legend: { display: false },
        tooltip: {
            backgroundColor: 'rgba(30, 41, 59, 0.9)',
            titleColor: '#f8fafc',
            bodyColor: '#94a3b8'
        }
    }
}
```

#### Personnalisation
- **Couleurs** : Modifiables dans `chart-config.js`
- **Limite données** : 20 points par défaut
- **Intervalles** : Ajustables selon les besoins
- **Animations** : Désactivées pour les performances

### Contrôles des Graphiques

#### Redémarrer
```javascript
restartCharts(); // Redémarre tous les graphiques
```

#### Actualiser
```javascript
refreshCharts(); // Réinitialise l'affichage
```

#### Nettoyer
```javascript
window.chartManager.cleanup(); // Supprime tous les graphiques
```

## ⚡ Actions Rapides

### Boutons d'Action

#### 🔄 Actualiser
- **Fonction** : Mise à jour manuelle des données
- **Feedback** : Confirmation visuelle
- **Durée** : 2 secondes

#### 📥 Exporter Données
- **Format** : JSON
- **Contenu** : Toutes les métriques collectées
- **Nom fichier** : `admin-data-[timestamp].json`

#### 🚀 Optimiser
- **Processus** : Analyse et optimisation automatique
- **Durée** : 3 secondes
- **Feedback** : Statut de l'optimisation

#### 💾 Sauvegarde
- **Type** : Sauvegarde des données système
- **Durée** : 2 secondes
- **Confirmation** : Message de succès

## 🔗 Intégration Discord

### Configuration
```javascript
const ADMIN_CONFIG = {
    discord: {
        webhookUrl: "https://discord.com/api/webhooks/...",
        enabled: true
    }
};
```

### Fonctionnalités

#### Test de Connexion
- **Vérification** : Test du webhook Discord
- **Durée** : 2 secondes
- **Résultat** : Statut de la connexion

#### Message de Test
- **Contenu** : Message de vérification
- **Durée** : 1.5 secondes
- **Confirmation** : Statut d'envoi

#### Consultation des Logs
- **Format** : Fenêtre popup
- **Contenu** : Historique des actions Discord
- **Style** : Interface sombre

## 🎯 Optimisation Automatique

### Système d'Optimisation
L'optimisation est gérée automatiquement par `PerformanceMonitor`

### Déclencheurs

#### FPS Faible (< 30)
- **Action** : Réduction des animations
- **Méthode** : Limitation des particules
- **Résultat** : Amélioration des performances

#### Mémoire Élevée (> 80%)
- **Action** : Nettoyage automatique
- **Méthode** : Garbage collection forcé
- **Résultat** : Libération de mémoire

#### Erreurs Multiples (> 5)
- **Action** : Mode diagnostic
- **Méthode** : Surveillance détaillée
- **Résultat** : Identification des problèmes

#### Performance Faible (< 50)
- **Action** : Mode économie
- **Méthode** : Désactivation des effets non essentiels
- **Résultat** : Amélioration de la stabilité

### Métriques d'Optimisation
- **Niveau** : Aucun, Moyen, Élevé
- **Statut** : En cours, Terminé, Échec
- **Historique** : Actions appliquées
- **Efficacité** : Amélioration mesurée

## 🚨 Dépannage

### Problèmes Courants

#### Graphiques ne s'affichent pas
**Symptômes** : Canvas vides, erreurs console
**Solutions** :
1. Vérifier le chargement de Chart.js
2. Contrôler la console pour les erreurs
3. Vérifier l'existence des éléments canvas
4. Redémarrer les graphiques : `restartCharts()`

#### Métriques non mises à jour
**Symptômes** : Valeurs statiques, pas de tendances
**Solutions** :
1. Vérifier la connexion aux moniteurs
2. Contrôler les permissions JavaScript
3. Vérifier la configuration des moniteurs
4. Actualiser manuellement : bouton "Actualiser"

#### Erreurs de connexion
**Symptômes** : Redirection vers login, session expirée
**Solutions** :
1. Vérifier la configuration admin
2. Contrôler la session utilisateur
3. Vérifier les logs du serveur
4. Reconnecter avec le code d'accès

### Logs de Débogage

#### Console Navigateur
- **Erreurs** : Affichées en rouge
- **Avertissements** : Affichés en orange
- **Informations** : Affichées en bleu

#### Logs Admin
- **Accès** : Via la console du navigateur
- **Niveau** : DEBUG, INFO, WARN, ERROR
- **Format** : Timestamp + Message + Détails

### Tests de Diagnostic

#### Test des Graphiques
```javascript
// Vérifier l'état du gestionnaire
console.log('ChartManager:', window.chartManager);
console.log('Initialisé:', window.chartManager?.isInitialized);

// Tester l'initialisation
window.chartManager?.initializeAllCharts();
```

#### Test des Moniteurs
```javascript
// Vérifier les moniteurs disponibles
console.log('PerformanceMonitor:', window.performanceMonitor);
console.log('SiteMonitor:', window.siteMonitor);
console.log('ActivityMonitor:', window.activityMonitor);
```

#### Test des Métriques
```javascript
// Collecter les données
const stats = collectAllMonitorData();
console.log('Métriques collectées:', stats);
```

## 🔧 Maintenance

### Nettoyage Régulier
- **Graphiques** : Nettoyer les anciennes données
- **Mémoire** : Vérifier l'utilisation
- **Logs** : Archiver les anciens logs
- **Sessions** : Nettoyer les sessions expirées

### Mise à Jour
- **Chart.js** : Vérifier les nouvelles versions
- **Moniteurs** : Mettre à jour les algorithmes
- **Configuration** : Revoir les paramètres
- **Sécurité** : Mettre à jour les codes d'accès

### Sauvegarde
- **Configuration** : Sauvegarder `admin-config.js`
- **Données** : Exporter régulièrement les métriques
- **Logs** : Archiver les logs importants
- **Personnalisations** : Sauvegarder les modifications

---

**💡 Conseil** : Testez régulièrement toutes les fonctionnalités pour vous assurer du bon fonctionnement du panel admin.
