/**
 * Configuration des graphiques pour le panel admin
 * Gère l'initialisation et la configuration de Chart.js
 */

class ChartManager {
    constructor() {
        this.charts = {};
        this.chartConfigs = {};
        this.isInitialized = false;
        this.init();
    }

    init() {
        console.log('📊 Initialisation du gestionnaire de graphiques...');
        
        // Vérifier que Chart.js est disponible
        if (typeof Chart === 'undefined') {
            console.warn('⚠️ Chart.js non disponible, chargement en cours...');
            this.loadChartJS();
            return;
        }
        
        this.isInitialized = true;
        this.setupDefaultConfigs();
        console.log('✅ Gestionnaire de graphiques initialisé');
    }

    /**
     * Charger Chart.js depuis CDN si non disponible
     */
    loadChartJS() {
        const script = document.createElement('script');
        script.src = 'https://cdn.jsdelivr.net/npm/chart.js';
        script.onload = () => {
            console.log('✅ Chart.js chargé avec succès');
            this.isInitialized = true;
            this.setupDefaultConfigs();
            this.initializeAllCharts();
        };
        script.onerror = () => {
            console.error('❌ Erreur chargement Chart.js');
        };
        document.head.appendChild(script);
    }

    /**
     * Configuration par défaut des graphiques
     */
    setupDefaultConfigs() {
        // Configuration commune pour tous les graphiques
        const commonConfig = {
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    backgroundColor: 'rgba(30, 41, 59, 0.9)',
                    titleColor: '#f8fafc',
                    bodyColor: '#94a3b8',
                    borderColor: '#334155',
                    borderWidth: 1,
                    cornerRadius: 8
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    grid: {
                        color: 'rgba(51, 65, 85, 0.3)'
                    },
                    ticks: {
                        color: '#94a3b8',
                        font: {
                            size: 11
                        }
                    },
                    // Empêcher la descente vers le bas
                    position: 'left',
                    border: {
                        display: false
                    }
                },
                x: {
                    grid: {
                        color: 'rgba(51, 65, 85, 0.3)'
                    },
                    ticks: {
                        color: '#94a3b8',
                        font: {
                            size: 11
                        }
                    },
                    // Empêcher la descente vers le bas
                    position: 'bottom',
                    border: {
                        display: false
                    }
                }
            },
            elements: {
                point: {
                    radius: 3,
                    hoverRadius: 5
                },
                line: {
                    tension: 0.4
                }
            },
            // Empêcher les animations qui peuvent causer des problèmes visuels
            animation: {
                duration: 0
            },
            // Empêcher la redimension qui peut causer des problèmes
            resizeDelay: 0
        };

        // Configuration spécifique pour FPS
        this.chartConfigs.fps = {
            ...commonConfig,
            scales: {
                ...commonConfig.scales,
                y: {
                    ...commonConfig.scales.y,
                    max: 120,
                    min: 0,
                    // Empêcher la descente vers le bas
                    position: 'left',
                    border: {
                        display: false
                    }
                },
                x: {
                    ...commonConfig.scales.x,
                    // Empêcher la descente vers le bas
                    position: 'bottom',
                    border: {
                        display: false
                    }
                }
            }
        };

        // Configuration spécifique pour mémoire
        this.chartConfigs.memory = {
            ...commonConfig,
            scales: {
                ...commonConfig.scales,
                y: {
                    ...commonConfig.scales.y,
                    min: 0,
                    max: 500, // Mémoire max en MB
                    // Empêcher la descente vers le bas
                    position: 'left',
                    border: {
                        display: false
                    }
                },
                x: {
                    ...commonConfig.scales.x,
                    // Empêcher la descente vers le bas
                    position: 'bottom',
                    border: {
                        display: false
                    }
                }
            }
        };
    }

    /**
     * Initialiser tous les graphiques
     */
    initializeAllCharts() {
        if (!this.isInitialized) {
            console.warn('⚠️ ChartManager non initialisé');
            return;
        }

        this.initializeFPSChart();
        this.initializeMemoryChart();
    }

    /**
     * Initialiser le graphique FPS
     */
    initializeFPSChart() {
        const ctx = document.getElementById('fpsChart');
        if (!ctx) {
            console.warn('⚠️ Canvas FPS non trouvé');
            return;
        }

        // Détruire le graphique existant
        if (this.charts.fps) {
            this.charts.fps.destroy();
        }

        // Créer le nouveau graphique
        this.charts.fps = new Chart(ctx, {
            type: 'line',
            data: {
                labels: [],
                datasets: [{
                    label: 'FPS',
                    data: [],
                    borderColor: '#60a5fa',
                    backgroundColor: 'rgba(96, 165, 250, 0.1)',
                    borderWidth: 2,
                    fill: true,
                    tension: 0.4
                }]
            },
            options: this.chartConfigs.fps
        });

        console.log('✅ Graphique FPS initialisé');
    }

    /**
     * Initialiser le graphique mémoire
     */
    initializeMemoryChart() {
        const ctx = document.getElementById('memoryChart');
        if (!ctx) {
            console.warn('⚠️ Canvas mémoire non trouvé');
            return;
        }

        // Détruire le graphique existant
        if (this.charts.memory) {
            this.charts.memory.destroy();
        }

        // Créer le nouveau graphique
        this.charts.memory = new Chart(ctx, {
            type: 'line',
            data: {
                labels: [],
                datasets: [{
                    label: 'Mémoire (MB)',
                    data: [],
                    borderColor: '#10b981',
                    backgroundColor: 'rgba(16, 185, 129, 0.1)',
                    borderWidth: 2,
                    fill: true,
                    tension: 0.4
                }]
            },
            options: this.chartConfigs.memory
        });

        console.log('✅ Graphique mémoire initialisé');
    }



    /**
     * Mettre à jour le graphique FPS
     */
    updateFPSChart(data) {
        if (!this.charts.fps) {
            this.initializeFPSChart();
        }

        const chart = this.charts.fps;
        if (!chart) return;

        // Limiter à 20 points de données
        const maxPoints = 20;
        
        // Ajouter les nouvelles données
        chart.data.labels.push(new Date().toLocaleTimeString());
        chart.data.datasets[0].data.push(data);

        // Limiter le nombre de points
        if (chart.data.labels.length > maxPoints) {
            chart.data.labels.shift();
            chart.data.datasets[0].data.shift();
        }

        chart.update('none'); // Mise à jour sans animation pour de meilleures performances
    }

    /**
     * Mettre à jour le graphique mémoire
     */
    updateMemoryChart(data) {
        if (!this.charts.memory) {
            this.initializeMemoryChart();
        }

        const chart = this.charts.memory;
        if (!chart) return;

        // Limiter à 20 points de données
        const maxPoints = 20;
        
        // Ajouter les nouvelles données
        chart.data.labels.push(new Date().toLocaleTimeString());
        chart.data.datasets[0].data.push(data);

        // Limiter le nombre de points
        if (chart.data.labels.length > maxPoints) {
            chart.data.labels.shift();
            chart.data.datasets[0].data.shift();
        }

        chart.update('none');
    }



    /**
     * Mettre à jour tous les graphiques avec les données de performance
     */
    updateAllCharts(performanceData) {
        if (!this.isInitialized) return;

        try {
            // Mettre à jour FPS
            if (performanceData.fps !== undefined) {
                this.updateFPSChart(performanceData.fps);
            }

            // Mettre à jour mémoire
            if (performanceData.memory !== undefined) {
                this.updateMemoryChart(performanceData.memory);
            }

        } catch (error) {
            console.warn('⚠️ Erreur mise à jour graphiques:', error);
        }
    }

    /**
     * Redémarrer tous les graphiques
     */
    restart() {
        console.log('🔄 Redémarrage des graphiques...');
        
        // Détruire tous les graphiques existants
        Object.values(this.charts).forEach(chart => {
            if (chart && typeof chart.destroy === 'function') {
                chart.destroy();
            }
        });
        
        this.charts = {};
        
        // Réinitialiser
        setTimeout(() => {
            this.initializeAllCharts();
        }, 100);
    }

    /**
     * Nettoyer les graphiques
     */
    cleanup() {
        Object.values(this.charts).forEach(chart => {
            if (chart && typeof chart.destroy === 'function') {
                chart.destroy();
            }
        });
        this.charts = {};
    }
}

// Créer une instance globale
window.chartManager = new ChartManager();

// Exposer la classe globalement
window.ChartManager = ChartManager;
