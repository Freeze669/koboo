/**
 * Site Monitor - Monitoring en temps réel OPTIMISÉ pour GitHub Pages
 * Collecte les vraies informations du site avec des performances améliorées
 */

class SiteMonitor {
    constructor() {
        this.webhookUrl = "https://discord.com/api/webhooks/1404106149908709537/P13SLEmuSEh5xcPtH9WCYd0ANluBicjSal-Xt3ESqzU7jJZ9jG3i31ENiNyLlZGQWB1";
        this.isInitialized = false;
        this.data = {
            startTime: Date.now(),
            visitors: new Set(),
            sessions: new Map(),
            pageViews: [],
            userActivity: [],
            errors: [],
            performance: [],
            systemMetrics: []
        };
        
        this.config = {
            updateInterval: 5000, // Augmenté de 2000 à 5000ms pour réduire la charge
            maxDataPoints: 500, // Réduit de 1000 à 500 pour économiser la mémoire
            sendToDiscord: true,
            logLevel: 'INFO',
            enablePerformanceObserver: true, // Option pour désactiver si nécessaire
            enableRealTimeUpdates: true, // Option pour désactiver si nécessaire
            batchSize: 10, // Traiter les données par lots
            throttleDelay: 1000 // Délai de throttling pour les mises à jour
        };
        
        this.performanceObserver = null;
        this.updateTimeout = null;
        this.batchQueue = [];
        this.lastDiscordSend = 0;
        this.discordThrottle = 5000; // Envoyer à Discord max toutes les 5 secondes
        
        this.init();
    }
    
    /**
     * Initialisation du moniteur optimisée
     */
    init() {
        try {
            console.log('🚀 Initialisation du moniteur de site optimisé...');
            
            // Vérifier les capacités du navigateur
            this.checkBrowserCapabilities();
            
            // Démarrer la collecte de données avec délai
            setTimeout(() => {
                this.startDataCollection();
            }, 100);
            
            // Démarrer les mises à jour en temps réel seulement si activé
            if (this.config.enableRealTimeUpdates) {
                setTimeout(() => {
                    this.startRealTimeUpdates();
                }, 500);
            }
            
            // Configurer les événements avec throttling
            this.setupEventListeners();
            
            this.isInitialized = true;
            console.log('✅ Moniteur de site optimisé initialisé');
            
            // Envoyer le message de démarrage avec délai
            setTimeout(() => {
                this.sendStartupMessage();
            }, 1000);
            
        } catch (error) {
            console.warn('⚠️ Erreur d\'initialisation du moniteur:', error);
        }
    }
    
    /**
     * Vérifier les capacités du navigateur
     */
    checkBrowserCapabilities() {
        // Vérifier si PerformanceObserver est disponible
        if (!('PerformanceObserver' in window)) {
            this.config.enablePerformanceObserver = false;
            console.warn('⚠️ PerformanceObserver non disponible, désactivation du monitoring de performance');
        }
        
        // Vérifier si performance.memory est disponible
        if (!('memory' in performance)) {
            console.warn('⚠️ performance.memory non disponible');
        }
        
        // Vérifier si requestIdleCallback est disponible
        if ('requestIdleCallback' in window) {
            console.log('✅ requestIdleCallback disponible pour l\'optimisation');
        }
    }
    
    /**
     * Démarrer la collecte de données optimisée
     */
    startDataCollection() {
        // Collecter les données de performance seulement si activé
        if (this.config.enablePerformanceObserver) {
            this.collectPerformanceData();
        }
        
        // Collecter les données utilisateur avec délai
        setTimeout(() => {
            this.collectUserData();
        }, 200);
        
        // Collecter les données système avec délai
        setTimeout(() => {
            this.collectSystemData();
        }, 300);
        
        // Tracker les erreurs
        this.trackErrors();
    }
    
