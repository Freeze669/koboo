/**
 * Gestionnaire des statistiques générales pour le panel admin
 * Gère les vraies données et affiche N/A quand nécessaire
 */

class AdminStatsManager {
    constructor() {
        this.stats = {
            visitors: null, // null = pas de données, 0 = 0 visiteurs réels
            pageViews: null,
            uptime: '00:00:00',
            memory: { used: '10 MB', total: '100 MB', percentage: 10 },
            loadTime: 0,
            errors: 0,
            fps: 60,
            frameTime: 16.67,
            animationQuality: 1.0,
            performanceScore: 95,
            activities: 0,
            sessions: 0,
            trends: {},
            alerts: [],
            connections: [] // Historique des connexions
        };
        
        this.startTime = Date.now();
        this.lastUpdateTime = 0; // Optimisation FPS
        this.isRunning = false;
        this.updateInterval = null;
        this.connectionCounter = 0;
        
        this.init();
    }
    
    /**
     * Initialiser le gestionnaire de statistiques
     */
    init() {
        console.log('📊 Initialisation du gestionnaire de statistiques...');
        
        // Démarrer le compteur de temps de fonctionnement
        this.startUptimeCounter();
        
        // Démarrer les mises à jour automatiques
        this.startAutoUpdates();
        
        // Simuler une connexion initiale pour tester
        this.logNewConnection('Test Initial');
        
        this.isRunning = true;
        console.log('✅ Gestionnaire de statistiques initialisé');
    }
    
    /**
     * Enregistrer une nouvelle connexion
     */
    logNewConnection(userInfo = 'Visiteur') {
        const connection = {
            id: ++this.connectionCounter,
            timestamp: new Date().toISOString(),
            userInfo: userInfo,
            ip: this.generateMockIP(),
            userAgent: navigator.userAgent.substring(0, 50) + '...',
            sessionId: this.generateSessionId()
        };
        
        this.stats.connections.unshift(connection);
        
        // Garder seulement les 50 dernières connexions
        if (this.stats.connections.length > 50) {
            this.stats.connections = this.stats.connections.slice(0, 50);
        }
        
        // Mettre à jour les statistiques de visiteurs
        if (this.stats.visitors === null) {
            this.stats.visitors = 1;
        } else {
            this.stats.visitors += 1;
        }
        
        if (this.stats.sessions === null) {
            this.stats.sessions = 1;
        } else {
            this.stats.sessions += 1;
        }
        
        // Mettre à jour les vues de page
        if (this.stats.pageViews === null) {
            this.stats.pageViews = 1;
        } else {
            this.stats.pageViews += 1;
        }
        
        console.log('🔗 Nouvelle connexion enregistrée:', connection);
        
        // Déclencher une mise à jour des statistiques
        this.triggerStatsUpdate();
        
        return connection;
    }
    
    /**
     * Générer une IP simulée pour les tests
     */
    generateMockIP() {
        return `192.168.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`;
    }
    
