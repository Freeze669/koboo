/**
 * Discord Logger - Système de logging avancé avec webhook Discord
 * Envoie des informations détaillées sur les membres connectés et activités
 */

class DiscordLogger {
    constructor(webhookUrl) {
        this.webhookUrl = webhookUrl;
        this.isEnabled = true;
        this.logLevel = 'INFO'; // DEBUG, INFO, WARN, ERROR
        this.maxRetries = 3;
        this.retryDelay = 1000;
        this.batchSize = 5;
        this.messageQueue = [];
        this.isProcessing = false;
        
        // Configuration des couleurs pour les embeds
        this.colors = {
            INFO: 0x00BFFF,    // Bleu
            SUCCESS: 0x00FF00,  // Vert
            WARN: 0xFFA500,     // Orange
            ERROR: 0xFF0000,    // Rouge
            MEMBER_JOIN: 0x00FF7F, // Vert clair
            MEMBER_LEAVE: 0xFF6B6B, // Rouge clair
            COMMAND: 0x9370DB,  // Violet
            ACTIVITY: 0x20B2AA  // Bleu-vert
        };
        
        this.init();
    }
    
    init() {
        console.log('🚀 Discord Logger initialisé');
        this.startHeartbeat();
        this.processQueue();
    }
    
    /**
     * Log un message avec niveau et contexte
     */
    async log(level, message, context = {}, options = {}) {
        if (!this.isEnabled) return;
        
        const logEntry = {
            timestamp: new Date().toISOString(),
            level: level.toUpperCase(),
            message,
            context,
            options
        };
        
        // Log local
        this.logToConsole(logEntry);
        
        // Ajouter à la queue pour envoi Discord
        this.messageQueue.push(logEntry);
        
        // Traiter la queue si elle n'est pas en cours
        if (!this.isProcessing) {
            this.processQueue();
        }
    }
    
    /**
     * Log d'un membre qui se connecte
     */
    async logMemberJoin(memberData) {
        const embed = {
            title: "🟢 Nouveau Membre Connecté",
            color: this.colors.MEMBER_JOIN,
            fields: [
                {
                    name: "👤 Membre",
                    value: memberData.name || memberData.username || "Inconnu",
                    inline: true
                },
                {
                    name: "🆔 ID",
                    value: memberData.id || "N/A",
                    inline: true
                },
                {
                    name: "🌐 IP",
                    value: memberData.ip || "N/A",
                    inline: true
                },
                {
                    name: "📍 Localisation",
                    value: memberData.location || "N/A",
                    inline: true
                },
                {
                    name: "🕒 Heure de Connexion",
                    value: new Date().toLocaleString('fr-FR'),
                    inline: true
                },
                {
                    name: "💻 Navigateur",
                    value: memberData.userAgent || "N/A",
                    inline: true
                }
            ],
            timestamp: new Date().toISOString(),
            footer: {
                text: "Système de Logging Discord"
            }
        };
        
        await this.sendDiscordMessage({
            embeds: [embed]
        });
        
        // Log local
        await this.log('INFO', `Membre connecté: ${memberData.name || memberData.username}`, memberData);
    }
    
    /**
     * Log d'un membre qui se déconnecte
     */
    async logMemberLeave(memberData) {
        const embed = {
            title: "🔴 Membre Déconnecté",
            color: this.colors.MEMBER_LEAVE,
            fields: [
                {
                    name: "👤 Membre",
                    value: memberData.name || memberData.username || "Inconnu",
                    inline: true
                },
                {
                    name: "🆔 ID",
                    value: memberData.id || "N/A",
                    inline: true
                },
                {
                    name: "⏱️ Durée de Session",
                    value: memberData.sessionDuration || "N/A",
                    inline: true
                },
                {
                    name: "🕒 Heure de Déconnexion",
                    value: new Date().toLocaleString('fr-FR'),
                    inline: true
                },
                {
                    name: "📊 Pages Visitées",
                    value: memberData.pagesVisited || "0",
                    inline: true
                }
            ],
            timestamp: new Date().toISOString(),
            footer: {
                text: "Système de Logging Discord"
            }
        };
        
        await this.sendDiscordMessage({
            embeds: [embed]
        });
        
        await this.log('INFO', `Membre déconnecté: ${memberData.name || memberData.username}`, memberData);
    }
    
    /**
     * Log d'une commande exécutée
     */
    async logCommand(commandData) {
        const embed = {
            title: "⚡ Commande Exécutée",
            color: this.colors.COMMAND,
            fields: [
                {
                    name: "👤 Utilisateur",
                    value: commandData.user || "Anonyme",
                    inline: true
                },
                {
                    name: "🔧 Commande",
                    value: commandData.command || "N/A",
                    inline: true
                },
                {
                    name: "📝 Paramètres",
                    value: commandData.params || "Aucun",
                    inline: true
                },
                {
                    name: "🕒 Timestamp",
                    value: new Date().toLocaleString('fr-FR'),
                    inline: true
                },
                {
                    name: "💻 Page",
                    value: commandData.page || "N/A",
                    inline: true
                },
                {
                    name: "✅ Statut",
                    value: commandData.success ? "Succès" : "Échec",
                    inline: true
                }
            ],
            timestamp: new Date().toISOString(),
            footer: {
                text: "Système de Logging Discord"
            }
        };
        
        await this.sendDiscordMessage({
            embeds: [embed]
        });
        
        await this.log('INFO', `Commande exécutée: ${commandData.command}`, commandData);
    }
    
