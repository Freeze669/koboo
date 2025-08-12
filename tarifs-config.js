/**
 * Configuration des Tarifs - Mayu & Jack Studio
 * Gestion centralisée des prix et services
 */

class TarifsConfig {
    constructor() {
        this.tarifs = {
            // Services de base
            services: {
                'design-web': {
                    nom: 'Design Web',
                    description: 'Création de sites web personnalisés',
                    prix: 299,
                    devise: 'EUR',
                    duree: '2-3 semaines',
                    categorie: 'web'
                },
                'logo-design': {
                    nom: 'Logo Design',
                    description: 'Création de logos uniques',
                    prix: 99,
                    devise: 'EUR',
                    duree: '1 semaine',
                    categorie: 'design'
                },
                'branding': {
                    nom: 'Branding Complet',
                    description: 'Identité visuelle complète',
                    prix: 499,
                    devise: 'EUR',
                    duree: '3-4 semaines',
                    categorie: 'branding'
                },
                'maintenance': {
                    nom: 'Maintenance Web',
                    description: 'Maintenance et mises à jour',
                    prix: 49,
                    devise: 'EUR',
                    duree: 'mensuel',
                    categorie: 'maintenance'
                }
            },
            
            // Forfaits
            forfaits: {
                'starter': {
                    nom: 'Pack Starter',
                    services: ['design-web', 'logo-design'],
                    prix: 349,
                    devise: 'EUR',
                    reduction: 15,
                    description: 'Pack idéal pour débuter'
                },
                'business': {
                    nom: 'Pack Business',
                    services: ['design-web', 'logo-design', 'branding'],
                    prix: 699,
                    devise: 'EUR',
                    reduction: 25,
                    description: 'Pack complet pour entreprises'
                },
                'premium': {
                    nom: 'Pack Premium',
                    services: ['design-web', 'logo-design', 'branding', 'maintenance'],
                    prix: 899,
                    devise: 'EUR',
                    reduction: 30,
                    description: 'Pack premium avec maintenance'
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
        
        this.loadFromStorage();
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
                console.log('✅ Configuration des tarifs chargée depuis le stockage');
            }
        } catch (error) {
            console.warn('⚠️ Erreur lors du chargement des tarifs:', error);
        }
    }
    
    /**
     * Sauvegarder la configuration dans le stockage local
     */
    saveToStorage() {
        try {
            localStorage.setItem('tarifs-config', JSON.stringify(this.tarifs));
            console.log('✅ Configuration des tarifs sauvegardée');
            return true;
        } catch (error) {
            console.error('❌ Erreur lors de la sauvegarde des tarifs:', error);
            return false;
        }
    }
    
    /**
     * Mettre à jour un tarif
     */
    updateTarif(categorie, id, nouvellesDonnees) {
        if (this.tarifs[categorie] && this.tarifs[categorie][id]) {
            this.tarifs[categorie][id] = { ...this.tarifs[categorie][id], ...nouvellesDonnees };
            this.saveToStorage();
            return true;
        }
        return false;
    }
    
    /**
     * Ajouter un nouveau tarif
     */
    addTarif(categorie, id, donnees) {
        if (!this.tarifs[categorie]) {
            this.tarifs[categorie] = {};
        }
        this.tarifs[categorie][id] = donnees;
        this.saveToStorage();
        return true;
    }
    
    /**
     * Supprimer un tarif
     */
    removeTarif(categorie, id) {
        if (this.tarifs[categorie] && this.tarifs[categorie][id]) {
            delete this.tarifs[categorie][id];
            this.saveToStorage();
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
    importConfig(configJson) {
        try {
            const config = JSON.parse(configJson);
            this.tarifs = config;
            this.saveToStorage();
            return true;
        } catch (error) {
            console.error('❌ Erreur lors de l\'import de la configuration:', error);
            return false;
        }
    }
}

// Instance globale
window.tarifsConfig = new TarifsConfig();
