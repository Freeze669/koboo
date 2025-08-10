/**
 * Activity Monitor - Système de surveillance des activités et commandes
 * Intégré avec Discord Logger pour notifications automatiques
 */

class ActivityMonitor {
    constructor(discordLogger) {
        this.discordLogger = discordLogger;
        this.activities = [];
        this.commands = [];
        this.maxActivities = 1000;
        this.maxCommands = 500;
        this.isMonitoring = true;
        
        // Configuration
        this.config = {
            trackClicks: true,
            trackForms: true,
            trackNavigation: true,
            trackErrors: true,
            trackPerformance: true,
            trackCommands: true,
            autoCleanup: true
        };
        
        // Types d'activités surveillées
        this.activityTypes = {
            CLICK: 'click',
            FORM_SUBMIT: 'form_submit',
            NAVIGATION: 'navigation',
            ERROR: 'error',
            PERFORMANCE: 'performance',
            COMMAND: 'command',
            FILE_UPLOAD: 'file_upload',
            SCROLL: 'scroll',
            KEYPRESS: 'keypress',
            MOUSE_MOVE: 'mouse_move',
            PAGE_VIEW: 'page_view',
            SESSION_START: 'session_start',
            SESSION_END: 'session_end'
        };
        
        this.init();
    }
    
    init() {
        console.log('📊 Activity Monitor initialisé');
        this.setupEventListeners();
        this.startPerformanceMonitoring();
        this.loadFromStorage();
    }
    
    /**
     * Configuration des écouteurs d'événements
     */
    setupEventListeners() {
        if (!this.isMonitoring) return;
        
        // Surveillance des clics
        if (this.config.trackClicks) {
            this.trackClicks();
        }
        
        // Surveillance des formulaires
        if (this.config.trackForms) {
            this.trackForms();
        }
        
        // Surveillance de la navigation
        if (this.config.trackNavigation) {
            this.trackNavigation();
        }
        
        // Surveillance des erreurs
        if (this.config.trackErrors) {
            this.trackErrors();
        }
        
        // Surveillance des commandes
        if (this.config.trackCommands) {
            this.trackCommands();
        }
        
        // Surveillance des fichiers
        this.trackFileUploads();
        
        // Surveillance du scroll
        this.trackScroll();
        
        // Surveillance des touches
        this.trackKeypress();
        
        // Surveillance de la souris
        this.trackMouseMovement();
    }
    
    /**
     * Surveillance des clics
     */
    trackClicks() {
        document.addEventListener('click', (e) => {
            const target = e.target;
            const activity = {
                type: this.activityTypes.CLICK,
                target: target.tagName.toLowerCase(),
                id: target.id || null,
                className: target.className || null,
                text: target.textContent?.substring(0, 100) || null,
                x: e.clientX,
                y: e.clientY,
                timestamp: new Date().toISOString(),
                page: window.location.href,
                userAgent: navigator.userAgent
            };
            
            this.logActivity(activity);
        }, { passive: true });
    }
    
    /**
     * Surveillance des formulaires
     */
    trackForms() {
        document.addEventListener('submit', (e) => {
            const form = e.target;
            const activity = {
                type: this.activityTypes.FORM_SUBMIT,
                formId: form.id || null,
                formClass: form.className || null,
                action: form.action || null,
                method: form.method || 'GET',
                fields: this.getFormFields(form),
                timestamp: new Date().toISOString(),
                page: window.location.href
            };
            
            this.logActivity(activity);
        });
        
        // Surveillance des changements d'input
        document.addEventListener('change', (e) => {
            if (e.target.tagName === 'INPUT' || e.target.tagName === 'SELECT' || e.target.tagName === 'TEXTAREA') {
                const input = e.target;
                const activity = {
                    type: 'input_change',
                    inputType: input.type || 'text',
                    inputName: input.name || null,
                    inputId: input.id || null,
                    inputValue: input.value?.substring(0, 100) || null,
                    timestamp: new Date().toISOString(),
                    page: window.location.href
                };
                
                this.logActivity(activity);
            }
        });
    }
    
