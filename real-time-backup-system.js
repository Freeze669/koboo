/**
 * SYSTÈME DE SAUVEGARDE EN TEMPS RÉEL
 * Surveille et sauvegarde automatiquement toutes les activités des utilisateurs
 * 
 * @author Mayu & Jack Studio
 * @version 1.0.0
 * 
 * NOTE: Ce fichier contient UNIQUEMENT la logique de surveillance et de sauvegarde.
 * Tous les éléments d'interface utilisateur sont gérés par admin-backup-ui.js
 */

class RealTimeBackupSystem {
    constructor(config = {}) {
        this.isActive = false;
        this.backupInterval = null;
        this.userActivities = new Map();
        this.sessionData = new Map();
        this.backupQueue = [];
        this.lastBackupTime = Date.now();
        this.backupStats = {
            totalBackups: 0,
            totalUsers: 0,
            totalActivities: 0,
            lastBackupDuration: 0,
            errors: 0
        };
        
        // Configuration de sauvegarde
        this.config = {
            backupIntervalMs: 5000, // Sauvegarde toutes les 5 secondes
            maxQueueSize: 1000,     // Taille maximale de la file d'attente
            batchSize: 50,          // Nombre d'activités par lot
            retentionDays: 30,      // Conservation des données pendant 30 jours
            enableCompression: true, // Compression des données
            enableEncryption: false, // Chiffrement (optionnel)
            backupPath: 'site-backups', // Chemin Firebase pour les sauvegardes
            useFirebase: true,      // Utiliser Firebase si disponible
            autoStart: true,        // Démarrer automatiquement
            trackMouse: true,       // Suivre les mouvements de souris
            trackScroll: true,      // Suivre le défilement
            trackInputs: true,      // Suivre les saisies
            trackClicks: true,      // Suivre les clics
            trackNavigation: true,  // Suivre la navigation
            trackForms: true,       // Suivre les formulaires
            trackDOM: true,         // Suivre les changements DOM
            ...config
        };
        
        // Événements personnalisés pour la communication avec l'UI
        this.events = {
            backupSuccess: 'backupSystem:backupSuccess',
            backupError: 'backupSystem:backupError',
            monitoringStarted: 'backupSystem:monitoringStarted',
            monitoringStopped: 'backupSystem:monitoringStopped',
            statsUpdated: 'backupSystem:statsUpdated',
            userActivity: 'backupSystem:userActivity'
        };
        
        if (this.config.autoStart) {
            this.initialize();
        }
    }
    
    /**
     * Initialise le système de sauvegarde
     */
    async initialize() {
        try {
            console.log('🚀 Initialisation du système de sauvegarde en temps réel...');
            
            // Vérifier la disponibilité de Firebase
            if (this.config.useFirebase && window.firebaseConfig && window.firebaseConfig.isAvailable()) {
                await this.initializeFirebase();
            }
            
            // Démarrer la surveillance des utilisateurs
            this.startMonitoring();
            
            // Démarrer la sauvegarde automatique
            this.startBackupProcess();
            
            // Configurer les écouteurs d'événements
            this.setupEventListeners();
            
            this.isActive = true;
            console.log('✅ Système de sauvegarde en temps réel activé');
            
            // Émettre l'événement de démarrage
            this.dispatchEvent(this.events.monitoringStarted, { timestamp: Date.now() });
            
        } catch (error) {
            console.error('❌ Erreur initialisation système de sauvegarde:', error);
            this.isActive = false;
            this.dispatchEvent(this.events.backupError, { error: error.message, timestamp: Date.now() });
        }
    }
    
    /**
     * Initialise Firebase pour la sauvegarde
     */
    async initializeFirebase() {
        try {
            if (window.firebaseConfig && window.firebaseConfig.isAvailable()) {
                this.firebaseBackup = {
                    enabled: true,
                    path: this.config.backupPath,
                    compression: this.config.enableCompression
                };
                console.log('🔥 Sauvegarde Firebase configurée');
            }
        } catch (error) {
            console.warn('⚠️ Erreur configuration Firebase:', error);
            this.firebaseBackup = { enabled: false };
        }
    }
    
    /**
     * Crée une session utilisateur unique
     */
    createUserSession() {
        const sessionId = this.generateId('session');
        const session = {
            id: sessionId,
            startTime: Date.now(),
            userAgent: navigator.userAgent,
            language: navigator.language,
            timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
            screen: {
                width: screen.width,
                height: screen.height,
                colorDepth: screen.colorDepth
            },
            connection: this.getConnectionInfo(),
            location: this.getLocationInfo()
        };
        
        this.sessionData.set(sessionId, session);
        return sessionId;
    }
    
