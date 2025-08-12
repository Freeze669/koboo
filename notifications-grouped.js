/**
 * Système de Notifications Groupées - Mayu & Jack Studio
 * Notifications Discord optimisées et groupées
 */

class NotificationsGrouped {
    constructor(webhookUrl) {
        this.webhookUrl = webhookUrl;
        this.notifications = [];
        this.groupingTimeout = null;
        this.groupingDelay = 30000; // 30 secondes
        
        // Configuration des notifications importantes
        this.importantEvents = [
            'user_login',
            'user_logout', 
            'admin_access',
            'payment_received',
            'service_request',
            'error_critical',
            'security_alert'
        ];
        
        // Configuration des notifications de connexion
        this.connectionEvents = [
            'ip_connection',
            'ip_disconnection',
            'new_visitor',
            'returning_visitor'
        ];
        
        this.init();
    }
    
    /**
     * Initialisation du système
     */
    init() {
        console.log('🚀 Initialisation du système de notifications groupées...');
        this.startGroupingTimer();
    }
    
    /**
     * Ajouter une notification
     */
    addNotification(type, data, priority = 'normal') {
        const notification = {
            id: Date.now() + Math.random(),
            type: type,
            data: data,
            priority: priority,
            timestamp: new Date(),
            isImportant: this.importantEvents.includes(type),
            isConnection: this.connectionEvents.includes(type)
        };
        
        this.notifications.push(notification);
        
        // Envoyer immédiatement si c'est important
        if (notification.isImportant) {
            this.sendImmediateNotification(notification);
        } else {
            // Démarrer le timer de groupement
            this.startGroupingTimer();
        }
        
        return notification.id;
    }
    
    /**
     * Démarrer le timer de groupement
     */
    startGroupingTimer() {
        if (this.groupingTimeout) {
            clearTimeout(this.groupingTimeout);
        }
        
        this.groupingTimeout = setTimeout(() => {
            this.processGroupedNotifications();
        }, this.groupingDelay);
    }
    
    /**
     * Traiter les notifications groupées
     */
    async processGroupedNotifications() {
        if (this.notifications.length === 0) return;
        
        // Séparer les notifications par type
        const grouped = this.groupNotifications();
        
        // Envoyer les notifications groupées
        for (const [type, notifications] of Object.entries(grouped)) {
            if (notifications.length > 0) {
                await this.sendGroupedNotification(type, notifications);
            }
        }
        
        // Vider le buffer
        this.notifications = [];
    }
    
    /**
     * Grouper les notifications par type
     */
    groupNotifications() {
        const grouped = {};
        
        this.notifications.forEach(notification => {
            if (!grouped[notification.type]) {
                grouped[notification.type] = [];
            }
            grouped[notification.type].push(notification);
        });
        
        return grouped;
    }
    
    /**
     * Envoyer une notification immédiate (pour les événements importants)
     */
    async sendImmediateNotification(notification) {
        const embed = this.createEmbed(notification);
        
        try {
            await this.sendDiscordWebhook({
                embeds: [embed]
            });
            
            console.log(`✅ Notification immédiate envoyée: ${notification.type}`);
        } catch (error) {
            console.error('❌ Erreur envoi notification immédiate:', error);
        }
    }
    
    /**
     * Envoyer une notification groupée
     */
    async sendGroupedNotification(type, notifications) {
        const embed = this.createGroupedEmbed(type, notifications);
        
        try {
            await this.sendDiscordWebhook({
                embeds: [embed]
            });
            
            console.log(`✅ Notification groupée envoyée: ${type} (${notifications.length} événements)`);
        } catch (error) {
            console.error('❌ Erreur envoi notification groupée:', error);
        }
    }
    
    /**
     * Créer un embed pour une notification simple
     */
    createEmbed(notification) {
        const color = this.getColorForType(notification.type);
        const icon = this.getIconForType(notification.type);
        
        return {
            title: `${icon} ${this.getTitleForType(notification.type)}`,
            description: this.formatNotificationData(notification),
            color: color,
            timestamp: notification.timestamp.toISOString(),
            footer: {
                text: 'Mayu & Jack Studio - Notifications'
            }
        };
    }
    
    /**
     * Créer un embed pour des notifications groupées
     */
    createGroupedEmbed(type, notifications) {
        const color = this.getColorForType(type);
        const icon = this.getIconForType(type);
        const title = this.getTitleForType(type);
        
        let description = `**${notifications.length} événements** groupés\n\n`;
        
        // Grouper par IP si c'est des connexions
        if (this.connectionEvents.includes(type)) {
            const ipGroups = this.groupByIP(notifications);
            for (const [ip, ipNotifications] of Object.entries(ipGroups)) {
                description += `**IP: ${ip}** - ${ipNotifications.length} événements\n`;
                if (ipNotifications.length <= 3) {
                    ipNotifications.forEach(n => {
                        description += `• ${this.formatTime(n.timestamp)} - ${this.formatConnectionData(n)}\n`;
                    });
                } else {
                    description += `• ${ipNotifications.length} événements entre ${this.formatTime(ipNotifications[0].timestamp)} et ${this.formatTime(ipNotifications[ipNotifications.length - 1].timestamp)}\n`;
                }
                description += '\n';
            }
        } else {
            // Pour les autres types, montrer un résumé
            const uniqueData = this.getUniqueData(notifications);
            uniqueData.forEach(data => {
                description += `• ${data}\n`;
            });
        }
        
        return {
            title: `${icon} ${title} - Résumé Groupé`,
            description: description,
            color: color,
            timestamp: new Date().toISOString(),
            footer: {
                text: `Mayu & Jack Studio - ${notifications.length} événements groupés`
            }
        };
    }
    
