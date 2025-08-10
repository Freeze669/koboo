/**
 * Discord Logging System - Système principal d'intégration
 * Initialise et coordonne Discord Logger, Member Tracker et Activity Monitor
 */

class DiscordLoggingSystem {
    constructor(webhookUrl) {
        this.webhookUrl = webhookUrl;
        this.isInitialized = false;
        this.components = {};
        
        // Anti-spam system
        this.spamLogs = {};
        this.spamSummaryTimeout = null;
        
        // Configuration globale
        this.config = {
            enableDiscordLogging: true,
            enableMemberTracking: true,
            enableActivityMonitoring: true,
            enablePerformanceTracking: true,
            enableErrorTracking: true,
            enableCommandTracking: true,
            enableFileUploadTracking: true,
            enableNavigationTracking: true,
            enableFormTracking: true,
            enableClickTracking: true,
            enableScrollTracking: true,
            enableKeypressTracking: true,
            enableMouseTracking: true,
            enableHeartbeat: true,
            heartbeatInterval: 300000, // 5 minutes
            maxLogLevel: 'INFO', // DEBUG, INFO, WARN, ERROR
            autoCleanup: true,
            cleanupInterval: 600000, // 10 minutes
            storageEnabled: true,
            maxStorageSize: 50 * 1024 * 1024, // 50MB
            webhookRetryAttempts: 3,
            webhookRetryDelay: 1000
        };
        
        this.init();
    }
    
    /**
     * Initialisation du système
     */
    async init() {
        try {
            console.log('🚀 Initialisation du système de logging Discord...');
            
            // Vérifier la configuration
            this.validateConfig();
            
            // Initialiser les composants
            await this.initializeComponents();
            
            // Configurer les événements globaux
            this.setupGlobalEvents();
            
            // Démarrer les services
            this.startServices();
            
            // Marquer comme initialisé
            this.isInitialized = true;
            
            console.log('✅ Système de logging Discord initialisé avec succès');
            
            // Envoyer un message de démarrage
            await this.sendStartupMessage();
            
        } catch (error) {
            console.error('❌ Erreur lors de l\'initialisation:', error);
            this.handleInitializationError(error);
        }
    }
    
    /**
     * Validation de la configuration
     */
    validateConfig() {
        if (!this.webhookUrl) {
            throw new Error('URL webhook Discord requise');
        }
        
        if (!this.webhookUrl.includes('discord.com/api/webhooks/')) {
            throw new Error('URL webhook Discord invalide');
        }
        
        console.log('✅ Configuration validée');
    }
    
    /**
     * Initialisation des composants
     */
    async initializeComponents() {
        // Initialiser Discord Logger
        if (this.config.enableDiscordLogging) {
            this.components.discordLogger = new DiscordLogger(this.webhookUrl);
            this.components.discordLogger.setLogLevel(this.config.maxLogLevel);
            console.log('✅ Discord Logger initialisé');
        }
        
        // Initialiser Member Tracker
        if (this.config.enableMemberTracking) {
            this.components.memberTracker = new MemberTracker(this.components.discordLogger);
            console.log('✅ Member Tracker initialisé');
        }
        
        // Initialiser Activity Monitor
        if (this.config.enableActivityMonitoring) {
            this.components.activityMonitor = new ActivityMonitor(this.components.discordLogger);
            
            // Configurer l'Activity Monitor
            this.components.activityMonitor.setConfig({
                trackClicks: this.config.enableClickTracking,
                trackForms: this.config.enableFormTracking,
                trackNavigation: this.config.enableNavigationTracking,
                trackErrors: this.config.enableErrorTracking,
                trackPerformance: this.config.enablePerformanceTracking,
                trackCommands: this.config.enableCommandTracking,
                autoCleanup: this.config.autoCleanup
            });
            
            console.log('✅ Activity Monitor initialisé');
        }
        
        // Initialiser le gestionnaire de stockage
        if (this.config.storageEnabled) {
            this.components.storageManager = new StorageManager();
            console.log('✅ Storage Manager initialisé');
        }
    }
    
