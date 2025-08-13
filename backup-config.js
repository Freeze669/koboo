/**
 * CONFIGURATION DU SYSTÈME DE SAUVEGARDE EN TEMPS RÉEL
 * Personnalisez le comportement de sauvegarde selon vos besoins
 * 
 * @author Mayu & Jack Studio
 * @version 1.0.0
 */

window.BackupConfig = {
    // ========================================
    // CONFIGURATION GÉNÉRALE
    // ========================================
    
    // Activer/désactiver le système
    enabled: true,
    
    // Mode de débogage
    debug: false,
    
    // Nom du site
    siteName: 'Mayu & Jack Studio',
    
    // Version du système
    version: '1.0.0',
    
    // ========================================
    // CONFIGURATION DE LA SAUVEGARDE
    // ========================================
    
    backup: {
        // Intervalle de sauvegarde (en millisecondes)
        intervalMs: 5000, // 5 secondes
        
        // Taille maximale de la file d'attente
        maxQueueSize: 1000,
        
        // Nombre d'éléments par lot
        batchSize: 50,
        
        // Conservation des données (en jours)
        retentionDays: 30,
        
        // Compression des données
        enableCompression: true,
        
        // Chiffrement des données (optionnel)
        enableEncryption: false,
        
        // Chemin Firebase pour les sauvegardes
        firebasePath: 'site-backups'
    },
    
    // ========================================
    // SURVEILLANCE DES UTILISATEURS
    // ========================================
    
    monitoring: {
        // Surveiller les clics
        trackClicks: true,
        
        // Surveiller les saisies
        trackInputs: true,
        
        // Surveiller le scroll
        trackScroll: true,
        
        // Surveiller les mouvements de souris
        trackMouseMovement: true,
        
        // Surveiller les touches
        trackTouch: true,
        
        // Surveiller la navigation
        trackNavigation: true,
        
        // Surveiller les formulaires
        trackForms: true,
        
        // Surveiller les sélections de texte
        trackTextSelection: true,
        
        // Surveiller le copier/coller
        trackCopyPaste: true,
        
        // Surveiller les raccourcis clavier
        trackKeyboardShortcuts: true,
        
        // Surveiller les changements de visibilité
        trackVisibility: true,
        
        // Surveiller les changements de focus
        trackFocus: true,
        
        // Surveiller les mutations DOM
        trackDOMChanges: true
    },
    
    // ========================================
    // DONNÉES UTILISATEUR
    // ========================================
    
    userData: {
        // Collecter l'agent utilisateur
        collectUserAgent: true,
        
        // Collecter la langue
        collectLanguage: true,
        
        // Collecter le fuseau horaire
        collectTimezone: true,
        
        // Collecter les informations d'écran
        collectScreenInfo: true,
        
        // Collecter les informations de connexion
        collectConnectionInfo: true,
        
        // Collecter les informations de localisation
        collectLocationInfo: true,
        
        // Anonymiser les données
        anonymizeData: false,
        
        // Limiter la taille des données collectées
        maxDataSize: 1024 * 1024 // 1MB
    },
    
    // ========================================
    // NOTIFICATIONS ET INTERFACE
    // ========================================
    
    ui: {
        // Afficher l'indicateur de statut
        showStatusIndicator: true,
        
        // Position de l'indicateur
        statusPosition: 'bottom-right', // 'top-left', 'top-right', 'bottom-left', 'bottom-right'
        
        // Afficher les confirmations de sauvegarde
        showBackupConfirmations: true,
        
        // Afficher les erreurs de sauvegarde
        showBackupErrors: true,
        
        // Durée d'affichage des notifications (en millisecondes)
        notificationDuration: 3000,
        
        // Couleurs du thème
        colors: {
            primary: '#10b981',
            secondary: '#059669',
            success: '#22c55e',
            warning: '#f59e0b',
            error: '#ef4444',
            info: '#3b82f6'
        }
    },
    
    // ========================================
    // PERFORMANCE ET OPTIMISATION
    // ========================================
    
    performance: {
        // Throttling des événements (en millisecondes)
        throttleMouseMovement: 500,
        throttleScroll: 100,
        throttleInput: 300,
        
        // Limiter le nombre d'activités en mémoire
        maxActivitiesInMemory: 100,
        
        // Nettoyer automatiquement les anciennes données
        autoCleanup: true,
        
        // Intervalle de nettoyage (en millisecondes)
        cleanupInterval: 60000, // 1 minute
        
        // Utiliser Web Workers pour le traitement
        useWebWorkers: false
    },
    
    // ========================================
    // SÉCURITÉ ET CONFIDENTIALITÉ
    // ========================================
    
    security: {
        // Chiffrer les données sensibles
        encryptSensitiveData: false,
        
        // Clé de chiffrement (à définir si chiffrement activé)
        encryptionKey: null,
        
        // Filtrer les données sensibles
        filterSensitiveData: true,
        
        // Mots-clés sensibles à filtrer
        sensitiveKeywords: [
            'password', 'motdepasse', 'secret', 'private', 'confidential',
            'credit', 'carte', 'banque', 'bank', 'ssn', 'social'
        ],
        
        // Respecter le mode incognito
        respectIncognito: true,
        
        // Demander le consentement utilisateur
        requireConsent: false
    },
    
    // ========================================
    // INTÉGRATION AVEC D'AUTRES SYSTÈMES
    // ========================================
    
    integrations: {
        // Intégration avec Firebase
        firebase: {
            enabled: true,
            autoInitialize: true,
            fallbackToLocal: true
        },
        
        // Intégration avec Discord (si disponible)
        discord: {
            enabled: false,
            webhookUrl: null,
            notifyOnBackup: false,
            notifyOnError: true
        },
        
        // Intégration avec Google Analytics
        googleAnalytics: {
            enabled: false,
            trackEvents: false,
            customDimensions: []
        },
        
        // Intégration avec d'autres systèmes de tracking
        customTracking: {
            enabled: false,
            endpoints: [],
            headers: {}
        }
    },
    
    // ========================================
    // PERSONNALISATION DES ÉVÉNEMENTS
    // ========================================
    
    customEvents: {
        // Événements personnalisés à surveiller
        events: [
            'tarifsChanged',
            'adminLogin',
            'formSubmitted',
            'projectRequested',
            'serviceSelected'
        ],
        
        // Priorités des événements
        priorities: {
            'adminLogin': 1,
            'formSubmitted': 2,
            'projectRequested': 2,
            'serviceSelected': 3,
            'tarifsChanged': 4
        }
    },
    
    // ========================================
    // RAPPORTS ET ANALYTICS
    // ========================================
    
    analytics: {
        // Générer des rapports automatiques
        generateReports: true,
        
        // Intervalle de génération des rapports (en heures)
        reportInterval: 24,
        
        // Types de rapports
        reportTypes: [
            'user_activity',
            'session_summary',
            'backup_status',
            'performance_metrics'
        ],
        
        // Exporter les données
        exportData: {
            enabled: false,
            format: 'json', // 'json', 'csv', 'excel'
            includeRawData: false
        }
    },
    
    // ========================================
    // MODES SPÉCIAUX
    // ========================================
    
    modes: {
        // Mode développement
        development: {
            enabled: false,
            verboseLogging: true,
            mockData: false,
            testMode: false
        },
        
        // Mode maintenance
        maintenance: {
            enabled: false,
            readOnly: false,
            limitedBackup: false
        },
        
        // Mode haute performance
        highPerformance: {
            enabled: false,
            aggressiveThrottling: true,
            minimalDataCollection: true,
            fastBackup: true
        }
    }
};

