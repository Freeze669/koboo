/**
 * Configuration des Tarifs - Mayu & Jack Studio
 * Gestion centralisée des prix et services
 */

class TarifsConfig {
    constructor() {
        this.tarifs = {
            // Services de base
            services: {
                // Services Graphisme
                'logo-simple': {
                    nom: 'Logo Simple',
                    description: 'Logo basique et élégant',
                    prix: 50,
                    devise: 'EUR',
                    duree: '1 semaine',
                    categorie: 'graphisme'
                },
                'logo-complexe': {
                    nom: 'Logo Complexe',
                    description: 'Logo détaillé et personnalisé',
                    prix: 150,
                    devise: 'EUR',
                    duree: '2 semaines',
                    categorie: 'graphisme'
                },
                'affiche-flyer': {
                    nom: 'Affiche/Flyer',
                    description: 'Support de communication print',
                    prix: 30,
                    devise: 'EUR',
                    duree: '3-5 jours',
                    categorie: 'graphisme'
                },
                'habillage-reseaux': {
                    nom: 'Habillage Réseaux Sociaux',
                    description: 'Bannières et visuels pour réseaux',
                    prix: 100,
                    devise: 'EUR',
                    duree: '1 semaine',
                    categorie: 'graphisme'
                },
                'templates-rp': {
                    nom: 'Templates RP',
                    description: 'Modèles de jeux de rôle',
                    prix: 40,
                    devise: 'EUR',
                    duree: '1 semaine',
                    categorie: 'graphisme'
                },
                
                // Services Développement
                'site-vitrine': {
                    nom: 'Site Vitrine',
                    description: 'Site web professionnel',
                    prix: 300,
                    devise: 'EUR',
                    duree: '2-3 semaines',
                    categorie: 'developpement'
                },
                'site-ecommerce': {
                    nom: 'Site E-commerce',
                    description: 'Boutique en ligne complète',
                    prix: 800,
                    devise: 'EUR',
                    duree: '4-6 semaines',
                    categorie: 'developpement'
                },
                'bot-discord-simple': {
                    nom: 'Bot Discord Simple',
                    description: 'Bot Discord basique',
                    prix: 150,
                    devise: 'EUR',
                    duree: '1 semaine',
                    categorie: 'developpement'
                },
                'bot-discord-avance': {
                    nom: 'Bot Discord Avancé',
                    description: 'Bot Discord avec fonctionnalités avancées',
                    prix: 400,
                    devise: 'EUR',
                    duree: '2-3 semaines',
                    categorie: 'developpement'
                },
                'application-web': {
                    nom: 'Application Web',
                    description: 'Application web complexe',
                    prix: 1000,
                    devise: 'EUR',
                    duree: '6-8 semaines',
                    categorie: 'developpement'
                }
            },
            
            // Forfaits
            forfaits: {
                'pack-graphisme': {
                    nom: 'Pack Graphisme Complet',
                    services: ['logo-simple', 'affiche-flyer', 'habillage-reseaux'],
                    prix: 150,
                    devise: 'EUR',
                    reduction: 20,
                    description: 'Pack graphisme complet pour débuter'
                },
                'pack-developpement': {
                    nom: 'Pack Développement Web',
                    services: ['site-vitrine', 'logo-simple'],
                    prix: 400,
                    devise: 'EUR',
                    reduction: 15,
                    description: 'Pack web complet avec logo'
                },
                'pack-entreprise': {
                    nom: 'Pack Entreprise Premium',
                    services: ['site-ecommerce', 'logo-complexe', 'habillage-reseaux'],
                    prix: 1000,
                    devise: 'EUR',
                    reduction: 25,
                    description: 'Pack premium pour entreprises'
                }
            },
            
            // Options additionnelles
            options: {
                'responsive': {
                    nom: 'Design Responsive',
                    description: 'Adaptation mobile et tablette',
                    prix: 79,
                    devise: 'EUR'
                },
                'seo': {
                    nom: 'Optimisation SEO',
                    description: 'Référencement naturel',
                    prix: 129,
                    devise: 'EUR'
                },
                'ecommerce': {
                    nom: 'Fonctionnalités E-commerce',
                    description: 'Boutique en ligne',
                    prix: 199,
                    devise: 'EUR'
                }
            }
        };
        
        // Initialiser Firebase et charger les données
        this.initializeFirebase();
        
        // Écouter les changements en temps réel
        this.setupRealtimeListener();
    }
    
    /**
     * Initialiser Firebase
     */
    async initializeFirebase() {
        // Attendre que Firebase soit disponible
        if (window.firebaseConfig && window.firebaseConfig.isAvailable()) {
            // Charger depuis Firebase
            await this.loadFromFirebase();
        } else {
            // Fallback vers le stockage local
            this.loadFromStorage();
        }
    }
    