    /**
     * Collecter les données de performance optimisées
     */
    collectPerformanceData() {
        if ('performance' in window && this.config.enablePerformanceObserver) {
            try {
                this.performanceObserver = new PerformanceObserver((list) => {
                    // Traiter les entrées par lots pour améliorer les performances
                    const entries = list.getEntries();
                    
                    // Limiter le nombre d'entrées traitées
                    const limitedEntries = entries.slice(0, this.config.batchSize);
                    
                    limitedEntries.forEach(entry => {
                        this.data.performance.push({
                            name: entry.name,
                            type: entry.entryType,
                            value: entry.duration || entry.value || 0,
                            timestamp: Date.now()
                        });
                    });
                    
                    // Limiter l'historique
                    if (this.data.performance.length > this.config.maxDataPoints) {
                        this.data.performance = this.data.performance.slice(-this.config.maxDataPoints);
                    }
                    
                    // Traitement par lots pour les mises à jour
                    this.queueBatchUpdate('performance');
                });
                
                // Observer seulement les métriques essentielles
                this.performanceObserver.observe({ 
                    entryTypes: ['navigation', 'paint', 'largest-contentful-paint'] 
                });
                
                console.log('✅ Observateur de performance activé');
                
            } catch (error) {
                console.warn('⚠️ Erreur lors de l\'initialisation de PerformanceObserver:', error);
                this.config.enablePerformanceObserver = false;
            }
        }
    }
    
    /**
     * Collecter les données utilisateur optimisées
     */
    collectUserData() {
        // Utiliser requestIdleCallback si disponible pour améliorer les performances
        const collectData = () => {
            const visitorId = this.getVisitorId();
            const sessionId = this.getSessionId();
            
            // Ajouter le visiteur
            this.data.visitors.add(visitorId);
            
            // Mettre à jour ou créer la session
            if (!this.data.sessions.has(sessionId)) {
                this.data.sessions.set(sessionId, {
                    id: sessionId,
                    visitorId: visitorId,
                    startTime: Date.now(),
                    lastActivity: Date.now(),
                    pagesVisited: 1,
                    userAgent: navigator.userAgent,
                    language: navigator.language
                });
            } else {
                const session = this.data.sessions.get(sessionId);
                session.lastActivity = Date.now();
                session.pagesVisited++;
            }
            
            // Ajouter la vue de page
            this.data.pageViews.push({
                url: window.location.href,
                title: document.title,
                timestamp: Date.now(),
                sessionId: sessionId
            });
            
            // Limiter l'historique
            if (this.data.pageViews.length > this.config.maxDataPoints) {
                this.data.pageViews = this.data.pageViews.slice(-this.config.maxDataPoints);
            }
        };
        
        if ('requestIdleCallback' in window) {
            requestIdleCallback(collectData, { timeout: 1000 });
        } else {
            collectData();
        }
    }
    
    /**
     * Collecter les données système optimisées
     */
    collectSystemData() {
        const collectSystemData = () => {
            const now = Date.now();
            
            // Collecter les métriques système seulement si elles changent significativement
            const memoryInfo = this.getMemoryInfo();
            const performanceInfo = this.getPerformanceInfo();
            
            // Ajouter seulement si les données ont changé significativement
            const lastMetric = this.data.systemMetrics[this.data.systemMetrics.length - 1];
            if (!lastMetric || 
                Math.abs(lastMetric.memory - memoryInfo.used) > 1024 * 1024 || // 1MB de différence
                Math.abs(lastMetric.loadTime - performanceInfo.loadTime) > 100) { // 100ms de différence
                
                this.data.systemMetrics.push({
                    timestamp: now,
                    memory: memoryInfo.used,
                    memoryTotal: memoryInfo.total,
                    loadTime: performanceInfo.loadTime,
                    domContentLoaded: performanceInfo.domContentLoaded
                });
                
                // Limiter l'historique
                if (this.data.systemMetrics.length > this.config.maxDataPoints) {
                    this.data.systemMetrics = this.data.systemMetrics.slice(-this.config.maxDataPoints);
                }
            }
        };
        
        if ('requestIdleCallback' in window) {
            requestIdleCallback(collectSystemData, { timeout: 1000 });
        } else {
            collectSystemData();
        }
    }
    
    /**
     * Tracker les erreurs optimisé
     */
    trackErrors() {
        // Tracker les erreurs JavaScript
        window.addEventListener('error', (event) => {
            this.trackError('javascript', {
                message: event.message,
                filename: event.filename,
                lineno: event.lineno,
                colno: event.colno,
                error: event.error
            });
        });
        
        // Tracker les promesses rejetées
        window.addEventListener('unhandledrejection', (event) => {
            this.trackError('promise', {
                reason: event.reason,
                promise: event.promise
            });
        });
        
        // Tracker les erreurs de ressources
        window.addEventListener('error', (event) => {
            if (event.target && event.target.tagName) {
                this.trackError('resource', {
                    type: event.target.tagName.toLowerCase(),
                    src: event.target.src || event.target.href,
                    message: 'Erreur de chargement de ressource'
                });
            }
        }, true);
    }
    