    /**
     * Configuration des événements globaux
     */
    setupGlobalEvents() {
        // Gestionnaire d'erreurs global
        window.addEventListener('error', (event) => {
            this.handleGlobalError(event);
        });
        
        // Gestionnaire de promesses rejetées
        window.addEventListener('unhandledrejection', (event) => {
            this.handleUnhandledRejection(event);
        });
        
        // Gestionnaire de visibilité de page
        document.addEventListener('visibilitychange', () => {
            this.handleVisibilityChange();
        });
        
        // Gestionnaire de fermeture de page
        window.addEventListener('beforeunload', () => {
            this.handlePageUnload();
        });
        
        // Gestionnaire de focus/blur
        window.addEventListener('focus', () => {
            this.handleWindowFocus();
        });
        
        window.addEventListener('blur', () => {
            this.handleWindowBlur();
        });
        
        console.log('✅ Événements globaux configurés');
    }
    
    /**
     * Démarrage des services
     */
    startServices() {
        // Démarrer le heartbeat
        if (this.config.enableHeartbeat) {
            this.startHeartbeat();
        }
        
        // Démarrer le nettoyage automatique
        if (this.config.autoCleanup) {
            this.startAutoCleanup();
        }
        
        // Démarrer la surveillance des performances
        if (this.config.enablePerformanceTracking) {
            this.startPerformanceMonitoring();
        }
        
        console.log('✅ Services démarrés');
    }
    
    /**
     * Démarrage du heartbeat
     */
    startHeartbeat() {
        setInterval(() => {
            this.sendHeartbeat();
        }, this.config.heartbeatInterval);
        
        console.log(`💓 Heartbeat démarré (${this.config.heartbeatInterval / 1000}s)`);
    }
    
    /**
     * Démarrage du nettoyage automatique
     */
    startAutoCleanup() {
        setInterval(() => {
            this.performAutoCleanup();
        }, this.config.cleanupInterval);
        
        console.log(`🧹 Nettoyage automatique démarré (${this.config.cleanupInterval / 1000}s)`);
    }
    
    /**
     * Démarrage de la surveillance des performances
     */
    startPerformanceMonitoring() {
        if ('PerformanceObserver' in window) {
            // Surveillance des métriques de performance
            this.observePerformanceMetrics();
        }
        
        console.log('📊 Surveillance des performances démarrée');
    }
    
    /**
     * Observation des métriques de performance
     */
    observePerformanceMetrics() {
        try {
            // Surveillance du temps de chargement
            window.addEventListener('load', () => {
                const loadTime = performance.now();
                this.logPerformanceMetric('page_load', loadTime);
            });
            
            // Surveillance du DOM Content Loaded
            document.addEventListener('DOMContentLoaded', () => {
                const domReadyTime = performance.now();
                this.logPerformanceMetric('dom_ready', domReadyTime);
            });
            
        } catch (error) {
            console.warn('⚠️ Erreur lors de la surveillance des performances:', error);
        }
    }
    
    /**
     * Log d'une métrique de performance
     */
    logPerformanceMetric(metric, value) {
        if (this.components.discordLogger) {
            this.components.discordLogger.log('INFO', `Métrique de performance: ${metric}`, {
                metric: metric,
                value: value,
                unit: 'ms',
                page: window.location.href
            });
        }
    }
    
    /**
     * Envoi du message de démarrage
     */
    async sendStartupMessage() {
        if (!this.components.discordLogger) return;
        
        try {
            const startupEmbed = {
                title: "🚀 Système de Logging Discord Démarre",
                description: "Le système de surveillance et logging est maintenant actif",
                color: 0x00FF00,
                fields: [
                    {
                        name: "🌐 Page",
                        value: window.location.href,
                        inline: false
                    },
                    {
                        name: "⏰ Heure de Démarrage",
                        value: new Date().toLocaleString('fr-FR'),
                        inline: true
                    },
                    {
                        name: "🔧 Composants Actifs",
                        value: Object.keys(this.components).length,
                        inline: true
                    },
                    {
                        name: "📊 Configuration",
                        value: this.getConfigSummary(),
                        inline: false
                    }
                ],
                timestamp: new Date().toISOString(),
                footer: {
                    text: "Discord Logging System"
                }
            };
            
            await this.components.discordLogger.sendDiscordMessage({
                embeds: [startupEmbed]
            });
            
        } catch (error) {
            console.warn('⚠️ Erreur lors de l\'envoi du message de démarrage:', error);
        }
    }
    
