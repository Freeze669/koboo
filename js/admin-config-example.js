/**
 * Configuration d'exemple pour le Panel Administrateur
 * Copiez ce fichier vers admin-config.js et personnalisez selon vos besoins
 */

const ADMIN_CONFIG = {
    // Configuration de sécurité
    security: {
        // Code d'accès à 6 chiffres pour l'administration
        adminCode: "123456",
        
        // Durée de session en millisecondes (1 heure par défaut)
        sessionDuration: 3600000,
        
        // Nombre maximum de tentatives de connexion
        maxLoginAttempts: 5,
        
        // Délai de verrouillage après échecs (en millisecondes)
        lockoutDuration: 300000, // 5 minutes
        
        // Activer la validation des sessions
        enableSessionValidation: true
    },

    // Configuration Discord
    discord: {
        // URL du webhook Discord
        webhookUrl: "https://discord.com/api/webhooks/VOTRE_WEBHOOK_ID/VOTRE_TOKEN",
        
        // Activer l'intégration Discord
        enabled: true,
        
        // Nom du bot Discord
        botName: "Koboo Admin Bot",
        
        // Avatar du bot (URL)
        botAvatar: "https://example.com/bot-avatar.png",
        
        // Couleur des messages Discord
        embedColor: 0x60a5fa,
        
        // Notifications à envoyer
        notifications: {
            login: true,        // Connexion admin
            errors: true,       // Erreurs système
            performance: true,  // Alertes performance
            activities: false   // Activités utilisateur
        }
    },

    // Configuration des métriques
    metrics: {
        // Intervalle de mise à jour en millisecondes
        updateInterval: 2000, // 2 secondes
        
        // Historique des métriques
        historySize: 100,
        
        // Seuils d'alerte
        thresholds: {
            fps: {
                warning: 30,
                critical: 20
            },
            memory: {
                warning: 80,    // 80%
                critical: 95    // 95%
            },
            performance: {
                warning: 50,
                critical: 30
            },
            errors: {
                warning: 5,
                critical: 10
            }
        },
        
        // Métriques à afficher
        display: {
            visitors: true,
            pageViews: true,
            uptime: true,
            memory: true,
            performance: true,
            errors: true,
            fps: true,
            animationQuality: true
        }
    },

    // Configuration des graphiques
    charts: {
        // Activer les graphiques
        enabled: true,
        
        // Type de graphiques
        types: {
            fps: "line",
            memory: "line",
            performance: "line"
        },
        
        // Couleurs des graphiques
        colors: {
            fps: "#60a5fa",
            memory: "#10b981",
            performance: "#8b5cf6"
        },
        
        // Limite de points de données
        maxDataPoints: 20,
        
        // Animations des graphiques
        animations: false, // Désactivé pour les performances
        
        // Responsive
        responsive: true,
        
        // Maintenir le ratio d'aspect
        maintainAspectRatio: false
    },

    // Configuration des alertes
    alerts: {
        // Activer les alertes
        enabled: true,
        
        // Types d'alertes
        types: {
            performance: true,
            errors: true,
            security: true,
            system: true
        },
        
        // Niveaux d'alerte
        levels: {
            info: true,
            warning: true,
            error: true,
            critical: true
        },
        
        // Notifications
        notifications: {
            browser: true,      // Notifications navigateur
            discord: true,      // Notifications Discord
            email: false,       // Notifications email
            sms: false          // Notifications SMS
        }
    },

    // Configuration de l'optimisation
    optimization: {
        // Activer l'optimisation automatique
        enabled: true,
        
        // Modes d'optimisation
        modes: {
            fps: true,          // Optimisation FPS
            memory: true,       // Optimisation mémoire
            animations: true,   // Optimisation animations
            network: true       // Optimisation réseau
        },
        
        // Seuils de déclenchement
        triggers: {
            fpsLow: 30,         // FPS faible
            memoryHigh: 80,     // Mémoire élevée
            errorsHigh: 5,      // Erreurs multiples
            performanceLow: 50  // Performance faible
        },
        
        // Actions d'optimisation
        actions: {
            reduceAnimations: true,    // Réduire animations
            cleanupMemory: true,       // Nettoyer mémoire
            enableDiagnostic: true,    // Mode diagnostic
            enableEconomy: true        // Mode économie
        }
    },

    // Configuration des pages d'information
    infoPages: {
        // Pages disponibles
        pages: {
            stats: {
                title: "📊 Statistiques",
                description: "Vue d'ensemble des métriques",
                enabled: true
            },
            users: {
                title: "👥 Utilisateurs",
                description: "Gestion des utilisateurs",
                enabled: true
            },
            performance: {
                title: "⚡ Performances",
                description: "Détails des performances",
                enabled: true
            },
            alerts: {
                title: "🚨 Alertes",
                description: "Notifications et erreurs",
                enabled: true
            },
            activities: {
                title: "📝 Activités",
                description: "Journal des activités",
                enabled: true
            },
            config: {
                title: "⚙️ Configuration",
                description: "Paramètres système",
                enabled: true
            }
        },
        
        // Ordre d'affichage
        order: ["stats", "users", "performance", "alerts", "activities", "config"]
    },

    // Configuration des exports
    exports: {
        // Formats supportés
        formats: ["json", "csv", "xml"],
        
        // Données à exporter
        data: {
            metrics: true,
            activities: true,
            errors: true,
            performance: true
        },
        
        // Nom du fichier d'export
        filename: "koboo-admin-data-{timestamp}",
        
        // Compression
        compression: false
    },

    // Configuration de la sauvegarde
    backup: {
        // Activer la sauvegarde
        enabled: true,
        
        // Fréquence de sauvegarde (en millisecondes)
        frequency: 3600000, // 1 heure
        
        // Rétention des sauvegardes (nombre de fichiers)
        retention: 24,
        
        // Données à sauvegarder
        data: {
            config: true,
            metrics: true,
            logs: true,
            settings: true
        }
    },

    // Configuration du thème
    theme: {
        // Mode sombre/clair
        mode: "dark", // "dark" ou "light"
        
        // Couleurs principales
        colors: {
            primary: "#60a5fa",
            secondary: "#8b5cf6",
            success: "#10b981",
            warning: "#f59e0b",
            error: "#ef4444",
            info: "#3b82f6"
        },
        
        // Police
        font: {
            family: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
            size: "14px"
        },
        
        // Animations
        animations: {
            enabled: true,
            duration: "0.3s",
            easing: "ease"
        }
    },

    // Configuration des logs
    logging: {
        // Niveau de log
        level: "info", // "debug", "info", "warn", "error"
        
        // Activer les logs
        enabled: true,
        
        // Destination des logs
        destinations: {
            console: true,
            file: false,
            discord: true
        },
        
        // Rétention des logs
        retention: {
            console: 1000,    // 1000 entrées
            file: 10000,      // 10000 entrées
            discord: 100      // 100 entrées
        }
    },

    // Configuration des tests
    testing: {
        // Activer les tests
        enabled: true,
        
        // Tests disponibles
        tests: {
            charts: true,      // Test des graphiques
            metrics: true,     // Test des métriques
            discord: true,     // Test Discord
            performance: true  // Test de performance
        },
        
        // Données de test
        testData: {
            enabled: true,
            interval: 3000,    // 3 secondes
            randomize: true
        }
    }
};

// Configuration de développement (à désactiver en production)
const DEV_CONFIG = {
    // Mode développement
    development: true,
    
    // Logs de débogage
    debug: true,
    
    // Tests automatiques
    autoTest: true,
    
    // Données simulées
    mockData: true,
    
    // Validation stricte
    strictValidation: false
};

// Exporter la configuration
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { ADMIN_CONFIG, DEV_CONFIG };
} else {
    // Variables globales pour le navigateur
    window.ADMIN_CONFIG = ADMIN_CONFIG;
    window.DEV_CONFIG = DEV_CONFIG;
}

console.log('🔧 Configuration admin chargée:', ADMIN_CONFIG);