    /**
     * Tracker les activités utilisateur optimisé
     */
    trackUserActivity(type, data) {
        const activity = {
            type: type,
            timestamp: Date.now(),
            url: window.location.href,
            sessionId: this.getSessionId(),
            userId: this.getVisitorId(),
            ...data
        };
        
        this.data.userActivity.push(activity);
        
        // Limiter l'historique
        if (this.data.userActivity.length > this.config.maxDataPoints) {
            this.data.userActivity = this.data.userActivity.slice(-this.config.maxDataPoints);
        }
        
        // Mettre à jour la session
        const sessionId = this.getSessionId();
        if (this.data.sessions.has(sessionId)) {
            const session = this.data.sessions.get(sessionId);
            session.lastActivity = Date.now();
        }
        
        // Traitement par lots pour les mises à jour
        this.queueBatchUpdate('userActivity');
        
        // Envoyer immédiatement à Discord si c'est une soumission de formulaire
        if (type === 'form_submit' || type === 'form') {
            this.sendToDiscord(type, data);
        }
    }
    
    /**
     * Tracker les erreurs optimisé
     */
    trackError(type, data) {
        const error = {
            type: type,
            timestamp: Date.now(),
            url: window.location.href,
            sessionId: this.getSessionId(),
            userId: this.getVisitorId(),
            ...data
        };
        
        this.data.errors.push(error);
        
        // Limiter l'historique
        if (this.data.errors.length > this.config.maxDataPoints) {
            this.data.errors = this.data.errors.slice(-this.config.maxDataPoints);
        }
        
        // Traitement par lots pour les mises à jour
        this.queueBatchUpdate('errors');
    }
    
    /**
     * Démarrer les mises à jour en temps réel optimisées
     */
    startRealTimeUpdates() {
        if (this.updateTimeout) {
            clearTimeout(this.updateTimeout);
        }
        
        this.updateTimeout = setTimeout(() => {
            this.updateRealTimeData();
        }, this.config.updateInterval);
    }
    
    /**
     * Mettre à jour les données en temps réel optimisées
     */
    updateRealTimeData() {
        if (!this.config.enableRealTimeUpdates) return;
        
        // Utiliser requestIdleCallback si disponible
        const updateData = () => {
            this.updateVisitors();
            this.updatePageViews();
            this.updateSessions();
            
            // Programmer la prochaine mise à jour
            this.updateTimeout = setTimeout(() => {
                this.updateRealTimeData();
            }, this.config.updateInterval);
        };
        
        if ('requestIdleCallback' in window) {
            requestIdleCallback(updateData, { timeout: 1000 });
        } else {
            updateData();
        }
    }
    
    /**
     * Mettre à jour les visiteurs
     */
    updateVisitors() {
        // Nettoyer les visiteurs inactifs (plus de 30 minutes)
        const now = Date.now();
        const thirtyMinutesAgo = now - (30 * 60 * 1000);
        
        // Cette logique peut être optimisée si nécessaire
        // Pour l'instant, on garde tous les visiteurs
    }
    
    /**
     * Mettre à jour les vues de pages
     */
    updatePageViews() {
        // Nettoyer les anciennes vues (plus de 24h)
        const now = Date.now();
        const oneDayAgo = now - (24 * 60 * 60 * 1000);
        
        this.data.pageViews = this.data.pageViews.filter(view => 
            view.timestamp > oneDayAgo
        );
    }
    
    /**
     * Mettre à jour les sessions
     */
    updateSessions() {
        const now = Date.now();
        const sessionTimeout = 30 * 60 * 1000; // 30 minutes
        
        // Nettoyer les sessions expirées
        for (const [sessionId, session] of this.data.sessions.entries()) {
            if (now - session.lastActivity > sessionTimeout) {
                this.data.sessions.delete(sessionId);
            }
        }
    }
    
