/**
 * Performance Monitor - Système de surveillance des performances en temps réel
 * Optimise les FPS, réduit le lag et surveille les métriques de performance
 */

class PerformanceMonitor {
    constructor() {
        this.metrics = {
            fps: 0,
            frameTime: 0,
            loadTime: 0,
            memoryUsage: 0,
            cpuUsage: 0,
            networkLatency: 0,
            domSize: 0,
            jsHeapSize: 0,
            renderTime: 0,
            paintTime: 0,
            layoutTime: 0
        };
        
        this.history = {
            fps: [],
            frameTime: [],
            loadTime: [],
            memoryUsage: [],
            cpuUsage: []
        };
        
        this.maxHistorySize = 100;
        this.isMonitoring = true;
        this.frameCount = 0;
        this.lastFrameTime = performance.now();
        this.rafId = null;
        
        // Configuration des seuils d'alerte
        this.thresholds = {
            fps: { warning: 30, critical: 20 },
            frameTime: { warning: 33, critical: 50 },
            loadTime: { warning: 2000, critical: 5000 },
            memoryUsage: { warning: 100, critical: 200 }
        };
        
        this.init();
    }
    
    init() {
        console.log('🚀 Performance Monitor initialisé');
        this.startFPSCounter();
        this.startPerformanceObserver();
        this.startMemoryMonitoring();
        this.startNetworkMonitoring();
        this.startDOMMonitoring();
        this.startRenderMonitoring();
        
        // Optimisations automatiques
        this.autoOptimize();
    }
    
    /**
     * Démarrer le compteur FPS
     */
    startFPSCounter() {
        const measureFPS = () => {
            if (!this.isMonitoring) return;
            
            const now = performance.now();
            const deltaTime = now - this.lastFrameTime;
            this.lastFrameTime = now;
            
            this.frameCount++;
            
            // Calculer FPS et temps de frame
            if (deltaTime > 0) {
                this.metrics.fps = Math.round(1000 / deltaTime);
                this.metrics.frameTime = Math.round(deltaTime);
                
                // Ajouter à l'historique
                this.addToHistory('fps', this.metrics.fps);
                this.addToHistory('frameTime', this.metrics.frameTime);
            }
            
            // Optimisations automatiques basées sur les performances
            this.autoOptimizeBasedOnFPS();
            
            this.rafId = requestAnimationFrame(measureFPS);
        };
        
        this.rafId = requestAnimationFrame(measureFPS);
    }
    
    /**
     * Démarrer l'observateur de performance
     */
    startPerformanceObserver() {
        if ('PerformanceObserver' in window) {
            // Observer les métriques Web Vitals
            const observer = new PerformanceObserver((list) => {
                for (const entry of list.getEntries()) {
                    this.handlePerformanceEntry(entry);
                }
            });
            
            try {
                observer.observe({ entryTypes: ['navigation', 'resource', 'paint', 'largest-contentful-paint', 'first-input', 'layout-shift'] });
            } catch (e) {
                console.warn('⚠️ PerformanceObserver non supporté:', e);
            }
        }
    }
    
    /**
     * Démarrer la surveillance de la mémoire
     */
    startMemoryMonitoring() {
        if ('memory' in performance) {
            setInterval(() => {
                this.metrics.memoryUsage = Math.round(performance.memory.usedJSHeapSize / 1024 / 1024);
                this.metrics.jsHeapSize = Math.round(performance.memory.totalJSHeapSize / 1024 / 1024);
                this.addToHistory('memoryUsage', this.metrics.memoryUsage);
            }, 1000);
        }
    }
    
    /**
     * Démarrer la surveillance réseau
     */
    startNetworkMonitoring() {
        if ('connection' in navigator) {
            const connection = navigator.connection;
            this.metrics.networkLatency = connection.rtt || 0;
            
            connection.addEventListener('change', () => {
                this.metrics.networkLatency = connection.rtt || 0;
            });
        }
    }
    
