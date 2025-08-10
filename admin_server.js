/**
 * ADMIN PANEL SERVER - MAYU & JACK STUDIO
 * Backend Node.js sécurisé pour le panel d'administration
 * Authentification par code + Analytics avancées
 */

const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const bcrypt = require('bcrypt');
const session = require('express-session');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const app = express();
const PORT = process.env.PORT || 3001;

// Configuration de sécurité
app.use(helmet({
    contentSecurityPolicy: false, // Pour permettre les styles inline
}));

app.use(cors({
    origin: ['http://localhost:3000', 'http://127.0.0.1:3000'],
    credentials: true
}));

// Rate limiting pour éviter les attaques brute force
const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 5, // 5 tentatives max
    message: {
        error: 'Trop de tentatives de connexion. Réessayez dans 15 minutes.'
    }
});

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

// Configuration des sessions
app.use(session({
    secret: crypto.randomBytes(64).toString('hex'),
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: false, // true en production avec HTTPS
        httpOnly: true,
        maxAge: 24 * 60 * 60 * 1000 // 24 heures
    }
}));

// Base de données SQLite
const dbPath = path.join(__dirname, 'admin_data.db');
const db = new sqlite3.Database(dbPath);

// Initialisation de la base de données
function initializeDatabase() {
    db.serialize(() => {
        // Table des sessions admin
        db.run(`CREATE TABLE IF NOT EXISTS admin_sessions (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            session_id TEXT UNIQUE,
            user_agent TEXT,
            ip_address TEXT,
            login_time DATETIME DEFAULT CURRENT_TIMESTAMP,
            last_activity DATETIME DEFAULT CURRENT_TIMESTAMP,
            is_active BOOLEAN DEFAULT 1
        )`);

        // Table des visiteurs du site
        db.run(`CREATE TABLE IF NOT EXISTS site_visitors (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            ip_address TEXT,
            user_agent TEXT,
            page_visited TEXT,
            referrer TEXT,
            visit_time DATETIME DEFAULT CURRENT_TIMESTAMP,
            session_duration INTEGER DEFAULT 0,
            country TEXT,
            device_type TEXT
        )`);

        // Table des contacts/formulaires
        db.run(`CREATE TABLE IF NOT EXISTS contact_submissions (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            email TEXT NOT NULL,
            project_type TEXT,
            details TEXT,
            deadline DATE,
            budget TEXT,
            status TEXT DEFAULT 'nouveau',
            submission_time DATETIME DEFAULT CURRENT_TIMESTAMP,
            ip_address TEXT,
            priority INTEGER DEFAULT 1
        )`);

        // Table des métriques de performance
        db.run(`CREATE TABLE IF NOT EXISTS performance_metrics (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            metric_type TEXT,
            metric_value REAL,
            timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
            additional_data TEXT
        )`);

        // Table des erreurs système
        db.run(`CREATE TABLE IF NOT EXISTS system_logs (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            log_level TEXT,
            message TEXT,
            stack_trace TEXT,
            timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
            ip_address TEXT,
            user_agent TEXT
        )`);

        console.log('📁 Base de données initialisée');
    });
}

// Code d'accès admin (hash)
const ADMIN_CODE_HASH = '$2b$10$rQj7OcGd8vX4YzHjN6TZQOvKj4E5A8nRm7FpLx2C9wQ3sK8vN1mL6'; // Code: "MAYU_JACK_2024"

// Middleware d'authentification
function requireAuth(req, res, next) {
    if (req.session.isAdmin) {
        // Mettre à jour l'activité
        updateLastActivity(req.session.adminSessionId);
        next();
    } else {
        res.status(401).json({ error: 'Authentification requise' });
    }
}

// Fonction pour mettre à jour la dernière activité
function updateLastActivity(sessionId) {
    db.run(
        'UPDATE admin_sessions SET last_activity = CURRENT_TIMESTAMP WHERE session_id = ?',
        [sessionId]
    );
}