    /**
     * Configurer les écouteurs d'événements optimisés
     */
    setupEventListeners() {
        // Tracker les clics avec throttling
        let clickTimeout;
        document.addEventListener('click', (event) => {
            if (!clickTimeout) {
                clickTimeout = setTimeout(() => {
                    this.trackUserActivity('click', {
                        target: event.target.tagName.toLowerCase(),
                        text: event.target.textContent?.substring(0, 50) || '',
                        x: event.clientX,
                        y: event.clientY
                    });
                    clickTimeout = null;
                }, this.config.throttleDelay);
            }
        });
        
        // Tracker la navigation avec throttling
        let navigationTimeout;
        window.addEventListener('popstate', () => {
            if (!navigationTimeout) {
                navigationTimeout = setTimeout(() => {
                    this.trackUserActivity('navigation', {
                        from: document.referrer,
                        to: window.location.href
                    });
                    navigationTimeout = null;
                }, this.config.throttleDelay);
            }
        });
        
        // Tracker le défilement avec throttling
        let scrollTimeout;
        window.addEventListener('scroll', () => {
            if (!scrollTimeout) {
                scrollTimeout = setTimeout(() => {
                    this.trackUserActivity('scroll', {
                        scrollY: window.scrollY,
                        scrollX: window.scrollX
                    });
                    scrollTimeout = null;
                }, this.config.throttleDelay);
            }
        });
        
        // Tracker la soumission de formulaires
        document.addEventListener('submit', (event) => {
            this.trackUserActivity('form_submit', {
                formId: event.target.id || 'unknown',
                formAction: event.target.action || 'unknown'
            });
        });
        
        // Tracker la visibilité de la page
        document.addEventListener('visibilitychange', () => {
            this.trackUserActivity('visibility', {
                hidden: document.hidden,
                timestamp: Date.now()
            });
        });
        
        // Tracker la fermeture de la page
        window.addEventListener('beforeunload', () => {
            this.trackUserActivity('page_unload', {
                timestamp: Date.now(),
                sessionDuration: Date.now() - this.data.startTime
            });
        });
    }
    
    /**
     * Mettre en file d'attente une mise à jour par lots
     */
    queueBatchUpdate(type) {
        if (!this.batchQueue.includes(type)) {
            this.batchQueue.push(type);
        }
        
        // Traiter la file d'attente après un délai
        if (this.batchQueue.length > 0) {
            setTimeout(() => {
                this.processBatchQueue();
            }, 1000);
        }
    }
    
    /**
     * Traiter la file d'attente des mises à jour par lots
     */
    processBatchQueue() {
        if (this.batchQueue.length === 0) return;
        
        const types = [...this.batchQueue];
        this.batchQueue = [];
        
        // Traiter chaque type de mise à jour
        types.forEach(type => {
            this.processUpdateType(type);
        });
    }
    
    /**
     * Traiter un type de mise à jour spécifique
     */
    processUpdateType(type) {
        switch (type) {
            case 'performance':
                // Mettre à jour les métriques de performance
                break;
            case 'userActivity':
                // Mettre à jour l'activité utilisateur
                break;
            case 'errors':
                // Mettre à jour les erreurs
                break;
        }
    }
    
