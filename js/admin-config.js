// ===== CONFIGURATION ADMINISTRATEUR AVANCÉE - MAYU & JACK STUDIO =====
// Système de monitoring en temps réel avec vraies informations du site et logging Discord

const ADMIN_CONFIG = {
    // Configuration de sécurité
    security: {
        adminCode: "DF505",
        maxLoginAttempts: 3,
        lockoutDuration: 30000,
        sessionDuration: 7200000,
        forbiddenKeywords: ["admin", "password", "1234", "test"]
    },

    // Configuration Discord Webhook
    discord: {
        webhookUrl: "https://discord.com/api/webhooks/1404106149908709537/P13SLEmuSEh5xcPtH9WCYd0ANluBicjSal-Xt3ESqzU7jJZ9jG3i31ENiNyLlZGQWBp1",
        enabled: true,
        logLevel: "INFO", // DEBUG, INFO, WARN, ERROR
        sendRealTimeUpdates: true,
        sendPerformanceMetrics: true,
        sendUserActivity: true,
        sendSystemStatus: true,
        sendErrorLogs: true,
        sendHeartbeat: true,
        heartbeatInterval: 300000, // 5 minutes
        maxRetryAttempts: 3,
        retryDelay: 1000
    },

    // Configuration des données en temps réel
    data: {
        realTimeUpdateInterval: 2000, // 2 secondes
        systemUpdateInterval: 5000,   // 5 secondes
        performanceUpdateInterval: 1000, // 1 seconde
        activityHistoryLimit: 200,
        maxDataPoints: 1000,
        
        // Données réelles du site (mises à jour dynamiquement)
        realSiteData: {
            visitors: [],
            pageViews: [],
            forms: [],
            sessions: [],
            errors: [],
            performance: [],
            userActivity: [],
            systemMetrics: []
        }
    },

    // Configuration de l'interface
    ui: {
        theme: "dark",
        animationsEnabled: true,
        particlesEnabled: true,
        particleCount: 15,
        colors: {
            primary: "#60a5fa",
            secondary: "#a78bfa",
            success: "#10b981",
            warning: "#fbbf24",
            error: "#ef4444",
            background: "#0f172a"
        },
        showNotifications: false, // Désactiver les notifications d'erreur
        showConsoleLogs: false,   // Désactiver les logs console
        autoRefresh: true,
        refreshInterval: 5000
    },

    // Configuration des notifications
    notifications: {
        displayDuration: 3000,
        position: "top-right",
        types: ["info", "success", "warning"], // Supprimé "error"
        silentMode: true // Mode silencieux pour éviter les erreurs
    },

    // Configuration des raccourcis clavier
    shortcuts: {
        refresh: "Ctrl+R",
        export: "Ctrl+E",
        settings: "Ctrl+S",
        help: "F1",
        back: "Escape"
    },

    // Configuration des sections
    sections: {
        dashboard: {
            name: "Tableau de bord",
            icon: "fas fa-tachometer-alt",
            enabled: true
        },
        analytics: {
            name: "Analytics",
            icon: "fas fa-chart-line",
            enabled: true
        },
        users: {
            name: "Utilisateurs",
            icon: "fas fa-users",
            enabled: true
        },
        settings: {
            name: "Paramètres",
            icon: "fas fa-cog",
            enabled: true
        },
        discord: {
            name: "Discord Logs",
            icon: "fab fa-discord",
            enabled: true
        }
    },

    // Configuration des actions rapides
    quickActions: {
        backup: {
            name: "Sauvegarde",
            icon: "fas fa-database",
            enabled: true,
            duration: 2000
        },
        optimize: {
            name: "Optimiser",
            icon: "fas fa-rocket",
            enabled: true,
            duration: 3000
        },
        refresh: {
            name: "Actualiser",
            icon: "fas fa-sync-alt",
            enabled: true,
            duration: 1000
        },
        export: {
            name: "Exporter",
            icon: "fas fa-download",
            enabled: true,
            duration: 2000
        }
    },

    // Configuration des métriques système
    systemMetrics: {
        cpu: {
            enabled: true,
            updateInterval: 2000,
            maxHistory: 100
        },
        memory: {
            enabled: true,
            updateInterval: 2000,
            maxHistory: 100
        },
        performance: {
            enabled: true,
            updateInterval: 1000,
            maxHistory: 200
        },
        network: {
            enabled: true,
            updateInterval: 5000,
            maxHistory: 50
        }
    },

    // Configuration des alertes
    alerts: {
        enabled: true,
        thresholds: {
            cpu: 80,
            memory: 85,
            errors: 5,
            responseTime: 3000
        },
        discordNotifications: true,
        emailNotifications: false
    }
};

