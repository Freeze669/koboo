/**
 * 💰 Gestionnaire de Tarifs Firebase - Mayu & Jack Studio
 * Gère la synchronisation des tarifs entre le panel admin et le site index
 */

class FirebaseTarifsManager {
    constructor() {
        this.tarifs = {
            services: {},
            forfaits: {}
        };
        this.isInitialized = false;
        this.firebaseSync = null;
        
        this.init();
    }
    
    /**
     * Initialisation du gestionnaire
     */
    async init() {
        try {
            // Attendre que Firebase soit disponible
            await this.waitForFirebase();
            
            // Initialiser la synchronisation Firebase
            if (window.firebaseRealtimeSync) {
                this.firebaseSync = window.firebaseRealtimeSync;
                this.isInitialized = true;
                console.log('✅ Firebase Tarifs Manager initialisé');
                
                // Charger les tarifs depuis Firebase
                await this.loadTarifsFromFirebase();
                
                // Configurer les écouteurs d'événements
                this.setupEventListeners();
            } else {
                console.warn('⚠️ Firebase Realtime Sync non disponible');
            }
        } catch (error) {
            console.error('❌ Erreur initialisation Firebase Tarifs Manager:', error);
        }
    }
    
    /**
     * Attendre que Firebase soit disponible
     */
    async waitForFirebase() {
        return new Promise((resolve) => {
            if (window.firebaseRealtimeSync) {
                resolve();
            } else {
                const checkFirebase = () => {
                    if (window.firebaseRealtimeSync) {
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
     * Charger les tarifs depuis Firebase
     */
    async loadTarifsFromFirebase() {
        try {
            // Charger les services
            const services = await this.firebaseSync.getFromFirebase('/services');
            if (services) {
                this.tarifs.services = services;
                console.log('✅ Services chargés depuis Firebase:', services);
            }
            
            // Charger les forfaits
            const forfaits = await this.firebaseSync.getFromFirebase('/forfaits');
            if (forfaits) {
                this.tarifs.forfaits = forfaits;
                console.log('✅ Forfaits chargés depuis Firebase:', forfaits);
            }
            
            // Déclencher la mise à jour de l'affichage
            this.triggerDisplayUpdate();
            
        } catch (error) {
            console.error('❌ Erreur chargement tarifs Firebase:', error);
        }
    }
    
    /**
     * Configurer les écouteurs d'événements
     */
    setupEventListeners() {
        // Écouter les mises à jour des services
        document.addEventListener('servicesChanged', (event) => {
            const { services, source } = event.detail;
            if (source === 'firebase-realtime') {
                this.tarifs.services = services;
                this.triggerDisplayUpdate();
            }
        });
        
        // Écouter les mises à jour des forfaits
        document.addEventListener('forfaitsChanged', (event) => {
            const { forfaits, source } = event.detail;
            if (source === 'firebase-realtime') {
                this.tarifs.forfaits = forfaits;
                this.triggerDisplayUpdate();
            }
        });
        
        // Écouter les mises à jour des tarifs
        document.addEventListener('tarifsChanged', (event) => {
            const { tarifs, source } = event.detail;
            if (source === 'firebase-realtime') {
                this.tarifs = tarifs;
                this.triggerDisplayUpdate();
            }
        });
    }
    
    /**
     * Déclencher la mise à jour de l'affichage
     */
    triggerDisplayUpdate() {
        // Déclencher l'événement de mise à jour
        const event = new CustomEvent('tarifsDisplayUpdate', {
            detail: {
                tarifs: this.tarifs,
                timestamp: Date.now()
            }
        });
        document.dispatchEvent(event);
        
        // Mettre à jour l'affichage si les fonctions existent
        if (typeof renderTarifsDisplay === 'function') {
            renderTarifsDisplay();
        }
        
        if (typeof updateTarifsDisplayWithAnimation === 'function') {
            updateTarifsDisplayWithAnimation(this.tarifs);
        }
    }
    
    /**
     * Ajouter un nouveau service
     */
    async addService(serviceData) {
        try {
            const serviceId = this.generateId();
            const newService = {
                id: serviceId,
                ...serviceData,
                createdAt: Date.now(),
                updatedAt: Date.now()
            };
            
            // Ajouter localement
            this.tarifs.services[serviceId] = newService;
            
            // Sauvegarder dans Firebase
            if (this.firebaseSync) {
                await this.firebaseSync.saveToFirebase('/services', this.tarifs.services);
            }
            
            console.log('✅ Nouveau service ajouté:', newService);
            this.triggerDisplayUpdate();
            
            return serviceId;
        } catch (error) {
            console.error('❌ Erreur ajout service:', error);
            throw error;
        }
    }
    
    /**
     * Mettre à jour un service existant
     */
    async updateService(serviceId, updates) {
        try {
            if (!this.tarifs.services[serviceId]) {
                throw new Error(`Service ${serviceId} non trouvé`);
            }
            
            // Mettre à jour localement
            this.tarifs.services[serviceId] = {
                ...this.tarifs.services[serviceId],
                ...updates,
                updatedAt: Date.now()
            };
            
            // Sauvegarder dans Firebase
            if (this.firebaseSync) {
                await this.firebaseSync.saveToFirebase('/services', this.tarifs.services);
            }
            
            console.log('✅ Service mis à jour:', serviceId);
            this.triggerDisplayUpdate();
            
            return true;
        } catch (error) {
            console.error('❌ Erreur mise à jour service:', error);
            throw error;
        }
    }
    
    /**
     * Supprimer un service
     */
    async deleteService(serviceId) {
        try {
            if (!this.tarifs.services[serviceId]) {
                throw new Error(`Service ${serviceId} non trouvé`);
            }
            
            // Supprimer localement
            delete this.tarifs.services[serviceId];
            
            // Sauvegarder dans Firebase
            if (this.firebaseSync) {
                await this.firebaseSync.saveToFirebase('/services', this.tarifs.services);
            }
            
            console.log('✅ Service supprimé:', serviceId);
            this.triggerDisplayUpdate();
            
            return true;
        } catch (error) {
            console.error('❌ Erreur suppression service:', error);
            throw error;
        }
    }
    
    /**
     * Ajouter un nouveau forfait
     */
    async addForfait(forfaitData) {
        try {
            const forfaitId = this.generateId();
            const newForfait = {
                id: forfaitId,
                ...forfaitData,
                createdAt: Date.now(),
                updatedAt: Date.now()
            };
            
            // Ajouter localement
            this.tarifs.forfaits[forfaitId] = newForfait;
            
            // Sauvegarder dans Firebase
            if (this.firebaseSync) {
                await this.firebaseSync.saveToFirebase('/forfaits', this.tarifs.forfaits);
            }
            
            console.log('✅ Nouveau forfait ajouté:', newForfait);
            this.triggerDisplayUpdate();
            
            return forfaitId;
        } catch (error) {
            console.error('❌ Erreur ajout forfait:', error);
            throw error;
        }
    }
    
    /**
     * Mettre à jour un forfait existant
     */
    async updateForfait(forfaitId, updates) {
        try {
            if (!this.tarifs.forfaits[forfaitId]) {
                throw new Error(`Forfait ${forfaitId} non trouvé`);
            }
            
            // Mettre à jour localement
            this.tarifs.forfaits[forfaitId] = {
                ...this.tarifs.forfaits[forfaitId],
                ...updates,
                updatedAt: Date.now()
            };
            
            // Sauvegarder dans Firebase
            if (this.firebaseSync) {
                await this.firebaseSync.saveToFirebase('/forfaits', this.tarifs.forfaits);
            }
            
            console.log('✅ Forfait mis à jour:', forfaitId);
            this.triggerDisplayUpdate();
            
            return true;
        } catch (error) {
            console.error('❌ Erreur mise à jour forfait:', error);
            throw error;
        }
    }
    
    /**
     * Supprimer un forfait
     */
    async deleteForfait(forfaitId) {
        try {
            if (!this.tarifs.forfaits[forfaitId]) {
                throw new Error(`Forfait ${forfaitId} non trouvé`);
            }
            
            // Supprimer localement
            delete this.tarifs.forfaits[forfaitId];
            
            // Sauvegarder dans Firebase
            if (this.firebaseSync) {
                await this.firebaseSync.saveToFirebase('/forfaits', this.tarifs.forfaits);
            }
            
            console.log('✅ Forfait supprimé:', forfaitId);
            this.triggerDisplayUpdate();
            
            return true;
        } catch (error) {
            console.error('❌ Erreur suppression forfait:', error);
            throw error;
        }
    }
    
    /**
     * Mettre à jour tous les tarifs
     */
    async updateAllTarifs(newTarifs) {
        try {
            // Mettre à jour localement
            this.tarifs = {
                ...this.tarifs,
                ...newTarifs
            };
            
            // Sauvegarder dans Firebase
            if (this.firebaseSync) {
                await this.firebaseSync.saveToFirebase('/tarifs', this.tarifs);
            }
            
            console.log('✅ Tous les tarifs mis à jour');
            this.triggerDisplayUpdate();
            
            return true;
        } catch (error) {
            console.error('❌ Erreur mise à jour tarifs:', error);
            throw error;
        }
    }
    
    /**
     * Obtenir tous les tarifs
     */
    getAllTarifs() {
        return this.tarifs;
    }
    
    /**
     * Obtenir les services par catégorie
     */
    getServicesByCategory(category) {
        return Object.entries(this.tarifs.services)
            .filter(([id, service]) => service.categorie === category)
            .reduce((acc, [id, service]) => {
                acc[id] = service;
                return acc;
            }, {});
    }
    
    /**
     * Obtenir un service par ID
     */
    getServiceById(serviceId) {
        return this.tarifs.services[serviceId] || null;
    }
    
    /**
     * Obtenir un forfait par ID
     */
    getForfaitById(forfaitId) {
        return this.tarifs.forfaits[forfaitId] || null;
    }
    
    /**
     * Rechercher des services
     */
    searchServices(query) {
        const results = [];
        const searchTerm = query.toLowerCase();
        
        Object.entries(this.tarifs.services).forEach(([id, service]) => {
            if (service.nom.toLowerCase().includes(searchTerm) ||
                service.description?.toLowerCase().includes(searchTerm) ||
                service.categorie.toLowerCase().includes(searchTerm)) {
                results.push({ id, ...service });
            }
        });
        
        return results;
    }
    
    /**
     * Rechercher des forfaits
     */
    searchForfaits(query) {
        const results = [];
        const searchTerm = query.toLowerCase();
        
        Object.entries(this.tarifs.forfaits).forEach(([id, forfait]) => {
            if (forfait.nom.toLowerCase().includes(searchTerm) ||
                forfait.description?.toLowerCase().includes(searchTerm)) {
                results.push({ id, ...forfait });
            }
        });
        
        return results;
    }
    
    /**
     * Générer un ID unique
     */
    generateId() {
        return Date.now().toString(36) + Math.random().toString(36).substr(2);
    }
    
    /**
     * Exporter les tarifs
     */
    exportTarifs() {
        const dataStr = JSON.stringify(this.tarifs, null, 2);
        const dataBlob = new Blob([dataStr], { type: 'application/json' });
        
        const link = document.createElement('a');
        link.href = URL.createObjectURL(dataBlob);
        link.download = `tarifs-${new Date().toISOString().split('T')[0]}.json`;
        link.click();
    }
    
    /**
     * Importer des tarifs
     */
    async importTarifs(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            
            reader.onload = async (event) => {
                try {
                    const importedTarifs = JSON.parse(event.target.result);
                    
                    // Valider la structure
                    if (this.validateTarifsStructure(importedTarifs)) {
                        // Mettre à jour les tarifs
                        await this.updateAllTarifs(importedTarifs);
                        resolve(true);
                    } else {
                        reject(new Error('Structure des tarifs invalide'));
                    }
                } catch (error) {
                    reject(error);
                }
            };
            
            reader.onerror = () => reject(new Error('Erreur lecture fichier'));
            reader.readAsText(file);
        });
    }
    
    /**
     * Valider la structure des tarifs
     */
    validateTarifsStructure(tarifs) {
        return tarifs && 
               typeof tarifs === 'object' &&
               (tarifs.services || tarifs.forfaits);
    }
    
    /**
     * Obtenir les statistiques des tarifs
     */
    getTarifsStats() {
        const servicesCount = Object.keys(this.tarifs.services).length;
        const forfaitsCount = Object.keys(this.tarifs.forfaits).length;
        
        const categories = {};
        Object.values(this.tarifs.services).forEach(service => {
            categories[service.categorie] = (categories[service.categorie] || 0) + 1;
        });
        
        return {
            totalServices: servicesCount,
            totalForfaits: forfaitsCount,
            totalTarifs: servicesCount + forfaitsCount,
            categories: categories,
            lastUpdate: Date.now()
        };
    }
    
    /**
     * Vider tous les tarifs
     */
    async clearAllTarifs() {
        try {
            this.tarifs = { services: {}, forfaits: {} };
            
            // Sauvegarder dans Firebase
            if (this.firebaseSync) {
                await this.firebaseSync.saveToFirebase('/tarifs', this.tarifs);
            }
            
            console.log('✅ Tous les tarifs supprimés');
            this.triggerDisplayUpdate();
            
            return true;
        } catch (error) {
            console.error('❌ Erreur suppression tarifs:', error);
            throw error;
        }
    }
}

// Instance globale
window.firebaseTarifsManager = null;

// Initialisation automatique
if (typeof window !== 'undefined') {
    window.addEventListener('load', function() {
        // Attendre que Firebase Realtime Sync soit chargé
        setTimeout(() => {
            window.firebaseTarifsManager = new FirebaseTarifsManager();
        }, 2000);
    });
}

// Exposer la classe
window.FirebaseTarifsManager = FirebaseTarifsManager;

console.log('💰 Firebase Tarifs Manager chargé - Gestion des tarifs temps réel activée');