    /**
     * Démarre la surveillance des activités utilisateur
     */
    startMonitoring() {
        if (this.isActive) {
            console.log('📊 Démarrage de la surveillance des activités utilisateur...');
            this.startActivityTracking();
            this.dispatchEvent(this.events.monitoringStarted, { timestamp: Date.now() });
        }
    }
    
    /**
     * Arrête la surveillance des activités utilisateur
     */
    stopMonitoring() {
        if (this.isActive) {
            console.log('⏹️ Arrêt de la surveillance des activités utilisateur...');
            this.stopActivityTracking();
            this.dispatchEvent(this.events.monitoringStopped, { timestamp: Date.now() });
        }
    }
    
    /**
     * Configure les écouteurs d'événements pour la surveillance
     */
    setupEventListeners() {
        if (this.config.trackClicks) {
            document.addEventListener('click', this.handleUserActivity.bind(this), true);
        }
        
        if (this.config.trackInputs) {
            document.addEventListener('input', this.handleUserActivity.bind(this), true);
            document.addEventListener('change', this.handleUserActivity.bind(this), true);
        }
        
        if (this.config.trackScroll) {
            document.addEventListener('scroll', this.throttle(this.handleUserActivity.bind(this), 100), true);
        }
        
        if (this.config.trackNavigation) {
            window.addEventListener('popstate', this.handleUserActivity.bind(this));
            window.addEventListener('beforeunload', this.handleUserActivity.bind(this));
        }
        
        if (this.config.trackForms) {
            document.addEventListener('submit', this.handleUserActivity.bind(this), true);
        }
        
        if (this.config.trackDOM) {
            this.setupDOMObserver();
        }
        
        if (this.config.trackMouse) {
            document.addEventListener('mousemove', this.throttle(this.handleUserActivity.bind(this), 200), true);
        }
    }
    
    /**
     * Supprime les écouteurs d'événements
     */
    removeEventListeners() {
        document.removeEventListener('click', this.handleUserActivity.bind(this), true);
        document.removeEventListener('input', this.handleUserActivity.bind(this), true);
        document.removeEventListener('change', this.handleUserActivity.bind(this), true);
        document.removeEventListener('scroll', this.throttle(this.handleUserActivity.bind(this), 100), true);
        document.removeEventListener('submit', this.handleUserActivity.bind(this), true);
        document.removeEventListener('mousemove', this.throttle(this.handleUserActivity.bind(this), 200), true);
    }
    
    /**
     * Gère les activités utilisateur
     */
    handleUserActivity(event) {
        if (!this.isActive) return;
        
        const activity = this.getEventDetails(event);
        if (activity) {
            const sessionId = this.createUserSession();
            this.userActivities.set(activity.id, {
                ...activity,
                sessionId,
                timestamp: Date.now()
            });
            
            // Ajouter à la file d'attente de sauvegarde
            this.backupQueue.push(activity.id);
            
            // Limiter la taille de la file d'attente
            if (this.backupQueue.length > this.config.maxQueueSize) {
                this.backupQueue.shift();
            }
            
            // Émettre l'événement d'activité utilisateur
            this.dispatchEvent(this.events.userActivity, { activity, timestamp: Date.now() });
            
            // Mettre à jour les statistiques
            this.updateStats();
        }
    }
    
    /**
     * Extrait les détails d'un événement
     */
    getEventDetails(event) {
        try {
            const target = event.target;
            const activity = {
                id: this.generateId('activity'),
                type: event.type,
                target: {
                    tagName: target.tagName,
                    id: target.id,
                    className: target.className,
                    textContent: target.textContent ? target.textContent.substring(0, 100) : '',
                    href: target.href || '',
                    value: target.value || ''
                },
                position: {
                    x: event.clientX || 0,
                    y: event.clientY || 0,
                    pageX: event.pageX || 0,
                    pageY: event.pageY || 0
                },
                timestamp: Date.now(),
                url: window.location.href,
                referrer: document.referrer
            };
            
            return activity;
        } catch (error) {
            console.warn('⚠️ Erreur extraction détails événement:', error);
            return null;
        }
    }
    
    /**
     * Configure l'observateur DOM pour les changements
     */
    setupDOMObserver() {
        if (window.MutationObserver) {
            this.domObserver = new MutationObserver(this.throttle((mutations) => {
                mutations.forEach(mutation => {
                    if (mutation.type === 'childList' || mutation.type === 'attributes') {
                        this.handleUserActivity({
                            type: 'DOMChange',
                            target: mutation.target,
                            timestamp: Date.now()
                        });
                    }
                });
            }, 500));
            
            this.domObserver.observe(document.body, {
                childList: true,
                subtree: true,
                attributes: true,
                attributeFilter: ['class', 'style', 'data-*']
            });
        }
    }
    