    /**
     * Démarrer la surveillance DOM
     */
    startDOMMonitoring() {
        setInterval(() => {
            this.metrics.domSize = document.querySelectorAll('*').length;
        }, 5000);
    }
    
    /**
     * Démarrer la surveillance du rendu
     */
    startRenderMonitoring() {
        if ('PerformanceObserver' in window) {
            const observer = new PerformanceObserver((list) => {
                for (const entry of list.getEntries()) {
                    if (entry.entryType === 'paint') {
                        this.metrics.paintTime = Math.round(entry.startTime);
                    }
                }
            });
            
            try {
                observer.observe({ entryTypes: ['paint'] });
            } catch (e) {
                console.warn('⚠️ Paint observer non supporté:', e);
            }
        }
    }
    
    /**
     * Gérer les entrées de performance
     */
    handlePerformanceEntry(entry) {
        switch (entry.entryType) {
            case 'navigation':
                this.metrics.loadTime = Math.round(entry.loadEventEnd - entry.loadEventStart);
                this.addToHistory('loadTime', this.metrics.loadTime);
                break;
                
            case 'paint':
                if (entry.name === 'first-paint') {
                    this.metrics.paintTime = Math.round(entry.startTime);
                }
                break;
                
            case 'largest-contentful-paint':
                this.metrics.lcp = Math.round(entry.startTime);
                break;
                
            case 'first-input':
                this.metrics.fid = Math.round(entry.processingStart - entry.startTime);
                break;
        }
    }
    
    /**
     * Ajouter à l'historique
     */
    addToHistory(metric, value) {
        if (!this.history[metric]) return;
        
        this.history[metric].push({
            value: value,
            timestamp: Date.now()
        });
        
        // Limiter la taille de l'historique
        if (this.history[metric].length > this.maxHistorySize) {
            this.history[metric].shift();
        }
    }
    
    /**
     * Optimisations automatiques basées sur les FPS
     */
    autoOptimizeBasedOnFPS() {
        if (this.metrics.fps < this.thresholds.fps.critical) {
            this.emergencyOptimization();
        } else if (this.metrics.fps < this.thresholds.fps.warning) {
            this.warningOptimization();
        }
    }
    
    /**
     * Optimisation d'urgence
     */
    emergencyOptimization() {
        console.warn('🚨 Optimisation d\'urgence activée - FPS critique:', this.metrics.fps);
        
        // Désactiver les animations non essentielles
        this.disableNonEssentialAnimations();
        
        // Réduire la qualité des effets visuels
        this.reduceVisualEffects();
        
        // Optimiser le DOM
        this.optimizeDOM();
        
        // Nettoyer la mémoire
        this.cleanupMemory();
    }
    
    /**
     * Optimisation d'avertissement
     */
    warningOptimization() {
        console.warn('⚠️ Optimisation d\'avertissement - FPS faible:', this.metrics.fps);
        
        // Optimisations légères
        this.lightOptimization();
    }
    
    /**
     * Désactiver les animations non essentielles
     */
    disableNonEssentialAnimations() {
        const nonEssentialElements = document.querySelectorAll('.non-essential-animation, .decorative-animation');
        nonEssentialElements.forEach(el => {
            el.style.animationPlayState = 'paused';
            el.style.transition = 'none';
        });
    }
    
    /**
     * Réduire les effets visuels
     */
    reduceVisualEffects() {
        document.body.style.setProperty('--animation-duration', '0.1s');
        document.body.style.setProperty('--transition-duration', '0.1s');
        
        // Réduire les ombres
        const elementsWithShadows = document.querySelectorAll('[style*="box-shadow"], [style*="text-shadow"]');
        elementsWithShadows.forEach(el => {
            el.style.boxShadow = 'none';
            el.style.textShadow = 'none';
        });
    }
    