    /**
     * Obtenir l'ID du visiteur
     */
    getVisitorId() {
        let visitorId = localStorage.getItem('visitor_id');
        if (!visitorId) {
            visitorId = 'visitor_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
            localStorage.setItem('visitor_id', visitorId);
        }
        return visitorId;
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
     * Obtenir les informations de mémoire
     */
    getMemoryInfo() {
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
     * Obtenir les informations de performance
     */
    getPerformanceInfo() {
        if ('performance' in window) {
            const navigation = performance.getEntriesByType('navigation')[0];
            if (navigation) {
                return {
                    loadTime: navigation.loadEventEnd - navigation.loadEventStart,
                    domContentLoaded: navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart,
                    firstPaint: 0,
                    firstContentfulPaint: 0
                };
            }
        }
        return { loadTime: 0, domContentLoaded: 0, firstPaint: 0, firstContentfulPaint: 0 };
    }
    
    /**
     * Déterminer si une activité est importante pour Discord
     */
    isImportantActivity(type, data) {
        const importantTypes = ['error', 'form', 'form_submit', 'navigation'];
        return importantTypes.includes(type) || 
               (type === 'click' && data.target === 'button') ||
               (type === 'scroll' && Math.abs(data.scrollY) > 1000);
    }
    
    /**
     * Envoyer à Discord avec throttling
     */
    async sendToDiscord(type, data) {
        const now = Date.now();
        
        // Les soumissions de formulaires sont toujours envoyées immédiatement
        if (type === 'form_submit' || type === 'form') {
            try {
                const embed = this.createDiscordEmbed(type, data);
                await this.sendWebhook(embed);
                this.lastDiscordSend = now;
                console.log('✅ Formulaire envoyé à Discord immédiatement');
            } catch (error) {
                console.warn('⚠️ Erreur lors de l\'envoi du formulaire à Discord:', error);
            }
            return;
        }
        
        // Pour les autres types d'activités, appliquer le throttling
        if (now - this.lastDiscordSend < this.discordThrottle) {
            return; // Trop tôt pour envoyer
        }
        
        if (this.isImportantActivity(type, data)) {
            try {
                const embed = this.createDiscordEmbed(type, data);
                await this.sendWebhook(embed);
                this.lastDiscordSend = now;
            } catch (error) {
                console.warn('⚠️ Erreur lors de l\'envoi à Discord:', error);
            }
        }
    }
    
    /**
     * Envoyer un résumé à Discord
     */
    async sendSummaryToDiscord() {
        try {
            const stats = this.getRealTimeStats();
            const embed = {
                title: '📊 Résumé du Site',
                color: 0x00ff00,
                fields: [
                    {
                        name: '👥 Visiteurs',
                        value: stats.visitors.toString(),
                        inline: true
                    },
                    {
                        name: '📄 Pages vues',
                        value: stats.pageViews.toString(),
                        inline: true
                    },
                    {
                        name: '⏱️ Temps de fonctionnement',
                        value: stats.uptime,
                        inline: true
                    },
                    {
                        name: '💾 Mémoire utilisée',
                        value: stats.memory,
                        inline: true
                    },
                    {
                        name: '🚨 Erreurs',
                        value: stats.errors.toString(),
                        inline: true
                    },
                    {
                        name: '📝 Activités',
                        value: stats.activities.toString(),
                        inline: true
                    }
                ],
                timestamp: new Date().toISOString()
            };
            
            await this.sendWebhook(embed);
            
        } catch (error) {
            console.warn('⚠️ Erreur lors de l\'envoi du résumé à Discord:', error);
        }
    }
    
    /**
     * Créer un embed Discord
     */
    createDiscordEmbed(type, data) {
        const embed = {
            title: this.getEmbedTitle(type),
            description: this.getEmbedDescription(type, data),
            color: this.getEmbedColor(type),
            fields: this.getEmbedFields(type, data),
            timestamp: new Date().toISOString(),
            footer: {
                text: 'Mayu & Jack Studio - Monitoring'
            }
        };
        
        return embed;
    }
    
    /**
     * Obtenir le titre de l'embed selon le type
     */
    getEmbedTitle(type) {
        const titles = {
            click: '🖱️ Clic Utilisateur',
            navigation: '🧭 Navigation',
            form: '📝 Formulaire Soumis',
            form_submit: '📝 Nouveau Formulaire de Contact',
            scroll: '📜 Défilement',
            error: '🚨 Erreur Détectée',
            performance: '⚡ Métrique Performance'
        };
        return titles[type] || '📊 Activité Utilisateur';
    }
    
    /**
     * Obtenir la description de l'embed
     */
    getEmbedDescription(type, data) {
        switch (type) {
            case 'click':
                return `Clic sur un élément ${data.target}`;
            case 'navigation':
                return `Navigation de ${data.from} vers ${data.to}`;
            case 'form':
                return `Formulaire ${data.formId} soumis`;
            case 'form_submit':
                return `Nouveau formulaire de contact soumis par ${data.formData?.name || 'un client'}`;
            case 'scroll':
                return `Défilement de ${data.scrollY}px`;
            case 'error':
                return data.message || 'Erreur système détectée';
            default:
                return 'Activité utilisateur détectée';
        }
    }
    
    /**
     * Obtenir la couleur de l'embed
     */
    getEmbedColor(type) {
        const colors = {
            click: 0x3498db,
            navigation: 0x2ecc71,
            form: 0xf39c12,
            scroll: 0x9b59b6,
            error: 0xe74c3c,
            performance: 0x1abc9c
        };
        return colors[type] || 0x95a5a6;
    }
    
    /**
     * Obtenir les champs de l'embed
     */
    getEmbedFields(type, data) {
        const fields = [
            {
                name: '🌐 URL',
                value: window.location.href,
                inline: false
            },
            {
                name: '👤 Utilisateur',
                value: this.getVisitorId(),
                inline: true
            },
            {
                name: '⏰ Timestamp',
                value: new Date().toLocaleString(),
                inline: true
            }
        ];
        
        // Ajouter des champs spécifiques selon le type
        if (type === 'click' && data.text) {
            fields.push({
                name: '📝 Texte',
                value: data.text.substring(0, 100),
                inline: true
            });
        }
        
        if (type === 'error' && data.stack) {
            fields.push({
                name: '🔍 Détails',
                value: data.stack.substring(0, 100) + '...',
                inline: false
            });
        }
        
        // Champs spécifiques pour les soumissions de formulaires
        if ((type === 'form_submit' || type === 'form') && data.formData) {
            if (data.formData.name) {
                fields.push({
                    name: '👤 Nom du Client',
                    value: data.formData.name,
                    inline: true
                });
            }
            
            if (data.formData.email) {
                fields.push({
                    name: '📧 Email',
                    value: data.formData.email,
                    inline: true
                });
            }
            
            if (data.formData.projectType) {
                fields.push({
                    name: '🎯 Type de Projet',
                    value: data.formData.projectType,
                    inline: true
                });
            }
            
            if (data.formData.details) {
                fields.push({
                    name: '📝 Description',
                    value: data.formData.details.length > 200 ? data.formData.details.substring(0, 200) + '...' : data.formData.details,
                    inline: false
                });
            }
            
            if (data.formData.deadline) {
                fields.push({
                    name: '📅 Deadline',
                    value: data.formData.deadline,
                    inline: true
                });
            }
            
            if (data.formData.budget) {
                fields.push({
                    name: '💰 Budget',
                    value: data.formData.budget,
                    inline: true
                });
            }
        }
        
        return fields;
    }
    
    /**
     * Envoyer le webhook Discord
     */
    async sendWebhook(embed) {
        try {
            const response = await fetch(this.webhookUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    embeds: [embed]
                })
            });
            
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }
            