// ===== UTILITAIRES ADMINISTRATEUR =====
class AdminUtils {
    constructor() {
        this.discordLogger = null;
        this.isInitialized = false;
        this.dataCollector = null;
        this.init();
    }

    /**
     * Valider le code d'accès administrateur
     */
    validateAdminCode(code) {
        return code === ADMIN_CONFIG.security.adminCode;
    }

    /**
     * Valider les entrées utilisateur
     */
    validateInput(input, type = 'text') {
        if (!input || typeof input !== 'string') return false;
        
        const trimmed = input.trim();
        if (trimmed.length === 0) return false;
        
        // Vérifier les mots-clés interdits
        const forbidden = ADMIN_CONFIG.security.forbiddenKeywords.some(keyword => 
            trimmed.toLowerCase().includes(keyword.toLowerCase())
        );
        
        if (forbidden) return false;
        
        // Validation spécifique par type
        switch (type) {
            case 'code':
                return trimmed.length >= 3 && trimmed.length <= 20;
            case 'text':
                return trimmed.length <= 100;
            default:
                return true;
        }
    }

    /**
     * Démarrer une session administrateur
     */
    startSession() {
        const sessionToken = this.generateSessionToken();
        const sessionData = {
            token: sessionToken,
            startTime: Date.now(),
            expiresAt: Date.now() + ADMIN_CONFIG.security.sessionDuration,
            userAgent: navigator.userAgent,
            ip: 'client-side'
        };
        
        // Stocker en session
        sessionStorage.setItem('admin_session', JSON.stringify(sessionData));
        
        // Logger la session
        this.log('info', 'Session administrateur démarrée', sessionData);
        
        return sessionToken;
    }

    /**
     * Générer un token de session unique
     */
    generateSessionToken() {
        const timestamp = Date.now();
        const random = Math.random().toString(36).substring(2);
        return `admin_${timestamp}_${random}`;
    }

    /**
     * Logger les événements
     */
    log(level, message, data = {}) {
        const logEntry = {
            level: level.toUpperCase(),
            message,
            data,
            timestamp: new Date().toISOString(),
            url: window.location.href
        };
        
        // Console log si activé
        if (ADMIN_CONFIG.ui.showConsoleLogs) {
            const emoji = {
                'info': 'ℹ️',
                'success': '✅',
                'warn': '⚠️',
                'error': '❌'
            };
            console.log(`${emoji[level] || '📝'} ${message}`, data);
        }
        
        // Envoyer à Discord si disponible
        if (this.discordLogger && ADMIN_CONFIG.discord.enabled) {
            try {
                this.discordLogger.log(level, message, data);
            } catch (error) {
                console.warn('⚠️ Erreur envoi Discord:', error);
            }
        }
        
        // Stocker localement
        this.storeLogEntry(logEntry);
    }

    /**
     * Stocker une entrée de log localement
     */
    storeLogEntry(logEntry) {
        try {
            const logs = JSON.parse(localStorage.getItem('adminLogs') || '[]');
            logs.push(logEntry);
            
            // Limiter le nombre de logs stockés
            if (logs.length > 100) {
                logs.splice(0, logs.length - 100);
            }
            
            localStorage.setItem('adminLogs', JSON.stringify(logs));
        } catch (error) {
            console.warn('⚠️ Erreur stockage log:', error);
        }
    }