// ROUTES D'AUTHENTIFICATION

// Route de connexion admin
app.post('/admin/login', authLimiter, async (req, res) => {
    const { code } = req.body;
    
    if (!code) {
        return res.status(400).json({ error: 'Code requis' });
    }

    try {
        const isValid = await bcrypt.compare(code, ADMIN_CODE_HASH);
        
        if (isValid) {
            const sessionId = crypto.randomBytes(32).toString('hex');
            
            // Enregistrer la session admin
            db.run(
                `INSERT INTO admin_sessions (session_id, user_agent, ip_address) 
                 VALUES (?, ?, ?)`,
                [sessionId, req.get('User-Agent'), req.ip],
                function(err) {
                    if (!err) {
                        req.session.isAdmin = true;
                        req.session.adminSessionId = sessionId;
                        
                        res.json({ 
                            success: true, 
                            message: 'Connexion réussie',
                            sessionId: sessionId
                        });
                    }
                }
            );
        } else {
            // Log tentative échouée
            logSystemEvent('WARN', 'Tentative de connexion admin échouée', null, req.ip, req.get('User-Agent'));
            res.status(401).json({ error: 'Code incorrect' });
        }
    } catch (error) {
        console.error('Erreur login:', error);
        res.status(500).json({ error: 'Erreur serveur' });
    }
});

// Route de déconnexion
app.post('/admin/logout', requireAuth, (req, res) => {
    const sessionId = req.session.adminSessionId;
    
    // Marquer la session comme inactive
    db.run(
        'UPDATE admin_sessions SET is_active = 0 WHERE session_id = ?',
        [sessionId]
    );
    
    req.session.destroy();
    res.json({ success: true, message: 'Déconnexion réussie' });
});

// ROUTES DU DASHBOARD

// Dashboard principal
app.get('/admin/dashboard', requireAuth, (req, res) => {
    const queries = {
        totalVisitors: `SELECT COUNT(*) as count FROM site_visitors WHERE DATE(visit_time) = DATE('now')`,
        totalContacts: `SELECT COUNT(*) as count FROM contact_submissions`,
        newContacts: `SELECT COUNT(*) as count FROM contact_submissions WHERE status = 'nouveau'`,
        avgSessionDuration: `SELECT AVG(session_duration) as avg FROM site_visitors WHERE session_duration > 0`,
        topPages: `SELECT page_visited, COUNT(*) as visits FROM site_visitors GROUP BY page_visited ORDER BY visits DESC LIMIT 5`,
        recentContacts: `SELECT * FROM contact_submissions ORDER BY submission_time DESC LIMIT 10`,
        visitorsToday: `SELECT COUNT(*) as count FROM site_visitors WHERE DATE(visit_time) = DATE('now')`,
        visitorsWeek: `SELECT COUNT(*) as count FROM site_visitors WHERE DATE(visit_time) >= DATE('now', '-7 days')`,
        performanceMetrics: `SELECT * FROM performance_metrics ORDER BY timestamp DESC LIMIT 20`
    };

    const dashboardData = {};
    let completedQueries = 0;
    const totalQueries = Object.keys(queries).length;

    Object.entries(queries).forEach(([key, query]) => {
        db.all(query, (err, rows) => {
            if (!err) {
                dashboardData[key] = rows;
            }
            completedQueries++;
            
            if (completedQueries === totalQueries) {
                res.json(dashboardData);
            }
        });
    });
});

// Statistiques détaillées des visiteurs
app.get('/admin/visitors', requireAuth, (req, res) => {
    const { period = '7' } = req.query;
    
    const query = `
        SELECT 
            DATE(visit_time) as date,
            COUNT(*) as visitors,
            COUNT(DISTINCT ip_address) as unique_visitors,
            AVG(session_duration) as avg_duration
        FROM site_visitors 
        WHERE DATE(visit_time) >= DATE('now', '-${period} days')
        GROUP BY DATE(visit_time)
        ORDER BY date DESC
    `;
    
    db.all(query, (err, rows) => {
        if (err) {
            return res.status(500).json({ error: 'Erreur base de données' });
        }
        res.json(rows);
    });
});

