import { db } from './data.js';         // Conexión a la base de datos que hicimos en el data.js
import { collection, getDocs, doc, getDoc, addDoc, deleteDoc, setDoc, updateDoc } from "firebase/firestore";


const usersCollection = collection(db, "users");    // Referencia a la colección "users" en Firestore