    /**
     * Surveillance de la navigation
     */
    trackNavigation() {
        // Surveillance des changements de page
        let currentUrl = window.location.href;
        
        const checkNavigation = () => {
            if (window.location.href !== currentUrl) {
                const activity = {
                    type: this.activityTypes.NAVIGATION,
                    from: currentUrl,
                    to: window.location.href,
                    timestamp: new Date().toISOString(),
                    referrer: document.referrer
                };
                
                this.logActivity(activity);
                currentUrl = window.location.href;
            }
        };
        
        // Vérifier la navigation régulièrement
        setInterval(checkNavigation, 1000);
        
        // Surveillance des liens cliqués
        document.addEventListener('click', (e) => {
            const target = e.target.closest('a');
            if (target && target.href) {
                const activity = {
                    type: 'link_click',
                    href: target.href,
                    text: target.textContent?.substring(0, 100) || null,
                    target: target.target || '_self',
                    timestamp: new Date().toISOString(),
                    page: window.location.href
                };
                
                this.logActivity(activity);
            }
        });
    }
    
    /**
     * Surveillance des erreurs
     */
    trackErrors() {
        // Erreurs JavaScript
        window.addEventListener('error', (e) => {
            const activity = {
                type: this.activityTypes.ERROR,
                errorType: 'javascript',
                message: e.message,
                filename: e.filename,
                lineno: e.lineno,
                colno: e.colno,
                error: e.error?.stack || null,
                timestamp: new Date().toISOString(),
                page: window.location.href
            };
            
            this.logActivity(activity);
            
            // Logger l'erreur dans Discord
            if (this.discordLogger) {
                this.discordLogger.logError({
                    type: 'JavaScript Error',
                    message: e.message,
                    details: `${e.filename}:${e.lineno}:${e.colno}`,
                    page: window.location.href
                });
            }
        });
        
        // Erreurs de promesses rejetées
        window.addEventListener('unhandledrejection', (e) => {
            const activity = {
                type: this.activityTypes.ERROR,
                errorType: 'promise',
                message: e.reason?.message || 'Promise rejected',
                reason: e.reason,
                timestamp: new Date().toISOString(),
                page: window.location.href
            };
            
            this.logActivity(activity);
            
            // Logger l'erreur dans Discord
            if (this.discordLogger) {
                this.discordLogger.logError({
                    type: 'Promise Rejection',
                    message: e.reason?.message || 'Promise rejected',
                    details: e.reason,
                    page: window.location.href
                });
            }
        });
    }
    
