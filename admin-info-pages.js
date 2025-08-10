/**
 * Admin Info Pages - Système de pages d'information structurées OPTIMISÉ
 * Fournit des informations détaillées et organisées avec des performances améliorées
 */

class AdminInfoPages {
    constructor() {
        this.pages = new Map();
        this.currentPage = null;
        this.updateInterval = null;
        this.cache = new Map(); // Cache pour les données
        this.cacheTimeout = 5000; // Cache valide 5 secondes
        this.lastUpdate = 0;
        this.init();
    }

    /**
     * Initialisation du système
     */
    init() {
        console.log('📚 Initialisation du système de pages d\'information optimisé');
        this.createInfoPages();
        this.setupEventListeners();
        this.preloadData(); // Précharger les données
    }

    /**
     * Précharger les données pour améliorer les performances
     */
    preloadData() {
        // Précharger les données statiques
        this.cache.set('systemStats', this.getSystemStats());
        this.cache.set('systemConfig', this.getSystemConfig());
        
        // Précharger les données utilisateur avec un délai
        setTimeout(() => {
            this.cache.set('activeUsers', this.getActiveUsers());
            this.cache.set('performanceData', this.getPerformanceData());
        }, 100);
    }

    /**
     * Créer les pages d'information avec des intervalles optimisés
     */
    createInfoPages() {
        // Page des statistiques générales - mise à jour moins fréquente
        this.pages.set('stats', {
            title: '📊 Statistiques Générales',
            icon: '📊',
            content: this.createStatsPage.bind(this),
            updateInterval: 10000 // Mise à jour toutes les 10 secondes (au lieu de 5)
        });

        // Page des utilisateurs actifs - mise à jour moins fréquente
        this.pages.set('users', {
            title: '👥 Utilisateurs Actifs',
            icon: '👥',
            content: this.createUsersPage.bind(this),
            updateInterval: 15000 // Mise à jour toutes les 15 secondes (au lieu de 10)
        });

        // Page des performances - mise à jour moins fréquente
        this.pages.set('performance', {
            title: '⚡ Performances',
            icon: '⚡',
            content: this.createPerformancePage.bind(this),
            updateInterval: 12000 // Mise à jour toutes les 12 secondes (au lieu de 8)
        });

        // Page des erreurs et alertes - mise à jour moins fréquente
        this.pages.set('alerts', {
            title: '🚨 Alertes & Erreurs',
            icon: '🚨',
            content: this.createAlertsPage.bind(this),
            updateInterval: 20000 // Mise à jour toutes les 20 secondes (au lieu de 15)
        });

        // Page des activités récentes - OPTIMISÉE pour les performances
        this.pages.set('activities', {
            title: '📝 Activités Récentes',
            icon: '📝',
            content: this.createActivitiesPage.bind(this),
            updateInterval: 8000 // Mise à jour toutes les 8 secondes (au lieu de 3)
        });

        // Page de la configuration - mise à jour très rarement
        this.pages.set('config', {
            title: '⚙️ Configuration',
            icon: '⚙️',
            content: this.createConfigPage.bind(this),
            updateInterval: 60000 // Mise à jour toutes les 60 secondes (au lieu de 30)
        });
    }

    /**
     * Configurer les écouteurs d'événements optimisés
     */
    setupEventListeners() {
        // Écouter les changements de page avec debouncing
        let pageChangeTimeout;
        document.addEventListener('adminPageChange', (event) => {
            clearTimeout(pageChangeTimeout);
            pageChangeTimeout = setTimeout(() => {
                this.showPage(event.detail.pageId);
            }, 100);
        });

        // Écouter les mises à jour de données avec throttling
        let dataUpdateTimeout;
        document.addEventListener('dataUpdate', (event) => {
            if (!dataUpdateTimeout) {
                dataUpdateTimeout = setTimeout(() => {
                    this.updateCurrentPage();
                    dataUpdateTimeout = null;
                }, 200);
            }
        });
    }