    /**
     * Configurer l'écouteur en temps réel
     */
    setupRealtimeListener() {
        if (window.firebaseConfig && window.firebaseConfig.isAvailable()) {
            console.log('🔄 Configuration des écouteurs Firebase en temps réel...');
            
            // Écouter les changements des services
            this.servicesListener = window.firebaseConfig.listen('tarifs/services', (data) => {
                if (data) {
                    console.log('🔄 Services mis à jour en temps réel:', data);
                    this.tarifs.services = data;
                    this.notifyTarifsChanged();
                }
            });
            
            // Écouter les changements des forfaits
            this.forfaitsListener = window.firebaseConfig.listen('tarifs/forfaits', (data) => {
                if (data) {
                    console.log('🔄 Forfaits mis à jour en temps réel:', data);
                    this.tarifs.forfaits = data;
                    this.notifyTarifsChanged();
                }
            });
            
            // Écouter les changements des options
            this.optionsListener = window.firebaseConfig.listen('tarifs/options', (data) => {
                if (data) {
                    console.log('🔄 Options mises à jour en temps réel:', data);
                    this.tarifs.options = data;
                    this.notifyTarifsChanged();
                }
            });
            
            console.log('✅ Écouteurs Firebase configurés avec succès');
        } else {
            console.log('⚠️ Firebase non disponible, mode local storage activé');
        }
    }
    
    /**
     * Notifier que les tarifs ont changé
     */
    notifyTarifsChanged() {
        console.log('📢 Notification de changement de tarifs en cours...');
        
        // Déclencher un événement personnalisé
        const event = new CustomEvent('tarifsChanged', {
            detail: { 
                tarifs: this.tarifs,
                timestamp: new Date().toISOString(),
                source: 'firebase'
            }
        });
        document.dispatchEvent(event);
        
        // Notifier aussi via le système de notifications Discord si disponible
        if (window.notificationsGrouped) {
            window.notificationsGrouped.addNotification('tarifs_updated', {
                message: 'Tarifs mis à jour en temps réel via Firebase',
                timestamp: new Date().toISOString(),
                updatedBy: 'Firebase Realtime',
                changes: Object.keys(this.tarifs.services).length + ' services, ' + 
                        Object.keys(this.tarifs.forfaits).length + ' forfaits'
            }, 'important');
        }
        
        console.log('✅ Notification de changement envoyée');
    }
    
    /**
     * Charger la configuration depuis le stockage local
     */
    loadFromStorage() {
        try {
            const saved = localStorage.getItem('tarifs-config');
            if (saved) {
                const parsed = JSON.parse(saved);
                this.tarifs = { ...this.tarifs, ...parsed };
            }
        } catch (error) {
            // Erreur silencieuse
        }
    }
    
    /**
     * Charger la configuration depuis Firebase
     */
    async loadFromFirebase() {
        try {
            if (window.firebaseConfig && window.firebaseConfig.isAvailable()) {
                // Charger les services
                const services = await window.firebaseConfig.get('tarifs/services');
                if (services) {
                    this.tarifs.services = services;
                }
                
                // Charger les forfaits
                const forfaits = await window.firebaseConfig.get('tarifs/forfaits');
                if (forfaits) {
                    this.tarifs.forfaits = forfaits;
                }
                
                // Charger les options
                const options = await window.firebaseConfig.get('tarifs/options');
                if (options) {
                    this.tarifs.options = options;
                }
                
                return true;
            }
            return false;
        } catch (error) {
            console.warn('⚠️ Erreur chargement Firebase, fallback vers local storage');
            return false;
        }
    }
    
    /**
     * Sauvegarder la configuration dans Firebase
     */
    async saveToFirebase() {
        try {
            if (window.firebaseConfig && window.firebaseConfig.isAvailable()) {
                // Sauvegarder les services
                await window.firebaseConfig.save('tarifs/services', this.tarifs.services);
                
                // Sauvegarder les forfaits
                await window.firebaseConfig.save('tarifs/forfaits', this.tarifs.forfaits);
                
                // Sauvegarder les options
                await window.firebaseConfig.save('tarifs/options', this.tarifs.options);
                
                return true;
            }
            return false;
        } catch (error) {
            console.warn('⚠️ Erreur sauvegarde Firebase, fallback vers local storage');
            return false;
        }
    }
    
    /**
     * Sauvegarder la configuration dans le stockage local
     */
    saveToStorage() {
        try {
            localStorage.setItem('tarifs-config', JSON.stringify(this.tarifs));
            return true;
        } catch (error) {
            return false;
        }
    }
    
