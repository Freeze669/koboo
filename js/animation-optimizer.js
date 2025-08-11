/**
 * Animation Optimizer - Système d'optimisation des animations pour 80-90 FPS
 * Optimise les animations en temps réel pour une performance maximale
 */
class AnimationOptimizer {
    constructor(performanceMonitor) {
        this.performanceMonitor = performanceMonitor;
        this.isOptimizing = true;
        this.animationFrames = new Map();
        this.optimizationLevel = 'high'; // high, medium, low, emergency
        this.targetFPS = 90;
        this.currentFPS = 0;
        this.animationQuality = 1.0; // 0.0 à 1.0
        this.smoothAnimations = true;
        this.useTransform3D = true;
        this.enableHardwareAcceleration = true;
        
        // Configuration des seuils d'optimisation
        this.thresholds = {
            fps: { target: 90, warning: 60, critical: 30 },
            frameTime: { target: 11, warning: 16, critical: 33 },
            memoryUsage: { warning: 100, critical: 200 }
        };
        
        this.init();
    }
    
    init() {
        this.setupPerformanceListener();
        this.optimizeExistingAnimations();
        this.startAnimationMonitoring();
        this.enableHardwareAcceleration();
        console.log('🎬 Animation Optimizer initialisé - Cible: 80-90 FPS');
    }
    
    setupPerformanceListener() {
        if (this.performanceMonitor) {
            this.performanceMonitor.on('fpsUpdate', (fps) => {
                this.currentFPS = fps;
                this.autoOptimizeAnimations();
            });
        }
    }
    
    startAnimationMonitoring() {
        // Surveillance des animations en cours
        this.monitorAnimationFrames();
        
        // Optimisation automatique basée sur les FPS
        setInterval(() => {
            this.autoOptimizeAnimations();
        }, 1000);
    }
    
    monitorAnimationFrames() {
        // Intercepter requestAnimationFrame pour optimisation
        const originalRAF = window.requestAnimationFrame;
        window.requestAnimationFrame = (callback) => {
            const optimizedCallback = (timestamp) => {
                this.beforeFrame(timestamp);
                callback(timestamp);
                this.afterFrame(timestamp);
            };
            return originalRAF(optimizedCallback);
        };
    }
    
    beforeFrame(timestamp) {
        // Optimisations avant chaque frame
        if (this.currentFPS < this.thresholds.fps.warning) {
            this.emergencyOptimization();
        }
    }
    
    afterFrame(timestamp) {
        // Nettoyage après chaque frame
        this.cleanupFrame();
    }
    
    autoOptimizeAnimations() {
        const fps = this.currentFPS;
        const frameTime = this.performanceMonitor?.metrics.frameTime || 16;
        
        if (fps < this.thresholds.fps.critical) {
            this.emergencyOptimization();
        } else if (fps < this.thresholds.fps.warning) {
            this.warningOptimization();
        } else if (fps < this.thresholds.fps.target) {
            this.lightOptimization();
        } else {
            this.restoreQuality();
        }
        
        // Optimisation basée sur le temps de frame
        if (frameTime > this.thresholds.frameTime.critical) {
            this.optimizeFrameTime();
        }
    }
    
    emergencyOptimization() {
        this.optimizationLevel = 'emergency';
        this.animationQuality = 0.3;
        
        // Désactiver toutes les animations non essentielles
        this.disableNonEssentialAnimations();
        this.reduceAnimationComplexity();
        this.enableLowPowerMode();
        
        console.log('🚨 Optimisation d\'urgence activée - Qualité: 30%');
    }
    
    warningOptimization() {
        this.optimizationLevel = 'medium';
        this.animationQuality = 0.6;
        
        // Réduire la complexité des animations
        this.reduceAnimationComplexity();
        this.optimizeAnimationTiming();
        
        console.log('⚠️ Optimisation d\'avertissement - Qualité: 60%');
    }
    
    lightOptimization() {
        this.optimizationLevel = 'low';
        this.animationQuality = 0.8;
        
        // Optimisations légères
        this.optimizeAnimationTiming();
        this.enableSmartCulling();
        
        console.log('🔧 Optimisation légère - Qualité: 80%');
    }
    
    restoreQuality() {
        this.optimizationLevel = 'high';
        this.animationQuality = 1.0;
        
        // Restaurer la qualité maximale
        this.enableAllAnimations();
        this.restoreAnimationComplexity();
        
        console.log('✨ Qualité maximale restaurée - 100%');
    }
    