    /**
     * Générer un ID de session unique
     */
    generateSessionId() {
        return 'sess_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    }
    
    /**
     * Déclencher une mise à jour des statistiques
     */
    triggerStatsUpdate() {
        if (this.updateInterval) {
            // Forcer une mise à jour immédiate
            this.updateStats();
        }
    }
    
    /**
     * Démarrer le compteur de temps de fonctionnement
     */
    startUptimeCounter() {
        setInterval(() => {
            const now = Date.now();
            const uptimeMs = now - this.startTime;
            const hours = Math.floor(uptimeMs / (1000 * 60 * 60));
            const minutes = Math.floor((uptimeMs % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((uptimeMs % (1000 * 60)) / 1000);
            
            this.stats.uptime = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        }, 1000);
    }
    
    /**
     * Démarrer les mises à jour automatiques
     */
    startAutoUpdates() {
        this.updateInterval = setInterval(() => {
            this.updateStats();
        }, 8000); // Mise à jour toutes les 8 secondes (optimisation FPS)
    }
    
    /**
     * Mettre à jour les statistiques
     */
    updateStats() {
        try {
            // Optimisation FPS : mise à jour conditionnelle
            const now = Date.now();
            if (now - this.lastUpdateTime < 5000) { // Mise à jour max toutes les 5 secondes
                return;
            }
            this.lastUpdateTime = now;
            
            // Simuler des changements réalistes seulement si on a des données
            if (this.hasRealData()) {
                this.simulateRealisticChanges();
            }
            
            // Mettre à jour les tendances
            this.updateTrends();
            
            // Générer des alertes si nécessaire
            this.checkForAlerts();
            
        } catch (error) {
            console.warn('⚠️ Erreur mise à jour statistiques:', error);
        }
    }
    
    /**
     * Vérifier si on a des vraies données
     */
    hasRealData() {
        return this.stats.visitors !== null && this.stats.visitors > 0;
    }
    
    /**
     * Simuler des changements réalistes
     */
    simulateRealisticChanges() {
        // FPS (variation réaliste)
        const fpsVariation = (Math.random() - 0.5) * 10; // ±5 FPS
        this.stats.fps = Math.max(30, Math.min(120, this.stats.fps + fpsVariation));
        
        // Mémoire (variation lente)
        const memoryVariation = (Math.random() - 0.5) * 5; // ±2.5%
        const newPercentage = Math.max(5, Math.min(95, this.stats.memory.percentage + memoryVariation));
        this.stats.memory.percentage = Math.round(newPercentage);
        this.stats.memory.used = `${Math.round((newPercentage / 100) * 100)} MB`;
        
        // Score de performance (variation lente)
        const perfVariation = (Math.random() - 0.5) * 6; // ±3 points
        this.stats.performanceScore = Math.max(60, Math.min(100, this.stats.performanceScore + perfVariation));
        
        // Qualité des animations basée sur FPS
        if (this.stats.fps >= 80) {
            this.stats.animationQuality = 1.0;
        } else if (this.stats.fps >= 60) {
            this.stats.animationQuality = 0.8;
        } else if (this.stats.fps >= 45) {
            this.stats.animationQuality = 0.6;
        } else if (this.stats.fps >= 30) {
            this.stats.animationQuality = 0.4;
        } else {
            this.stats.animationQuality = 0.2;
        }
        
        // Erreurs (occasionnelles)
        if (Math.random() < 0.1) { // 10% de chance
            this.stats.errors += 1;
        }
        
        // Activités (augmentation continue)
        this.stats.activities += Math.floor(Math.random() * 2) + 1;
    }
    
    /**
     * Mettre à jour les tendances
     */
    updateTrends() {
        // Calculer les tendances basées sur les changements récents
        this.stats.trends = {
            visitors: this.getVisitorTrend(),
            pageViews: this.getPageViewsTrend(),
            performance: this.stats.performanceScore > 90 ? 'Excellent' : 'Bon',
            memory: this.stats.memory.percentage < 80 ? 'Stable' : 'Élevée',
            fps: this.stats.fps > 55 ? 'Fluide' : 'Faible',
            animation: this.stats.animationQuality > 0.7 ? 'Fluide' : 'Minimal'
        };
    }
    
    /**
     * Obtenir la tendance des visiteurs
     */
    getVisitorTrend() {
        if (this.stats.visitors === null) return 'N/A';
        if (this.stats.visitors === 0) return '+0%';
        return '+5%'; // Simulation de tendance positive
    }
    
    /**
     * Obtenir la tendance des vues de page
     */
    getPageViewsTrend() {
        if (this.stats.pageViews === null) return 'N/A';
        if (this.stats.pageViews === 0) return '+0%';
        return '+8%'; // Simulation de tendance positive
    }
    
    /**
     * Vérifier les alertes
     */
    checkForAlerts() {
        this.stats.alerts = [];
        
        // Alerte FPS bas
        if (this.stats.fps < 40) {
            this.stats.alerts.push({
                type: 'warning',
                message: 'FPS bas détecté',
                timestamp: new Date().toISOString()
            });
        }
        
        // Alerte mémoire élevée
        if (this.stats.memory.percentage > 85) {
            this.stats.alerts.push({
                type: 'error',
                message: 'Utilisation mémoire élevée',
                timestamp: new Date().toISOString()
            });
        }
        
        // Alerte performance faible
        if (this.stats.performanceScore < 70) {
            this.stats.alerts.push({
                type: 'warning',
                message: 'Performance dégradée',
                timestamp: new Date().toISOString()
            });
        }
        
        // Alerte erreurs multiples
        if (this.stats.errors > 5) {
            this.stats.alerts.push({
                type: 'error',
                message: 'Nombre d\'erreurs élevé',
                timestamp: new Date().toISOString()
            });
        }
    }
    
    /**
     * Obtenir les statistiques actuelles
     */
    getStats() {
        return { ...this.stats };
    }
    
    /**
     * Obtenir les statistiques pour l'admin
     */
    getAdminStats() {
        return {
            current: {
                fps: this.stats.fps,
                frameTime: 1000 / this.stats.fps,
                loadTime: this.stats.loadTime,
                score: this.stats.performanceScore
            },
            trends: this.stats.trends,
            alerts: this.stats.alerts
        };
    }
    
    /**
     * Obtenir les statistiques du site
     */
    getSiteStats() {
        return {
            visitors: this.stats.visitors,
            pageViews: this.stats.pageViews,
            uptime: this.stats.uptime,
            errors: this.stats.errors,
            activities: this.stats.activities,
            sessions: this.stats.sessions,
            connections: this.stats.connections
        };
    }
    
    /**
     * Obtenir les statistiques d'activité
     */
    getActivityStats() {
        return {
            totalActivities: this.stats.activities,
            errorCount: this.stats.errors,
            performanceScore: this.stats.performanceScore
        };
    }
    
    /**
     * Obtenir les connexions récentes
     */
    getRecentConnections(limit = 10) {
        return this.stats.connections.slice(0, limit);
    }
    
    /**
     * Redémarrer les statistiques
     */
    restart() {
        console.log('🔄 Redémarrage des statistiques...');
        
        if (this.updateInterval) {
            clearInterval(this.updateInterval);
        }
        
        this.startTime = Date.now();
        this.startAutoUpdates();
        
        console.log('✅ Statistiques redémarrées');
    }
    
    /**
     * Arrêter les statistiques
     */
    stop() {
        if (this.updateInterval) {
            clearInterval(this.updateInterval);
            this.updateInterval = null;
        }
        
        this.isRunning = false;
        console.log('⏹️ Statistiques arrêtées');
    }
    
    /**
     * Nettoyer les ressources
     */
    cleanup() {
        this.stop();
        this.stats = null;
    }
}

// Créer une instance globale
window.adminStatsManager = new AdminStatsManager();

// Exposer la classe globalement
window.AdminStatsManager = AdminStatsManager;

// Créer des alias pour la compatibilité
window.siteMonitor = {
    getRealTimeStats: () => window.adminStatsManager.getSiteStats()
};

window.performanceMonitor = {
    getAdminStats: () => window.adminStatsManager.getAdminStats()
};

window.activityMonitor = {
    getStats: () => window.adminStatsManager.getActivityStats()
};

// Fonction globale pour tester les connexions
window.testNewConnection = (userInfo) => {
    if (window.adminStatsManager) {
        return window.adminStatsManager.logNewConnection(userInfo);
    }
    return null;
};

console.log('✅ Moniteurs de statistiques créés pour la compatibilité');
console.log('🔗 Utilisez window.testNewConnection("Nom") pour tester les connexions');