// Gestion des contacts
app.get('/admin/contacts', requireAuth, (req, res) => {
    const { status = 'all', limit = 50 } = req.query;
    
    let query = 'SELECT * FROM contact_submissions';
    let params = [];
    
    if (status !== 'all') {
        query += ' WHERE status = ?';
        params.push(status);
    }
    
    query += ' ORDER BY submission_time DESC LIMIT ?';
    params.push(parseInt(limit));
    
    db.all(query, params, (err, rows) => {
        if (err) {
            return res.status(500).json({ error: 'Erreur base de données' });
        }
        res.json(rows);
    });
});

// Mettre à jour le statut d'un contact
app.put('/admin/contacts/:id', requireAuth, (req, res) => {
    const { id } = req.params;
    const { status, priority } = req.body;
    
    db.run(
        'UPDATE contact_submissions SET status = ?, priority = ? WHERE id = ?',
        [status, priority, id],
        function(err) {
            if (err) {
                return res.status(500).json({ error: 'Erreur mise à jour' });
            }
            res.json({ success: true, changes: this.changes });
        }
    );
});

// Métriques de performance en temps réel
app.get('/admin/performance', requireAuth, (req, res) => {
    const query = `
        SELECT 
            metric_type,
            AVG(metric_value) as avg_value,
            MAX(metric_value) as max_value,
            MIN(metric_value) as min_value,
            COUNT(*) as data_points
        FROM performance_metrics 
        WHERE timestamp >= datetime('now', '-1 hour')
        GROUP BY metric_type
    `;
    
    db.all(query, (err, rows) => {
        if (err) {
            return res.status(500).json({ error: 'Erreur base de données' });
        }
        res.json(rows);
    });
});

// Logs système
app.get('/admin/logs', requireAuth, (req, res) => {
    const { level = 'all', limit = 100 } = req.query;
    
    let query = 'SELECT * FROM system_logs';
    let params = [];
    
    if (level !== 'all') {
        query += ' WHERE log_level = ?';
        params.push(level.toUpperCase());
    }
    
    query += ' ORDER BY timestamp DESC LIMIT ?';
    params.push(parseInt(limit));
    
    db.all(query, params, (err, rows) => {
        if (err) {
            return res.status(500).json({ error: 'Erreur base de données' });
        }
        res.json(rows);
    });
});

// Sessions admin actives
app.get('/admin/sessions', requireAuth, (req, res) => {
    const query = `
        SELECT 
            session_id,
            user_agent,
            ip_address,
            login_time,
            last_activity,
            (julianday('now') - julianday(last_activity)) * 24 * 60 as minutes_since_activity
        FROM admin_sessions 
        WHERE is_active = 1 
        ORDER BY last_activity DESC
    `;
    
    db.all(query, (err, rows) => {
        if (err) {
            return res.status(500).json({ error: 'Erreur base de données' });
        }
        res.json(rows);
    });
});

// ROUTES PUBLIQUES POUR TRACKING

// Enregistrer une visite
app.post('/track/visit', (req, res) => {
    const { page, referrer, sessionDuration = 0 } = req.body;
    const userAgent = req.get('User-Agent');
    const ip = req.ip;
    
    // Déterminer le type d'appareil
    const deviceType = getDeviceType(userAgent);
    
    db.run(
        `INSERT INTO site_visitors (ip_address, user_agent, page_visited, referrer, session_duration, device_type)
         VALUES (?, ?, ?, ?, ?, ?)`,
        [ip, userAgent, page, referrer, sessionDuration, deviceType],
        function(err) {
            if (err) {
                console.error('Erreur enregistrement visite:', err);
            }
            res.json({ success: true });
        }
    );
});