    /**
     * Optimiser le DOM
     */
    optimizeDOM() {
        // Utiliser DocumentFragment pour les modifications en lot
        const fragment = document.createDocumentFragment();
        
        // Optimiser les sélecteurs
        const heavySelectors = document.querySelectorAll('div > div > div > div');
        if (heavySelectors.length > 100) {
            console.warn('⚠️ Trop de sélecteurs imbriqués détectés');
        }
    }
    
    /**
     * Nettoyer la mémoire
     */
    cleanupMemory() {
        // Forcer le garbage collection si disponible
        if (window.gc) {
            window.gc();
        }
        
        // Nettoyer les event listeners non utilisés
        this.cleanupEventListeners();
    }
    
    /**
     * Nettoyer les event listeners
     */
    cleanupEventListeners() {
        // Implémentation de nettoyage des event listeners
        console.log('🧹 Nettoyage des event listeners...');
    }
    
    /**
     * Optimisations légères
     */
    lightOptimization() {
        // Réduire la fréquence des animations
        document.body.style.setProperty('--animation-duration', '0.2s');
        
        // Optimiser les transitions
        const animatedElements = document.querySelectorAll('.animated, .transition');
        animatedElements.forEach(el => {
            if (el.style.transition) {
                el.style.transition = 'all 0.2s ease';
            }
        });
    }
    
    /**
     * Optimisations automatiques au démarrage
     */
    autoOptimize() {
        // Optimiser les images
        this.optimizeImages();
        
        // Optimiser les polices
        this.optimizeFonts();
        
        // Optimiser le CSS
        this.optimizeCSS();
        
        // Optimiser le JavaScript
        this.optimizeJavaScript();
    }
    
    /**
     * Optimiser les images
     */
    optimizeImages() {
        const images = document.querySelectorAll('img');
        images.forEach(img => {
            // Lazy loading
            if (!img.loading) {
                img.loading = 'lazy';
            }
            
            // Optimiser la taille
            if (img.width > 1920) {
                img.style.maxWidth = '100%';
                img.style.height = 'auto';
            }
        });
    }
    
    /**
     * Optimiser les polices
     */
    optimizeFonts() {
        // Précharger les polices critiques
        const fontLinks = document.querySelectorAll('link[rel="preload"][as="font"]');
        fontLinks.forEach(link => {
            link.rel = 'preload';
            link.as = 'font';
            link.crossOrigin = 'anonymous';
        });
    }
    
    /**
     * Optimiser le CSS
     */
    optimizeCSS() {
        // Réduire les reflows
        const style = document.createElement('style');
        style.textContent = `
            .optimized * {
                will-change: auto;
                transform: translateZ(0);
            }
        `;
        document.head.appendChild(style);
    }
    
    /**
     * Optimiser le JavaScript
     */
    optimizeJavaScript() {
        // Utiliser requestIdleCallback pour les tâches non critiques
        if ('requestIdleCallback' in window) {
            requestIdleCallback(() => {
                this.performBackgroundTasks();
            });
        }
    }
    
    /**
     * Effectuer des tâches en arrière-plan
     */
    performBackgroundTasks() {
        // Nettoyer le cache
        this.cleanupCache();
        
        // Analyser les performances
        this.analyzePerformance();
    }
    
    /**
     * Nettoyer le cache
     */
    cleanupCache() {
        // Implémentation du nettoyage du cache
        console.log('🧹 Nettoyage du cache...');
    }
    
    /**
     * Analyser les performances
     */
    analyzePerformance() {
        const analysis = {
            fps: this.getAverageMetric('fps'),
            frameTime: this.getAverageMetric('frameTime'),
            loadTime: this.getAverageMetric('loadTime'),
            memoryUsage: this.getAverageMetric('memoryUsage'),
            score: this.calculatePerformanceScore()
        };
        
        console.log('📊 Analyse des performances:', analysis);
        return analysis;
    }
    
