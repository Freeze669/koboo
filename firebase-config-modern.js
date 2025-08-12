// ========================================
// CONFIGURATION FIREBASE MODERNE - KOBOO STUDIO
// ========================================

// Import des fonctions Firebase (sera chargé dynamiquement)
let firebaseApp;
let firebaseDatabase;
let firebaseAnalytics;

// Configuration Firebase RÉELLE pour Koboo Studio
const firebaseConfig = {
    apiKey: "AIzaSyAaWKRu4hSnDcrmLdjlEy4DqEdBBUEl60s",
    authDomain: "koboo-460e2.firebaseapp.com",
    databaseURL: "https://koboo-460e2-default-rtdb.europe-west1.firebasedatabase.app",
    projectId: "koboo-460e2",
    storageBucket: "koboo-460e2.firebasestorage.app",
    messagingSenderId: "868107745079",
    appId: "1:868107745079:web:7ebca3ffc016a60f864cb2",
    measurementId: "G-MJPQ0N92VZ"
};

// Fonction d'initialisation Firebase moderne
async function initializeFirebaseModern() {
    try {
        // Vérifier si Firebase est déjà chargé
        if (typeof firebase === 'undefined') {
            console.warn('Firebase SDK non chargé, utilisation du mode local storage');
            return false;
        }

        // Initialiser l'app Firebase
        firebaseApp = firebase.initializeApp(firebaseConfig);
        firebaseDatabase = firebase.database();
        
        // Initialiser Analytics si disponible
        try {
            firebaseAnalytics = firebase.analytics();
            console.log('✅ Firebase Analytics initialisé');
        } catch (error) {
            console.log('⚠️ Firebase Analytics non disponible');
        }
        
        console.log('✅ Firebase initialisé avec succès pour Koboo Studio (Configuration Moderne)');
        return true;
        
    } catch (error) {
        console.warn('⚠️ Erreur initialisation Firebase moderne:', error.message);
        return false;
    }
}

// Fonction pour obtenir une référence à la base de données
function getDatabaseRef(path) {
    if (firebaseDatabase) {
        return firebaseDatabase.ref(path);
    }
    return null;
}

// Fonction pour écouter les changements en temps réel
function listenToChanges(path, callback) {
    const ref = getDatabaseRef(path);
    if (ref) {
        ref.on('value', (snapshot) => {
            const data = snapshot.val();
            callback(data);
        });
        return ref; // Retourner la référence pour pouvoir arrêter l'écoute
    }
    return null;
}

// Fonction pour arrêter d'écouter les changements
function stopListening(ref) {
    if (ref && typeof ref.off === 'function') {
        ref.off();
    }
}

// Fonction pour sauvegarder des données
async function saveToFirebase(path, data) {
    try {
        const ref = getDatabaseRef(path);
        if (ref) {
            await ref.set(data);
            
            // Log Analytics si disponible
            if (firebaseAnalytics) {
                firebaseAnalytics.logEvent('data_saved', {
                    path: path,
                    data_size: JSON.stringify(data).length
                });
            }
            
            return true;
        }
        return false;
    } catch (error) {
        console.error('❌ Erreur sauvegarde Firebase:', error);
        return false;
    }
}

// Fonction pour récupérer des données
async function getFromFirebase(path) {
    try {
        const ref = getDatabaseRef(path);
        if (ref) {
            const snapshot = await ref.once('value');
            const data = snapshot.val();
            
            // Log Analytics si disponible
            if (firebaseAnalytics) {
                firebaseAnalytics.logEvent('data_retrieved', {
                    path: path,
                    has_data: !!data
                });
            }
            
            return data;
        }
        return null;
    } catch (error) {
        console.error('❌ Erreur récupération Firebase:', error);
        return null;
    }
}

// Fonction pour mettre à jour des données
async function updateInFirebase(path, data) {
    try {
        const ref = getDatabaseRef(path);
        if (ref) {
            await ref.update(data);
            
            // Log Analytics si disponible
            if (firebaseAnalytics) {
                firebaseAnalytics.logEvent('data_updated', {
                    path: path,
                    update_size: Object.keys(data).length
                });
            }
            
            return true;
        }
        return false;
    } catch (error) {
        console.error('❌ Erreur mise à jour Firebase:', error);
        return false;
    }
}

// Fonction pour supprimer des données
async function deleteFromFirebase(path) {
    try {
        const ref = getDatabaseRef(path);
        if (ref) {
            await ref.remove();
            
            // Log Analytics si disponible
            if (firebaseAnalytics) {
                firebaseAnalytics.logEvent('data_deleted', {
                    path: path
                });
            }
            
            return true;
        }
        return false;
    } catch (error) {
        console.error('❌ Erreur suppression Firebase:', error);
        return false;
    }
}

// Vérifier si Firebase est disponible
function isFirebaseAvailable() {
    return firebaseDatabase !== undefined && firebaseDatabase !== null;
}

// Fonction pour obtenir des statistiques Firebase
function getFirebaseStats() {
    return {
        app: !!firebaseApp,
        database: !!firebaseDatabase,
        analytics: !!firebaseAnalytics,
        config: firebaseConfig
    };
}

// Export des fonctions pour utilisation dans d'autres modules
window.firebaseConfig = {
    initialize: initializeFirebaseModern,
    getRef: getDatabaseRef,
    listen: listenToChanges,
    stopListen: stopListening,
    save: saveToFirebase,
    get: getFromFirebase,
    update: updateInFirebase,
    delete: deleteFromFirebase,
    isAvailable: isFirebaseAvailable,
    getStats: getFirebaseStats
};

// Auto-initialisation si Firebase est déjà chargé
if (typeof firebase !== 'undefined') {
    initializeFirebaseModern();
}

// ========================================
// INSTRUCTIONS D'UTILISATION
// ========================================

/*
✅ CONFIGURATION FIREBASE ACTIVÉE !

Vos vraies clés Firebase sont maintenant configurées :
- apiKey: ✅ Configuré
- authDomain: ✅ Configuré  
- databaseURL: ✅ Configuré
- projectId: ✅ Configuré
- storageBucket: ✅ Configuré
- messagingSenderId: ✅ Configuré
- appId: ✅ Configuré
- measurementId: ✅ Configuré

🚀 Le système temps réel est maintenant opérationnel !

Pour tester :
1. Ouvrez "test-firebase-optimized.html"
2. Cliquez sur "Tester la Connexion Firebase"
3. Vérifiez que la connexion réussit
4. Testez la synchronisation temps réel

Le panel admin et le site principal se synchroniseront automatiquement !
*/