    /**
     * Démarre le suivi des activités
     */
    startActivityTracking() {
        this.activityTrackingActive = true;
        console.log('📈 Suivi des activités activé');
    }
    
    /**
     * Arrête le suivi des activités
     */
    stopActivityTracking() {
        this.activityTrackingActive = false;
        console.log('⏸️ Suivi des activités arrêté');
    }
    
    /**
     * Démarre le processus de sauvegarde automatique
     */
    startBackupProcess() {
        if (this.backupInterval) {
            clearInterval(this.backupInterval);
        }
        
        this.backupInterval = setInterval(() => {
            if (this.isActive && this.backupQueue.length > 0) {
                this.performBackup();
            }
        }, this.config.backupIntervalMs);
        
        console.log('💾 Processus de sauvegarde automatique démarré');
    }
    
    /**
     * Arrête le processus de sauvegarde automatique
     */
    stopBackupProcess() {
        if (this.backupInterval) {
            clearInterval(this.backupInterval);
            this.backupInterval = null;
        }
        console.log('⏹️ Processus de sauvegarde automatique arrêté');
    }
    
    /**
     * Effectue une sauvegarde des données
     */
    async performBackup() {
        if (!this.isActive || this.backupQueue.length === 0) return;
        
        const startTime = Date.now();
        const backupId = this.generateId('backup');
        
        try {
            console.log(`💾 Début de la sauvegarde ${backupId}...`);
            
            // Traiter la file d'attente par lots
            const batches = this.processBackupQueue();
            
            // Sauvegarder chaque lot
            for (const batch of batches) {
                if (this.firebaseBackup && this.firebaseBackup.enabled) {
                    await this.saveToFirebase(batch);
                } else {
                    await this.saveToLocalStorage(batch);
                }
            }
            
            // Mettre à jour les statistiques
            const duration = Date.now() - startTime;
            this.backupStats.totalBackups++;
            this.backupStats.lastBackupDuration = duration;
            this.lastBackupTime = Date.now();
            
            // Vider la file d'attente
            this.backupQueue = [];
            
            console.log(`✅ Sauvegarde ${backupId} terminée en ${duration}ms`);
            
            // Émettre l'événement de succès
            this.dispatchEvent(this.events.backupSuccess, {
                backupId,
                duration,
                timestamp: Date.now(),
                stats: this.backupStats
            });
            
        } catch (error) {
            console.error(`❌ Erreur lors de la sauvegarde ${backupId}:`, error);
            this.backupStats.errors++;
            
            // Émettre l'événement d'erreur
            this.dispatchEvent(this.events.backupError, {
                backupId,
                error: error.message,
                timestamp: Date.now()
            });
        }
    }
    
    /**
     * Traite la file d'attente de sauvegarde par lots
     */
    processBackupQueue() {
        const batches = [];
        const queue = [...this.backupQueue];
        
        while (queue.length > 0) {
            const batch = queue.splice(0, this.config.batchSize);
            const batchData = batch.map(id => this.userActivities.get(id)).filter(Boolean);
            batches.push(batchData);
        }
        
        return batches;
    }
    
    /**
     * Sauvegarde les données dans Firebase
     */
    async saveToFirebase(data) {
        if (!this.firebaseBackup || !this.firebaseBackup.enabled) {
            throw new Error('Firebase non disponible');
        }
        
        try {
            const backupRef = window.firebaseConfig.database.ref(`${this.firebaseBackup.path}/${Date.now()}`);
            await backupRef.set(data);
            console.log('🔥 Données sauvegardées dans Firebase');
        } catch (error) {
            console.error('❌ Erreur sauvegarde Firebase:', error);
            throw error;
        }
    }
    
    /**
     * Sauvegarde les données dans le stockage local
     */
    async saveToLocalStorage(data) {
        try {
            const key = `backup_${Date.now()}`;
            const backupData = {
                timestamp: Date.now(),
                data: data,
                version: '1.0.0'
            };
            
            localStorage.setItem(key, JSON.stringify(backupData));
            console.log('💾 Données sauvegardées en local');
            
            // Nettoyer les anciennes sauvegardes
            this.cleanupOldBackups();
            
        } catch (error) {
            console.error('❌ Erreur sauvegarde locale:', error);
            throw error;
        }
    }
    
    /**
     * Sauvegarde une session utilisateur
     */
    async saveSession(session) {
        try {
            if (this.firebaseBackup && this.firebaseBackup.enabled) {
                await this.saveToFirebase({ type: 'session', ...session });
            } else {
                await this.saveToLocalStorage({ type: 'session', ...session });
            }
        } catch (error) {
            console.error('❌ Erreur sauvegarde session:', error);
        }
    }
    