    /**
     * Initialisation du système
     */
    async init() {
        try {
            console.log('🚀 Initialisation du système admin...');
            
            // Initialiser le logger Discord si activé
            if (ADMIN_CONFIG.discord.enabled) {
                await this.initializeDiscordLogger();
            }
            
            // Initialiser le collecteur de données
            this.initializeDataCollector();
            
            // Démarrer la collecte en temps réel
            this.startRealTimeDataCollection();
            
            this.isInitialized = true;
            console.log('✅ Système admin initialisé');
            
        } catch (error) {
            console.warn('⚠️ Erreur d\'initialisation admin:', error);
            // Ne pas afficher d'erreur à l'utilisateur
        }
    }

    /**
     * Initialisation du logger Discord
     */
    async initializeDiscordLogger() {
        try {
            // Charger le système de logging Discord
            if (typeof DiscordLoggingSystem !== 'undefined') {
                this.discordLogger = new DiscordLoggingSystem(ADMIN_CONFIG.discord.webhookUrl);
                console.log('✅ Logger Discord initialisé');
            } else {
                console.warn('⚠️ Système Discord non disponible');
            }
        } catch (error) {
            console.warn('⚠️ Erreur Discord Logger:', error);
        }
    }

    /**
     * Initialisation du collecteur de données
     */
    initializeDataCollector() {
        this.dataCollector = {
            startTime: Date.now(),
            pageLoads: 0,
            userInteractions: 0,
            errors: 0,
            performance: [],
            visitors: new Set(),
            sessions: new Map()
        };
    }

    /**
     * Démarrer la collecte de données en temps réel
     */
    startRealTimeDataCollection() {
        // Collecter les données de performance
        this.collectPerformanceData();
        
        // Collecter les données utilisateur
        this.collectUserData();
        
        // Collecter les données système
        this.collectSystemData();
        
        // Mettre à jour les données en temps réel
        setInterval(() => {
            this.updateRealTimeData();
        }, ADMIN_CONFIG.data.realTimeUpdateInterval);
    }

    /**
     * Collecter les données de performance
     */
    collectPerformanceData() {
        if ('performance' in window) {
            const observer = new PerformanceObserver((list) => {
                for (const entry of list.getEntries()) {
                    this.dataCollector.performance.push({
                        name: entry.name,
                        type: entry.entryType,
                        value: entry.duration || entry.value,
                        timestamp: Date.now()
                    });
                    
                    // Limiter l'historique
                    if (this.dataCollector.performance.length > ADMIN_CONFIG.data.maxDataPoints) {
                        this.dataCollector.performance.shift();
                    }
                }
            });
            
            observer.observe({ entryTypes: ['navigation', 'resource', 'paint', 'largest-contentful-paint'] });
        }
    }

    /**
     * Collecter les données utilisateur
     */
    collectUserData() {
        // Tracker les clics
        document.addEventListener('click', (e) => {
            this.dataCollector.userInteractions++;
            this.trackUserActivity('click', e.target.tagName, e.target.textContent?.substring(0, 50));
        });

        // Tracker les formulaires
        document.addEventListener('submit', (e) => {
            this.dataCollector.userInteractions++;
            this.trackUserActivity('form_submit', e.target.tagName, e.target.action);
        });

        // Tracker la navigation
        window.addEventListener('popstate', () => {
            this.trackUserActivity('navigation', 'popstate', window.location.pathname);
        });
    }

    /**
     * Collecter les données système
     */
    collectSystemData() {
        // Tracker les erreurs
        window.addEventListener('error', (e) => {
            this.dataCollector.errors++;
            this.trackError('javascript_error', e.message, e.filename);
        });

        // Tracker les rejets de promesses
        window.addEventListener('unhandledrejection', (e) => {
            this.dataCollector.errors++;
            this.trackError('promise_rejection', e.reason, 'promise');
        });
    }