    /**
     * Envoi du heartbeat
     */
    async sendHeartbeat() {
        if (!this.components.discordLogger) return;
        
        try {
            const stats = this.getSystemStats();
            
            await this.components.discordLogger.log('INFO', '💓 Heartbeat - Système actif', stats);
            
        } catch (error) {
            console.warn('⚠️ Erreur lors de l\'envoi du heartbeat:', error);
        }
    }
    
    /**
     * Nettoyage automatique
     */
    performAutoCleanup() {
        try {
            // Nettoyage du stockage local
            if (this.components.storageManager) {
                this.components.storageManager.cleanup();
            }
            
            // Nettoyage des composants
            if (this.components.memberTracker) {
                this.components.memberTracker.cleanupInactiveMembers();
            }
            
            // Nettoyage des logs
            this.cleanupOldLogs();
            
            console.log('🧹 Nettoyage automatique effectué');
            
        } catch (error) {
            console.warn('⚠️ Erreur lors du nettoyage automatique:', error);
        }
    }
    
    /**
     * Nettoyage des anciens logs
     */
    cleanupOldLogs() {
        const oneDayAgo = Date.now() - (24 * 60 * 60 * 1000);
        
        // Nettoyer les activités anciennes
        if (this.components.activityMonitor) {
            this.components.activityMonitor.activities = this.components.activityMonitor.activities.filter(
                activity => new Date(activity.timestamp) > new Date(oneDayAgo)
            );
        }
        
        // Nettoyer les commandes anciennes
        if (this.components.activityMonitor) {
            this.components.activityMonitor.commands = this.components.activityMonitor.commands.filter(
                command => new Date(command.timestamp) > new Date(oneDayAgo)
            );
        }
    }
    
    /**
     * Gestionnaire d'erreur globale
     */
    handleGlobalError(event) {
        if (!this.config.enableErrorTracking) return;
        
        const errorData = {
            type: 'Global JavaScript Error',
            message: event.message,
            filename: event.filename,
            lineno: event.lineno,
            colno: event.colno,
            error: event.error?.stack || null,
            page: window.location.href
        };
        
        // Logger l'erreur
        if (this.components.discordLogger) {
            this.components.discordLogger.logError(errorData);
        }
        
        // Logger l'activité
        if (this.components.activityMonitor) {
            this.components.activityMonitor.logActivity({
                type: 'error',
                errorType: 'global',
                message: event.message,
                filename: event.filename,
                lineno: event.lineno,
                colno: event.colno,
                timestamp: new Date().toISOString(),
                page: window.location.href
            });
        }
    }
    
    /**
     * Gestionnaire de promesses rejetées
     */
    handleUnhandledRejection(event) {
        if (!this.config.enableErrorTracking) return;
        
        const errorData = {
            type: 'Unhandled Promise Rejection',
            message: event.reason?.message || 'Promise rejected',
            reason: event.reason,
            page: window.location.href
        };
        
        // Logger l'erreur
        if (this.components.discordLogger) {
            this.components.discordLogger.logError(errorData);
        }
    }
    
    /**
     * Gestionnaire de changement de visibilité
     */
    handleVisibilityChange() {
        const isVisible = !document.hidden;
        const activity = {
            type: 'page_visibility',
            visible: isVisible,
            timestamp: new Date().toISOString(),
            page: window.location.href
        };
        
        if (this.components.activityMonitor) {
            this.components.activityMonitor.logActivity(activity);
        }
    }
    
    /**
     * Gestionnaire de fermeture de page
     */
    handlePageUnload() {
        // Envoyer un message de fermeture
        if (this.components.discordLogger) {
            this.components.discordLogger.log('INFO', '🔴 Page fermée', {
                page: window.location.href,
                timestamp: new Date().toISOString()
            });
        }
        
        // Sauvegarder les données
        this.saveAllData();
    }
    
