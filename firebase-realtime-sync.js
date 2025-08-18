/**
 * 🔄 Système de Synchronisation Temps Réel Firebase - Mayu & Jack Studio
 * Synchronise automatiquement les modifications du panel admin vers le site index
 */

class FirebaseRealtimeSync {
    constructor() {
        this.isInitialized = false;
        this.listeners = new Map();
        this.syncPaths = {
            tarifs: '/tarifs',
            services: '/services',
            forfaits: '/forfaits',
            contenu: '/contenu',
            images: '/images',
            configuration: '/configuration'
        };
        
        this.init();
    }
    
    /**
     * Initialisation du système
     */
    async init() {
        try {
            // Attendre que Firebase soit disponible
            await this.waitForFirebase();
            
            // Initialiser Firebase
            if (window.firebaseConfig && window.firebaseConfig.initialize) {
                const success = await window.firebaseConfig.initialize();
                if (success) {
                    this.isInitialized = true;
                    console.log('✅ Firebase Realtime Sync initialisé');
                    this.startRealtimeSync();
                } else {
                    console.warn('⚠️ Firebase non disponible, utilisation du mode local');
                }
            } else {
                console.warn('⚠️ Configuration Firebase non trouvée');
            }
        } catch (error) {
            console.error('❌ Erreur initialisation Firebase Realtime Sync:', error);
        }
    }
    
    /**
     * Attendre que Firebase soit disponible
     */
    async waitForFirebase() {
        return new Promise((resolve) => {
            if (typeof firebase !== 'undefined') {
                resolve();
            } else {
                // Attendre que Firebase soit chargé
                const checkFirebase = () => {
                    if (typeof firebase !== 'undefined') {
                        resolve();
                    } else {
                        setTimeout(checkFirebase, 100);
                    }
                };
                checkFirebase();
            }
        });
    }
    
    /**
     * Démarrer la synchronisation temps réel
     */
    startRealtimeSync() {
        if (!this.isInitialized) return;
        
        console.log('🚀 Démarrage de la synchronisation temps réel...');
        
        // Synchroniser les tarifs
        this.syncTarifs();
        
        // Synchroniser les services
        this.syncServices();
        
        // Synchroniser les forfaits
        this.syncForfaits();
        
        // Synchroniser le contenu
        this.syncContenu();
        
        // Synchroniser la configuration
        this.syncConfiguration();
        
        // Créer l'indicateur de synchronisation
        this.createSyncIndicator();
    }
    
    /**
     * Synchroniser les tarifs en temps réel
     */
    syncTarifs() {
        const tarifsRef = window.firebaseConfig.listen('/tarifs', (data) => {
            if (data) {
                console.log('🔄 Tarifs mis à jour en temps réel:', data);
                
                // Mettre à jour la configuration locale
                if (window.tarifsConfig) {
                    window.tarifsConfig.updateTarifsFromFirebase(data);
                }
                
                // Déclencher l'événement de mise à jour
                this.triggerTarifsUpdate(data);
                
                // Mettre à jour l'affichage
                this.updateTarifsDisplay(data);
            }
        });
        
        this.listeners.set('tarifs', tarifsRef);
    }
    
    /**
     * Synchroniser les services en temps réel
     */
    syncServices() {
        const servicesRef = window.firebaseConfig.listen('/services', (data) => {
            if (data) {
                console.log('🔄 Services mis à jour en temps réel:', data);
                
                // Mettre à jour la configuration locale
                if (window.tarifsConfig) {
                    window.tarifsConfig.updateServicesFromFirebase(data);
                }
                
                // Déclencher l'événement de mise à jour
                this.triggerServicesUpdate(data);
            }
        });
        
        this.listeners.set('services', servicesRef);
    }
    
    /**
     * Synchroniser les forfaits en temps réel
     */
    syncForfaits() {
        const forfaitsRef = window.firebaseConfig.listen('/forfaits', (data) => {
            if (data) {
                console.log('🔄 Forfaits mis à jour en temps réel:', data);
                
                // Mettre à jour la configuration locale
                if (window.tarifsConfig) {
                    window.tarifsConfig.updateForfaitsFromFirebase(data);
                }
                
                // Déclencher l'événement de mise à jour
                this.triggerForfaitsUpdate(data);
            }
        });
        
        this.listeners.set('forfaits', forfaitsRef);
    }
    
    /**
     * Synchroniser le contenu en temps réel
     */
    syncContenu() {
        const contenuRef = window.firebaseConfig.listen('/contenu', (data) => {
            if (data) {
                console.log('🔄 Contenu mis à jour en temps réel:', data);
                
                // Déclencher l'événement de mise à jour du contenu
                this.triggerContenuUpdate(data);
                
                // Mettre à jour l'affichage du contenu
                this.updateContenuDisplay(data);
            }
        });
        
        this.listeners.set('contenu', contenuRef);
    }
    