// ========================================
// VALIDATION DE LA CONFIGURATION
// ========================================

(function() {
    'use strict';
    
    // Valider la configuration
    function validateConfig() {
        const errors = [];
        
        // Vérifications de base
        if (typeof BackupConfig.backup.intervalMs !== 'number' || BackupConfig.backup.intervalMs < 1000) {
            errors.push('Intervalle de sauvegarde invalide (minimum 1000ms)');
        }
        
        if (typeof BackupConfig.backup.maxQueueSize !== 'number' || BackupConfig.backup.maxQueueSize < 10) {
            errors.push('Taille de file d\'attente invalide (minimum 10)');
        }
        
        if (typeof BackupConfig.backup.batchSize !== 'number' || BackupConfig.backup.batchSize < 1) {
            errors.push('Taille de lot invalide (minimum 1)');
        }
        
        // Afficher les erreurs
        if (errors.length > 0) {
            console.error('❌ Erreurs de configuration du système de sauvegarde:');
            errors.forEach(error => console.error(`  - ${error}`));
            return false;
        }
        
        return true;
    }
    
    // Appliquer les modes spéciaux
    function applySpecialModes() {
        // Mode développement
        if (BackupConfig.modes.development.enabled) {
            BackupConfig.debug = true;
            BackupConfig.backup.intervalMs = 2000; // Plus rapide en dev
            console.log('🔧 Mode développement activé pour le système de sauvegarde');
        }
        
        // Mode maintenance
        if (BackupConfig.modes.maintenance.enabled) {
            BackupConfig.backup.intervalMs = 30000; // Plus lent en maintenance
            console.log('🔧 Mode maintenance activé pour le système de sauvegarde');
        }
        
        // Mode haute performance
        if (BackupConfig.modes.highPerformance.enabled) {
            BackupConfig.backup.intervalMs = 10000; // Plus lent mais plus efficace
            BackupConfig.performance.throttleMouseMovement = 1000;
            BackupConfig.performance.throttleScroll = 200;
            console.log('🚀 Mode haute performance activé pour le système de sauvegarde');
        }
    }
    
    // Initialiser la configuration
    function initializeConfig() {
        if (validateConfig()) {
            applySpecialModes();
            
            // Stocker la configuration validée
            window.ValidatedBackupConfig = { ...BackupConfig };
            
            console.log('✅ Configuration du système de sauvegarde validée et appliquée');
            
            // Émettre un événement de configuration prête
            document.dispatchEvent(new CustomEvent('backupConfigReady', {
                detail: { config: window.ValidatedBackupConfig }
            }));
            
        } else {
            console.warn('⚠️ Configuration invalide, utilisation des valeurs par défaut');
            
            // Configuration par défaut de sécurité
            window.ValidatedBackupConfig = {
                enabled: true,
                backup: {
                    intervalMs: 5000,
                    maxQueueSize: 1000,
                    batchSize: 50,
                    retentionDays: 30
                },
                monitoring: {
                    trackClicks: true,
                    trackInputs: true,
                    trackScroll: true,
                    trackNavigation: true,
                    trackForms: true
                }
            };
        }
    }
    
    // Initialiser quand le DOM est prêt
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initializeConfig);
    } else {
        initializeConfig();
    }
    
})();

console.log('⚙️ Configuration du système de sauvegarde chargée');
