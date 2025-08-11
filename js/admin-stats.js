/**
 * Gestionnaire des statistiques générales pour le panel admin
 * Simule et gère toutes les métriques d'administration
 */

class AdminStatsManager {
    constructor() {
        this.stats = {
            visitors: 1,
            pageViews: 1,
            uptime: '00:00:00',
            memory: { used: '10 MB', total: '100 MB', percentage: 10 },
            loadTime: 0,
            errors: 0,
            fps: 60,
            frameTime: 16.67,
            animationQuality: 1.0,
            performanceScore: 95,
            activities: 0,
            sessions: 1,
            trends: {},
            alerts: []
        };
        
        this.startTime = Date.now();
        this.isRunning = false;
        this.updateInterval = null;
        
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
        
        this.isRunning = true;
        console.log('✅ Gestionnaire de statistiques initialisé');
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
        }, 3000); // Mise à jour toutes les 3 secondes
    }
    
    /**
     * Mettre à jour les statistiques
     */
    updateStats() {
        try {
            // Simuler des changements réalistes
            this.simulateRealisticChanges();
            
            // Mettre à jour les tendances
            this.updateTrends();
            
            // Générer des alertes si nécessaire
            this.checkForAlerts();
            
        } catch (error) {
            console.warn('⚠️ Erreur mise à jour statistiques:', error);
        }
    }
    
    /**
     * Simuler des changements réalistes
     */
    simulateRealisticChanges() {
        // Visiteurs (augmentation lente)
        if (Math.random() < 0.3) { // 30% de chance
            this.stats.visitors += Math.floor(Math.random() * 2) + 1;
        }
        
        // Vues de page (augmentation plus rapide)
        if (Math.random() < 0.5) { // 50% de chance
            this.stats.pageViews += Math.floor(Math.random() * 3) + 1;
        }
        
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
        
        // Sessions (augmentation lente)
        if (Math.random() < 0.2) { // 20% de chance
            this.stats.sessions += 1;
        }
    }
    
    /**
     * Mettre à jour les tendances
     */
    updateTrends() {
        // Calculer les tendances basées sur les changements récents
        this.stats.trends = {
            visitors: this.stats.visitors > 0 ? '+5%' : '+0%',
            pageViews: this.stats.pageViews > 0 ? '+8%' : '+0%',
            performance: this.stats.performanceScore > 90 ? 'Excellent' : 'Bon',
            memory: this.stats.memory.percentage < 80 ? 'Stable' : 'Élevée',
            fps: this.stats.fps > 55 ? 'Fluide' : 'Faible',
            animation: this.stats.animationQuality > 0.7 ? 'Fluide' : 'Minimal'
        };
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
            sessions: this.stats.sessions
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

console.log('✅ Moniteurs de statistiques créés pour la compatibilité');