    /**
     * Log d'activité utilisateur
     */
    async logActivity(activityData) {
        const embed = {
            title: "📊 Activité Utilisateur",
            color: this.colors.ACTIVITY,
            fields: [
                {
                    name: "👤 Utilisateur",
                    value: activityData.user || "Anonyme",
                    inline: true
                },
                {
                    name: "🎯 Action",
                    value: activityData.action || "N/A",
                    inline: true
                },
                {
                    name: "📄 Page",
                    value: activityData.page || "N/A",
                    inline: true
                },
                {
                    name: "⏱️ Durée",
                    value: activityData.duration || "N/A",
                    inline: true
                },
                {
                    name: "📱 Appareil",
                    value: activityData.device || "N/A",
                    inline: true
                }
            ],
            timestamp: new Date().toISOString(),
            footer: {
                text: "Système de Logging Discord"
            }
        };
        
        await this.sendDiscordMessage({
            embeds: [embed]
        });
        
        await this.log('INFO', `Activité: ${activityData.action}`, activityData);
    }
    
    /**
     * Log d'erreur système
     */
    async logError(errorData) {
        const embed = {
            title: "❌ Erreur Système",
            color: this.colors.ERROR,
            fields: [
                {
                    name: "🚨 Type d'Erreur",
                    value: errorData.type || "Erreur inconnue",
                    inline: true
                },
                {
                    name: "📝 Message",
                    value: errorData.message || "Aucun message",
                    inline: false
                },
                {
                    name: "🔍 Détails",
                    value: errorData.details || "Aucun détail",
                    inline: false
                },
                {
                    name: "🕒 Timestamp",
                    value: new Date().toLocaleString('fr-FR'),
                    inline: true
                },
                {
                    name: "💻 Page",
                    value: errorData.page || "N/A",
                    inline: true
                }
            ],
            timestamp: new Date().toISOString(),
            footer: {
                text: "Système de Logging Discord"
            }
        };
        
        await this.sendDiscordMessage({
            embeds: [embed]
        });
        
        await this.log('ERROR', `Erreur: ${errorData.message}`, errorData);
    }
    
    /**
     * Envoi du message Discord
     */
    async sendDiscordMessage(payload) {
        if (!this.webhookUrl) {
            // URL webhook non configurée - pas de message dans le webhook
            return;
        }
        
        try {
            const response = await fetch(this.webhookUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload)
            });
            
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }
            
            console.log('✅ Message Discord envoyé avec succès');
            
        } catch (error) {
            // Erreur silencieuse - pas de message dans le webhook
            
            // Retry logic
            if (this.retryCount < this.maxRetries) {
                this.retryCount++;
                setTimeout(() => {
                    this.sendDiscordMessage(payload);
                }, this.retryDelay * this.retryCount);
            }
        }
    }
    
    /**
     * Traitement de la queue des messages
     */
    async processQueue() {
        if (this.isProcessing || this.messageQueue.length === 0) return;
        
        this.isProcessing = true;
        
        while (this.messageQueue.length > 0) {
            const batch = this.messageQueue.splice(0, this.batchSize);
            
            for (const entry of batch) {
                try {
                    await this.sendDiscordMessage({
                        embeds: [{
                            title: `📋 Log ${entry.level}`,
                            description: entry.message,
                            color: this.colors[entry.level] || this.colors.INFO,
                            fields: Object.entries(entry.context).map(([key, value]) => ({
                                name: key,
                                value: String(value),
                                inline: true
                            })),
                            timestamp: entry.timestamp,
                            footer: {
                                text: "Système de Logging Discord"
                            }
                        }]
                    });
                    
                    // Délai entre les messages pour éviter le rate limiting
                    await new Promise(resolve => setTimeout(resolve, 500));
                    
                } catch (error) {
                    // Erreur silencieuse - pas de message dans le webhook
                }
            }
        }
        
        this.isProcessing = false;
    }
    
    /**
     * Log local dans la console
     */
    logToConsole(entry) {
        const timestamp = new Date(entry.timestamp).toLocaleString('fr-FR');
        const level = entry.level.padEnd(5);
        const context = Object.keys(entry.context).length > 0 
            ? ` [${Object.entries(entry.context).map(([k, v]) => `${k}:${v}`).join(', ')}]`
            : '';
        
        console.log(`[${timestamp}] ${level} ${entry.message}${context}`);
    }
    
    /**
     * Démarrage du heartbeat
     */
    startHeartbeat() {
        setInterval(() => {
            this.log('INFO', '💓 Heartbeat - Système de logging actif', {
                uptime: process.uptime ? Math.floor(process.uptime) : 'N/A',
                memory: process.memoryUsage ? Math.round(process.memoryUsage().heapUsed / 1024 / 1024) + 'MB' : 'N/A',
                queueSize: this.messageQueue.length
            });
        }, 300000); // Toutes les 5 minutes
    }
    
    /**
     * Configuration du niveau de log
     */
    setLogLevel(level) {
        this.logLevel = level.toUpperCase();
        console.log(`🔧 Niveau de log changé: ${this.logLevel}`);
    }
    
    /**
     * Activation/Désactivation du logger
     */
    setEnabled(enabled) {
        this.isEnabled = enabled;
        console.log(`🔧 Logger ${enabled ? 'activé' : 'désactivé'}`);
    }
    
    /**
     * Statistiques du logger
     */
    getStats() {
        return {
            isEnabled: this.isEnabled,
            logLevel: this.logLevel,
            queueSize: this.messageQueue.length,
            isProcessing: this.isProcessing,
            webhookConfigured: !!this.webhookUrl
        };
    }
}

// Export pour utilisation dans d'autres modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = DiscordLogger;
} else if (typeof window !== 'undefined') {
    window.DiscordLogger = DiscordLogger;
}
