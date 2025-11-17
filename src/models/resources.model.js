import { db } from './data.js';     // Conexión a la base de datos que hicimos en el data.js

// Importo funciones necesarias de Firebase Firestore para operar con documentos y colecciones.
import { collection, getDocs, doc, getDoc, addDoc, deleteDoc, setDoc, updateDoc } from "firebase/firestore";

// collection: para referenciar una colección,
// ¿que es una colección de documentos? es como una tabla en bases de datos relacionales que agrupa documentos similares.
// getDocs: para obtener múltiples documentos de una colección
// ¿que es un documento? es una unidad individual de datos dentro de una colección, similar a una fila en una tabla relacional
// doc: para referenciar un documento específico
// getDoc: para obtener un solo documento
// addDoc: para agregar un nuevo documento con ID autogenerado
// deleteDoc: para eliminar un documento
// setDoc: para crear o sobrescribir un documento con ID específico
// updateDoc: para actualizar campos específicos de un documento

// Referencia a la colección "resources" en Firestore

const resourcesCollection = collection(db, "resources");

// Obtiene todos los productos desde Firestore.
export const getAllResources = async () =>
{
    try
    {
        // Obtengo todos los documentos de la colección.
        const snapshot = await getDocs(resourcesCollection); // snapshot es como una "foto" del estado actual
        
        // Mapeo cada doc a un objeto con id y sus datos.
        return snapshot.docs.map((doc) =>
        {
            const data = doc.data();
            return{
                id: doc.id,
                title: data.title || "Sin título",
                type: data.type || "Desconocido",
                content: data.content || "Sin contenido"
            }
        });

    } catch (error){
        // Si hay error lo muestro en consola y retorno un array vacío para no romper la app.
        console.error('getAllResources error:', error);
        
        return []; // retorno defensivo en caso de error
    }
}