    /**
     * Tracker l'activité utilisateur
     */
    trackUserActivity(type, target, details) {
        const activity = {
            type,
            target,
            details,
            timestamp: Date.now(),
            url: window.location.href,
            userAgent: navigator.userAgent
        };

        ADMIN_CONFIG.data.realSiteData.userActivity.push(activity);
        
        // Limiter l'historique
        if (ADMIN_CONFIG.data.realSiteData.userActivity.length > ADMIN_CONFIG.data.activityHistoryLimit) {
            ADMIN_CONFIG.data.realSiteData.userActivity.shift();
        }

        // Envoyer à Discord si activé
        if (this.discordLogger && ADMIN_CONFIG.discord.sendUserActivity) {
            this.discordLogger.logActivity(activity);
        }
    }

    /**
     * Tracker les erreurs
     */
    trackError(type, message, source) {
        const error = {
            type,
            message,
            source,
            timestamp: Date.now(),
            url: window.location.href,
            stack: new Error().stack
        };

        ADMIN_CONFIG.data.realSiteData.errors.push(error);
        
        // Limiter l'historique
        if (ADMIN_CONFIG.data.realSiteData.errors.length > ADMIN_CONFIG.data.activityHistoryLimit) {
            ADMIN_CONFIG.data.realSiteData.errors.shift();
        }

        // Envoyer à Discord si activé
        if (this.discordLogger && ADMIN_CONFIG.discord.sendErrorLogs) {
            this.discordLogger.logError(error);
        }
    }

    /**
     * Mettre à jour les données en temps réel
     */
    updateRealTimeData() {
        // Mettre à jour les visiteurs
        this.updateVisitors();
        
        // Mettre à jour les vues de page
        this.updatePageViews();
        
        // Mettre à jour les sessions
        this.updateSessions();
        
        // Mettre à jour les métriques système
        this.updateSystemMetrics();
        
        // Envoyer les données à Discord
        this.sendDataToDiscord();
    }

    /**
     * Mettre à jour les visiteurs
     */
    updateVisitors() {
        const visitorId = this.generateVisitorId();
        this.dataCollector.visitors.add(visitorId);
        
        ADMIN_CONFIG.data.realSiteData.visitors = Array.from(this.dataCollector.visitors);
    }

    /**
     * Mettre à jour les vues de page
     */
    updatePageViews() {
        const pageView = {
            url: window.location.href,
            title: document.title,
            timestamp: Date.now(),
            referrer: document.referrer
        };
        
        ADMIN_CONFIG.data.realSiteData.pageViews.push(pageView);
        
        if (ADMIN_CONFIG.data.realSiteData.pageViews.length > ADMIN_CONFIG.data.activityHistoryLimit) {
            ADMIN_CONFIG.data.realSiteData.pageViews.shift();
        }
    }

    /**
     * Mettre à jour les sessions
     */
    updateSessions() {
        const sessionId = this.getSessionId();
        const session = this.dataCollector.sessions.get(sessionId) || {
            id: sessionId,
            startTime: Date.now(),
            pageViews: 0,
            interactions: 0
        };
        
        session.pageViews++;
        session.interactions = this.dataCollector.userInteractions;
        session.lastActivity = Date.now();
        
        this.dataCollector.sessions.set(sessionId, session);
        
        ADMIN_CONFIG.data.realSiteData.sessions = Array.from(this.dataCollector.sessions.values());
    }

    /**
     * Mettre à jour les métriques système
     */
    updateSystemMetrics() {
        const metrics = {
            timestamp: Date.now(),
            uptime: Date.now() - this.dataCollector.startTime,
            memory: this.getMemoryUsage(),
            performance: this.getPerformanceMetrics(),
            errors: this.dataCollector.errors,
            interactions: this.dataCollector.userInteractions
        };
        
        ADMIN_CONFIG.data.realSiteData.systemMetrics.push(metrics);
        
        if (ADMIN_CONFIG.data.realSiteData.systemMetrics.length > ADMIN_CONFIG.data.activityHistoryLimit) {
            ADMIN_CONFIG.data.realSiteData.systemMetrics.shift();
        }
    }