    /**
     * Synchroniser la configuration en temps réel
     */
    syncConfiguration() {
        const configRef = window.firebaseConfig.listen('/configuration', (data) => {
            if (data) {
                console.log('🔄 Configuration mise à jour en temps réel:', data);
                
                // Déclencher l'événement de mise à jour de la configuration
                this.triggerConfigurationUpdate(data);
                
                // Appliquer la nouvelle configuration
                this.applyConfiguration(data);
            }
        });
        
        this.listeners.set('configuration', configRef);
    }
    
    /**
     * Déclencher la mise à jour des tarifs
     */
    triggerTarifsUpdate(tarifs) {
        const event = new CustomEvent('tarifsChanged', {
            detail: {
                tarifs: tarifs,
                timestamp: Date.now(),
                source: 'firebase-realtime'
            }
        });
        document.dispatchEvent(event);
    }
    
    /**
     * Déclencher la mise à jour des services
     */
    triggerServicesUpdate(services) {
        const event = new CustomEvent('servicesChanged', {
            detail: {
                services: services,
                timestamp: Date.now(),
                source: 'firebase-realtime'
            }
        });
        document.dispatchEvent(event);
    }
    
    /**
     * Déclencher la mise à jour des forfaits
     */
    triggerForfaitsUpdate(forfaits) {
        const event = new CustomEvent('forfaitsChanged', {
            detail: {
                forfaits: forfaits,
                timestamp: Date.now(),
                source: 'firebase-realtime'
            }
        });
        document.dispatchEvent(event);
    }
    
    /**
     * Déclencher la mise à jour du contenu
     */
    triggerContenuUpdate(contenu) {
        const event = new CustomEvent('contenuChanged', {
            detail: {
                contenu: contenu,
                timestamp: Date.now(),
                source: 'firebase-realtime'
            }
        });
        document.dispatchEvent(event);
    }
    
    /**
     * Déclencher la mise à jour de la configuration
     */
    triggerConfigurationUpdate(config) {
        const event = new CustomEvent('configurationChanged', {
            detail: {
                configuration: config,
                timestamp: Date.now(),
                source: 'firebase-realtime'
            }
        });
        document.dispatchEvent(event);
    }
    
    /**
     * Mettre à jour l'affichage des tarifs
     */
    updateTarifsDisplay(tarifs) {
        // Mettre à jour l'affichage si la fonction existe
        if (typeof renderTarifsDisplay === 'function') {
            renderTarifsDisplay();
        }
        
        // Mettre à jour avec animation si disponible
        if (typeof updateTarifsDisplayWithAnimation === 'function') {
            updateTarifsDisplayWithAnimation(tarifs);
        }
    }
    
    /**
     * Mettre à jour l'affichage du contenu
     */
    updateContenuDisplay(contenu) {
        // Mettre à jour le titre de la page
        if (contenu.titre) {
            document.title = contenu.titre;
        }
        
        // Mettre à jour la description
        if (contenu.description) {
            const metaDescription = document.querySelector('meta[name="description"]');
            if (metaDescription) {
                metaDescription.setAttribute('content', contenu.description);
            }
        }
        
        // Mettre à jour le contenu principal
        if (contenu.contenuPrincipal) {
            const mainContent = document.querySelector('main') || document.querySelector('.main-content');
            if (mainContent) {
                mainContent.innerHTML = contenu.contenuPrincipal;
            }
        }
    }
    
    /**
     * Appliquer la nouvelle configuration
     */
    applyConfiguration(config) {
        // Mettre à jour le thème
        if (config.theme) {
            document.documentElement.setAttribute('data-theme', config.theme);
        }
        
        // Mettre à jour les couleurs
        if (config.couleurs) {
            this.updateColors(config.couleurs);
        }
        
        // Mettre à jour les animations
        if (config.animations !== undefined) {
            this.updateAnimations(config.animations);
        }
    }
    
    /**
     * Mettre à jour les couleurs
     */
    updateColors(couleurs) {
        const root = document.documentElement;
        
        Object.entries(couleurs).forEach(([property, value]) => {
            root.style.setProperty(`--${property}`, value);
        });
    }
    
    /**
     * Mettre à jour les animations
     */
    updateAnimations(animations) {
        if (animations) {
            document.body.classList.add('animations-enabled');
        } else {
            document.body.classList.remove('animations-enabled');
        }
    }
    