    /**
     * Surveillance des performances
     */
    startPerformanceMonitoring() {
        if (!this.config.trackPerformance) return;
        
        // Surveillance des Web Vitals
        if ('PerformanceObserver' in window) {
            try {
                // LCP (Largest Contentful Paint)
                const lcpObserver = new PerformanceObserver((list) => {
                    const entries = list.getEntries();
                    const lastEntry = entries[entries.length - 1];
                    
                    const activity = {
                        type: this.activityTypes.PERFORMANCE,
                        metric: 'LCP',
                        value: lastEntry.startTime,
                        timestamp: new Date().toISOString(),
                        page: window.location.href
                    };
                    
                    this.logActivity(activity);
                });
                lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });
                
                // FID (First Input Delay)
                const fidObserver = new PerformanceObserver((list) => {
                    const entries = list.getEntries();
                    entries.forEach(entry => {
                        const activity = {
                            type: this.activityTypes.PERFORMANCE,
                            metric: 'FID',
                            value: entry.processingStart - entry.startTime,
                            timestamp: new Date().toISOString(),
                            page: window.location.href
                        };
                        
                        this.logActivity(activity);
                    });
                });
                fidObserver.observe({ entryTypes: ['first-input'] });
                
                // CLS (Cumulative Layout Shift)
                const clsObserver = new PerformanceObserver((list) => {
                    let clsValue = 0;
                    list.getEntries().forEach(entry => {
                        if (!entry.hadRecentInput) {
                            clsValue += entry.value;
                        }
                    });
                    
                    const activity = {
                        type: this.activityTypes.PERFORMANCE,
                        metric: 'CLS',
                        value: clsValue,
                        timestamp: new Date().toISOString(),
                        page: window.location.href
                    };
                    
                    this.logActivity(activity);
                });
                clsObserver.observe({ entryTypes: ['layout-shift'] });
                
            } catch (error) {
                console.warn('⚠️ Erreur lors de la surveillance des performances:', error);
            }
        }
        
        // Surveillance des ressources
        if ('PerformanceObserver' in window) {
            try {
                const resourceObserver = new PerformanceObserver((list) => {
                    list.getEntries().forEach(entry => {
                        if (entry.initiatorType === 'img' || entry.initiatorType === 'script' || entry.initiatorType === 'css') {
                            const activity = {
                                type: this.activityTypes.PERFORMANCE,
                                metric: 'resource',
                                resourceType: entry.initiatorType,
                                name: entry.name,
                                duration: entry.duration,
                                size: entry.transferSize || 0,
                                timestamp: new Date().toISOString(),
                                page: window.location.href
                            };
                            
                            this.logActivity(activity);
                        }
                    });
                });
                resourceObserver.observe({ entryTypes: ['resource'] });
            } catch (error) {
                console.warn('⚠️ Erreur lors de la surveillance des ressources:', error);
            }
        }
    }
    
    /**
     * Surveillance des commandes
     */
    trackCommands() {
        // Intercepter les commandes admin
        const originalLog = console.log;
        console.log = (...args) => {
            // Appeler la fonction originale
            originalLog.apply(console, args);
            
            // Vérifier si c'est une commande admin
            const message = args.join(' ');
            if (message.includes('ADMIN_COMMAND:') || message.includes('COMMAND:')) {
                const commandMatch = message.match(/(?:ADMIN_COMMAND|COMMAND):\s*(\w+)/);
                if (commandMatch) {
                    const command = commandMatch[1];
                    const activity = {
                        type: this.activityTypes.COMMAND,
                        command: command,
                        fullMessage: message,
                        timestamp: new Date().toISOString(),
                        page: window.location.href
                    };
                    
                    this.logActivity(activity);
                    
                    // Logger la commande dans Discord
                    if (this.discordLogger) {
                        this.discordLogger.logCommand({
                            user: 'Admin',
                            command: command,
                            params: message,
                            page: window.location.href,
                            success: true
                        });
                    }
                }
            }
        };
        
        // Intercepter les erreurs de commande
        const originalError = console.error;
        console.error = (...args) => {
            // Appeler la fonction originale
            originalError.apply(console, args);
            
            // Vérifier si c'est une erreur de commande
            const message = args.join(' ');
            if (message.includes('COMMAND_ERROR:') || message.includes('ADMIN_ERROR:')) {
                const activity = {
                    type: this.activityTypes.ERROR,
                    errorType: 'command',
                    message: message,
                    timestamp: new Date().toISOString(),
                    page: window.location.href
                };
                
                this.logActivity(activity);
                
                // Logger l'erreur dans Discord
                if (this.discordLogger) {
                    this.discordLogger.logError({
                        type: 'Command Error',
                        message: message,
                        details: 'Erreur lors de l\'exécution d\'une commande',
                        page: window.location.href
                    });
                }
            }
        };
    }
    
    /**
     * Surveillance des uploads de fichiers
     */
    trackFileUploads() {
        document.addEventListener('change', (e) => {
            if (e.target.type === 'file') {
                const input = e.target;
                const files = Array.from(input.files);
                
                files.forEach(file => {
                    const activity = {
                        type: this.activityTypes.FILE_UPLOAD,
                        fileName: file.name,
                        fileSize: file.size,
                        fileType: file.type,
                        inputName: input.name || null,
                        inputId: input.id || null,
                        timestamp: new Date().toISOString(),
                        page: window.location.href
                    };
                    
                    this.logActivity(activity);
                });
            }
        });
    }
    
    /**
     * Surveillance du scroll
     */
    trackScroll() {
        let scrollTimeout;
        let lastScrollTop = 0;
        
        window.addEventListener('scroll', () => {
            clearTimeout(scrollTimeout);
            
            scrollTimeout = setTimeout(() => {
                const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
                const scrollDirection = scrollTop > lastScrollTop ? 'down' : 'up';
                
                const activity = {
                    type: this.activityTypes.SCROLL,
                    scrollTop: scrollTop,
                    scrollDirection: scrollDirection,
                    scrollPercentage: Math.round((scrollTop / (document.documentElement.scrollHeight - window.innerHeight)) * 100),
                    timestamp: new Date().toISOString(),
                    page: window.location.href
                };
                
                this.logActivity(activity);
                lastScrollTop = scrollTop;
            }, 100);
        }, { passive: true });
    }
    
    /**
     * Surveillance des touches
     */
    trackKeypress() {
        let keyCount = 0;
        let keyTimeout;
        
        document.addEventListener('keydown', (e) => {
            keyCount++;
            
            clearTimeout(keyTimeout);
            keyTimeout = setTimeout(() => {
                const activity = {
                    type: this.activityTypes.KEYPRESS,
                    keyCount: keyCount,
                    key: e.key,
                    keyCode: e.keyCode,
                    ctrlKey: e.ctrlKey,
                    altKey: e.altKey,
                    shiftKey: e.shiftKey,
                    timestamp: new Date().toISOString(),
                    page: window.location.href
                };
                
                this.logActivity(activity);
                keyCount = 0;
            }, 1000);
        });
    }
    
    /**
     * Surveillance des mouvements de souris
     */
    trackMouseMovement() {
        let moveCount = 0;
        let moveTimeout;
        let lastX = 0;
        let lastY = 0;
        
        document.addEventListener('mousemove', (e) => {
            moveCount++;
            
            // Éviter de logger trop souvent
            if (Math.abs(e.clientX - lastX) < 10 && Math.abs(e.clientY - lastY) < 10) {
                return;
            }
            
            lastX = e.clientX;
            lastY = e.clientY;
            
            clearTimeout(moveTimeout);
            moveTimeout = setTimeout(() => {
                const activity = {
                    type: this.activityTypes.MOUSE_MOVE,
                    moveCount: moveCount,
                    x: e.clientX,
                    y: e.clientY,
                    timestamp: new Date().toISOString(),
                    page: window.location.href
                };
                
                this.logActivity(activity);
                moveCount = 0;
            }, 2000);
        }, { passive: true });
    }
    
    /**
     * Log d'une activité
     */
    logActivity(activity) {
        if (!this.isMonitoring) return;
        
        // Ajouter l'activité à la liste
        this.activities.push(activity);
        
        // Limiter la taille de la liste
        if (this.activities.length > this.maxActivities) {
            this.activities = this.activities.slice(-this.maxActivities);
        }
        
        // Sauvegarder
        this.saveToStorage();
        
        // Logger dans Discord si c'est important
        if (this.shouldLogToDiscord(activity)) {
            this.logToDiscord(activity);
        }
        
        // Log local
        console.log(`📊 Activité: ${activity.type}`, activity);
    }
    
    /**
     * Log d'une commande
     */
    logCommand(commandData) {
        const command = {
            ...commandData,
            timestamp: new Date().toISOString(),
            page: window.location.href
        };
        
        // Ajouter la commande à la liste
        this.commands.push(command);
        
        // Limiter la taille de la liste
        if (this.commands.length > this.maxCommands) {
            this.commands = this.commands.slice(-this.maxCommands);
        }
        
        // Sauvegarder
        this.saveToStorage();
        
        // Logger dans Discord
        if (this.discordLogger) {
            this.discordLogger.logCommand(command);
        }
        
        console.log(`⚡ Commande: ${command.command}`, command);
    }
    
    /**
     * Déterminer si une activité doit être loggée dans Discord
     */
    shouldLogToDiscord(activity) {
        // Log toutes les erreurs
        if (activity.type === this.activityTypes.ERROR) return true;
        
        // Log les commandes
        if (activity.type === this.activityTypes.COMMAND) return true;
        
        // Log les performances importantes
        if (activity.type === this.activityTypes.PERFORMANCE) {
            if (activity.metric === 'LCP' && activity.value > 2500) return true;
            if (activity.metric === 'FID' && activity.value > 100) return true;
            if (activity.metric === 'CLS' && activity.value > 0.1) return true;
        }
        
        // Log les uploads de fichiers
        if (activity.type === this.activityTypes.FILE_UPLOAD) return true;
        
        // Log les soumissions de formulaires
        if (activity.type === this.activityTypes.FORM_SUBMIT) return true;
        
        return false;
    }
    
    /**
     * Logger une activité dans Discord
     */
    async logToDiscord(activity) {
        if (!this.discordLogger) return;
        
        try {
            await this.discordLogger.logActivity({
                user: 'Visiteur',
                action: activity.type,
                page: activity.page,
                details: this.formatActivityForDiscord(activity),
                timestamp: activity.timestamp
            });
        } catch (error) {
            console.warn('⚠️ Erreur lors du log Discord:', error);
        }
    }
    
    /**
     * Formater une activité pour Discord
     */
    formatActivityForDiscord(activity) {
        switch (activity.type) {
            case this.activityTypes.ERROR:
                return `Erreur: ${activity.message || 'Erreur inconnue'}`;
            case this.activityTypes.PERFORMANCE:
                return `${activity.metric}: ${activity.value}`;
            case this.activityTypes.FILE_UPLOAD:
                return `Fichier: ${activity.fileName} (${this.formatFileSize(activity.fileSize)})`;
            case this.activityTypes.FORM_SUBMIT:
                return `Formulaire soumis: ${activity.formId || activity.formClass || 'Formulaire'}`;
            default:
                return activity.type;
        }
    }
    
    /**
     * Formater la taille d'un fichier
     */
    formatFileSize(bytes) {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }
    
    /**
     * Obtenir les champs d'un formulaire
     */
    getFormFields(form) {
        const fields = [];
        const inputs = form.querySelectorAll('input, select, textarea');
        
        inputs.forEach(input => {
            if (input.type !== 'submit' && input.type !== 'button') {
                fields.push({
                    name: input.name || input.id || 'field',
                    type: input.type || 'text',
                    required: input.required || false
                });
            }
        });
        
        return fields;
    }
    
    /**
     * Sauvegarde dans le stockage local
     */
    saveToStorage() {
        try {
            localStorage.setItem('activityMonitor_activities', JSON.stringify(this.activities));
            localStorage.setItem('activityMonitor_commands', JSON.stringify(this.commands));
        } catch (error) {
            console.warn('⚠️ Impossible de sauvegarder dans le stockage local:', error);
        }
    }
    
    /**
     * Chargement depuis le stockage local
     */
    loadFromStorage() {
        try {
            const activitiesData = localStorage.getItem('activityMonitor_activities');
            const commandsData = localStorage.getItem('activityMonitor_commands');
            
            if (activitiesData) {
                this.activities = JSON.parse(activitiesData);
            }
            
            if (commandsData) {
                this.commands = JSON.parse(commandsData);
            }
        } catch (error) {
            console.warn('⚠️ Impossible de charger depuis le stockage local:', error);
        }
    }
    
    /**
     * Obtention des statistiques
     */
    getStats() {
        const now = Date.now();
        const oneHourAgo = now - (60 * 60 * 1000);
        const oneDayAgo = now - (24 * 60 * 60 * 1000);
        
        const recentActivities = this.activities.filter(a => new Date(a.timestamp) > new Date(oneHourAgo));
        const recentCommands = this.commands.filter(c => new Date(c.timestamp) > new Date(oneHourAgo));
        
        return {
            totalActivities: this.activities.length,
            totalCommands: this.commands.length,
            recentActivities: recentActivities.length,
            recentCommands: recentCommands.length,
            activityTypes: this.getActivityTypeDistribution(),
            errorCount: this.activities.filter(a => a.type === this.activityTypes.ERROR).length,
            performanceIssues: this.activities.filter(a => 
                a.type === this.activityTypes.PERFORMANCE && 
                ((a.metric === 'LCP' && a.value > 2500) ||
                 (a.metric === 'FID' && a.value > 100) ||
                 (a.metric === 'CLS' && a.value > 0.1))
            ).length,
            lastUpdate: new Date().toISOString()
        };
    }
    
    /**
     * Distribution des types d'activités
     */
    getActivityTypeDistribution() {
        const distribution = {};
        
        this.activities.forEach(activity => {
            distribution[activity.type] = (distribution[activity.type] || 0) + 1;
        });
        
        return distribution;
    }
    
    /**
     * Export des données
     */
    exportData() {
        return {
            activities: this.activities,
            commands: this.commands,
            stats: this.getStats(),
            config: this.config,
            exportTime: new Date().toISOString()
        };
    }
    
    /**
     * Réinitialisation
     */
    reset() {
        this.activities = [];
        this.commands = [];
        this.saveToStorage();
        console.log('🔄 Activity Monitor réinitialisé');
    }
    
    /**
     * Activation/Désactivation de la surveillance
     */
    setMonitoring(enabled) {
        this.isMonitoring = enabled;
        console.log(`🔧 Surveillance ${enabled ? 'activée' : 'désactivée'}`);
    }
    
    /**
     * Configuration de la surveillance
     */
    setConfig(newConfig) {
        this.config = { ...this.config, ...newConfig };
        console.log('🔧 Configuration mise à jour:', this.config);
    }
}

// Export pour utilisation dans d'autres modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ActivityMonitor;
} else if (typeof window !== 'undefined') {
    window.ActivityMonitor = ActivityMonitor;
}