    disableNonEssentialAnimations() {
        // Désactiver les animations AOS non essentielles
        const aosElements = document.querySelectorAll('[data-aos]');
        aosElements.forEach(el => {
            if (!el.hasAttribute('data-aos-essential')) {
                el.style.animation = 'none';
                el.style.transition = 'none';
            }
        });
        
        // Désactiver les animations CSS complexes
        this.disableComplexCSSAnimations();
        
        // Désactiver les animations JavaScript non essentielles
        this.disableNonEssentialJSAnimations();
    }
    
    disableComplexCSSAnimations() {
        const style = document.createElement('style');
        style.id = 'emergency-animations';
        style.textContent = `
            .custom-cursor,
            .custom-cursor-follower,
            .premium-loader,
            .floating-elements,
            .particle-effect {
                animation: none !important;
                transition: none !important;
            }
            
            * {
                animation-duration: 0.1s !important;
                transition-duration: 0.1s !important;
            }
        `;
        
        if (!document.getElementById('emergency-animations')) {
            document.head.appendChild(style);
        }
    }
    
    disableNonEssentialJSAnimations() {
        // Arrêter les animations JavaScript non essentielles
        if (window.particleEngine) {
            window.particleEngine.pause();
        }
        
        if (window.shaderManager) {
            window.shaderManager.setQuality('low');
        }
    }
    
    reduceAnimationComplexity() {
        // Réduire la complexité des animations
        this.setAnimationDuration(0.3);
        this.setAnimationEasing('ease-out');
        this.reduceParticleCount();
        this.simplifyShaders();
    }
    
    setAnimationDuration(duration) {
        const style = document.createElement('style');
        style.id = 'reduced-animations';
        style.textContent = `
            * {
                animation-duration: ${duration}s !important;
                transition-duration: ${duration}s !important;
            }
        `;
        
        if (!document.getElementById('reduced-animations')) {
            document.head.appendChild(style);
        }
    }
    
    setAnimationEasing(easing) {
        const style = document.createElement('style');
        style.id = 'easing-animations';
        style.textContent = `
            * {
                animation-timing-function: ${easing} !important;
                transition-timing-function: ${easing} !important;
            }
        `;
        
        if (!document.getElementById('easing-animations')) {
            document.head.appendChild(style);
        }
    }
    
    reduceParticleCount() {
        if (window.particleEngine) {
            window.particleEngine.setMaxParticles(50);
        }
    }
    
    simplifyShaders() {
        if (window.shaderManager) {
            window.shaderManager.setComplexity('low');
        }
    }
    
    optimizeAnimationTiming() {
        // Optimiser le timing des animations
        this.useTransform3D = true;
        this.enableHardwareAcceleration = true;
        this.optimizeAnimationFrames();
    }
    
    enableHardwareAcceleration() {
        // Forcer l'accélération matérielle
        const style = document.createElement('style');
        style.id = 'hardware-acceleration';
        style.textContent = `
            .hardware-accelerated {
                transform: translateZ(0);
                backface-visibility: hidden;
                perspective: 1000px;
                will-change: transform;
            }
            
            .custom-cursor,
            .custom-cursor-follower,
            .premium-loader,
            .floating-elements {
                transform: translateZ(0);
                will-change: transform;
            }
        `;
        
        if (!document.getElementById('hardware-acceleration')) {
            document.head.appendChild(style);
        }
        
        // Appliquer aux éléments existants
        this.applyHardwareAcceleration();
    }
    
    applyHardwareAcceleration() {
        const elements = document.querySelectorAll('.custom-cursor, .custom-cursor-follower, .premium-loader, .floating-elements');
        elements.forEach(el => {
            el.classList.add('hardware-accelerated');
        });
    }
    
    optimizeAnimationFrames() {
        // Optimiser le rendu des frames
        if (this.performanceMonitor?.metrics.frameTime > this.thresholds.frameTime.warning) {
            this.enableFrameSkipping();
            this.reduceFrameRate();
        }
    }
    
    enableFrameSkipping() {
        // Permettre le saut de frames pour maintenir les FPS
        this.frameSkipEnabled = true;
        this.frameSkipRate = 2; // Sauter 1 frame sur 2 si nécessaire
    }
    
    reduceFrameRate() {
        // Réduire le taux de rafraîchissement si nécessaire
        if (this.currentFPS < 30) {
            this.targetFrameRate = 30;
        } else if (this.currentFPS < 60) {
            this.targetFrameRate = 60;
        }
    }
    
