/**
 * Configuration du Webhook Discord - Mayu & Jack Studio
 * Configuration centralisée pour les notifications Discord
 */

const DISCORD_CONFIG = {
    // URL du webhook Discord (remplacer par votre URL)
    webhookUrl: 'VOTRE_WEBHOOK_DISCORD_ICI',
    
    // Configuration des notifications
    notifications: {
        // Délai de groupement en millisecondes
        groupingDelay: 30000, // 30 secondes
        
        // Types d'événements importants (envoi immédiat)
        importantEvents: [
            'user_login',
            'user_logout',
            'admin_access',
            'payment_received',
            'service_request',
            'error_critical',
            'security_alert',
            'tarifs_updated'
        ],
        
        // Types d'événements de connexion (groupés par IP)
        connectionEvents: [
            'ip_connection',
            'ip_disconnection',
            'new_visitor',
            'returning_visitor'
        ],
        
        // Types d'événements normaux (groupés par type)
        normalEvents: [
            'page_view',
            'form_submit',
            'button_click',
            'scroll_event',
            'performance_metric'
        ]
    },
    
    // Configuration des embeds
    embeds: {
        // Couleurs par type d'événement
        colors: {
            'user_login': 0x00ff00,      // Vert
            'user_logout': 0xff8800,     // Orange
            'admin_access': 0xff0000,    // Rouge
            'payment_received': 0x00ff88, // Vert clair
            'service_request': 0x0088ff,  // Bleu
            'ip_connection': 0x8888ff,   // Bleu clair
            'ip_disconnection': 0xff8888, // Rouge clair
            'new_visitor': 0x88ff88,     // Vert clair
            'returning_visitor': 0xffff88, // Jaune
            'error_critical': 0xff0000,  // Rouge
            'security_alert': 0xff0088,  // Rose
            'tarifs_updated': 0x10b981   // Vert émeraude
        },
        
        // Icônes par type d'événement
        icons: {
            'user_login': '🔐',
            'user_logout': '🚪',
            'admin_access': '👑',
            'payment_received': '💰',
            'service_request': '📋',
            'ip_connection': '🌐',
            'ip_disconnection': '❌',
            'new_visitor': '👤',
            'returning_visitor': '🔄',
            'error_critical': '🚨',
            'security_alert': '⚠️',
            'tarifs_updated': '💎'
        },
        
        // Titres par type d'événement
        titles: {
            'user_login': 'Connexion Utilisateur',
            'user_logout': 'Déconnexion Utilisateur',
            'admin_access': 'Accès Administrateur',
            'payment_received': 'Paiement Reçu',
            'service_request': 'Demande de Service',
            'ip_connection': 'Nouvelle Connexion IP',
            'ip_disconnection': 'Déconnexion IP',
            'new_visitor': 'Nouveau Visiteur',
            'returning_visitor': 'Visiteur de Retour',
            'error_critical': 'Erreur Critique',
            'security_alert': 'Alerte de Sécurité',
            'tarifs_updated': 'Tarifs Mis à Jour'
        }
    },
    
    // Configuration du rate limiting
    rateLimit: {
        maxRequestsPerMinute: 30,
        cooldownPeriod: 60000 // 1 minute
    },
    
    // Configuration des retry
    retry: {
        maxAttempts: 3,
        delayBetweenAttempts: 1000, // 1 seconde
        backoffMultiplier: 2
    }
};

// Fonction pour obtenir la configuration
function getDiscordConfig() {
    return DISCORD_CONFIG;
}

// Fonction pour vérifier si le webhook est configuré
function isWebhookConfigured() {
    return DISCORD_CONFIG.webhookUrl && 
           DISCORD_CONFIG.webhookUrl !== 'VOTRE_WEBHOOK_DISCORD_ICI' &&
           DISCORD_CONFIG.webhookUrl.includes('discord.com/api/webhooks/');
}

// Fonction pour obtenir l'URL du webhook
function getWebhookUrl() {
    return DISCORD_CONFIG.webhookUrl;
}

// Fonction pour mettre à jour l'URL du webhook
function updateWebhookUrl(newUrl) {
    if (newUrl && newUrl.includes('discord.com/api/webhooks/')) {
        DISCORD_CONFIG.webhookUrl = newUrl;
        
        // Sauvegarder dans le localStorage
        try {
            localStorage.setItem('discord_webhook_url', newUrl);
            console.log('✅ URL du webhook Discord mise à jour et sauvegardée');
            return true;
        } catch (error) {
            console.error('❌ Erreur sauvegarde webhook URL:', error);
            return false;
        }
    } else {
        console.error('❌ URL webhook Discord invalide');
        return false;
    }
}

// Fonction pour charger l'URL du webhook depuis le localStorage
function loadWebhookUrl() {
    try {
        const savedUrl = localStorage.getItem('discord_webhook_url');
        if (savedUrl && savedUrl.includes('discord.com/api/webhooks/')) {
            DISCORD_CONFIG.webhookUrl = savedUrl;
            console.log('✅ URL du webhook Discord chargée depuis le stockage');
            return true;
        }
    } catch (error) {
        console.warn('⚠️ Erreur chargement webhook URL:', error);
    }
    return false;
}

// Charger l'URL du webhook au démarrage
loadWebhookUrl();

// Exposer les fonctions globalement
window.DISCORD_CONFIG = DISCORD_CONFIG;
window.getDiscordConfig = getDiscordConfig;
window.isWebhookConfigured = isWebhookConfigured;
window.getWebhookUrl = getWebhookUrl;
window.updateWebhookUrl = updateWebhookUrl;