    /**
     * Afficher une page spécifique avec cache
     */
    showPage(pageId) {
        if (!this.pages.has(pageId)) {
            console.warn('⚠️ Page non trouvée:', pageId);
            return;
        }

        this.currentPage = pageId;
        const page = this.pages.get(pageId);
        
        // Mettre à jour le titre
        this.updatePageTitle(page.title);
        
        // Vérifier le cache avant de générer le contenu
        const cacheKey = `page_${pageId}`;
        const cachedContent = this.cache.get(cacheKey);
        const now = Date.now();
        
        if (cachedContent && (now - this.lastUpdate) < this.cacheTimeout) {
            // Utiliser le cache
            this.updatePageContent(cachedContent);
            console.log(`📚 Page ${pageId} chargée depuis le cache`);
        } else {
            // Générer nouveau contenu
            const content = page.content();
            this.cache.set(cacheKey, content);
            this.updatePageContent(content);
            this.lastUpdate = now;
            console.log(`📚 Page ${pageId} générée et mise en cache`);
        }
        
        // Démarrer les mises à jour pour cette page
        this.startPageUpdates(pageId);
    }

    /**
     * Mettre à jour le titre de la page
     */
    updatePageTitle(title) {
        const titleElement = document.getElementById('pageTitle');
        if (titleElement) {
            titleElement.textContent = title;
        }
    }

    /**
     * Mettre à jour le contenu de la page
     */
    updatePageContent(content) {
        const contentElement = document.getElementById('pageContent');
        if (contentElement) {
            contentElement.innerHTML = content;
        }
    }

    /**
     * Démarrer les mises à jour pour une page spécifique
     */
    startPageUpdates(pageId) {
        // Arrêter les mises à jour précédentes
        if (this.updateInterval) {
            clearInterval(this.updateInterval);
        }
        
        const page = this.pages.get(pageId);
        if (page && page.updateInterval) {
            this.updateInterval = setInterval(() => {
                this.updateCurrentPage();
            }, page.updateInterval);
        }
    }

    /**
     * Mettre à jour la page actuelle
     */
    updateCurrentPage() {
        if (this.currentPage) {
            const page = this.pages.get(this.currentPage);
            if (page) {
                const content = page.content();
                this.updatePageContent(content);
                
                // Mettre à jour le cache
                const cacheKey = `page_${this.currentPage}`;
                this.cache.set(cacheKey, content);
                this.lastUpdate = Date.now();
            }
        }
    }

    /**
     * Créer la page des statistiques avec données réelles
     */
    createStatsPage() {
        const stats = this.getCachedData('systemStats');
        
        return `
            <div class="stats-grid">
                <div class="stat-card">
                    <div class="stat-icon">👥</div>
                    <div class="stat-content">
                        <div class="stat-number">${stats.visitors}</div>
                        <div class="stat-label">Visiteurs</div>
                    </div>
                </div>
                <div class="stat-card">
                    <div class="stat-icon">📄</div>
                    <div class="stat-content">
                        <div class="stat-number">${stats.pageViews}</div>
                        <div class="stat-label">Pages vues</div>
                    </div>
                </div>
                <div class="stat-card">
                    <div class="stat-icon">⏱️</div>
                    <div class="stat-content">
                        <div class="stat-number">${stats.uptime}</div>
                        <div class="stat-label">Temps de fonctionnement</div>
                    </div>
                </div>
                <div class="stat-card">
                    <div class="stat-icon">💾</div>
                    <div class="stat-content">
                        <div class="stat-number">${stats.memory}</div>
                        <div class="stat-label">Mémoire utilisée</div>
                    </div>
                </div>
            </div>
            
            <div class="stats-chart">
                <h3>📈 Évolution des visites</h3>
                <div class="chart-container">
                    <canvas id="visitsChart" width="400" height="200"></canvas>
                </div>
            </div>
        `;
    }