    /**
     * Gestionnaire de focus de fenêtre
     */
    handleWindowFocus() {
        if (this.components.activityMonitor) {
            this.components.activityMonitor.logActivity({
                type: 'window_focus',
                timestamp: new Date().toISOString(),
                page: window.location.href
            });
        }
    }
    
    /**
     * Gestionnaire de perte de focus de fenêtre
     */
    handleWindowBlur() {
        if (this.components.activityMonitor) {
            this.components.activityMonitor.logActivity({
                type: 'window_blur',
                timestamp: new Date().toISOString(),
                page: window.location.href
            });
        }
    }
    
    /**
     * Gestionnaire d'erreur d'initialisation
     */
    handleInitializationError(error) {
        console.error('❌ Erreur critique d\'initialisation:', error);
        
        // Essayer d'envoyer un message d'erreur via le webhook
        this.sendErrorNotification(error);
    }
    
    /**
     * Envoi de notification d'erreur
     */
    async sendErrorNotification(error) {
        try {
            const errorEmbed = {
                title: "❌ Erreur Critique d'Initialisation",
                description: "Le système de logging n'a pas pu démarrer correctement",
                color: 0xFF0000,
                fields: [
                    {
                        name: "🚨 Erreur",
                        value: error.message || 'Erreur inconnue',
                        inline: false
                    },
                    {
                        name: "📄 Page",
                        value: window.location.href,
                        inline: true
                    },
                    {
                        name: "⏰ Timestamp",
                        value: new Date().toLocaleString('fr-FR'),
                        inline: true
                    }
                ],
                timestamp: new Date().toISOString(),
                footer: {
                    text: "Discord Logging System - Erreur Critique"
                }
            };
            
            // Envoyer directement via fetch
            await fetch(this.webhookUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    embeds: [errorEmbed]
                })
            });
            
        } catch (fetchError) {
            console.error('❌ Impossible d\'envoyer la notification d\'erreur:', fetchError);
        }
    }
    
    /**
     * Sauvegarde de toutes les données
     */
    saveAllData() {
        try {
            if (this.components.storageManager) {
                this.components.storageManager.saveAll();
            }
        } catch (error) {
            console.warn('⚠️ Erreur lors de la sauvegarde:', error);
        }
    }
    
    /**
     * Obtention des statistiques système
     */
    getSystemStats() {
        const stats = {
            timestamp: new Date().toISOString(),
            page: window.location.href,
            userAgent: navigator.userAgent,
            language: navigator.language,
            platform: navigator.platform,
            cookieEnabled: navigator.cookieEnabled,
            onLine: navigator.onLine,
            memory: this.getMemoryInfo(),
            performance: this.getPerformanceInfo()
        };
        
        // Ajouter les stats des composants
        if (this.components.memberTracker) {
            stats.memberStats = this.components.memberTracker.getStats();
        }
        
        if (this.components.activityMonitor) {
            stats.activityStats = this.components.activityMonitor.getStats();
        }
        
        if (this.components.discordLogger) {
            stats.loggerStats = this.components.discordLogger.getStats();
        }
        
        return stats;
    }
    
    /**
     * Obtention des informations mémoire
     */
    getMemoryInfo() {
        if (performance.memory) {
            return {
                used: Math.round(performance.memory.usedJSHeapSize / 1024 / 1024) + 'MB',
                total: Math.round(performance.memory.totalJSHeapSize / 1024 / 1024) + 'MB',
                limit: Math.round(performance.memory.jsHeapSizeLimit / 1024 / 1024) + 'MB'
            };
        }
        return 'Non disponible';
    }
    
    /**
     * Obtention des informations de performance
     */
    getPerformanceInfo() {
        const navigation = performance.getEntriesByType('navigation')[0];
        if (navigation) {
            return {
                loadTime: Math.round(navigation.loadEventEnd - navigation.loadEventStart) + 'ms',
                domReady: Math.round(navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart) + 'ms',
                totalTime: Math.round(navigation.loadEventEnd - navigation.navigationStart) + 'ms'
            };
        }
        return 'Non disponible';
    }
    
    /**
     * Résumé de la configuration
     */
    getConfigSummary() {
        const activeComponents = Object.keys(this.components).length;
        const totalConfigs = Object.keys(this.config).length;
        const activeConfigs = Object.values(this.config).filter(Boolean).length;
        
        return `${activeComponents} composants actifs, ${activeConfigs}/${totalConfigs} options activées`;
    }
    
    /**
     * Test de la connectivité Discord
     */
    async testDiscordConnection() {
        if (!this.webhookUrl) {
            throw new Error('URL webhook non configurée');
        }
        
        try {
            const testEmbed = {
                title: "🧪 Test de Connexion Discord",
                description: "Ce message teste la connectivité avec le webhook Discord",
                color: 0x00BFFF,
                timestamp: new Date().toISOString(),
                footer: {
                    text: "Test de Connexion"
                }
            };
            
            const response = await fetch(this.webhookUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    embeds: [testEmbed]
                })
            });
            
            if (response.ok) {
                console.log('✅ Test de connexion Discord réussi');
                return true;
            } else {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }
            
        } catch (error) {
            console.error('❌ Test de connexion Discord échoué:', error);
            throw error;
        }
    }
    
    /**
     * Méthode de logging principale avec filtrage anti-spam
     */
    async log(level, message, data = {}) {
        try {
            if (!this.isInitialized) {
                console.warn('⚠️ Système non initialisé, log ignoré:', message);
                return false;
            }

            // Filtrage anti-spam
            if (this.isSpam(message, level)) {
                this.addToSpamLog(level, message, data);
                return true; // Log accepté mais pas envoyé immédiatement
            }

            // Utiliser le Discord Logger si disponible
            if (this.components.discordLogger && this.components.discordLogger.log) {
                return await this.components.discordLogger.log(level, message, data);
            }

            // Fallback: envoyer directement au webhook
            const embed = this.createLogEmbed(level, message, data);
            return await this.sendWebhookDirectly(embed);

        } catch (error) {
            console.error('❌ Erreur lors du logging:', error);
            return false;
        }
    }

    /**
     * Vérifier si un log est considéré comme spam
     */
    isSpam(message, level) {
        const now = Date.now();
        const key = `${level}_${message}`;
        
        // Nettoyer les anciens logs
        this.cleanupSpamLogs();
        
        // Vérifier la fréquence
        if (!this.spamLogs[key]) {
            this.spamLogs[key] = [];
        }
        
        // Ajouter le timestamp actuel
        this.spamLogs[key].push(now);
        
        // Garder seulement les logs des 5 dernières minutes
        this.spamLogs[key] = this.spamLogs[key].filter(time => now - time < 300000);
        
        // Considérer comme spam si plus de 3 logs identiques en 5 minutes
        return this.spamLogs[key].length > 3;
    }

    /**
     * Ajouter un log au système anti-spam
     */
    addToSpamLog(level, message, data) {
        const key = `${level}_${message}`;
        if (!this.spamLogs[key]) {
            this.spamLogs[key] = [];
        }
        
        this.spamLogs[key].push({
            timestamp: Date.now(),
            data: data
        });
        
        // Envoyer un résumé périodiquement
        this.scheduleSpamSummary();
    }

    /**
     * Programmer un résumé des logs spam
     */
    scheduleSpamSummary() {
        if (this.spamSummaryTimeout) return;
        
        this.spamSummaryTimeout = setTimeout(() => {
            this.sendSpamSummary();
            this.spamSummaryTimeout = null;
        }, 60000); // Résumé toutes les minutes
    }

    /**
     * Envoyer un résumé des logs spam
     */
    async sendSpamSummary() {
        try {
            const summaries = [];
            
            for (const [key, logs] of Object.entries(this.spamLogs)) {
                if (logs.length > 3) {
                    const [level, message] = key.split('_', 2);
                    const count = logs.length;
                    const lastLog = logs[logs.length - 1];
                    
                    summaries.push({
                        level,
                        message,
                        count,
                        lastData: lastLog.data,
                        timeRange: '5 minutes'
                    });
                }
            }
            
            if (summaries.length > 0) {
                const embed = this.createSpamSummaryEmbed(summaries);
                await this.sendWebhookDirectly(embed);
                
                // Nettoyer après envoi
                this.cleanupSpamLogs();
            }
        } catch (error) {
            console.error('❌ Erreur envoi résumé spam:', error);
        }
    }

    /**
     * Créer un embed pour le résumé des logs spam
     */
    createSpamSummaryEmbed(summaries) {
        return {
            title: '📊 Résumé des Activités Récurrentes',
            description: 'Activités détectées plusieurs fois dans les 5 dernières minutes',
            color: 0x10B981,
            timestamp: new Date().toISOString(),
            fields: summaries.slice(0, 10).map(summary => ({
                name: `${summary.level.toUpperCase()} - ${summary.message}`,
                value: `**${summary.count}x** en ${summary.timeRange}`,
                inline: true
            })),
            footer: {
                text: "Admin Panel - MAYU & JACK STUDIO - Anti-Spam"
            }
        };
    }

    /**
     * Nettoyer les anciens logs spam
     */
    cleanupSpamLogs() {
        const now = Date.now();
        const cutoff = now - 300000; // 5 minutes
        
        for (const [key, logs] of Object.entries(this.spamLogs)) {
            this.spamLogs[key] = logs.filter(log => 
                typeof log === 'number' ? log > cutoff : log.timestamp > cutoff
            );
            
            if (this.spamLogs[key].length === 0) {
                delete this.spamLogs[key];
            }
        }
    }
    
    /**
     * Créer un embed pour le log
     */
    createLogEmbed(level, message, data) {
        const colors = {
            'DEBUG': 0x6B7280,
            'INFO': 0x3B82F6,
            'WARN': 0xF59E0B,
            'ERROR': 0xEF4444
        };
        
        return {
            title: `📝 ${level.toUpperCase()}`,
            description: message,
            color: colors[level.toUpperCase()] || colors['INFO'],
            timestamp: new Date().toISOString(),
            fields: Object.entries(data).map(([key, value]) => ({
                name: key,
                value: typeof value === 'object' ? JSON.stringify(value, null, 2) : String(value),
                inline: true
            })).slice(0, 10), // Limiter à 10 champs
            footer: {
                text: "Admin Panel - MAYU & JACK STUDIO"
            }
        };
    }
    
    /**
     * Envoyer directement au webhook
     */
    async sendWebhookDirectly(embed) {
        try {
            const response = await fetch(this.webhookUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    embeds: [embed]
                })
            });
            
            return response.ok;
        } catch (error) {
            console.error('❌ Erreur envoi webhook:', error);
            return false;
        }
    }

    /**
     * Obtention des statistiques complètes
     */
    getCompleteStats() {
        return {
            system: this.getSystemStats(),
            components: this.getComponentStats(),
            config: this.config,
            status: {
                isInitialized: this.isInitialized,
                webhookConfigured: !!this.webhookUrl,
                timestamp: new Date().toISOString()
            }
        };
    }
    
    /**
     * Obtention des statistiques des composants
     */
    getComponentStats() {
        const componentStats = {};
        
        for (const [name, component] of Object.entries(this.components)) {
            if (component.getStats) {
                componentStats[name] = component.getStats();
            } else {
                componentStats[name] = { status: 'active', methods: Object.getOwnPropertyNames(Object.getPrototypeOf(component)) };
            }
        }
        
        return componentStats;
    }
    
    /**
     * Export de toutes les données
     */
    exportAllData() {
        const exportData = {
            system: this.getCompleteStats(),
            timestamp: new Date().toISOString(),
            version: '1.0.0'
        };
        
        // Ajouter les données des composants
        if (this.components.memberTracker) {
            exportData.members = this.components.memberTracker.exportData();
        }
        
        if (this.components.activityMonitor) {
            exportData.activities = this.components.activityMonitor.exportData();
        }
        
        return exportData;
    }
    
    /**
     * Réinitialisation complète du système
     */
    async reset() {
        try {
            console.log('🔄 Réinitialisation du système...');
            
            // Arrêter les services
            this.stopServices();
            
            // Réinitialiser les composants
            for (const [name, component] of Object.entries(this.components)) {
                if (component.reset) {
                    component.reset();
                }
            }
            
            // Nettoyer le stockage
            if (this.components.storageManager) {
                this.components.storageManager.clearAll();
            }
            
            // Réinitialiser l'état
            this.isInitialized = false;
            
            // Redémarrer
            await this.init();
            
            console.log('✅ Système réinitialisé avec succès');
            
        } catch (error) {
            console.error('❌ Erreur lors de la réinitialisation:', error);
            throw error;
        }
    }
    
    /**
     * Arrêt des services
     */
    stopServices() {
        // Arrêter les intervalles (simulation)
        console.log('🛑 Services arrêtés');
    }
    
    /**
     * Configuration du système
     */
    configure(newConfig) {
        this.config = { ...this.config, ...newConfig };
        console.log('🔧 Configuration mise à jour:', this.config);
        
        // Appliquer la configuration aux composants
        this.applyConfigToComponents();
    }
    
    /**
     * Application de la configuration aux composants
     */
    applyConfigToComponents() {
        if (this.components.activityMonitor) {
            this.components.activityMonitor.setConfig({
                trackClicks: this.config.enableClickTracking,
                trackForms: this.config.enableFormTracking,
                trackNavigation: this.config.enableNavigationTracking,
                trackErrors: this.config.enableErrorTracking,
                trackPerformance: this.config.enablePerformanceTracking,
                trackCommands: this.config.enableCommandTracking,
                autoCleanup: this.config.autoCleanup
            });
        }
        
        if (this.components.discordLogger) {
            this.components.discordLogger.setLogLevel(this.config.maxLogLevel);
        }
    }
}