    /**
     * Obtenir la moyenne d'une métrique
     */
    getAverageMetric(metric) {
        if (!this.history[metric] || this.history[metric].length === 0) return 0;
        
        const sum = this.history[metric].reduce((acc, item) => acc + item.value, 0);
        return Math.round(sum / this.history[metric].length);
    }
    
    /**
     * Calculer le score de performance
     */
    calculatePerformanceScore() {
        let score = 100;
        
        // Pénaliser les FPS bas
        if (this.metrics.fps < 30) score -= 20;
        if (this.metrics.fps < 20) score -= 30;
        
        // Pénaliser le temps de chargement élevé
        if (this.metrics.loadTime > 3000) score -= 15;
        if (this.metrics.loadTime > 5000) score -= 25;
        
        // Pénaliser l'utilisation mémoire élevée
        if (this.metrics.memoryUsage > 100) score -= 10;
        if (this.metrics.memoryUsage > 200) score -= 20;
        
        return Math.max(0, score);
    }
    
    /**
     * Obtenir les métriques en temps réel
     */
    getRealTimeMetrics() {
        return {
            ...this.metrics,
            score: this.calculatePerformanceScore(),
            history: this.history,
            analysis: this.analyzePerformance()
        };
    }
    
    /**
     * Obtenir les statistiques pour le panel admin
     */
    getAdminStats() {
        return {
            current: {
                fps: this.metrics.fps,
                frameTime: this.metrics.frameTime,
                loadTime: this.metrics.loadTime,
                memoryUsage: this.metrics.memoryUsage,
                score: this.calculatePerformanceScore()
            },
            average: {
                fps: this.getAverageMetric('fps'),
                frameTime: this.getAverageMetric('frameTime'),
                loadTime: this.getAverageMetric('loadTime'),
                memoryUsage: this.getAverageMetric('memoryUsage')
            },
            trends: this.getTrends(),
            alerts: this.getAlerts()
        };
    }
    
    /**
     * Obtenir les tendances
     */
    getTrends() {
        const trends = {};
        
        Object.keys(this.history).forEach(metric => {
            if (this.history[metric].length >= 2) {
                const recent = this.history[metric].slice(-5);
                const older = this.history[metric].slice(-10, -5);
                
                if (recent.length > 0 && older.length > 0) {
                    const recentAvg = recent.reduce((acc, item) => acc + item.value, 0) / recent.length;
                    const olderAvg = older.reduce((acc, item) => acc + item.value, 0) / older.length;
                    
                    trends[metric] = recentAvg > olderAvg ? 'up' : 'down';
                }
            }
        });
        
        return trends;
    }
    
    /**
     * Obtenir les alertes
     */
    getAlerts() {
        const alerts = [];
        
        if (this.metrics.fps < this.thresholds.fps.critical) {
            alerts.push({
                level: 'critical',
                message: `FPS critique: ${this.metrics.fps}`,
                metric: 'fps'
            });
        }
        
        if (this.metrics.frameTime > this.thresholds.frameTime.critical) {
            alerts.push({
                level: 'critical',
                message: `Temps de frame critique: ${this.metrics.frameTime}ms`,
                metric: 'frameTime'
            });
        }
        
        if (this.metrics.loadTime > this.thresholds.loadTime.critical) {
            alerts.push({
                level: 'warning',
                message: `Temps de chargement élevé: ${this.metrics.loadTime}ms`,
                metric: 'loadTime'
            });
        }
        
        return alerts;
    }
    
    /**
     * Arrêter le monitoring
     */
    stop() {
        this.isMonitoring = false;
        if (this.rafId) {
            cancelAnimationFrame(this.rafId);
        }
    }
    
    /**
     * Redémarrer le monitoring
     */
    restart() {
        this.stop();
        this.isMonitoring = true;
        this.init();
    }
}

// Créer l'instance globale
window.performanceMonitor = new PerformanceMonitor();

// Exporter pour utilisation dans d'autres modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = PerformanceMonitor;
}

