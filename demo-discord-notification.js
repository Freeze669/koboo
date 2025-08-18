/**
 * Démonstration des Notifications Discord - Nouveau Serveur
 * Mayu & Jack Studio
 * 
 * Ce fichier montre comment utiliser le système de notifications Discord
 * pour annoncer le nouveau serveur : https://discord.gg/5ps8dkfnBk
 */

// Configuration du webhook Discord (à remplacer par votre URL)
const DEMO_WEBHOOK_URL = 'VOTRE_WEBHOOK_DISCORD_ICI';

// Classe de démonstration pour les notifications Discord
class DiscordNotificationDemo {
    constructor() {
        this.notificationsSystem = null;
        this.isInitialized = false;
        this.demoData = {
            serverName: 'Mayu & Jack Studio - Nouveau Serveur',
            inviteLink: 'https://discord.gg/5ps8dkfnBk',
            description: 'Nouveau serveur Discord officiel avec support technique et communauté active',
            features: [
                'Support technique 24/7',
                'Communauté active et bienveillante',
                'Actualités en temps réel',
                'Tutoriels et guides',
                'Développement collaboratif'
            ],
            benefits: [
                'Accès prioritaire aux nouvelles fonctionnalités',
                'Support direct des développeurs',
                'Partage d\'expériences',
                'Réseautage professionnel'
            ]
        };
        
        this.init();
    }
    
    /**
     * Initialisation du système
     */
    init() {
        console.log('🚀 Initialisation de la démo Discord...');
        
        // Vérifier si le webhook est configuré
        if (this.checkWebhookConfiguration()) {
            this.initializeNotifications();
        } else {
            this.showConfigurationInstructions();
        }
    }
    
    /**
     * Vérifier la configuration du webhook
     */
    checkWebhookConfiguration() {
        if (typeof window !== 'undefined' && window.isWebhookConfigured) {
            return window.isWebhookConfigured();
        }
        
        // Vérification locale
        return DEMO_WEBHOOK_URL && 
               DEMO_WEBHOOK_URL !== 'VOTRE_WEBHOOK_DISCORD_ICI' &&
               DEMO_WEBHOOK_URL.includes('discord.com/api/webhooks/');
    }
    
    /**
     * Initialiser le système de notifications
     */
    initializeNotifications() {
        try {
            if (typeof NotificationsGrouped !== 'undefined') {
                this.notificationsSystem = new NotificationsGrouped(DEMO_WEBHOOK_URL);
                this.isInitialized = true;
                console.log('✅ Système de notifications initialisé');
                this.runDemo();
            } else {
                console.error('❌ Classe NotificationsGrouped non trouvée');
                this.showLoadError();
            }
        } catch (error) {
            console.error('❌ Erreur d\'initialisation:', error);
            this.showInitializationError(error);
        }
    }
    
    /**
     * Exécuter la démonstration
     */
    runDemo() {
        console.log('🎬 Démarrage de la démonstration Discord...');
        
        // Attendre un peu avant de commencer
        setTimeout(() => {
            this.sendWelcomeNotification();
        }, 1000);
        
        // Envoyer la notification du nouveau serveur après 3 secondes
        setTimeout(() => {
            this.sendNewServerNotification();
        }, 3000);
        
        // Envoyer une notification personnalisée après 6 secondes
        setTimeout(() => {
            this.sendCustomNotification();
        }, 6000);
        
        // Afficher les statistiques après 9 secondes
        setTimeout(() => {
            this.showStatistics();
        }, 9000);
    }
    
    /**
     * Envoyer une notification de bienvenue
     */
    sendWelcomeNotification() {
        if (!this.isInitialized) return;
        
        console.log('👋 Envoi de la notification de bienvenue...');
        
        try {
            const welcomeData = {
                message: 'Bienvenue dans la démonstration des notifications Discord !',
                type: 'demo_welcome',
                timestamp: new Date().toISOString()
            };
            
            const notificationId = this.notificationsSystem.addNotification(
                'discord_server_update',
                welcomeData,
                'high'
            );
            
            console.log('✅ Notification de bienvenue envoyée, ID:', notificationId);
            
        } catch (error) {
            console.error('❌ Erreur notification de bienvenue:', error);
        }
    }
    
    /**
     * Envoyer la notification du nouveau serveur Discord
     */
    sendNewServerNotification() {
        if (!this.isInitialized) return;
        
        console.log('🔄 Envoi de la notification du nouveau serveur Discord...');
        
        try {
            const notificationId = this.notificationsSystem.sendNewDiscordServerNotification();
            
            console.log('✅ Notification du nouveau serveur envoyée, ID:', notificationId);
            console.log('🔗 Lien du serveur:', this.demoData.inviteLink);
            
            // Afficher les détails dans la console
            this.logServerDetails();
            
        } catch (error) {
            console.error('❌ Erreur notification nouveau serveur:', error);
        }
    }
    