    enableSmartCulling() {
        // Culling intelligent des animations hors écran
        this.smartCulling = true;
        this.observeVisibility();
    }
    
    observeVisibility() {
        if ('IntersectionObserver' in window) {
            this.visibilityObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        this.enableElementAnimations(entry.target);
                    } else {
                        this.disableElementAnimations(entry.target);
                    }
                });
            }, { threshold: 0.1 });
            
            // Observer tous les éléments avec des animations
            const animatedElements = document.querySelectorAll('[data-aos], .animated, .floating-elements');
            animatedElements.forEach(el => this.visibilityObserver.observe(el));
        }
    }
    
    enableElementAnimations(element) {
        element.style.animationPlayState = 'running';
        element.style.transition = 'all 0.3s ease-out';
    }
    
    disableElementAnimations(element) {
        element.style.animationPlayState = 'paused';
        element.style.transition = 'none';
    }
    
    enableLowPowerMode() {
        // Mode basse consommation
        this.lowPowerMode = true;
        
        // Réduire la fréquence des mises à jour
        this.updateInterval = 100; // 10 FPS max en mode basse consommation
        
        // Désactiver les effets visuels coûteux
        this.disableExpensiveEffects();
    }
    
    disableExpensiveEffects() {
        // Désactiver les effets coûteux
        const style = document.createElement('style');
        style.id = 'low-power-mode';
        style.textContent = `
            .expensive-effect {
                display: none !important;
            }
            
            .particle-effect,
            .shader-effect,
            .complex-animation {
                opacity: 0.5 !important;
                filter: blur(1px) !important;
            }
        `;
        
        if (!document.getElementById('low-power-mode')) {
            document.head.appendChild(style);
        }
    }
    
    optimizeExistingAnimations() {
        // Optimiser les animations existantes
        this.optimizeAOSAnimations();
        this.optimizeCustomAnimations();
        this.optimizeCSSAnimations();
    }
    
    optimizeAOSAnimations() {
        // Optimiser les animations AOS
        if (window.AOS) {
            window.AOS.init({
                duration: 600,
                easing: 'ease-out',
                once: true,
                offset: 100,
                delay: 0,
                disable: false
            });
        }
    }
    
    optimizeCustomAnimations() {
        // Optimiser les animations personnalisées
        const customAnimations = document.querySelectorAll('.custom-animation, .floating-element');
        customAnimations.forEach(el => {
            el.style.willChange = 'transform';
            el.style.transform = 'translateZ(0)';
        });
    }
    
    optimizeCSSAnimations() {
        // Optimiser les animations CSS
        const animatedElements = document.querySelectorAll('.animated, [class*="fade"], [class*="slide"]');
        animatedElements.forEach(el => {
            el.style.willChange = 'opacity, transform';
            el.style.backfaceVisibility = 'hidden';
        });
    }
    
    cleanupFrame() {
        // Nettoyage après chaque frame
        if (this.frameCount % 60 === 0) { // Toutes les 60 frames
            this.cleanupMemory();
            this.cleanupEventListeners();
        }
        this.frameCount++;
    }
    
    cleanupMemory() {
        // Nettoyage mémoire
        if (window.gc) {
            window.gc();
        }
        
        // Vider les caches d'animation
        this.clearAnimationCache();
    }
    
    clearAnimationCache() {
        // Vider le cache des animations
        this.animationFrames.clear();
        
        // Forcer le garbage collection des animations
        if (this.performanceMonitor?.metrics.memoryUsage > this.thresholds.memoryUsage.warning) {
            this.emergencyMemoryCleanup();
        }
    }
    
    emergencyMemoryCleanup() {
        // Nettoyage d'urgence de la mémoire
        console.log('🧹 Nettoyage d\'urgence de la mémoire');
        
        // Arrêter toutes les animations
        this.pauseAllAnimations();
        
        // Vider les caches
        this.clearAllCaches();
        
        // Redémarrer avec des paramètres optimisés
        setTimeout(() => {
            this.restartWithOptimizedSettings();
        }, 100);
    }
    
    pauseAllAnimations() {
        const animatedElements = document.querySelectorAll('[data-aos], .animated, .custom-animation');
        animatedElements.forEach(el => {
            el.style.animationPlayState = 'paused';
            el.style.transition = 'none';
        });
    }
    
    clearAllCaches() {
        // Vider tous les caches
        this.animationFrames.clear();
        
        // Forcer le nettoyage du DOM
        if (window.performance && window.performance.memory) {
            console.log('Mémoire avant nettoyage:', window.performance.memory.usedJSHeapSize / 1024 / 1024, 'MB');
        }
    }
    
    restartWithOptimizedSettings() {
        // Redémarrer avec des paramètres optimisés
        this.optimizationLevel = 'emergency';
        this.animationQuality = 0.2;
        
        // Réactiver progressivement
        setTimeout(() => {
            this.warningOptimization();
        }, 2000);
        
        setTimeout(() => {
            this.lightOptimization();
        }, 5000);
    }
    
    getOptimizationStatus() {
        return {
            level: this.optimizationLevel,
            quality: this.animationQuality,
            targetFPS: this.targetFPS,
            currentFPS: this.currentFPS,
            smoothAnimations: this.smoothAnimations,
            hardwareAcceleration: this.enableHardwareAcceleration,
            lowPowerMode: this.lowPowerMode || false
        };
    }
    
    setTargetFPS(fps) {
        this.targetFPS = Math.max(30, Math.min(120, fps));
        console.log(`🎯 FPS cible défini à: ${this.targetFPS}`);
    }
    
    setAnimationQuality(quality) {
        this.animationQuality = Math.max(0.1, Math.min(1.0, quality));
        console.log(`🎨 Qualité d'animation définie à: ${Math.round(this.animationQuality * 100)}%`);
        
        // Appliquer immédiatement
        if (this.animationQuality < 0.5) {
            this.emergencyOptimization();
        } else if (this.animationQuality < 0.8) {
            this.warningOptimization();
        } else {
            this.lightOptimization();
        }
    }
    
    toggleSmoothAnimations() {
        this.smoothAnimations = !this.smoothAnimations;
        console.log(`🔄 Animations fluides: ${this.smoothAnimations ? 'Activées' : 'Désactivées'}`);
        
        if (this.smoothAnimations) {
            this.enableSmoothAnimations();
        } else {
            this.disableSmoothAnimations();
        }
    }
    
    enableSmoothAnimations() {
        // Activer les animations fluides
        const style = document.createElement('style');
        style.id = 'smooth-animations';
        style.textContent = `
            * {
                animation-timing-function: cubic-bezier(0.4, 0, 0.2, 1) !important;
                transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1) !important;
            }
        `;
        
        if (!document.getElementById('smooth-animations')) {
            document.head.appendChild(style);
        }
    }
    
    disableSmoothAnimations() {
        // Désactiver les animations fluides
        const style = document.getElementById('smooth-animations');
        if (style) {
            style.remove();
        }
    }
    
    getPerformanceMetrics() {
        return {
            fps: this.currentFPS,
            targetFPS: this.targetFPS,
            optimizationLevel: this.optimizationLevel,
            animationQuality: this.animationQuality,
            smoothAnimations: this.smoothAnimations,
            hardwareAcceleration: this.enableHardwareAcceleration,
            lowPowerMode: this.lowPowerMode || false,
            frameSkipEnabled: this.frameSkipEnabled || false,
            smartCulling: this.smartCulling || false
        };
    }
    
    stop() {
        this.isOptimizing = false;
        
        // Nettoyer les observateurs
        if (this.visibilityObserver) {
            this.visibilityObserver.disconnect();
        }
        
        // Restaurer les animations
        this.restoreQuality();
        
        console.log('🛑 Animation Optimizer arrêté');
    }
    
    restart() {
        this.stop();
        setTimeout(() => {
            this.init();
        }, 100);
    }
}

// Initialisation automatique
if (typeof window !== 'undefined') {
    window.animationOptimizer = new AnimationOptimizer(window.performanceMonitor);
    
    // Exposer les méthodes publiques
    window.optimizeAnimations = {
        setTargetFPS: (fps) => window.animationOptimizer.setTargetFPS(fps),
        setAnimationQuality: (quality) => window.animationOptimizer.setAnimationQuality(quality),
        toggleSmoothAnimations: () => window.animationOptimizer.toggleSmoothAnimations(),
        getStatus: () => window.animationOptimizer.getOptimizationStatus(),
        getMetrics: () => window.animationOptimizer.getPerformanceMetrics(),
        restart: () => window.animationOptimizer.restart()
    };
    
    console.log('🎬 Animation Optimizer chargé et prêt - FPS cible: 80-90');
}