// Enregistrer soumission formulaire
app.post('/track/contact', (req, res) => {
    const { name, email, projectType, details, deadline, budget } = req.body;
    const ip = req.ip;
    
    db.run(
        `INSERT INTO contact_submissions (name, email, project_type, details, deadline, budget, ip_address)
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [name, email, projectType, details, deadline, budget, ip],
        function(err) {
            if (err) {
                console.error('Erreur enregistrement contact:', err);
                return res.status(500).json({ error: 'Erreur enregistrement' });
            }
            
            // Log nouveau contact
            logSystemEvent('INFO', `Nouveau contact: ${name} (${email})`, null, ip);
            
            res.json({ success: true, id: this.lastID });
        }
    );
});

// Enregistrer métrique de performance
app.post('/track/performance', (req, res) => {
    const { metricType, value, additionalData = null } = req.body;
    
    db.run(
        'INSERT INTO performance_metrics (metric_type, metric_value, additional_data) VALUES (?, ?, ?)',
        [metricType, value, JSON.stringify(additionalData)],
        function(err) {
            if (err) {
                console.error('Erreur métrique:', err);
            }
            res.json({ success: true });
        }
    );
});

// FONCTIONS UTILITAIRES

function getDeviceType(userAgent) {
    if (/mobile/i.test(userAgent)) return 'mobile';
    if (/tablet/i.test(userAgent)) return 'tablet';
    return 'desktop';
}

function logSystemEvent(level, message, stackTrace = null, ip = null, userAgent = null) {
    db.run(
        'INSERT INTO system_logs (log_level, message, stack_trace, ip_address, user_agent) VALUES (?, ?, ?, ?, ?)',
        [level, message, stackTrace, ip, userAgent]
    );
}

// Génération du hash pour le code admin (utilitaire)
async function generateAdminHash(plainCode) {
    const hash = await bcrypt.hash(plainCode, 10);
    console.log('Hash généré:', hash);
    return hash;
}

// Route pour servir le panel admin
app.get('/admin', (req, res) => {
    res.sendFile(path.join(__dirname, 'admin_panel.html'));
});

// Gestion d'erreurs globale
app.use((err, req, res, next) => {
    console.error('Erreur serveur:', err);
    logSystemEvent('ERROR', err.message, err.stack, req.ip, req.get('User-Agent'));
    res.status(500).json({ error: 'Erreur serveur interne' });
});

// Nettoyage périodique (sessions expirées, logs anciens)
setInterval(() => {
    // Nettoyer sessions inactives depuis plus de 24h
    db.run(`UPDATE admin_sessions SET is_active = 0 
            WHERE julianday('now') - julianday(last_activity) > 1`);
    
    // Supprimer anciens logs (plus de 30 jours)
    db.run(`DELETE FROM system_logs 
            WHERE julianday('now') - julianday(timestamp) > 30`);
            
    // Supprimer anciennes métriques (plus de 7 jours)
    db.run(`DELETE FROM performance_metrics 
            WHERE julianday('now') - julianday(timestamp) > 7`);
            
}, 60 * 60 * 1000); // Chaque heure

// Démarrage du serveur
app.listen(PORT, () => {
    console.log(`
    🔐 ADMIN PANEL SERVER - MAYU & JACK STUDIO
    ==========================================
    
    🌐 Serveur: http://localhost:${PORT}
    🛡️  Panel Admin: http://localhost:${PORT}/admin
    📊 API Base: http://localhost:${PORT}/admin/
    
    🔑 Code d'accès: MAYU_JACK_2024
    🛡️  Sécurité: Rate limiting + Sessions + Hash
    📁 Base de données: SQLite (admin_data.db)
    
    Démarré à: ${new Date().toLocaleString()}
    `);
    
    initializeDatabase();
    logSystemEvent('INFO', 'Serveur admin démarré', null, 'localhost');
});

// Arrêt propre
process.on('SIGINT', () => {
    console.log('\n🛑 Arrêt du serveur...');
    db.close();
    process.exit(0);
});

module.exports = app;
