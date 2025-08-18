# 🔄 Notifications Discord - Nouveau Serveur

## 📋 Vue d'ensemble

Ce système permet d'envoyer automatiquement des notifications Discord lors de mises à jour importantes, notamment pour annoncer un nouveau serveur Discord.

## 🎯 Nouveau Serveur Discord

**Lien du nouveau serveur :** `https://discord.gg/5ps8dkfnBk`

## 🚀 Utilisation Rapide

### 1. Configuration du Webhook

```javascript
// Mettre à jour l'URL du webhook Discord
updateWebhookUrl('https://discord.com/api/webhooks/VOTRE_ID/VOTRE_TOKEN');
```

### 2. Envoyer une Notification

```javascript
// Notification automatique du nouveau serveur
notificationsSystem.sendNewDiscordServerNotification();

// Ou notification personnalisée
notificationsSystem.sendDiscordServerUpdate(
    'Nom du Serveur',
    'https://discord.gg/lien',
    { description: 'Description personnalisée' }
);
```

## 📁 Fichiers Modifiés

### `notifications-grouped.js`
- ✅ Ajout du type `discord_server_update`
- ✅ Configuration des couleurs, icônes et titres
- ✅ Fonction `sendDiscordServerUpdate()`
- ✅ Fonction `sendNewDiscordServerNotification()`

### `discord-webhook-config.js`
- ✅ Ajout dans les événements importants
- ✅ Configuration des embeds Discord
- ✅ Couleurs et icônes personnalisées

## 🔧 Configuration

### Types de Notifications Supportés

| Type | Description | Couleur | Icône |
|------|-------------|---------|-------|
| `discord_server_update` | Mise à jour serveur Discord | 🔵 Bleu | 🔄 |

### Configuration des Embeds

```javascript
const embedConfig = {
    color: 0x007bff,        // Bleu Discord
    icon: '🔄',             // Icône de mise à jour
    title: 'Mise à Jour du Serveur Discord'
};
```

## 📱 Interface de Test

Ouvrez `test-discord-notification.html` pour :

1. **Configurer le webhook Discord**
2. **Tester la notification automatique**
3. **Créer des notifications personnalisées**
4. **Vérifier le statut du webhook**

## 🎨 Personnalisation

### Notification Personnalisée

```javascript
const customData = {
    serverName: 'Mon Serveur',
    inviteLink: 'https://discord.gg/monlien',
    description: 'Description personnalisée',
    features: ['Fonctionnalité 1', 'Fonctionnalité 2'],
    priority: 'high'
};

notificationsSystem.sendDiscordServerUpdate(
    customData.serverName,
    customData.inviteLink,
    customData
);
```

### Format des Données

```javascript
{
    serverName: string,      // Nom du serveur
    inviteLink: string,      // Lien d'invitation
    description?: string,    // Description optionnelle
    features?: string[],     // Liste des fonctionnalités
    priority?: 'low' | 'normal' | 'high'
}
```

## 🔔 Intégration

### Dans votre Code

```javascript
// Importer le système
import { NotificationsGrouped } from './notifications-grouped.js';

// Initialiser
const notifications = new NotificationsGrouped(webhookUrl);

// Envoyer la notification du nouveau serveur
notifications.sendNewDiscordServerNotification();
```

### Dans une Page Web

```html
<script src="discord-webhook-config.js"></script>
<script src="notifications-grouped.js"></script>

<script>
    // Initialiser automatiquement
    window.addEventListener('load', function() {
        if (window.notificationsGrouped) {
            // Envoyer la notification
            window.notificationsGrouped.sendNewDiscordServerNotification();
        }
    });
</script>
```

## 🧪 Tests

### Test Automatique

```javascript
// Test de la notification par défaut
testDiscordNotification();

// Test de notification personnalisée
testCustomDiscordNotification();

// Vérification du statut
checkWebhookStatus();
```

### Vérification Console

```javascript
// Vérifier que la notification a été envoyée
console.log('📢 Notification Discord envoyée:', {
    type: 'discord_server_update',
    serverName: 'Mayu & Jack Studio - Nouveau Serveur',
    inviteLink: 'https://discord.gg/5ps8dkfnBk'
});
```

## 🚨 Gestion des Erreurs

### Erreurs Communes

1. **Webhook non configuré**
   ```javascript
   if (!isWebhookConfigured()) {
       console.error('❌ Webhook Discord non configuré');
   }
   ```

2. **URL invalide**
   ```javascript
   if (!webhookUrl.includes('discord.com/api/webhooks/')) {
       console.error('❌ URL de webhook invalide');
   }
   ```

3. **Erreur d'envoi**
   ```javascript
   try {
       await notificationsSystem.sendDiscordServerUpdate(...);
   } catch (error) {
       console.error('❌ Erreur envoi:', error.message);
   }
   ```

## 📊 Monitoring

### Statistiques

```javascript
const stats = notificationsSystem.getStats();
console.log('📊 Statistiques:', {
    totalNotifications: stats.totalNotifications,
    importantCount: stats.importantCount,
    connectionCount: stats.connectionCount,
    normalCount: stats.normalCount
});
```

### Logs

```javascript
// Activer les logs détaillés
console.log('🔔 Notification Discord:', {
    type: 'discord_server_update',
    timestamp: new Date().toISOString(),
    data: notificationData
});
```

## 🔄 Mise à Jour

### Ajouter de Nouveaux Types

1. Ajouter dans `importantEvents`
2. Configurer couleurs, icônes et titres
3. Ajouter le cas dans `formatNotificationData`
4. Créer la fonction utilitaire

### Exemple

```javascript
// 1. Ajouter le type
this.importantEvents.push('new_notification_type');

// 2. Configurer
colors: { 'new_notification_type': 0xff0000 },
icons: { 'new_notification_type': '🆕' },
titles: { 'new_notification_type': 'Nouveau Type' }

// 3. Formater
case 'new_notification_type':
    return `Nouvelle notification: ${notification.data.message}`;

// 4. Fonction utilitaire
sendNewNotificationType(data) {
    return this.addNotification('new_notification_type', data, 'high');
}
```

## 📞 Support

Pour toute question ou problème :

- **Discord :** [https://discord.gg/5ps8dkfnBk](https://discord.gg/5ps8dkfnBk)
- **Documentation :** Voir les fichiers README du projet
- **Issues :** Utiliser le système de gestion des problèmes GitHub

---

**Développé par Mayu & Jack Studio** 🚀