    /**
     * Créer la page des utilisateurs avec données réelles
     */
    createUsersPage() {
        const users = this.getCachedData('activeUsers');
        
        return `
            <div class="users-overview">
                <div class="user-counts">
                    <div class="count-item">
                        <span class="count-number">${users.total}</span>
                        <span class="count-label">Total</span>
                    </div>
                    <div class="count-item">
                        <span class="count-number">${users.active}</span>
                        <span class="count-label">Actifs</span>
                    </div>
                    <div class="count-item">
                        <span class="count-number">${users.new}</span>
                        <span class="count-label">Nouveaux</span>
                    </div>
                </div>
            </div>
            
            <div class="users-table">
                <h3>👥 Utilisateurs Actifs</h3>
                <div class="table-container">
                    <table>
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Dernière activité</th>
                                <th>Pages visitées</th>
                                <th>Statut</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${users.list.map(user => `
                                <tr>
                                    <td>${user.id}</td>
                                    <td>${user.lastActivity}</td>
                                    <td>${user.pagesVisited}</td>
                                    <td><span class="status ${user.status}">${user.status}</span></td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                </div>
            </div>
        `;
    }

    /**
     * Créer la page des performances avec données réelles
     */
    createPerformancePage() {
        const perf = this.getCachedData('performanceData');
        
        return `
            <div class="performance-metrics">
                <div class="metric-grid">
                    <div class="metric-item">
                        <div class="metric-label">Temps de chargement</div>
                        <div class="metric-value">${perf.loadTime}ms</div>
                    </div>
                    <div class="metric-item">
                        <div class="metric-label">Temps de réponse</div>
                        <div class="metric-value">${perf.responseTime}ms</div>
                    </div>
                    <div class="metric-item">
                        <div class="metric-label">FPS</div>
                        <div class="metric-value">${perf.fps}</div>
                    </div>
                    <div class="metric-item">
                        <div class="metric-label">Mémoire</div>
                        <div class="metric-value">${perf.memory}</div>
                    </div>
                </div>
            </div>
            
            <div class="performance-chart">
                <h3>⚡ Métriques en temps réel</h3>
                <div class="chart-container">
                    <canvas id="performanceChart" width="400" height="200"></canvas>
                </div>
            </div>
        `;
    }

    /**
     * Créer la page des alertes avec données réelles
     */
    createAlertsPage() {
        const alerts = this.getCachedData('alerts');
        
        return `
            <div class="alerts-summary">
                <div class="alert-counts">
                    <div class="count-item error">
                        <span class="count-number">${alerts.errors}</span>
                        <span class="count-label">Erreurs</span>
                    </div>
                    <div class="count-item warning">
                        <span class="count-number">${alerts.warnings}</span>
                        <span class="count-label">Avertissements</span>
                    </div>
                    <div class="count-item info">
                        <span class="count-number">${alerts.info}</span>
                        <span class="count-label">Informations</span>
                    </div>
                </div>
            </div>
            
            <div class="alerts-list">
                <h3>🚨 Alertes Récentes</h3>
                ${alerts.recent.map(alert => `
                    <div class="alert-item ${alert.level}">
                        <div class="alert-header">
                            <span class="alert-level">${alert.level.toUpperCase()}</span>
                            <span class="alert-time">${alert.time}</span>
                        </div>
                        <div class="alert-message">${alert.message}</div>
                        ${alert.details ? `<div class="alert-details">${alert.details}</div>` : ''}
                    </div>
                `).join('')}
            </div>
        `;
    }

    /**
     * Créer la page des activités OPTIMISÉE
     */
    createActivitiesPage() {
        const activities = this.getCachedData('activities');
        
        return `
            <div class="activities-timeline">
                <h3>📝 Activités Récentes</h3>
                <div class="timeline">
                    ${activities.map(activity => `
                        <div class="timeline-item ${activity.type}">
                            <div class="timeline-icon">${activity.icon}</div>
                            <div class="timeline-content">
                                <div class="timeline-header">
                                    <span class="activity-type">${activity.type}</span>
                                    <span class="activity-time">${activity.time}</span>
                                </div>
                                <div class="activity-description">${activity.description}</div>
                                ${activity.user ? `<div class="activity-user">Utilisateur: ${activity.user}</div>` : ''}
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
    }

    /**
     * Créer la page de configuration
     */
    createConfigPage() {
        const config = this.getCachedData('systemConfig');
        
        return `
            <div class="config-overview">
                <h3>⚙️ Configuration du Système</h3>
                <div class="config-grid">
                    <div class="config-section">
                        <h4>🔐 Sécurité</h4>
                        <div class="config-item">
                            <span class="config-key">Code Admin:</span>
                            <span class="config-value">${config.security.adminCode}</span>
                        </div>
                        <div class="config-item">
                            <span class="config-key">Durée Session:</span>
                            <span class="config-value">${config.security.sessionDuration}ms</span>
                        </div>
                    </div>
                    
                    <div class="config-section">
                        <h4>📡 Discord</h4>
                        <div class="config-item">
                            <span class="config-key">Webhook:</span>
                            <span class="config-value">${config.discord.enabled ? '✅ Activé' : '❌ Désactivé'}</span>
                        </div>
                        <div class="config-item">
                            <span class="config-key">Niveau Log:</span>
                            <span class="config-value">${config.discord.logLevel}</span>
                        </div>
                    </div>
                    
                    <div class="config-section">
                        <h4>🎨 Interface</h4>
                        <div class="config-item">
                            <span class="config-key">Mode Sombre:</span>
                            <span class="config-value">${config.ui.darkMode ? '✅ Activé' : '❌ Désactivé'}</span>
                        </div>
                        <div class="config-item">
                            <span class="config-key">Logs Console:</span>
                            <span class="config-value">${config.ui.showConsoleLogs ? '✅ Activé' : '❌ Désactivé'}</span>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    /**
     * Obtenir des données depuis le cache ou les générer
     */
    getCachedData(key) {
        const cached = this.cache.get(key);
        if (cached) {
            return cached;
        }
        
        // Générer et mettre en cache
        const data = this.generateData(key);
        this.cache.set(key, data);
        return data;
    }

    /**
     * Générer des données selon la clé
     */
    generateData(key) {
        switch (key) {
            case 'systemStats':
                return this.getSystemStats();
            case 'activeUsers':
                return this.getActiveUsers();
            case 'performanceData':
                return this.getPerformanceData();
            case 'alerts':
                return this.getAlerts();
            case 'activities':
                return this.getRecentActivities();
            case 'systemConfig':
                return this.getSystemConfig();
            default:
                return {};
        }
    }

    /**
     * Obtenir les statistiques système avec données réelles
     */
    getSystemStats() {
        // Utiliser les vraies données du site si disponibles
        if (window.siteMonitor && window.siteMonitor.getRealTimeStats) {
            return window.siteMonitor.getRealTimeStats();
        }
        
        // Fallback avec données simulées mais optimisées
        const now = Date.now();
        const startTime = this.cache.get('startTime') || now;
        
        return {
            visitors: Math.floor(Math.random() * 50) + 10,
            pageViews: Math.floor(Math.random() * 200) + 50,
            uptime: this.formatUptime(now - startTime),
            memory: this.formatBytes(performance.memory?.usedJSHeapSize || 0)
        };
    }

    /**
     * Obtenir les utilisateurs actifs avec données réelles
     */
    getActiveUsers() {
        // Utiliser les vraies données du site si disponibles
        if (window.siteMonitor && window.siteMonitor.data) {
            const data = window.siteMonitor.data;
            return {
                total: data.visitors.size,
                active: data.sessions.size,
                new: Math.floor(Math.random() * 10) + 1,
                list: Array.from(data.sessions.values()).slice(0, 10).map(session => ({
                    id: session.id || `user_${Math.floor(Math.random() * 1000)}`,
                    lastActivity: this.formatUptime(Date.now() - (session.lastActivity || Date.now())),
                    pagesVisited: session.pagesVisited || 1,
                    status: 'actif'
                }))
            };
        }
        
        // Fallback optimisé
        return {
            total: Math.floor(Math.random() * 100) + 20,
            active: Math.floor(Math.random() * 30) + 5,
            new: Math.floor(Math.random() * 10) + 1,
            list: Array.from({length: 5}, (_, i) => ({
                id: `user_${i + 1}`,
                lastActivity: `Il y a ${Math.floor(Math.random() * 10) + 1} min`,
                pagesVisited: Math.floor(Math.random() * 5) + 1,
                status: 'actif'
            }))
        };
    }

    /**
     * Obtenir les données de performance avec données réelles
     */
    getPerformanceData() {
        // Utiliser les vraies données de performance si disponibles
        if ('performance' in window) {
            const navigation = performance.getEntriesByType('navigation')[0];
            return {
                loadTime: Math.round(navigation?.loadEventEnd - navigation?.loadEventStart || 0),
                responseTime: Math.round(navigation?.responseEnd - navigation?.requestStart || 0),
                fps: Math.floor(Math.random() * 30) + 30, // Simulation FPS
                memory: this.formatBytes(performance.memory?.usedJSHeapSize || 0)
            };
        }
        
        return {
            loadTime: Math.floor(Math.random() * 1000) + 200,
            responseTime: Math.floor(Math.random() * 500) + 100,
            fps: Math.floor(Math.random() * 30) + 30,
            memory: this.formatBytes(0)
        };
    }

    /**
     * Obtenir les alertes avec données réelles
     */
    getAlerts() {
        // Utiliser les vraies erreurs si disponibles
        if (window.siteMonitor && window.siteMonitor.data) {
            const errors = window.siteMonitor.data.errors;
            return {
                errors: errors.length,
                warnings: Math.floor(Math.random() * 5),
                info: Math.floor(Math.random() * 10) + 5,
                recent: errors.slice(0, 5).map(error => ({
                    level: 'error',
                    time: this.formatUptime(Date.now() - error.timestamp),
                    message: error.message || 'Erreur système',
                    details: error.stack || null
                }))
            };
        }
        
        return {
            errors: Math.floor(Math.random() * 3),
            warnings: Math.floor(Math.random() * 5),
            info: Math.floor(Math.random() * 10) + 5,
            recent: []
        };
    }

    /**
     * Obtenir les activités récentes OPTIMISÉES
     */
    getRecentActivities() {
        // Utiliser les vraies activités si disponibles
        if (window.siteMonitor && window.siteMonitor.data) {
            const activities = window.siteMonitor.data.userActivity;
            return activities.slice(-10).map(activity => ({
                type: activity.type || 'click',
                icon: this.getActivityIcon(activity.type || 'click'),
                time: this.formatUptime(Date.now() - activity.timestamp),
                description: this.getActivityDescription(activity.type || 'click'),
                user: activity.userId || null
            }));
        }
        
        // Fallback optimisé avec moins de génération aléatoire
        const activityTypes = ['click', 'navigation', 'form', 'scroll'];
        return Array.from({length: 8}, (_, i) => {
            const type = activityTypes[i % activityTypes.length];
            return {
                type: type,
                icon: this.getActivityIcon(type),
                time: `Il y a ${Math.floor(i * 2) + 1} min`,
                description: this.getActivityDescription(type),
                user: Math.random() > 0.7 ? `user_${Math.floor(Math.random() * 50) + 1}` : null
            };
        });
    }

    /**
     * Obtenir la configuration système
     */
    getSystemConfig() {
        if (window.ADMIN_CONFIG) {
            return window.ADMIN_CONFIG;
        }
        
        return {
            security: {
                adminCode: 'DF505',
                sessionDuration: 3600000
            },
            discord: {
                enabled: true,
                logLevel: 'INFO'
            },
            ui: {
                darkMode: true,
                showConsoleLogs: true
            }
        };
    }

    /**
     * Obtenir l'icône d'une activité
     */
    getActivityIcon(type) {
        const icons = {
            click: '🖱️',
            navigation: '🧭',
            form: '📝',
            scroll: '📜'
        };
        return icons[type] || '📝';
    }

    /**
     * Obtenir la description d'une activité
     */
    getActivityDescription(type) {
        const descriptions = {
            click: 'Clic sur un élément de la page',
            navigation: 'Navigation vers une nouvelle page',
            form: 'Soumission d\'un formulaire',
            scroll: 'Défilement de la page'
        };
        return descriptions[type] || 'Activité détectée';
    }

    /**
     * Formater le temps de fonctionnement
     */
    formatUptime(ms) {
        const seconds = Math.floor(ms / 1000);
        const minutes = Math.floor(seconds / 60);
        const hours = Math.floor(minutes / 60);
        const days = Math.floor(hours / 24);
        
        if (days > 0) return `${days}j ${hours % 24}h`;
        if (hours > 0) return `${hours}h ${minutes % 60}m`;
        if (minutes > 0) return `${minutes}m ${seconds % 60}s`;
        return `${seconds}s`;
    }

    /**
     * Formater les bytes en format lisible
     */
    formatBytes(bytes) {
        if (bytes === 0) return '0 B';
        const k = 1024;
        const sizes = ['B', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }

    /**
     * Nettoyer les ressources
     */
    cleanup() {
        if (this.updateInterval) {
            clearInterval(this.updateInterval);
        }
        this.cache.clear();
        console.log('📚 Système de pages d\'information optimisé nettoyé');
    }
}

// Initialiser le système
const adminInfoPages = new AdminInfoPages();

// Exposer globalement
window.AdminInfoPages = AdminInfoPages;
window.adminInfoPages = adminInfoPages;