    /**
     * Créer l'indicateur de synchronisation
     */
    createSyncIndicator() {
        // Supprimer l'ancien indicateur s'il existe
        const oldIndicator = document.querySelector('.firebase-sync-indicator');
        if (oldIndicator) {
            oldIndicator.remove();
        }
        
        // Créer le nouvel indicateur
        const indicator = document.createElement('div');
        indicator.className = 'firebase-sync-indicator';
        indicator.innerHTML = `
            <div class="sync-status">
                <i class="fas fa-sync-alt fa-spin"></i>
                <span>Synchronisation Firebase Active</span>
            </div>
            <div class="sync-info">
                <small>Modifications en temps réel</small>
            </div>
        `;
        
        // Ajouter les styles
        const styles = document.createElement('style');
        styles.textContent = `
            .firebase-sync-indicator {
                position: fixed;
                top: 20px;
                right: 20px;
                background: linear-gradient(135deg, #3b82f6, #1d4ed8);
                color: white;
                padding: 0.75rem 1rem;
                border-radius: 12px;
                font-size: 0.85rem;
                z-index: 10000;
                box-shadow: 0 4px 20px rgba(59, 130, 246, 0.3);
                backdrop-filter: blur(10px);
                border: 1px solid rgba(255, 255, 255, 0.1);
                transition: all 0.3s ease;
                opacity: 0;
                transform: translateY(-20px);
            }
            
            .firebase-sync-indicator.show {
                opacity: 1;
                transform: translateY(0);
            }
            
            .firebase-sync-indicator .sync-status {
                display: flex;
                align-items: center;
                gap: 0.5rem;
                margin-bottom: 0.25rem;
            }
            
            .firebase-sync-indicator .sync-status i {
                color: #60a5fa;
            }
            
            .firebase-sync-indicator .sync-info small {
                opacity: 0.8;
                font-size: 0.75rem;
            }
            
            .firebase-sync-indicator:hover {
                transform: translateY(-2px);
                box-shadow: 0 6px 25px rgba(59, 130, 246, 0.4);
            }
            
            @keyframes syncPulse {
                0%, 100% { opacity: 1; }
                50% { opacity: 0.7; }
            }
            
            .firebase-sync-indicator .sync-status i {
                animation: syncPulse 2s infinite;
            }
        `;
        
        document.head.appendChild(styles);
        document.body.appendChild(indicator);
        
        // Afficher l'indicateur avec animation
        setTimeout(() => {
            indicator.classList.add('show');
        }, 1000);
    }
    
    /**
     * Sauvegarder des données dans Firebase
     */
    async saveToFirebase(path, data) {
        if (!this.isInitialized) {
            console.warn('⚠️ Firebase non initialisé');
            return false;
        }
        
        try {
            const success = await window.firebaseConfig.save(path, data);
            if (success) {
                console.log(`✅ Données sauvegardées dans Firebase: ${path}`);
                return true;
            }
            return false;
        } catch (error) {
            console.error(`❌ Erreur sauvegarde Firebase ${path}:`, error);
            return false;
        }
    }
    
    /**
     * Récupérer des données depuis Firebase
     */
    async getFromFirebase(path) {
        if (!this.isInitialized) {
            console.warn('⚠️ Firebase non initialisé');
            return null;
        }
        
        try {
            const data = await window.firebaseConfig.get(path);
            return data;
        } catch (error) {
            console.error(`❌ Erreur récupération Firebase ${path}:`, error);
            return null;
        }
    }
    
    /**
     * Mettre à jour des données dans Firebase
     */
    async updateInFirebase(path, data) {
        if (!this.isInitialized) {
            console.warn('⚠️ Firebase non initialisé');
            return false;
        }
        
        try {
            const success = await window.firebaseConfig.update(path, data);
            if (success) {
                console.log(`✅ Données mises à jour dans Firebase: ${path}`);
                return true;
            }
            return false;
        } catch (error) {
            console.error(`❌ Erreur mise à jour Firebase ${path}:`, error);
            return false;
        }
    }
    
    /**
     * Arrêter la synchronisation
     */
    stopSync() {
        console.log('🛑 Arrêt de la synchronisation Firebase...');
        
        // Arrêter tous les listeners
        this.listeners.forEach((ref, key) => {
            if (ref && typeof ref.off === 'function') {
                ref.off();
                console.log(`🔇 Listener ${key} arrêté`);
            }
        });
        
        this.listeners.clear();
        this.isInitialized = false;
        
        // Masquer l'indicateur
        const indicator = document.querySelector('.firebase-sync-indicator');
        if (indicator) {
            indicator.classList.remove('show');
            setTimeout(() => indicator.remove(), 300);
        }
    }
    
    /**
     * Redémarrer la synchronisation
     */
    async restartSync() {
        this.stopSync();
        await this.init();
    }
    
    /**
     * Obtenir le statut de la synchronisation
     */
    getStatus() {
        return {
            initialized: this.isInitialized,
            listenersCount: this.listeners.size,
            firebaseAvailable: window.firebaseConfig ? window.firebaseConfig.isAvailable() : false,
            timestamp: Date.now()
        };
    }
}

// Instance globale
window.firebaseRealtimeSync = null;

// Initialisation automatique
if (typeof window !== 'undefined') {
    window.addEventListener('load', function() {
        // Attendre un peu pour que tous les scripts soient chargés
        setTimeout(() => {
            window.firebaseRealtimeSync = new FirebaseRealtimeSync();
        }, 1000);
    });
}

// Exposer les fonctions globales
window.FirebaseRealtimeSync = FirebaseRealtimeSync;

console.log('🔄 Firebase Realtime Sync chargé - Synchronisation temps réel activée');
