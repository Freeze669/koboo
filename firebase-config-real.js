// ========================================
// CONFIGURATION FIREBASE REALTIME DATABASE
// CONFIGURATION RÉELLE POUR KOBOO STUDIO
// ========================================

// Configuration Firebase réelle pour Koboo Studio
const firebaseConfig = {
    // ⚠️ REMPLACEZ CES VALEURS PAR VOS VRAIES CLÉS FIREBASE
    apiKey: "VOTRE_CLE_API_FIREBASE",
    authDomain: "koboo-460e2.firebaseapp.com",
    databaseURL: "https://koboo-460e2-default-rtdb.europe-west1.firebasedatabase.app",
    projectId: "koboo-460e2",
    storageBucket: "koboo-460e2.appspot.com",
    messagingSenderId: "VOTRE_MESSAGING_SENDER_ID",
    appId: "VOTRE_APP_ID"
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
        
        console.log('✅ Firebase initialisé avec succès pour Koboo Studio');
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
        return false;
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

// ========================================
// INSTRUCTIONS D'INSTALLATION
// ========================================

/*
POUR ACTIVER FIREBASE REALTIME DATABASE :

1. Allez sur https://console.firebase.google.com/
2. Connectez-vous avec votre compte Google
3. Sélectionnez votre projet "koboo-460e2"
4. Dans le menu de gauche, cliquez sur "Realtime Database"
5. Cliquez sur "Créer une base de données"
6. Choisissez "Test mode" pour commencer
7. Sélectionnez la région "europe-west1"
8. Cliquez sur "Terminé"

9. Dans "Project Settings" (roue dentée), trouvez vos clés :
   - apiKey
   - authDomain
   - databaseURL
   - projectId
   - storageBucket
   - messagingSenderId
   - appId

10. Remplacez les valeurs dans ce fichier par vos vraies clés

11. Renommez ce fichier en "firebase-config.js" pour l'activer

12. Testez avec "test-firebase-realtime.html"

⚠️ ATTENTION : Ne partagez jamais vos clés Firebase publiquement !
*/
