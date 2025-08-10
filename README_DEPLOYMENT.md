# 🚀 Guide de Déploiement GitHub Pages - Mayu & Jack Studio

## 📋 Vue d'ensemble

Ce projet est conçu pour être déployé sur GitHub Pages comme un site statique. Il inclut un panel d'administration complet qui fonctionne entièrement côté client (frontend uniquement).

## ✨ Fonctionnalités

- **Site principal** : Interface moderne avec animations et design premium
- **Panel d'administration** : Accès sécurisé avec code `DF505`
- **Monitoring en temps réel** : Collecte de données côté client
- **Interface responsive** : Compatible mobile et desktop
- **Animations avancées** : Effets visuels et transitions fluides

## 🔧 Prérequis

- Compte GitHub
- Repository GitHub avec accès en écriture
- Branche `main` ou `master` configurée

## 📁 Structure des fichiers

```
koro - Copie/
├── index.html              # Page principale du site
├── admin-panel.html        # Panel d'administration
├── admin-login.html        # Page de connexion admin
├── admin-config.js         # Configuration et utilitaires
├── site-monitor.js         # Monitoring en temps réel
├── styles.css              # Styles principaux
├── admin-styles.css        # Styles du panel admin
├── script.js               # Scripts principaux
├── .github/workflows/      # Configuration GitHub Actions
└── .gitignore              # Fichiers exclus du déploiement
```

## 🚀 Déploiement automatique

### 1. Configuration GitHub Actions

Le fichier `.github/workflows/static.yml` est déjà configuré pour :
- Se déclencher sur les pushes vers `main`/`master`
- Déployer automatiquement vers la branche `gh-pages`
- Inclure tous les fichiers statiques nécessaires

### 2. Activation GitHub Pages

1. Allez dans **Settings** > **Pages** de votre repository
2. Sélectionnez **Source** : `Deploy from a branch`
3. Choisissez **Branch** : `gh-pages` et **Folder** : `/ (root)`
4. Cliquez **Save**

### 3. Premier déploiement

1. Poussez vos fichiers vers la branche `main` :
   ```bash
   git add .
   git commit -m "Initial commit for GitHub Pages"
   git push origin main
   ```

2. Vérifiez l'onglet **Actions** pour suivre le déploiement
3. Votre site sera disponible sur : `https://[username].github.io/[repository-name]`

## 🔐 Accès au Panel Admin

- **Code d'accès** : `DF505`
- **URL** : `[votre-site]/admin-login.html`
- **Fonctionnalités** :
  - Monitoring en temps réel
  - Métriques de performance
  - Gestion des utilisateurs
  - Actions rapides (sauvegarde, optimisation, sécurité)

## 📊 Fonctionnalités du Monitoring

Le système collecte automatiquement :
- **Visiteurs** : ID uniques, user agent, referrer
- **Performance** : Web Vitals, temps de chargement
- **Interactions** : Clics, scroll, formulaires
- **Erreurs** : JavaScript, ressources, promesses
- **Réseau** : Connectivité, latence

## 🎨 Personnalisation

### Modifier le code admin
Éditez `admin-config.js` :
```javascript
security: {
    adminCode: "VOTRE_CODE", // Changez ici
    // ...
}
```

### Modifier les couleurs
Éditez `admin-config.js` :
```javascript
ui: {
    colors: {
        primary: "#votre_couleur",
        // ...
    }
}
```

## ⚠️ Limitations GitHub Pages

- **Backend Go** : Non supporté (fichiers exclus via `.gitignore`)
- **Base de données** : Non disponible
- **API dynamiques** : Non supportées
- **Sessions serveur** : Non disponibles

## 🔧 Dépannage

### Le site ne se charge pas
1. Vérifiez que GitHub Pages est activé
2. Consultez les logs dans **Actions** > **Deploy**
3. Vérifiez que la branche `gh-pages` existe

### Le panel admin ne fonctionne pas
1. Vérifiez que `admin-config.js` est bien déployé
2. Utilisez le code : `DF505`
3. Vérifiez la console du navigateur pour les erreurs

### Problèmes de style
1. Vérifiez que tous les fichiers CSS sont déployés
2. Videz le cache du navigateur
3. Vérifiez les chemins des fichiers

## 📱 Test local

Pour tester avant déploiement :
1. Ouvrez `index.html` dans un navigateur
2. Testez le panel admin avec le code `DF505`
3. Vérifiez que toutes les fonctionnalités marchent

## 🌟 Support

- **Documentation** : Consultez les fichiers README
- **Issues** : Utilisez l'onglet Issues de GitHub
- **Wiki** : Créez un wiki pour la documentation utilisateur

---

**Mayu & Jack Studio** - Panel d'administration moderne et responsive