    /**
     * Force une sauvegarde immédiate
     */
    async forceBackup() {
        if (!this.isActive) {
            console.warn('⚠️ Le système de sauvegarde n\'est pas actif');
            return;
        }
        
        console.log('🚀 Sauvegarde forcée...');
        await this.performBackup();
    }
    
    /**
     * Nettoie les anciennes sauvegardes
     */
    cleanupOldBackups() {
        try {
            const cutoff = Date.now() - (this.config.retentionDays * 24 * 60 * 60 * 1000);
            const keys = Object.keys(localStorage);
            
            keys.forEach(key => {
                if (key.startsWith('backup_')) {
                    try {
                        const backup = JSON.parse(localStorage.getItem(key));
                        if (backup.timestamp < cutoff) {
                            localStorage.removeItem(key);
                        }
                    } catch (e) {
                        // Ignorer les clés corrompues
                    }
                }
            });
        } catch (error) {
            console.warn('⚠️ Erreur nettoyage sauvegardes:', error);
        }
    }
    
    /**
     * Réinitialise les statistiques
     */
    resetStats() {
        this.backupStats = {
            totalBackups: 0,
            totalUsers: 0,
            totalActivities: 0,
            lastBackupDuration: 0,
            errors: 0
        };
        console.log('🔄 Statistiques réinitialisées');
    }
    
    /**
     * Met à jour les statistiques
     */
    updateStats() {
        this.backupStats.totalActivities = this.userActivities.size;
        this.backupStats.totalUsers = this.sessionData.size;
        
        // Émettre l'événement de mise à jour des stats
        this.dispatchEvent(this.events.statsUpdated, {
            stats: this.backupStats,
            timestamp: Date.now()
        });
    }
    
    /**
     * Obtient les statistiques actuelles
     */
    getStats() {
        return {
            ...this.backupStats,
            currentQueueSize: this.backupQueue.length,
            totalSessions: this.sessionData.size,
            isActive: this.isActive,
            lastBackup: this.lastBackupTime
        };
    }
    
    /**
     * Obtient le statut du système
     */
    getSystemStatus() {
        return {
            isActive: this.isActive,
            monitoring: this.activityTrackingActive,
            backupProcess: !!this.backupInterval,
            firebaseEnabled: this.firebaseBackup ? this.firebaseBackup.enabled : false,
            queueSize: this.backupQueue.length,
            lastBackup: this.lastBackupTime
        };
    }
    
    /**
     * Active le système
     */
    activate() {
        if (!this.isActive) {
            this.initialize();
        }
    }
    
    /**
     * Désactive le système
     */
    deactivate() {
        if (this.isActive) {
            this.stopMonitoring();
            this.stopBackupProcess();
            this.removeEventListeners();
            this.isActive = false;
            console.log('⏹️ Système de sauvegarde désactivé');
        }
    }
    
    /**
     * Nettoie les ressources
     */
    cleanup() {
        this.deactivate();
        
        if (this.domObserver) {
            this.domObserver.disconnect();
        }
        
        this.userActivities.clear();
        this.sessionData.clear();
        this.backupQueue = [];
        
        console.log('🧹 Nettoyage des ressources terminé');
    }
    
    /**
     * Génère un ID unique
     */
    generateId(prefix = 'id') {
        return `${prefix}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    }
    
    /**
     * Obtient les informations de connexion
     */
    getConnectionInfo() {
        if (navigator.connection) {
            return {
                effectiveType: navigator.connection.effectiveType,
                downlink: navigator.connection.downlink,
                rtt: navigator.connection.rtt
            };
        }
        return { effectiveType: 'unknown', downlink: 0, rtt: 0 };
    }
    
    /**
     * Obtient les informations de localisation
     */
    getLocationInfo() {
        return {
            href: window.location.href,
            pathname: window.location.pathname,
            search: window.location.search,
            hash: window.location.hash,
            referrer: document.referrer
        };
    }
    
    /**
     * Limite la fréquence d'exécution d'une fonction
     */
    throttle(func, limit) {
        let inThrottle;
        return function() {
            const args = arguments;
            const context = this;
            if (!inThrottle) {
                func.apply(context, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    }
    
    /**
     * Émet un événement personnalisé
     */
    dispatchEvent(eventName, data = {}) {
        const event = new CustomEvent(eventName, {
            detail: data,
            bubbles: true,
            cancelable: true
        });
        document.dispatchEvent(event);
    }
}

// Initialisation automatique si le DOM est prêt
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        window.realTimeBackupSystem = new RealTimeBackupSystem();
    });
} else {
    window.realTimeBackupSystem = new RealTimeBackupSystem();
}

// Export pour utilisation dans d'autres modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = RealTimeBackupSystem;
}