            console.log('✅ Données envoyées à Discord');
            
        } catch (error) {
            console.error('❌ Erreur lors de l\'envoi à Discord:', error);
            throw error;
        }
    }
    
    /**
     * Envoyer le message de démarrage
     */
    async sendStartupMessage() {
        try {
            const embed = {
                title: '🚀 Site Démarré',
                description: 'Le monitoring du site est maintenant actif',
                color: 0x00ff00,
                fields: [
                    {
                        name: '🌐 URL',
                        value: window.location.href,
                        inline: false
                    },
                    {
                        name: '📱 User Agent',
                        value: navigator.userAgent.substring(0, 100) + '...',
                        inline: false
                    },
                    {
                        name: '🌍 Langue',
                        value: navigator.language,
                        inline: true
                    },
                    {
                        name: '⏰ Heure',
                        value: new Date().toLocaleString(),
                        inline: true
                    }
                ],
                timestamp: new Date().toISOString()
            };
            
            await this.sendWebhook(embed);
            
        } catch (error) {
            console.warn('⚠️ Erreur lors de l\'envoi du message de démarrage:', error);
        }
    }
    
    /**
     * Formater les bytes en format lisible
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
        
        if (days > 0) return `${days}j ${hours % 24}h`;
        if (hours > 0) return `${hours}h ${minutes % 60}m`;
        if (minutes > 0) return `${minutes}m ${seconds % 60}s`;
        return `${seconds}s`;
    }
    
    /**
     * Obtenir les statistiques en temps réel
     */
    getRealTimeStats() {
        const now = Date.now();
        
        return {
            visitors: this.data.visitors.size,
            pageViews: this.data.pageViews.length,
            uptime: this.formatUptime(now - this.data.startTime),
            memory: this.formatBytes(this.getMemoryInfo().used),
            errors: this.data.errors.length,
            activities: this.data.userActivity.length,
            sessions: this.data.sessions.size
        };
    }
    
    /**
     * Exporter toutes les données
     */
    exportAllData() {
        return {
            config: this.config,
            data: this.data,
            stats: this.getRealTimeStats(),
            timestamp: Date.now()
        };
    }
    
    /**
     * Réinitialiser les données
     */
    resetData() {
        this.data = {
            startTime: Date.now(),
            visitors: new Set(),
            sessions: new Map(),
            pageViews: [],
            userActivity: [],
            errors: [],
            performance: [],
            systemMetrics: []
        };
        
        console.log('🔄 Données du moniteur réinitialisées');
    }
    
    /**
     * Nettoyer les ressources
     */
    cleanup() {
        if (this.performanceObserver) {
            this.performanceObserver.disconnect();
        }
        
        if (this.updateTimeout) {
            clearTimeout(this.updateTimeout);
        }
        
        console.log('🧹 Moniteur de site nettoyé');
    }
}

// Initialiser le moniteur
const siteMonitor = new SiteMonitor();

// Exposer globalement
window.SiteMonitor = SiteMonitor;
window.siteMonitor = siteMonitor;
