// ========================================
// CONFIGURATION FIREBASE REALTIME DATABASE
// ========================================

// Configuration Firebase
const firebaseConfig = {
    apiKey: "AIzaSyBXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX", // À remplacer par votre clé API
    authDomain: "koboo-460e2.firebaseapp.com",
    databaseURL: "https://koboo-460e2-default-rtdb.europe-west1.firebasedatabase.app",
    projectId: "koboo-460e2",
    storageBucket: "koboo-460e2.appspot.com",
    messagingSenderId: "123456789", // À remplacer par votre ID
    appId: "1:123456789:web:abcdef123456" // À remplacer par votre App ID
};

// Initialiser Firebase
let firebaseApp;
let firebaseDatabase;

// Fonction d'initialisation Firebase
function initializeFirebase() {
    try {
        // Vérifier si Firebase est déjà chargé
        if (typeof firebase === 'undefined') {
            console.warn('Firebase SDK non chargé, utilisation du mode local storage');
            return false;
        }

        // Initialiser l'app Firebase
        firebaseApp = firebase.initializeApp(firebaseConfig);
        firebaseDatabase = firebase.database();
        
        console.log('✅ Firebase initialisé avec succès');
        return true;
        
    } catch (error) {
        console.warn('⚠️ Erreur initialisation Firebase:', error.message);
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
            return snapshot.val();
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

// Export des fonctions pour utilisation dans d'autres modules
window.firebaseConfig = {
    initialize: initializeFirebase,
    getRef: getDatabaseRef,
    listen: listenToChanges,
    stopListen: stopListening,
    save: saveToFirebase,
    get: getFromFirebase,
    update: updateInFirebase,
    delete: deleteFromFirebase,
    isAvailable: isFirebaseAvailable
};

// Auto-initialisation si Firebase est déjà chargé
if (typeof firebase !== 'undefined') {
    initializeFirebase();
}