/**
 * Storage Manager - Gestionnaire de stockage local
 */
class StorageManager {
    constructor() {
        this.storageKeys = {
            memberTracker: 'memberTracker_',
            activityMonitor: 'activityMonitor_',
            discordLogger: 'discordLogger_',
            systemConfig: 'discordLoggingSystem_'
        };
        
        this.maxStorageSize = 50 * 1024 * 1024; // 50MB
    }
    
    /**
     * Sauvegarde de toutes les données
     */
    saveAll() {
        try {
            // Sauvegarder la configuration système
            localStorage.setItem(this.storageKeys.systemConfig + 'config', JSON.stringify({
                timestamp: new Date().toISOString(),
                version: '1.0.0'
            }));
            
            console.log('💾 Données sauvegardées');
            
        } catch (error) {
            console.warn('⚠️ Erreur lors de la sauvegarde:', error);
        }
    }
    
    /**
     * Nettoyage du stockage
     */
    cleanup() {
        try {
            const currentSize = this.getStorageSize();
            
            if (currentSize > this.maxStorageSize) {
                // Supprimer les anciennes données
                this.removeOldData();
                console.log('🧹 Stockage nettoyé');
            }
            
        } catch (error) {
            console.warn('⚠️ Erreur lors du nettoyage:', error);
        }
    }
    
