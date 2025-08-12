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
            }
        } catch (error) {
            // Erreur silencieuse
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
