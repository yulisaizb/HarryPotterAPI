// firebaseConfig.js - Configuración de Firebase
// IMPORTANTE: Reemplaza esto con tu configuración de Firebase
// Obtén tu configuración en: https://console.firebase.google.com/

import { initializeApp } from 'firebase/app';
import { 
  getAuth, 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged
} from 'firebase/auth';
import { 
  getFirestore, 
  collection, 
  addDoc, 
  deleteDoc, 
  query, 
  where, 
  getDocs,
  doc 
} from 'firebase/firestore';

// Leer configuración desde variables de entorno (recomendado)
// Crea `.env.local` en la raíz con las variables `VITE_FIREBASE_*`.
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || '',
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || '',
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || '',
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || '',
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || '',
  appId: import.meta.env.VITE_FIREBASE_APP_ID || ''
};

// Inicializar Firebase si hay configuración disponible
let app, auth, db;
if (firebaseConfig.projectId && firebaseConfig.apiKey) {
  try {
    app = initializeApp(firebaseConfig);
    auth = getAuth(app);
    db = getFirestore(app);
    console.log('✅ Firebase inicializado desde variables de entorno');
  } catch (err) {
    console.error('⚠️ Error inicializando Firebase:', err.message);
  }
} else {
  console.warn('⚠️ Variables de Firebase no encontradas en import.meta.env. Comprueba `.env.local`.');
}

// Funciones de autenticación
export async function registerUser(email, password) {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    return { success: true, user: userCredential.user };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

export async function loginUser(email, password) {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return { success: true, user: userCredential.user };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

export async function logoutUser() {
  try {
    await signOut(auth);
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

// Funciones para favoritos (FUNCIÓN ORIGINAL CON DATOS A FIREBASE)
export async function addFavorite(userId, character) {
  try {
    const favoritesRef = collection(db, 'favorites');
    const docRef = await addDoc(favoritesRef, {
      userId: userId,
      characterId: character.id,
      characterName: character.name,
      characterImage: character.image || '',
      characterHouse: character.house || 'Unknown',
      addedAt: new Date(),
      notes: character.notes || ''
    });
    return { success: true, id: docRef.id };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

export async function removeFavorite(favoriteId) {
  try {
    await deleteDoc(doc(db, 'favorites', favoriteId));
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

export async function getFavorites(userId) {
  try {
    const favoritesRef = collection(db, 'favorites');
    const q = query(favoritesRef, where('userId', '==', userId));
    const querySnapshot = await getDocs(q);
    
    const favorites = [];
    querySnapshot.forEach((doc) => {
      favorites.push({
        id: doc.id,
        ...doc.data()
      });
    });
    
    return { success: true, data: favorites };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

// Función para guardar análisis de búsqueda (análisis adicional)
export async function saveSearchAnalytics(userId, searchTerm, resultsCount) {
  try {
    const analyticsRef = collection(db, 'searchAnalytics');
    await addDoc(analyticsRef, {
      userId: userId,
      searchTerm: searchTerm,
      resultsCount: resultsCount,
      timestamp: new Date()
    });
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

// Función para monitorear el estado de autenticación
export function monitorAuth(callback) {
  if (!auth) {
    console.warn('Firebase Auth no está inicializado.');
    callback(null);
    return;
  }
  return onAuthStateChanged(auth, callback);
}