    /**
     * Mettre à jour un tarif
     */
    async updateTarif(categorie, id, nouvellesDonnees) {
        if (this.tarifs[categorie] && this.tarifs[categorie][id]) {
            this.tarifs[categorie][id] = { ...this.tarifs[categorie][id], ...nouvellesDonnees };
            
            // Sauvegarder dans Firebase en priorité
            if (window.firebaseConfig && window.firebaseConfig.isAvailable()) {
                await this.saveToFirebase();
            } else {
                this.saveToStorage();
            }
            
            return true;
        }
        return false;
    }
    
    /**
     * Ajouter un nouveau tarif
     */
    async addTarif(categorie, id, donnees) {
        if (!this.tarifs[categorie]) {
            this.tarifs[categorie] = {};
        }
        this.tarifs[categorie][id] = donnees;
        
        // Sauvegarder dans Firebase en priorité
        if (window.firebaseConfig && window.firebaseConfig.isAvailable()) {
            await this.saveToFirebase();
        } else {
            this.saveToStorage();
        }
        
        return true;
    }
    
    /**
     * Supprimer un tarif
     */
    async removeTarif(categorie, id) {
        if (this.tarifs[categorie] && this.tarifs[categorie][id]) {
            delete this.tarifs[categorie][id];
            
            // Sauvegarder dans Firebase en priorité
            if (window.firebaseConfig && window.firebaseConfig.isAvailable()) {
                await this.saveToFirebase();
            } else {
                this.saveToStorage();
            }
            
            return true;
        }
        return false;
    }
    
    /**
     * Obtenir tous les tarifs
     */
    getAllTarifs() {
        return this.tarifs;
    }
    
    /**
     * Obtenir un tarif spécifique
     */
    getTarif(categorie, id) {
        return this.tarifs[categorie]?.[id] || null;
    }
    
    /**
     * Calculer le prix d'un forfait
     */
    calculateForfaitPrix(forfaitId) {
        const forfait = this.tarifs.forfaits[forfaitId];
        if (!forfait) return 0;
        
        let prixTotal = 0;
        forfait.services.forEach(serviceId => {
            const service = this.tarifs.services[serviceId];
            if (service) {
                prixTotal += service.prix;
            }
        });
        
        const reduction = (prixTotal * forfait.reduction) / 100;
        return prixTotal - reduction;
    }
    
    /**
     * Exporter la configuration
     */
    exportConfig() {
        return JSON.stringify(this.tarifs, null, 2);
    }
    
    /**
     * Importer la configuration
     */
    async importConfig(configJson) {
        try {
            const config = JSON.parse(configJson);
            this.tarifs = config;
            
            // Sauvegarder dans Firebase en priorité
            if (window.firebaseConfig && window.firebaseConfig.isAvailable()) {
                await this.saveToFirebase();
            } else {
                this.saveToStorage();
            }
            
            return true;
        } catch (error) {
            console.error('❌ Erreur lors de l\'import de la configuration:', error);
            return false;
        }
    }
    
    /**
     * Réinitialiser la configuration
     */
    async resetConfig() {
        this.tarifs = {
            services: {},
            forfaits: {},
            options: {}
        };
        
        // Sauvegarder dans Firebase en priorité
        if (window.firebaseConfig && window.firebaseConfig.isAvailable()) {
            await this.saveToFirebase();
        } else {
            this.saveToStorage();
        }
    }
    
    /**
     * Synchroniser avec Firebase (pour l'initialisation)
     */
    async syncWithFirebase() {
        if (window.firebaseConfig && window.firebaseConfig.isAvailable()) {
            // Vérifier si Firebase a des données
            const hasFirebaseData = await this.loadFromFirebase();
            
            if (!hasFirebaseData) {
                // Si Firebase est vide, y sauvegarder les données locales
                await this.saveToFirebase();
            }
        }
    }
    
    /**
     * Arrêter l'écoute des changements
     */
    stopListening() {
        console.log('🛑 Arrêt des écouteurs Firebase...');
        
        if (this.servicesListener) {
            window.firebaseConfig.stopListen(this.servicesListener);
            this.servicesListener = null;
        }
        if (this.forfaitsListener) {
            window.firebaseConfig.stopListen(this.forfaitsListener);
            this.forfaitsListener = null;
        }
        if (this.optionsListener) {
            window.firebaseConfig.stopListen(this.optionsListener);
            this.optionsListener = null;
        }
        
        console.log('✅ Écouteurs Firebase arrêtés');
    }
}

// Instance globale
window.tarifsConfig = new TarifsConfig();
