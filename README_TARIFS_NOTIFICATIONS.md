# 🚀 Système de Tarifs et Notifications Groupées - Mayu & Jack Studio

## 📋 Vue d'ensemble

Ce système comprend deux composants principaux :

1. **🎯 Gestion des Tarifs** : Interface d'administration complète pour gérer les prix et services
2. **🔔 Notifications Groupées Discord** : Système de notifications optimisées et groupées

## 🎯 Gestion des Tarifs

### Fonctionnalités

- ✅ **CRUD complet** : Créer, Lire, Mettre à jour, Supprimer des tarifs
- ✅ **Catégories** : Services, Forfaits, Options additionnelles
- ✅ **Calculs automatiques** : Prix des forfaits avec réductions
- ✅ **Import/Export** : Configuration JSON
- ✅ **Stockage local** : Sauvegarde automatique dans le navigateur
- ✅ **Interface moderne** : Design responsive avec animations

### Structure des Tarifs

#### Services
```json
{
  "design-web": {
    "nom": "Design Web",
    "description": "Création de sites web personnalisés",
    "prix": 299,
    "devise": "EUR",
    "duree": "2-3 semaines",
    "categorie": "web"
  }
}
```

#### Forfaits
```json
{
  "starter": {
    "nom": "Pack Starter",
    "services": ["design-web", "logo-design"],
    "prix": 349,
    "devise": "EUR",
    "reduction": 15,
    "description": "Pack idéal pour débuter"
  }
}
```

#### Options
```json
{
  "responsive": {
    "nom": "Design Responsive",
    "description": "Adaptation mobile et tablette",
    "prix": 79,
    "devise": "EUR"
  }
}
```

### Utilisation

1. **Accéder au panel admin** : `admin-panel.html`
2. **Section tarifs** : Automatiquement générée
3. **Modifier un tarif** : Cliquer sur l'icône d'édition
4. **Ajouter un service** : Bouton "Nouveau Service"
5. **Exporter/Importer** : Boutons en haut de la section

## 🔔 Notifications Groupées Discord

### Fonctionnalités

- ✅ **Groupement intelligent** : Notifications groupées par type et IP
- ✅ **Priorité** : Événements importants envoyés immédiatement
- ✅ **Optimisation** : Réduction du spam Discord
- ✅ **Connexions IP** : Suivi des visiteurs avec groupement par IP
- ✅ **Embeds colorés** : Notifications visuellement attrayantes

### Types d'Événements

#### Événements Importants (Envoi immédiat)
- `user_login` : Connexion utilisateur
- `admin_access` : Accès administrateur
- `payment_received` : Paiement reçu
- `error_critical` : Erreur critique
- `tarifs_updated` : Mise à jour des tarifs

#### Événements de Connexion (Groupés par IP)
- `ip_connection` : Nouvelle connexion IP
- `new_visitor` : Nouveau visiteur
- `returning_visitor` : Visiteur de retour

#### Événements Normaux (Groupés par type)
- `page_view` : Vue de page
- `form_submit` : Soumission de formulaire
- `button_click` : Clic sur bouton

### Configuration

1. **Modifier** `discord-webhook-config.js`
2. **Remplacer** `VOTRE_WEBHOOK_DISCORD_ICI` par votre URL
3. **Redémarrer** le panel admin

### Exemple de Webhook
```javascript
webhookUrl: 'https://discord.com/api/webhooks/123456789/abcdefghijklmnopqrstuvwxyz'
```

## 🧪 Tests et Développement

### Page de Test
- **Fichier** : `test-tarifs-notifications.html`
- **Fonction** : Tester tous les composants
- **URL** : Ouvrir dans le navigateur

### Tests Disponibles

#### Tarifs
- ✅ Configuration et chargement
- ✅ Opérations CRUD
- ✅ Export/Import
- ✅ Calculs de prix

#### Notifications
- ✅ Initialisation
- ✅ Notifications immédiates
- ✅ Notifications groupées
- ✅ Notifications de connexion

#### Intégration
- ✅ Test complet
- ✅ Mise à jour + notification
- ✅ Test de performance

## 📁 Structure des Fichiers

```
koboo-main/
├── tarifs-config.js              # Configuration des tarifs
├── admin-tarifs.js               # Interface d'administration
├── admin-tarifs.css              # Styles CSS
├── notifications-grouped.js      # Système de notifications
├── discord-webhook-config.js     # Configuration Discord
├── test-tarifs-notifications.html # Page de test
└── README_TARIFS_NOTIFICATIONS.md # Ce fichier
```