    /**
     * Obtention de la taille du stockage
     */
    getStorageSize() {
        let totalSize = 0;
        
        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            if (key) {
                totalSize += localStorage.getItem(key).length;
            }
        }
        
        return totalSize;
    }
    
    /**
     * Suppression des anciennes données
     */
    removeOldData() {
        const oneDayAgo = Date.now() - (24 * 60 * 60 * 1000);
        
        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            if (key && key.includes('discordLoggingSystem_')) {
                try {
                    const data = JSON.parse(localStorage.getItem(key));
                    if (data.timestamp && new Date(data.timestamp) < new Date(oneDayAgo)) {
                        localStorage.removeItem(key);
                    }
                } catch (error) {
                    // Ignorer les erreurs de parsing
                }
            }
        }
    }
    
    /**
     * Effacement de tout le stockage
     */
    clearAll() {
        try {
            for (let i = 0; i < localStorage.length; i++) {
                const key = localStorage.key(i);
                if (key && key.includes('discordLoggingSystem_')) {
                    localStorage.removeItem(key);
                }
            }
            
            console.log('🗑️ Stockage effacé');
            
        } catch (error) {
            console.warn('⚠️ Erreur lors de l\'effacement:', error);
        }
    }
}

// Export pour utilisation dans d'autres modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { DiscordLoggingSystem, StorageManager };
} else if (typeof window !== 'undefined') {
    window.DiscordLoggingSystem = DiscordLoggingSystem;
    window.StorageManager = StorageManager;
}
