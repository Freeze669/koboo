/**
 * Member Tracker - Système de suivi des membres connectés en temps réel
 * Intégré avec Discord Logger pour notifications automatiques
 */

class MemberTracker {
    constructor(discordLogger) {
        this.discordLogger = discordLogger;
        this.activeMembers = new Map(); // Map des membres actifs
        this.memberHistory = []; // Historique des connexions
        this.maxHistorySize = 1000; // Taille max de l'historique
        this.sessionTimeout = 300000; // 5 minutes d'inactivité
        this.heartbeatInterval = 60000; // Vérification toutes les minutes
        
        // Configuration
        this.config = {
            trackIP: true,
            trackLocation: true,
            trackUserAgent: true,
            trackPages: true,
            trackDuration: true,
            autoCleanup: true
        };
        
        this.init();
    }
    
    init() {
        console.log('👥 Member Tracker initialisé');
        this.startHeartbeat();
        this.setupEventListeners();
        this.loadFromStorage();
    }
    
    /**
     * Configuration des écouteurs d'événements
     */
    setupEventListeners() {
        // Détection de la page
        this.trackPageView();
        
        // Détection de l'activité utilisateur
        this.trackUserActivity();
        
        // Détection de la fermeture/rafraîchissement
        this.trackPageUnload();
        
        // Détection de la visibilité de la page
        this.trackPageVisibility();
        
        // Détection des interactions
        this.trackInteractions();
    }
    
    /**
     * Suivi de la vue de page
     */
    trackPageView() {
        const pageData = {
            url: window.location.href,
            title: document.title,
            referrer: document.referrer,
            timestamp: new Date().toISOString()
        };
        
        this.logPageView(pageData);
    }
    
    /**
     * Suivi de l'activité utilisateur
     */
    trackUserActivity() {
        let lastActivity = Date.now();
        let isActive = true;
        
        const activityEvents = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart', 'click'];
        
        const updateActivity = () => {
            lastActivity = Date.now();
            if (!isActive) {
                isActive = true;
                this.onUserActive();
            }
        };
        
        const checkInactivity = () => {
            const now = Date.now();
            if (now - lastActivity > this.sessionTimeout) {
                if (isActive) {
                    isActive = false;
                    this.onUserInactive();
                }
            }
        };
        
        // Écouter les événements d'activité
        activityEvents.forEach(event => {
            document.addEventListener(event, updateActivity, { passive: true });
        });
        
        // Vérifier l'inactivité régulièrement
        setInterval(checkInactivity, 30000); // Toutes les 30 secondes
    }
    
    /**
     * Suivi de la fermeture de page
     */
    trackPageUnload() {
        window.addEventListener('beforeunload', () => {
            this.onPageUnload();
        });
        
        window.addEventListener('pagehide', () => {
            this.onPageUnload();
        });
    }
    
