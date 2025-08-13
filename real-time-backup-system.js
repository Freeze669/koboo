/**
 * SYSTÈME DE SAUVEGARDE EN TEMPS RÉEL
 * Surveille et sauvegarde automatiquement toutes les activités des utilisateurs
 * 
 * @author Mayu & Jack Studio
 * @version 1.0.0
 */

class RealTimeBackupSystem {
    constructor() {
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
            backupPath: 'site-backups' // Chemin Firebase pour les sauvegardes
        };
        
        this.initialize();
    }
    
    /**
     * Initialise le système de sauvegarde
     */
    initialize() {
        try {
            console.log('🚀 Initialisation du système de sauvegarde en temps réel...');
            
            // Vérifier la disponibilité de Firebase
            if (window.firebaseConfig && window.firebaseConfig.isAvailable()) {
                this.setupFirebaseBackup();
            } else {
                this.setupLocalBackup();
            }
            
            // Démarrer la surveillance des utilisateurs
            this.startUserMonitoring();
            
            // Démarrer la sauvegarde automatique
            this.startAutoBackup();
            
            // Configurer les écouteurs d'événements
            this.setupEventListeners();
            
            this.isActive = true;
            console.log('✅ Système de sauvegarde en temps réel activé');
            
            // Afficher l'indicateur de statut
            this.showStatusIndicator();
            
        } catch (error) {
            console.error('❌ Erreur initialisation système de sauvegarde:', error);
            this.isActive = false;
        }
    }
    
    /**
     * Configure la sauvegarde Firebase
     */
    setupFirebaseBackup() {
        try {
            this.firebaseBackup = {
                enabled: true,
                path: this.config.backupPath,
                compression: this.config.enableCompression
            };
            
            console.log('🔥 Sauvegarde Firebase configurée');
            
            // Créer la structure de sauvegarde
            this.createBackupStructure();
            
        } catch (error) {
            console.warn('⚠️ Erreur configuration Firebase, fallback vers local:', error);
            this.setupLocalBackup();
        }
    }
    
    /**
     * Configure la sauvegarde locale
     */
    setupLocalBackup() {
        this.localBackup = {
            enabled: true,
            storageKey: 'koboo-backup-data',
            maxSize: 50 * 1024 * 1024 // 50MB max
        };
        
        console.log('💾 Sauvegarde locale configurée');
    }
    
    /**
     * Crée la structure de sauvegarde dans Firebase
     */
    async createBackupStructure() {
        if (!this.firebaseBackup?.enabled) return;
        
        try {
            const structure = {
                metadata: {
                    created: Date.now(),
                    version: '1.0.0',
                    system: 'koboo-backup',
                    lastUpdate: Date.now()
                },
                users: {},
                activities: {},
                sessions: {},
                statistics: this.backupStats
            };
            
            await window.firebaseConfig.save(`${this.firebaseBackup.path}/structure`, structure);
            console.log('🏗️ Structure de sauvegarde Firebase créée');
            
        } catch (error) {
            console.warn('⚠️ Erreur création structure Firebase:', error);
        }
    }
    
    /**
     * Démarre la surveillance des utilisateurs
     */
    startUserMonitoring() {
        // Surveillance des connexions
        this.monitorUserConnections();
        
        // Surveillance des activités
        this.monitorUserActivities();
        
        // Surveillance des sessions
        this.monitorUserSessions();
        
        // Surveillance des formulaires
        this.monitorFormSubmissions();
        
        // Surveillance de la navigation
        this.monitorNavigation();
        
        // Surveillance des interactions
        this.monitorUserInteractions();
        
        console.log('👥 Surveillance des utilisateurs activée');
    }
    
    /**
     * Surveille les connexions des utilisateurs
     */
    monitorUserConnections() {
        // Détecter les nouveaux utilisateurs
        const detectNewUser = () => {
            const userId = this.generateUserId();
            const userData = {
                id: userId,
                firstSeen: Date.now(),
                lastSeen: Date.now(),
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
            
            this.userActivities.set(userId, userData);
            this.sessionData.set(userId, {
                startTime: Date.now(),
                pages: [],
                actions: [],
                duration: 0
            });
            
            console.log(`👤 Nouvel utilisateur détecté: ${userId}`);
            
            // Ajouter à la file de sauvegarde
            this.addToBackupQueue('user_connection', userId, userData);
        };
        
        // Détecter si c'est un nouvel utilisateur ou un retour
        if (!this.hasExistingSession()) {
            detectNewUser();
        } else {
            this.updateExistingUser();
        }
        
        // Surveiller les changements de visibilité de page
        document.addEventListener('visibilitychange', () => {
            this.handleVisibilityChange();
        });
        
        // Surveiller les changements de focus
        window.addEventListener('focus', () => this.handleFocusChange(true));
        window.addEventListener('blur', () => this.handleFocusChange(false));
    }
    
    /**
     * Surveille les activités des utilisateurs
     */
    monitorUserActivities() {
        // Clics
        document.addEventListener('click', (e) => {
            this.recordUserActivity('click', {
                element: e.target.tagName,
                text: e.target.textContent?.substring(0, 100),
                position: { x: e.clientX, y: e.clientY },
                timestamp: Date.now()
            });
        });
        
        // Saisie de texte
        document.addEventListener('input', (e) => {
            if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') {
                this.recordUserActivity('input', {
                    element: e.target.tagName,
                    field: e.target.name || e.target.id,
                    length: e.target.value.length,
                    timestamp: Date.now()
                });
            }
        });
        
        // Scroll
        let scrollTimeout;
        window.addEventListener('scroll', () => {
            clearTimeout(scrollTimeout);
            scrollTimeout = setTimeout(() => {
                this.recordUserActivity('scroll', {
                    position: window.scrollY,
                    maxScroll: document.documentElement.scrollHeight - window.innerHeight,
                    timestamp: Date.now()
                });
            }, 100);
        });
        
        // Mouvements de souris (avec throttling)
        let mouseTimeout;
        document.addEventListener('mousemove', (e) => {
            clearTimeout(mouseTimeout);
            mouseTimeout = setTimeout(() => {
                this.recordUserActivity('mouse_move', {
                    position: { x: e.clientX, y: e.clientY },
                    timestamp: Date.now()
                });
            }, 500);
        });
        
        // Touches (mobile)
        document.addEventListener('touchstart', (e) => {
            this.recordUserActivity('touch', {
                touches: e.touches.length,
                position: { x: e.touches[0].clientX, y: e.touches[0].clientY },
                timestamp: Date.now()
            });
        });
    }
    
    /**
     * Surveille les sessions des utilisateurs
     */
    monitorUserSessions() {
        // Mise à jour de la durée de session
        setInterval(() => {
            this.updateSessionDuration();
        }, 1000);
        
        // Sauvegarde de session avant fermeture
        window.addEventListener('beforeunload', () => {
            this.saveSessionBeforeUnload();
        });
        
        // Sauvegarde de session lors des changements de page
        window.addEventListener('popstate', () => {
            this.handlePageChange();
        });
    }
    
    /**
     * Surveille les soumissions de formulaires
     */
    monitorFormSubmissions() {
        document.addEventListener('submit', (e) => {
            this.recordUserActivity('form_submit', {
                form: e.target.id || e.target.className,
                fields: this.getFormFields(e.target),
                timestamp: Date.now()
            });
        });
    }
    
    /**
     * Surveille la navigation
     */
    monitorNavigation() {
        // Changements de hash
        window.addEventListener('hashchange', () => {
            this.handlePageChange();
        });
        
        // Navigation programmatique
        const originalPushState = history.pushState;
        history.pushState = (...args) => {
            originalPushState.apply(history, args);
            this.handlePageChange();
        };
    }
    
    /**
     * Surveille les interactions utilisateur
     */
    monitorUserInteractions() {
        // Sélection de texte
        document.addEventListener('selectionchange', () => {
            const selection = window.getSelection();
            if (selection.toString().length > 0) {
                this.recordUserActivity('text_selection', {
                    text: selection.toString().substring(0, 100),
                    timestamp: Date.now()
                });
            }
        });
        
        // Copier/Coller
        document.addEventListener('copy', () => {
            this.recordUserActivity('copy', { timestamp: Date.now() });
        });
        
        document.addEventListener('paste', () => {
            this.recordUserActivity('paste', { timestamp: Date.now() });
        });
        
        // Raccourcis clavier
        document.addEventListener('keydown', (e) => {
            if (e.ctrlKey || e.metaKey) {
                this.recordUserActivity('keyboard_shortcut', {
                    keys: `${e.ctrlKey ? 'Ctrl+' : ''}${e.metaKey ? 'Cmd+' : ''}${e.key}`,
                    timestamp: Date.now()
                });
            }
        });
    }
    
    /**
     * Enregistre une activité utilisateur
     */
    recordUserActivity(type, data) {
        const userId = this.getCurrentUserId();
        if (!userId) return;
        
        const activity = {
            id: this.generateActivityId(),
            type: type,
            userId: userId,
            timestamp: Date.now(),
            data: data,
            page: window.location.pathname + window.location.hash,
            url: window.location.href
        };
        
        // Ajouter à l'historique de l'utilisateur
        const userData = this.userActivities.get(userId);
        if (userData) {
            if (!userData.activities) userData.activities = [];
            userData.activities.push(activity);
            userData.lastSeen = Date.now();
            
            // Limiter le nombre d'activités en mémoire
            if (userData.activities.length > 100) {
                userData.activities = userData.activities.slice(-50);
            }
        }
        
        // Ajouter à la file de sauvegarde
        this.addToBackupQueue('user_activity', activity.id, activity);
        
        // Mettre à jour les statistiques
        this.backupStats.totalActivities++;
    }
    
    /**
     * Démarre la sauvegarde automatique
     */
    startAutoBackup() {
        this.backupInterval = setInterval(() => {
            this.performBackup();
        }, this.config.backupIntervalMs);
        
        console.log(`⏰ Sauvegarde automatique programmée toutes les ${this.config.backupIntervalMs/1000} secondes`);
    }
    
    /**
     * Effectue une sauvegarde
     */
    async performBackup() {
        if (this.backupQueue.length === 0) return;
        
        const startTime = Date.now();
        console.log(`💾 Début de la sauvegarde (${this.backupQueue.length} éléments en attente)`);
        
        try {
            // Traiter la file par lots
            const batches = this.createBackupBatches();
            
            for (const batch of batches) {
                await this.processBackupBatch(batch);
            }
            
            // Vider la file
            this.backupQueue = [];
            
            // Mettre à jour les statistiques
            const duration = Date.now() - startTime;
            this.backupStats.lastBackupDuration = duration;
            this.backupStats.totalBackups++;
            
            console.log(`✅ Sauvegarde terminée en ${duration}ms`);
            
            // Afficher la confirmation
            this.showBackupConfirmation(duration);
            
        } catch (error) {
            console.error('❌ Erreur lors de la sauvegarde:', error);
            this.backupStats.errors++;
            
            // Afficher l'erreur
            this.showBackupError(error);
        }
    }
    
    /**
     * Traite un lot de sauvegarde
     */
    async processBackupBatch(batch) {
        if (this.firebaseBackup?.enabled) {
            await this.saveBatchToFirebase(batch);
        } else if (this.localBackup?.enabled) {
            await this.saveBatchToLocal(batch);
        }
    }
    
    /**
     * Sauvegarde un lot dans Firebase
     */
    async saveBatchToFirebase(batch) {
        try {
            const batchData = {
                timestamp: Date.now(),
                items: batch,
                metadata: {
                    source: 'koboo-backup-system',
                    version: '1.0.0'
                }
            };
            
            const batchId = `batch_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
            await window.firebaseConfig.save(
                `${this.firebaseBackup.path}/batches/${batchId}`,
                batchData
            );
            
            console.log(`🔥 Lot sauvegardé dans Firebase: ${batchId}`);
            
        } catch (error) {
            console.error('❌ Erreur sauvegarde Firebase:', error);
            throw error;
        }
    }
    
    /**
     * Sauvegarde un lot en local
     */
    async saveBatchToLocal(batch) {
        try {
            const existingData = this.getLocalBackupData();
            const batchId = `batch_${Date.now()}`;
            
            existingData.batches = existingData.batches || {};
            existingData.batches[batchId] = {
                timestamp: Date.now(),
                items: batch
            };
            
            // Nettoyer les anciens lots
            this.cleanupOldLocalBatches(existingData);
            
            // Sauvegarder
            localStorage.setItem(this.localBackup.storageKey, JSON.stringify(existingData));
            
            console.log(`💾 Lot sauvegardé en local: ${batchId}`);
            
        } catch (error) {
            console.error('❌ Erreur sauvegarde locale:', error);
            throw error;
        }
    }
    
    /**
     * Ajoute un élément à la file de sauvegarde
     */
    addToBackupQueue(type, id, data) {
        const item = {
            type: type,
            id: id,
            data: data,
            timestamp: Date.now(),
            priority: this.getPriority(type)
        };
        
        this.backupQueue.push(item);
        
        // Limiter la taille de la file
        if (this.backupQueue.length > this.config.maxQueueSize) {
            this.backupQueue = this.backupQueue.slice(-this.config.maxQueueSize / 2);
        }
    }
    
    /**
     * Détermine la priorité d'un élément
     */
    getPriority(type) {
        const priorities = {
            'user_connection': 1,    // Priorité haute
            'form_submit': 2,        // Priorité haute
            'user_activity': 3,      // Priorité moyenne
            'session_update': 4      // Priorité basse
        };
        
        return priorities[type] || 5;
    }
    
    /**
     * Crée des lots de sauvegarde
     */
    createBackupBatches() {
        const batches = [];
        const sortedQueue = [...this.backupQueue].sort((a, b) => a.priority - b.priority);
        
        for (let i = 0; i < sortedQueue.length; i += this.config.batchSize) {
            batches.push(sortedQueue.slice(i, i + this.config.batchSize));
        }
        
        return batches;
    }
    
    /**
     * Affiche l'indicateur de statut
     */
    showStatusIndicator() {
        const indicator = document.createElement('div');
        indicator.id = 'backup-status-indicator';
        indicator.innerHTML = `
            <div class="backup-status-content">
                <i class="fas fa-database"></i>
                <span class="backup-status-text">Sauvegarde Active</span>
                <div class="backup-status-dot"></div>
            </div>
        `;
        
        // Styles
        indicator.style.cssText = `
            position: fixed;
            bottom: 20px;
            right: 20px;
            background: linear-gradient(45deg, #10b981, #059669);
            color: white;
            padding: 0.75rem 1rem;
            border-radius: 25px;
            font-size: 0.8rem;
            z-index: 10000;
            box-shadow: 0 4px 15px rgba(16, 185, 129, 0.3);
            cursor: pointer;
            transition: all 0.3s ease;
        `;
        
        // Styles pour le contenu
        const style = document.createElement('style');
        style.textContent = `
            .backup-status-content {
                display: flex;
                align-items: center;
                gap: 0.5rem;
            }
            
            .backup-status-dot {
                width: 8px;
                height: 8px;
                background: #22c55e;
                border-radius: 50%;
                animation: backupPulse 2s infinite;
            }
            
            @keyframes backupPulse {
                0%, 100% { opacity: 1; transform: scale(1); }
                50% { opacity: 0.5; transform: scale(1.2); }
            }
            
            #backup-status-indicator:hover {
                transform: translateY(-2px);
                box-shadow: 0 6px 20px rgba(16, 185, 129, 0.4);
            }
        `;
        document.head.appendChild(style);
        
        // Clic pour afficher les détails
        indicator.addEventListener('click', () => {
            this.showBackupDetails();
        });
        
        document.body.appendChild(indicator);
    }
    
    /**
     * Affiche les détails de la sauvegarde
     */
    showBackupDetails() {
        const modal = document.createElement('div');
        modal.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.8);
            z-index: 10001;
            display: flex;
            align-items: center;
            justify-content: center;
        `;
        
        const content = document.createElement('div');
        content.style.cssText = `
            background: white;
            padding: 2rem;
            border-radius: 15px;
            max-width: 600px;
            max-height: 80vh;
            overflow-y: auto;
            color: #333;
        `;
        
        content.innerHTML = `
            <h2><i class="fas fa-database"></i> Statut de la Sauvegarde</h2>
            <div class="backup-stats">
                <div class="stat-item">
                    <strong>Statut:</strong> 
                    <span style="color: #10b981;">✅ Actif</span>
                </div>
                <div class="stat-item">
                    <strong>Sauvegardes totales:</strong> ${this.backupStats.totalBackups}
                </div>
                <div class="stat-item">
                    <strong>Utilisateurs surveillés:</strong> ${this.userActivities.size}
                </div>
                <div class="stat-item">
                    <strong>Activités enregistrées:</strong> ${this.backupStats.totalActivities}
                </div>
                <div class="stat-item">
                    <strong>Dernière sauvegarde:</strong> ${this.formatTime(this.lastBackupTime)}
                </div>
                <div class="stat-item">
                    <strong>Durée moyenne:</strong> ${this.backupStats.lastBackupDuration}ms
                </div>
                <div class="stat-item">
                    <strong>Éléments en attente:</strong> ${this.backupQueue.length}
                </div>
            </div>
            
            <div class="backup-actions">
                <button id="force-backup" style="
                    background: #10b981;
                    color: white;
                    border: none;
                    padding: 0.5rem 1rem;
                    border-radius: 5px;
                    cursor: pointer;
                    margin-right: 0.5rem;
                ">Forcer Sauvegarde</button>
                <button id="close-backup-modal" style="
                    background: #6b7280;
                    color: white;
                    border: none;
                    padding: 0.5rem 1rem;
                    border-radius: 5px;
                    cursor: pointer;
                ">Fermer</button>
            </div>
        `;
        
        modal.appendChild(content);
        document.body.appendChild(modal);
        
        // Événements
        document.getElementById('force-backup').addEventListener('click', () => {
            this.performBackup();
            content.querySelector('#force-backup').textContent = 'Sauvegarde...';
            content.querySelector('#force-backup').disabled = true;
        });
        
        document.getElementById('close-backup-modal').addEventListener('click', () => {
            document.body.removeChild(modal);
        });
        
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                document.body.removeChild(modal);
            }
        });
    }
    
    /**
     * Affiche la confirmation de sauvegarde
     */
    showBackupConfirmation(duration) {
        const notification = document.createElement('div');
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            left: 50%;
            transform: translateX(-50%);
            background: linear-gradient(45deg, #10b981, #059669);
            color: white;
            padding: 0.75rem 1.5rem;
            border-radius: 25px;
            font-size: 0.9rem;
            z-index: 10000;
            box-shadow: 0 4px 15px rgba(16, 185, 129, 0.3);
            animation: slideInDown 0.3s ease;
        `;
        
        notification.innerHTML = `
            <i class="fas fa-check-circle"></i>
            Sauvegarde terminée en ${duration}ms
        `;
        
        // Animation CSS
        const style = document.createElement('style');
        style.textContent = `
            @keyframes slideInDown {
                from { transform: translateX(-50%) translateY(-100%); opacity: 0; }
                to { transform: translateX(-50%) translateY(0); opacity: 1; }
            }
        `;
        document.head.appendChild(style);
        
        document.body.appendChild(notification);
        
        // Auto-suppression
        setTimeout(() => {
            if (notification.parentNode) {
                notification.style.animation = 'slideOutUp 0.3s ease';
                setTimeout(() => {
                    if (notification.parentNode) {
                        document.body.removeChild(notification);
                    }
                }, 300);
            }
        }, 3000);
    }
    
    /**
     * Affiche les erreurs de sauvegarde
     */
    showBackupError(error) {
        const notification = document.createElement('div');
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            left: 50%;
            transform: translateX(-50%);
            background: linear-gradient(45deg, #ef4444, #dc2626);
            color: white;
            padding: 0.75rem 1.5rem;
            border-radius: 25px;
            font-size: 0.9rem;
            z-index: 10000;
            box-shadow: 0 4px 15px rgba(239, 68, 68, 0.3);
            animation: slideInDown 0.3s ease;
        `;
        
        notification.innerHTML = `
            <i class="fas fa-exclamation-triangle"></i>
            Erreur de sauvegarde: ${error.message}
        `;
        
        document.body.appendChild(notification);
        
        // Auto-suppression
        setTimeout(() => {
            if (notification.parentNode) {
                document.body.removeChild(notification);
            }
        }, 5000);
    }
    
    // ========================================
    // UTILITAIRES
    // ========================================
    
    /**
     * Génère un ID utilisateur unique
     */
    generateUserId() {
        return `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    }
    
    /**
     * Génère un ID d'activité unique
     */
    generateActivityId() {
        return `activity_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    }
    
    /**
     * Obtient l'ID de l'utilisateur actuel
     */
    getCurrentUserId() {
        // Retourner le premier utilisateur trouvé (pour la démo)
        return Array.from(this.userActivities.keys())[0];
    }
    
    /**
     * Vérifie s'il y a une session existante
     */
    hasExistingSession() {
        return localStorage.getItem('koboo-user-session') !== null;
    }
    
    /**
     * Met à jour un utilisateur existant
     */
    updateExistingUser() {
        const sessionData = localStorage.getItem('koboo-user-session');
        if (sessionData) {
            try {
                const session = JSON.parse(sessionData);
                const userId = session.userId;
                
                if (this.userActivities.has(userId)) {
                    const userData = this.userActivities.get(userId);
                    userData.lastSeen = Date.now();
                    userData.returnVisits = (userData.returnVisits || 0) + 1;
                }
            } catch (error) {
                console.warn('⚠️ Erreur lecture session existante:', error);
            }
        }
    }
    
    /**
     * Gère les changements de visibilité
     */
    handleVisibilityChange() {
        const userId = this.getCurrentUserId();
        if (!userId) return;
        
        if (document.hidden) {
            this.recordUserActivity('page_hidden', { timestamp: Date.now() });
        } else {
            this.recordUserActivity('page_visible', { timestamp: Date.now() });
        }
    }
    
    /**
     * Gère les changements de focus
     */
    handleFocusChange(hasFocus) {
        const userId = this.getCurrentUserId();
        if (!userId) return;
        
        this.recordUserActivity(hasFocus ? 'window_focus' : 'window_blur', {
            timestamp: Date.now()
        });
    }
    
    /**
     * Met à jour la durée de session
     */
    updateSessionDuration() {
        const userId = this.getCurrentUserId();
        if (!userId) return;
        
        const session = this.sessionData.get(userId);
        if (session) {
            session.duration = Date.now() - session.startTime;
        }
    }
    
    /**
     * Sauvegarde la session avant fermeture
     */
    saveSessionBeforeUnload() {
        const userId = this.getCurrentUserId();
        if (!userId) return;
        
        const session = this.sessionData.get(userId);
        if (session) {
            session.endTime = Date.now();
            session.finalDuration = session.endTime - session.startTime;
            
            // Sauvegarder immédiatement
            this.addToBackupQueue('session_end', userId, session);
            
            // Forcer la sauvegarde
            this.performBackup();
        }
    }
    
    /**
     * Gère les changements de page
     */
    handlePageChange() {
        const userId = this.getCurrentUserId();
        if (!userId) return;
        
        const session = this.sessionData.get(userId);
        if (session) {
            session.pages.push({
                url: window.location.href,
                timestamp: Date.now()
            });
        }
        
        this.recordUserActivity('page_change', {
            from: document.referrer,
            to: window.location.href,
            timestamp: Date.now()
        });
    }
    
    /**
     * Obtient les informations de connexion
     */
    getConnectionInfo() {
        if ('connection' in navigator) {
            return {
                effectiveType: navigator.connection.effectiveType,
                downlink: navigator.connection.downlink,
                rtt: navigator.connection.rtt
            };
        }
        return { available: false };
    }
    
    /**
     * Obtient les informations de localisation
     */
    getLocationInfo() {
        return {
            timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
            language: navigator.language,
            country: navigator.language.split('-')[1] || 'unknown'
        };
    }
    
    /**
     * Obtient les champs d'un formulaire
     */
    getFormFields(form) {
        const fields = [];
        const formElements = form.elements;
        
        for (let i = 0; i < formElements.length; i++) {
            const element = formElements[i];
            if (element.name || element.id) {
                fields.push({
                    name: element.name || element.id,
                    type: element.type,
                    required: element.required
                });
            }
        }
        
        return fields;
    }
    
    /**
     * Obtient les données de sauvegarde locale
     */
    getLocalBackupData() {
        try {
            const data = localStorage.getItem(this.localBackup.storageKey);
            return data ? JSON.parse(data) : { batches: {} };
        } catch (error) {
            console.warn('⚠️ Erreur lecture sauvegarde locale:', error);
            return { batches: {} };
        }
    }
    
    /**
     * Nettoie les anciens lots locaux
     */
    cleanupOldLocalBatches(data) {
        const cutoff = Date.now() - (this.config.retentionDays * 24 * 60 * 60 * 1000);
        const batches = data.batches || {};
        
        Object.keys(batches).forEach(batchId => {
            if (batches[batchId].timestamp < cutoff) {
                delete batches[batchId];
            }
        });
    }
    
    /**
     * Formate un timestamp
     */
    formatTime(timestamp) {
        return new Date(timestamp).toLocaleString('fr-FR');
    }
    
    /**
     * Configure les écouteurs d'événements
     */
    setupEventListeners() {
        // Écouter les changements de tarifs
        document.addEventListener('tarifsChanged', (event) => {
            this.recordUserActivity('tarifs_update', {
                source: event.detail.source,
                timestamp: event.detail.timestamp,
                data: event.detail.tarifs
            });
        });
        
        // Écouter les connexions admin
        document.addEventListener('adminLogin', (event) => {
            this.recordUserActivity('admin_login', {
                username: event.detail.username,
                timestamp: Date.now()
            });
        });
        
        // Écouter les modifications de contenu
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
                    this.recordUserActivity('content_change', {
                        type: 'dom_mutation',
                        addedNodes: mutation.addedNodes.length,
                        timestamp: Date.now()
                    });
                }
            });
        });
        
        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    }
    
    /**
     * Arrête le système de sauvegarde
     */
    stop() {
        if (this.backupInterval) {
            clearInterval(this.backupInterval);
        }
        
        // Effectuer une dernière sauvegarde
        this.performBackup();
        
        this.isActive = false;
        console.log('🛑 Système de sauvegarde arrêté');
    }
    
    /**
     * Obtient les statistiques de sauvegarde
     */
    getStats() {
        return {
            ...this.backupStats,
            isActive: this.isActive,
            queueSize: this.backupQueue.length,
            userCount: this.userActivities.size,
            sessionCount: this.sessionData.size
        };
    }
}

// ========================================
// INITIALISATION AUTOMATIQUE
// ========================================

// Initialiser le système quand le DOM est prêt
document.addEventListener('DOMContentLoaded', () => {
    // Attendre que Firebase soit disponible
    const initBackupSystem = () => {
        if (window.firebaseConfig || typeof firebase !== 'undefined') {
            window.realTimeBackupSystem = new RealTimeBackupSystem();
        } else {
            setTimeout(initBackupSystem, 1000);
        }
    };
    
    initBackupSystem();
});

// Exposer le système globalement
window.RealTimeBackupSystem = RealTimeBackupSystem;

console.log('🚀 Module de sauvegarde en temps réel chargé');