    /**
     * Envoyer une notification personnalisée
     */
    sendCustomNotification() {
        if (!this.isInitialized) return;
        
        console.log('🎨 Envoi d\'une notification personnalisée...');
        
        try {
            const customData = {
                serverName: 'Serveur Démo Personnalisé',
                inviteLink: 'https://discord.gg/demo123',
                description: 'Ceci est une démonstration de notification personnalisée',
                features: ['Fonctionnalité A', 'Fonctionnalité B', 'Fonctionnalité C'],
                priority: 'high',
                demo: true,
                timestamp: new Date().toISOString()
            };
            
            const notificationId = this.notificationsSystem.sendDiscordServerUpdate(
                customData.serverName,
                customData.inviteLink,
                customData
            );
            
            console.log('✅ Notification personnalisée envoyée, ID:', notificationId);
            
        } catch (error) {
            console.error('❌ Erreur notification personnalisée:', error);
        }
    }
    
    /**
     * Afficher les statistiques
     */
    showStatistics() {
        if (!this.isInitialized) return;
        
        console.log('📊 Récupération des statistiques...');
        
        try {
            const stats = this.notificationsSystem.getStats();
            
            console.log('📈 Statistiques des notifications:');
            console.log('   • Total:', stats.totalNotifications);
            console.log('   • Importantes:', stats.importantCount);
            console.log('   • Connexions:', stats.connectionCount);
            console.log('   • Normales:', stats.normalCount);
            
        } catch (error) {
            console.error('❌ Erreur récupération statistiques:', error);
        }
    }
    
    /**
     * Afficher les détails du serveur dans la console
     */
    logServerDetails() {
        console.log('🏠 Détails du nouveau serveur Discord:');
        console.log('   • Nom:', this.demoData.serverName);
        console.log('   • Lien:', this.demoData.inviteLink);
        console.log('   • Description:', this.demoData.description);
        console.log('   • Fonctionnalités:', this.demoData.features);
        console.log('   • Avantages:', this.demoData.benefits);
    }
    
    /**
     * Afficher les instructions de configuration
     */
    showConfigurationInstructions() {
        console.log('⚙️ Configuration requise:');
        console.log('1. Remplacez VOTRE_WEBHOOK_DISCORD_ICI par votre URL de webhook Discord');
        console.log('2. Assurez-vous que les fichiers discord-webhook-config.js et notifications-grouped.js sont chargés');
        console.log('3. Rechargez la page pour réinitialiser');
        console.log('');
        console.log('📖 Voir README_DISCORD_NOTIFICATIONS.md pour plus de détails');
    }
    
    /**
     * Afficher l'erreur de chargement
     */
    showLoadError() {
        console.error('📚 Erreur de chargement:');
        console.error('   • Assurez-vous que discord-webhook-config.js est chargé');
        console.error('   • Assurez-vous que notifications-grouped.js est chargé');
        console.error('   • Vérifiez l\'ordre de chargement des scripts');
    }
    
    /**
     * Afficher l'erreur d'initialisation
     */
    showInitializationError(error) {
        console.error('🔧 Erreur d\'initialisation:');
        console.error('   • Détails:', error.message);
        console.error('   • Vérifiez la configuration du webhook');
        console.error('   • Vérifiez la connectivité réseau');
    }
    
    /**
     * Méthode publique pour forcer l'envoi d'une notification
     */
    forceSendNotification() {
        if (!this.isInitialized) {
            console.error('❌ Système non initialisé');
            return false;
        }
        
        try {
            this.sendNewServerNotification();
            return true;
        } catch (error) {
            console.error('❌ Erreur envoi forcé:', error);
            return false;
        }
    }
    
    /**
     * Méthode publique pour obtenir le statut
     */
    getStatus() {
        return {
            initialized: this.isInitialized,
            webhookConfigured: this.checkWebhookConfiguration(),
            demoData: this.demoData,
            timestamp: new Date().toISOString()
        };
    }
}

// Initialisation automatique si dans un navigateur
if (typeof window !== 'undefined') {
    // Attendre que la page soit chargée
    window.addEventListener('load', function() {
        // Créer l'instance de démonstration
        window.discordDemo = new DiscordNotificationDemo();
        
        // Exposer les méthodes publiques
        window.testDiscordNotification = () => {
            if (window.discordDemo) {
                return window.discordDemo.forceSendNotification();
            }
            return false;
        };
        
        window.getDiscordDemoStatus = () => {
            if (window.discordDemo) {
                return window.discordDemo.getStatus();
            }
            return null;
        };
        
        console.log('🎯 Démonstration Discord chargée. Utilisez:');
        console.log('   • testDiscordNotification() - Tester la notification');
        console.log('   • getDiscordDemoStatus() - Obtenir le statut');
        console.log('   • window.discordDemo - Accès direct à l\'instance');
    });
}

// Export pour utilisation en module
if (typeof module !== 'undefined' && module.exports) {
    module.exports = DiscordNotificationDemo;
}

console.log('📁 Fichier de démonstration Discord chargé');
console.log('🔗 Nouveau serveur: https://discord.gg/5ps8dkfnBk');