    /**
     * Obtenir l'utilisation mémoire
     */
    getMemoryUsage() {
        if ('memory' in performance) {
            return {
                used: performance.memory.usedJSHeapSize,
                total: performance.memory.totalJSHeapSize,
                limit: performance.memory.jsHeapSizeLimit
            };
        }
        return { used: 0, total: 0, limit: 0 };
    }

    /**
     * Obtenir les métriques de performance
     */
    getPerformanceMetrics() {
        const metrics = {};
        
        if ('performance' in window) {
            const navigation = performance.getEntriesByType('navigation')[0];
            if (navigation) {
                metrics.loadTime = navigation.loadEventEnd - navigation.loadEventStart;
                metrics.domContentLoaded = navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart;
                metrics.firstPaint = performance.getEntriesByType('paint')[0]?.startTime || 0;
            }
        }
        
        return metrics;
    }

    /**
     * Envoyer les données à Discord
     */
    async sendDataToDiscord() {
        if (!this.discordLogger || !ADMIN_CONFIG.discord.sendRealTimeUpdates) {
            return;
        }

        try {
            const summary = {
                visitors: this.dataCollector.visitors.size,
                pageViews: ADMIN_CONFIG.data.realSiteData.pageViews.length,
                sessions: this.dataCollector.sessions.size,
                errors: this.dataCollector.errors,
                interactions: this.dataCollector.userInteractions,
                uptime: Date.now() - this.dataCollector.startTime
            };

            await this.discordLogger.logActivity({
                type: 'admin_summary',
                details: `Résumé admin: ${summary.visitors} visiteurs, ${summary.pageViews} vues, ${summary.sessions} sessions`,
                timestamp: Date.now()
            });
        } catch (error) {
            console.warn('⚠️ Erreur envoi Discord:', error);
        }
    }

    /**
     * Générer un ID visiteur unique
     */
    generateVisitorId() {
        let id = localStorage.getItem('visitor_id');
        if (!id) {
            id = 'visitor_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
            localStorage.setItem('visitor_id', id);
        }
        return id;
    }

    /**
     * Obtenir l'ID de session
     */
    getSessionId() {
        let sessionId = sessionStorage.getItem('session_id');
        if (!sessionId) {
            sessionId = 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
            sessionStorage.setItem('session_id', sessionId);
        }
        return sessionId;
    }

    /**
     * Obtenir les vraies données du site
     */
    getRealSiteData() {
        return {
            visitors: this.dataCollector.visitors.size,
            pageViews: ADMIN_CONFIG.data.realSiteData.pageViews.length,
            sessions: this.dataCollector.sessions.size,
            errors: this.dataCollector.errors,
            interactions: this.dataCollector.userInteractions,
            uptime: Date.now() - this.dataCollector.startTime,
            currentUrl: window.location.href,
            userAgent: navigator.userAgent,
            timestamp: Date.now()
        };
    }

    /**
     * Obtenir l'utilisation mémoire
     */
    getMemoryUsage() {
        if ('memory' in performance) {
            const memory = performance.memory;
            return {
                used: this.formatBytes(memory.usedJSHeapSize),
                total: this.formatBytes(memory.totalJSHeapSize),
                limit: this.formatBytes(memory.jsHeapSizeLimit),
                percentage: Math.round((memory.usedJSHeapSize / memory.jsHeapSizeLimit) * 100)
            };
        }
        return { used: 'N/A', total: 'N/A', limit: 'N/A', percentage: 0 };
    }

    /**
     * Obtenir l'utilisation CPU (simulation)
     */
    getCPUUsage() {
        // Simulation basée sur l'activité
        const activity = this.dataCollector.userInteractions;
        const baseUsage = 15; // Usage de base
        const activityFactor = Math.min(activity * 0.5, 30); // Max 30% d'activité
        return Math.round(baseUsage + activityFactor);
    }

    /**
     * Obtenir le temps de fonctionnement
     */
    getUptime() {
        const uptime = Date.now() - this.dataCollector.startTime;
        return this.formatUptime(uptime);
    }