    /**
     * Suivi de la visibilité de la page
     */
    trackPageVisibility() {
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                this.onPageHidden();
            } else {
                this.onPageVisible();
            }
        });
    }
    
    /**
     * Suivi des interactions
     */
    trackInteractions() {
        // Suivi des clics
        document.addEventListener('click', (e) => {
            this.logInteraction('click', {
                target: e.target.tagName,
                text: e.target.textContent?.substring(0, 50),
                x: e.clientX,
                y: e.clientY
            });
        });
        
        // Suivi des soumissions de formulaire
        document.addEventListener('submit', (e) => {
            this.logInteraction('form_submit', {
                form: e.target.id || e.target.className,
                action: e.target.action
            });
        });
        
        // Suivi des changements d'input
        document.addEventListener('change', (e) => {
            if (e.target.type === 'file') {
                this.logInteraction('file_upload', {
                    type: e.target.type,
                    name: e.target.name
                });
            }
        });
    }
    
    /**
     * Connexion d'un nouveau membre
     */
    async connectMember(memberData = {}) {
        const memberId = this.generateMemberId();
        const sessionId = this.generateSessionId();
        
        const member = {
            id: memberId,
            sessionId: sessionId,
            name: memberData.name || this.getRandomName(),
            username: memberData.username || `user_${memberId}`,
            ip: memberData.ip || this.getClientIP(),
            location: memberData.location || this.getEstimatedLocation(),
            userAgent: memberData.userAgent || navigator.userAgent,
            device: this.getDeviceInfo(),
            connectTime: new Date().toISOString(),
            lastActivity: new Date().toISOString(),
            pagesVisited: [window.location.href],
            totalPages: 1,
            isActive: true,
            sessionStart: Date.now()
        };
        
        // Ajouter aux membres actifs
        this.activeMembers.set(sessionId, member);
        
        // Ajouter à l'historique
        this.addToHistory(member);
        
        // Sauvegarder
        this.saveToStorage();
        
        // Logger Discord
        if (this.discordLogger) {
            await this.discordLogger.logMemberJoin(member);
        }
        
        console.log(`🟢 Membre connecté: ${member.name} (${memberId})`);
        
        return member;
    }
    
    /**
     * Déconnexion d'un membre
     */
    async disconnectMember(sessionId) {
        const member = this.activeMembers.get(sessionId);
        if (!member) return;
        
        // Calculer la durée de session
        const sessionDuration = Date.now() - member.sessionStart;
        const durationFormatted = this.formatDuration(sessionDuration);
        
        const disconnectData = {
            ...member,
            disconnectTime: new Date().toISOString(),
            sessionDuration: durationFormatted,
            totalDuration: sessionDuration,
            pagesVisited: member.pagesVisited.length,
            isActive: false
        };
        
        // Retirer des membres actifs
        this.activeMembers.delete(sessionId);
        
        // Mettre à jour l'historique
        this.updateHistory(disconnectData);
        
        // Sauvegarder
        this.saveToStorage();
        
        // Logger Discord
        if (this.discordLogger) {
            await this.discordLogger.logMemberLeave(disconnectData);
        }
        
        console.log(`🔴 Membre déconnecté: ${member.name} - Session: ${durationFormatted}`);
        
        return disconnectData;
    }
    
    /**
     * Mise à jour de l'activité d'un membre
     */
    updateMemberActivity(sessionId, activityData = {}) {
        const member = this.activeMembers.get(sessionId);
        if (!member) return;
        
        // Mettre à jour l'activité
        member.lastActivity = new Date().toISOString();
        member.isActive = true;
        
        // Ajouter la page visitée si différente
        if (activityData.page && !member.pagesVisited.includes(activityData.page)) {
            member.pagesVisited.push(activityData.page);
            member.totalPages = member.pagesVisited.length;
        }
        
        // Sauvegarder
        this.saveToStorage();
        
        return member;
    }
    
    /**
     * Log d'une vue de page
     */
    logPageView(pageData) {
        // Trouver le membre actuel (ou en créer un)
        const currentMember = this.getCurrentMember();
        if (currentMember) {
            this.updateMemberActivity(currentMember.sessionId, {
                page: pageData.url,
                action: 'page_view',
                title: pageData.title
            });
        }
        
        // Logger l'activité
        if (this.discordLogger && currentMember) {
            this.discordLogger.logActivity({
                user: currentMember.name,
                action: 'page_view',
                page: pageData.url,
                title: pageData.title,
                timestamp: pageData.timestamp
            });
        }
    }
    
    /**
     * Log d'une interaction
     */
    logInteraction(type, data) {
        const currentMember = this.getCurrentMember();
        if (!currentMember) return;
        
        // Logger l'activité
        if (this.discordLogger) {
            this.discordLogger.logActivity({
                user: currentMember.name,
                action: type,
                page: window.location.href,
                details: data,
                timestamp: new Date().toISOString()
            });
        }
    }
    
    /**
     * Gestionnaire d'activité utilisateur
     */
    onUserActive() {
        const currentMember = this.getCurrentMember();
        if (currentMember) {
            this.updateMemberActivity(currentMember.sessionId, {
                action: 'user_active',
                timestamp: new Date().toISOString()
            });
        }
    }
    
    /**
     * Gestionnaire d'inactivité utilisateur
     */
    onUserInactive() {
        const currentMember = this.getCurrentMember();
        if (currentMember) {
            this.updateMemberActivity(currentMember.sessionId, {
                action: 'user_inactive',
                timestamp: new Date().toISOString()
            });
        }
    }
    
    /**
     * Gestionnaire de fermeture de page
     */
    onPageUnload() {
        const currentMember = this.getCurrentMember();
        if (currentMember) {
            this.disconnectMember(currentMember.sessionId);
        }
    }
    
    /**
     * Gestionnaire de page cachée
     */
    onPageHidden() {
        const currentMember = this.getCurrentMember();
        if (currentMember) {
            this.updateMemberActivity(currentMember.sessionId, {
                action: 'page_hidden',
                timestamp: new Date().toISOString()
            });
        }
    }
    
    /**
     * Gestionnaire de page visible
     */
    onPageVisible() {
        const currentMember = this.getCurrentMember();
        if (currentMember) {
            this.updateMemberActivity(currentMember.sessionId, {
                action: 'page_visible',
                timestamp: new Date().toISOString()
            });
        }
    }
    
    /**
     * Obtenir le membre actuel
     */
    getCurrentMember() {
        // Chercher dans les membres actifs
        for (const [sessionId, member] of this.activeMembers) {
            if (member.isActive) {
                return member;
            }
        }
        
        // Si aucun membre actif, en créer un nouveau
        return this.connectMember();
    }
    
    /**
     * Génération d'ID unique
     */
    generateMemberId() {
        return 'member_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    }
    
    /**
     * Génération d'ID de session
     */
    generateSessionId() {
        return 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    }
    
    /**
     * Génération de nom aléatoire
     */
    getRandomName() {
        const names = ['Visiteur', 'Utilisateur', 'Client', 'Membre', 'Invité'];
        return names[Math.floor(Math.random() * names.length)] + '_' + Math.floor(Math.random() * 1000);
    }
    
    /**
     * Obtention de l'IP client (simulation)
     */
    getClientIP() {
        // En production, cela viendrait du serveur
        return '127.0.0.1'; // IP locale pour le test
    }
    
    /**
     * Estimation de la localisation (simulation)
     */
    getEstimatedLocation() {
        // En production, cela utiliserait un service de géolocalisation
        return 'France'; // Localisation par défaut
    }
    
    /**
     * Informations sur l'appareil
     */
    getDeviceInfo() {
        const ua = navigator.userAgent;
        let device = 'Desktop';
        
        if (/Android/i.test(ua)) device = 'Android';
        else if (/iPhone|iPad|iPod/i.test(ua)) device = 'iOS';
        else if (/Windows Phone/i.test(ua)) device = 'Windows Phone';
        else if (/Mobile/i.test(ua)) device = 'Mobile';
        
        return device;
    }
    
    /**
     * Formatage de la durée
     */
    formatDuration(ms) {
        const seconds = Math.floor(ms / 1000);
        const minutes = Math.floor(seconds / 60);
        const hours = Math.floor(minutes / 60);
        
        if (hours > 0) {
            return `${hours}h ${minutes % 60}m`;
        } else if (minutes > 0) {
            return `${minutes}m ${seconds % 60}s`;
        } else {
            return `${seconds}s`;
        }
    }
    
    /**
     * Ajout à l'historique
     */
    addToHistory(member) {
        this.memberHistory.push({
            ...member,
            timestamp: new Date().toISOString()
        });
        
        // Limiter la taille de l'historique
        if (this.memberHistory.length > this.maxHistorySize) {
            this.memberHistory = this.memberHistory.slice(-this.maxHistorySize);
        }
    }
    
    /**
     * Mise à jour de l'historique
     */
    updateHistory(disconnectData) {
        const index = this.memberHistory.findIndex(h => h.sessionId === disconnectData.sessionId);
        if (index !== -1) {
            this.memberHistory[index] = disconnectData;
        }
    }
    
    /**
     * Sauvegarde dans le stockage local
     */
    saveToStorage() {
        try {
            localStorage.setItem('memberTracker_active', JSON.stringify(Array.from(this.activeMembers.entries())));
            localStorage.setItem('memberTracker_history', JSON.stringify(this.memberHistory));
        } catch (error) {
            console.warn('⚠️ Impossible de sauvegarder dans le stockage local:', error);
        }
    }
    
    /**
     * Chargement depuis le stockage local
     */
    loadFromStorage() {
        try {
            const activeData = localStorage.getItem('memberTracker_active');
            const historyData = localStorage.getItem('memberTracker_history');
            
            if (activeData) {
                this.activeMembers = new Map(JSON.parse(activeData));
            }
            
            if (historyData) {
                this.memberHistory = JSON.parse(historyData);
            }
        } catch (error) {
            console.warn('⚠️ Impossible de charger depuis le stockage local:', error);
        }
    }
    
    /**
     * Démarrage du heartbeat
     */
    startHeartbeat() {
        setInterval(() => {
            this.cleanupInactiveMembers();
            this.updateStats();
        }, this.heartbeatInterval);
    }
    
    /**
     * Nettoyage des membres inactifs
     */
    cleanupInactiveMembers() {
        if (!this.config.autoCleanup) return;
        
        const now = Date.now();
        const toRemove = [];
        
        for (const [sessionId, member] of this.activeMembers) {
            if (now - member.sessionStart > this.sessionTimeout * 2) {
                toRemove.push(sessionId);
            }
        }
        
        toRemove.forEach(sessionId => {
            this.disconnectMember(sessionId);
        });
    }
    
    /**
     * Mise à jour des statistiques
     */
    updateStats() {
        const stats = this.getStats();
        
        // Logger les stats périodiquement
        if (this.discordLogger && stats.activeMembers > 0) {
            this.discordLogger.log('INFO', '📊 Statistiques des membres', stats);
        }
    }
    
    /**
     * Obtention des statistiques
     */
    getStats() {
        const now = Date.now();
        const activeMembers = Array.from(this.activeMembers.values());
        
        return {
            activeMembers: activeMembers.length,
            totalHistory: this.memberHistory.length,
            totalSessions: this.memberHistory.length,
            averageSessionDuration: this.calculateAverageSessionDuration(),
            mostActivePage: this.getMostActivePage(),
            deviceDistribution: this.getDeviceDistribution(),
            lastUpdate: new Date().toISOString()
        };
    }
    
    /**
     * Calcul de la durée moyenne de session
     */
    calculateAverageSessionDuration() {
        const completedSessions = this.memberHistory.filter(h => h.totalDuration);
        if (completedSessions.length === 0) return 0;
        
        const totalDuration = completedSessions.reduce((sum, h) => sum + h.totalDuration, 0);
        return Math.round(totalDuration / completedSessions.length / 1000); // en secondes
    }
    
    /**
     * Page la plus visitée
     */
    getMostActivePage() {
        const pageCounts = {};
        
        this.memberHistory.forEach(member => {
            member.pagesVisited?.forEach(page => {
                pageCounts[page] = (pageCounts[page] || 0) + 1;
            });
        });
        
        let mostActive = null;
        let maxCount = 0;
        
        for (const [page, count] of Object.entries(pageCounts)) {
            if (count > maxCount) {
                maxCount = count;
                mostActive = page;
            }
        }
        
        return mostActive || 'Aucune';
    }
    
    /**
     * Distribution des appareils
     */
    getDeviceDistribution() {
        const deviceCounts = {};
        
        this.memberHistory.forEach(member => {
            const device = member.device || 'Unknown';
            deviceCounts[device] = (deviceCounts[device] || 0) + 1;
        });
        
        return deviceCounts;
    }
    
    /**
     * Export des données
     */
    exportData() {
        return {
            activeMembers: Array.from(this.activeMembers.values()),
            history: this.memberHistory,
            stats: this.getStats(),
            config: this.config,
            exportTime: new Date().toISOString()
        };
    }
    
    /**
     * Réinitialisation
     */
    reset() {
        this.activeMembers.clear();
        this.memberHistory = [];
        this.saveToStorage();
        console.log('🔄 Member Tracker réinitialisé');
    }
}

// Export pour utilisation dans d'autres modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = MemberTracker;
} else if (typeof window !== 'undefined') {
    window.MemberTracker = MemberTracker;
}