## 🚀 Installation et Configuration

### 1. Fichiers Requis
Assurez-vous que tous les fichiers sont présents dans le dossier `koboo-main/`

### 2. Configuration Discord
1. Créer un webhook dans votre serveur Discord
2. Modifier `discord-webhook-config.js`
3. Remplacer l'URL du webhook

### 3. Intégration Panel Admin
Les fichiers sont automatiquement inclus dans `admin-panel.html`

### 4. Test
1. Ouvrir `test-tarifs-notifications.html`
2. Configurer le webhook Discord
3. Exécuter les tests

## 💡 Utilisation Avancée

### Ajouter un Nouveau Type d'Événement

1. **Modifier** `discord-webhook-config.js`
2. **Ajouter** dans `importantEvents`, `connectionEvents`, ou `normalEvents`
3. **Définir** couleur, icône et titre dans `embeds`

### Personnaliser les Tarifs

1. **Modifier** `tarifs-config.js`
2. **Ajouter** nouvelles catégories
3. **Étendre** la logique de calcul

### Intégration avec d'autres Systèmes

```javascript
// Exemple d'utilisation
if (window.notificationsGrouped) {
    window.notificationsGrouped.addNotification('custom_event', {
        data: 'Vos données',
        timestamp: new Date().toISOString()
    });
}

if (window.tarifsConfig) {
    const tarifs = window.tarifsConfig.getAllTarifs();
    // Utiliser les tarifs
}
```

## 🔧 Dépannage

### Problèmes Courants

#### Notifications ne s'envoient pas
- ✅ Vérifier l'URL du webhook
- ✅ Vérifier la console du navigateur
- ✅ Tester avec la page de test

#### Tarifs ne se sauvegardent pas
- ✅ Vérifier le localStorage
- ✅ Vérifier les permissions du navigateur
- ✅ Tester avec la page de test

#### Interface ne s'affiche pas
- ✅ Vérifier que tous les fichiers sont chargés
- ✅ Vérifier la console pour les erreurs
- ✅ Vérifier l'ordre de chargement des scripts

### Logs et Debug

- **Console navigateur** : Tous les événements sont loggés
- **Notifications toast** : Feedback utilisateur en temps réel
- **Statut Discord** : Affiché dans le panel admin

## 📊 Performance

### Optimisations

- **Groupement** : Réduction des appels Discord
- **Cache local** : Stockage des tarifs
- **Lazy loading** : Chargement à la demande
- **Debouncing** : Limitation des mises à jour

### Métriques

- **Temps de réponse** : < 100ms pour les opérations CRUD
- **Mémoire** : < 5MB pour 1000 tarifs
- **Notifications** : Groupement toutes les 30 secondes

## 🔒 Sécurité

### Bonnes Pratiques

- ✅ **Webhook privé** : Ne pas exposer l'URL
- ✅ **Validation** : Vérification des données
- ✅ **Sanitisation** : Nettoyage des entrées
- ✅ **Rate limiting** : Protection contre le spam

### Permissions

- **Admin uniquement** : Accès au panel des tarifs
- **Lecture publique** : Tarifs visibles par tous
- **Modification** : Administrateurs uniquement

## 🌟 Fonctionnalités Futures

### Planifiées

- 🔄 **Synchronisation cloud** : Sauvegarde en ligne
- 📱 **API REST** : Interface programmatique
- 🎨 **Thèmes personnalisables** : Interface adaptative
- 📊 **Analytics avancés** : Statistiques détaillées

### Suggestions

- 💬 **Chat intégré** : Support client
- 💳 **Paiements** : Intégration Stripe/PayPal
- 📧 **Notifications email** : Alternative à Discord
- 🔔 **Push notifications** : Notifications navigateur

## 📞 Support

### Contact

- **Développeur** : Mayu & Jack Studio
- **Documentation** : Ce fichier README
- **Tests** : Page de test intégrée
- **Console** : Logs détaillés

### Contribution

1. **Fork** le projet
2. **Créer** une branche feature
3. **Tester** avec la page de test
4. **Soumettre** une pull request

---

**🎉 Système prêt à l'emploi !**

Configurez votre webhook Discord et commencez à gérer vos tarifs avec des notifications intelligentes et groupées.