    /**
     * Obtenir le temps de chargement de la page
     */
    getPageLoadTime() {
        if ('performance' in window) {
            const navigation = performance.getEntriesByType('navigation')[0];
            if (navigation) {
                return Math.round(navigation.loadEventEnd - navigation.loadEventStart);
            }
        }
        return 0;
    }

    /**
     * Formater les bytes
     */
    formatBytes(bytes) {
        if (bytes === 0) return '0 B';
        const k = 1024;
        const sizes = ['B', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }

    /**
     * Formater le temps de fonctionnement
     */
    formatUptime(milliseconds) {
        const seconds = Math.floor(milliseconds / 1000);
        const minutes = Math.floor(seconds / 60);
        const hours = Math.floor(minutes / 60);
        const days = Math.floor(hours / 24);

        if (days > 0) return `${days}j ${hours % 24}h ${minutes % 60}m`;
        if (hours > 0) return `${hours}h ${minutes % 60}m ${seconds % 60}s`;
        if (minutes > 0) return `${minutes}m ${seconds % 60}s`;
        return `${seconds}s`;
    }

    /**
     * Obtenir les statistiques en temps réel
     */
    getRealTimeStats() {
        return {
            visitors: this.dataCollector.visitors.size,
            pageViews: ADMIN_CONFIG.data.realSiteData.pageViews.length,
            sessions: this.dataCollector.sessions.size,
            errors: this.dataCollector.errors,
            interactions: this.dataCollector.userInteractions,
            uptime: this.getUptime(),
            memory: this.getMemoryUsage(),
            cpu: this.getCPUUsage(),
            loadTime: this.getPageLoadTime(),
            currentUrl: window.location.href,
            timestamp: Date.now()
        };
    }

    /**
     * Exporter toutes les données
     */
    exportAllData() {
        const data = {
            config: ADMIN_CONFIG,
            realTimeData: ADMIN_CONFIG.data.realSiteData,
            collector: this.dataCollector,
            stats: this.getRealTimeStats(),
            exportTime: new Date().toISOString()
        };

        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `admin-data-${Date.now()}.json`;
        a.click();
        URL.revokeObjectURL(url);
    }

    /**
     * Réinitialiser les données
     */
    resetData() {
        this.dataCollector = {
            startTime: Date.now(),
            pageLoads: 0,
            userInteractions: 0,
            errors: 0,
            performance: [],
            visitors: new Set(),
            sessions: new Map()
        };

        ADMIN_CONFIG.data.realSiteData = {
            visitors: [],
            pageViews: [],
            forms: [],
            sessions: [],
            errors: [],
            performance: [],
            userActivity: [],
            systemMetrics: []
        };

        console.log('✅ Données réinitialisées');
    }
}

// ===== INITIALISATION AUTOMATIQUE =====
let adminUtils = null;

// Fonction d'initialisation sécurisée
function initializeAdminUtils() {
    try {
        console.log('🚀 Initialisation de AdminUtils...');
        adminUtils = new AdminUtils();
        
        // Initialiser le système
        adminUtils.init().then(() => {
            console.log('✅ AdminUtils initialisé avec succès');
        }).catch(error => {
            console.error('❌ Erreur lors de l\'initialisation AdminUtils:', error);
        });
        
        return adminUtils;
    } catch (error) {
        console.error('❌ Erreur lors de la création AdminUtils:', error);
        return null;
    }
}

// Initialiser quand le DOM est prêt
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        console.log('📄 DOM chargé, initialisation AdminUtils...');
        adminUtils = initializeAdminUtils();
    });
} else {
    console.log('📄 DOM déjà prêt, initialisation AdminUtils...');
    adminUtils = initializeAdminUtils();
}

// Vérification périodique que adminUtils est disponible
setInterval(() => {
    if (!adminUtils) {
        console.warn('⚠️ AdminUtils non disponible, tentative de réinitialisation...');
        adminUtils = initializeAdminUtils();
    }
}, 5000);

// ===== EXPORT POUR UTILISATION EXTERNE =====
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { ADMIN_CONFIG, AdminUtils };
}
