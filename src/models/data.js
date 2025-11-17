// Importa las funciones de los SDK que necesitas
import { initializeApp } from "firebase/app";       // SDK principal de Firebase
import { getFirestore } from "firebase/firestore";  // SDK de Firestore

// ¿que es un SDK?
// Un SDK (Software Development Kit) es un conjunto de herramientas, bibliotecas, documentación y ejemplos de código
// que los desarrolladores pueden utilizar para crear aplicaciones específicas para una plataforma o servicio determinado.
// En este caso, los SDKs de Firebase proporcionan las herramientas necesarias para interactuar con los servicios de Firebase,
// como Firestore, Authentication, Storage, entre otros.

// La configuración de Firebase en nuestra aplicación web

const firebaseConfig =
{
    apiKey: process.env.FIREBASE_API_KEY,
    authDomain: process.env.FIREBASE_AUTH_DOMAIN,
    projectId: process.env.FIREBASE_PROJECT_ID,
    storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.FIREBASE_APP_ID
};

const app = initializeApp(firebaseConfig);      // Inicializo Firebase
const db = getFirestore(app);                   // inicializo Firestore


export { db }