    /**
     * Grouper par IP
     */
    groupByIP(notifications) {
        const groups = {};
        notifications.forEach(n => {
            const ip = n.data.ip || n.data.userIP || 'Unknown';
            if (!groups[ip]) groups[ip] = [];
            groups[ip].push(n);
        });
        return groups;
    }
    
    /**
     * Obtenir des données uniques
     */
    getUniqueData(notifications) {
        const unique = new Set();
        notifications.forEach(n => {
            const data = this.formatNotificationData(n);
            if (data) unique.add(data);
        });
        return Array.from(unique).slice(0, 5); // Limiter à 5 éléments
    }
    
    /**
     * Formater les données de notification
     */
    formatNotificationData(notification) {
        switch (notification.type) {
            case 'user_login':
                return `Utilisateur connecté: ${notification.data.username || 'Unknown'} (IP: ${notification.data.ip || 'Unknown'})`;
            case 'user_logout':
                return `Utilisateur déconnecté: ${notification.data.username || 'Unknown'} (IP: ${notification.data.ip || 'Unknown'})`;
            case 'admin_access':
                return `Accès admin: ${notification.data.username || 'Unknown'} (IP: ${notification.data.ip || 'Unknown'})`;
            case 'payment_received':
                return `Paiement reçu: ${notification.data.amount || 'Unknown'} ${notification.data.currency || 'EUR'} - ${notification.data.service || 'Unknown'}`;
            case 'service_request':
                return `Demande de service: ${notification.data.service || 'Unknown'} - ${notification.data.email || 'Unknown'}`;
            case 'ip_connection':
                return `Nouvelle connexion IP: ${notification.data.ip || 'Unknown'}`;
            case 'ip_disconnection':
                return `Déconnexion IP: ${notification.data.ip || 'Unknown'}`;
            case 'new_visitor':
                return `Nouveau visiteur: ${notification.data.ip || 'Unknown'}`;
            case 'returning_visitor':
                return `Visiteur de retour: ${notification.data.ip || 'Unknown'}`;
            default:
                return JSON.stringify(notification.data);
        }
    }
    
    /**
     * Formater les données de connexion
     */
    formatConnectionData(notification) {
        if (notification.data.userAgent) {
            return `${notification.data.browser || 'Unknown'} - ${notification.data.os || 'Unknown'}`;
        }
        return 'Connexion détectée';
    }
    
    /**
     * Formater l'heure
     */
    formatTime(timestamp) {
        return timestamp.toLocaleTimeString('fr-FR', { 
            hour: '2-digit', 
            minute: '2-digit' 
        });
    }
    
    /**
     * Obtenir la couleur pour le type
     */
    getColorForType(type) {
        const colors = {
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
            'security_alert': 0xff0088   // Rose
        };
        return colors[type] || 0x888888;
    }
    
    /**
     * Obtenir l'icône pour le type
     */
    getIconForType(type) {
        const icons = {
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
            'security_alert': '⚠️'
        };
        return icons[type] || '📢';
    }
    
    /**
     * Obtenir le titre pour le type
     */
    getTitleForType(type) {
        const titles = {
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
            'security_alert': 'Alerte de Sécurité'
        };
        return titles[type] || 'Notification';
    }
    
    /**
     * Envoyer le webhook Discord
     */
    async sendDiscordWebhook(data) {
        try {
            const response = await fetch(this.webhookUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data)
            });
            
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }
            
            return true;
        } catch (error) {
            console.error('❌ Erreur envoi webhook Discord:', error);
            throw error;
        }
    }
    
    /**
     * Forcer l'envoi des notifications en attente
     */
    forceSend() {
        if (this.groupingTimeout) {
            clearTimeout(this.groupingTimeout);
        }
        this.processGroupedNotifications();
    }
    
    /**
     * Vider le buffer de notifications
     */
    clearBuffer() {
        this.notifications = [];
        if (this.groupingTimeout) {
            clearTimeout(this.groupingTimeout);
        }
    }
    
    /**
     * Obtenir les statistiques
     */
    getStats() {
        return {
            totalNotifications: this.notifications.length,
            importantCount: this.notifications.filter(n => n.isImportant).length,
            connectionCount: this.notifications.filter(n => n.isConnection).length,
            normalCount: this.notifications.filter(n => !n.isImportant && !n.isConnection).length
        };
    }
}

// Instance globale
window.notificationsGrouped = null;
