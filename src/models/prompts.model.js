import { db } from './data.js';         // Importamos la conexión a Firestore que configuramos en data.js
import { collection, getDocs, doc, getDoc, addDoc, deleteDoc, setDoc, updateDoc, serverTimestamp, query, where } from "firebase/firestore";    // Importamos las funciones necesarias del SDK de Firestore para trabajar con colecciones y documentos

// Creamos una referencia a la colección "prompts" dentro de la base de datos.
const promptsCollection = collection(db, "prompts");    // Esta referencia se reutiliza en todas las operaciones de lectura/escritura.


// Obtiene todos los Prompts desde Firestore.
export const getAllPrompts = async () =>
{
    try
    {
        // Obtengo todos los documentos de la colección.
        const snapshot = await getDocs(promptsCollection);    // Cada snapshot es como una "foto" del estado actual de la colección.
        
        return snapshot.docs.map((doc) =>   // Transformamos cada documento en un objeto con su id y datos.
        {
            const data = doc.data();

            return{                                         // Usamos valores por defecto para evitar campos undefined.
                id: doc.id,                                         // ID único del documento en Firestore
                text: data.text || "Sin datos",
                category: data.category || "Categoría desconocida",
            }
        });

    }
    catch (error)          // Si ocurre un error, lo mostramos en consola para depuración.
    {    
        console.error('getAllPrompts error:', error);

        return []; // Retornamos un array vacío como fallback defensivo. Esto evita que la aplicación se rompa si falla la consulta.
    }
}


// Obtiene un solo Prompt desde Firestore, para evitar traer toda la lista.
export const getPromptById = async (id) => {
    try
    {
        const promptReference = doc(promptsCollection, id);     // Construimos la referencia al documento dentro de la colección "prompts".
        const snapshot = await getDoc(promptReference);       // Obtenemos el snapshot del documento.

        if(!snapshot.exists()){return null};                // Si el documento no existe, devolvemos null.

        const data = snapshot.data();                       // Extraemos los datos del documento.

        // Retornamos un objeto con el id y los datos del Prompt.  
        return {
            id: snapshot.id,                                 // Acá conviene usar snapshot.id en lugar de doc.id
            text: data.text || "Sin datos",
            category: data.category || "Categoría desconocida",
        };

    }
    catch (error)
    {
        console.error("getPromptById error:", error);         // Log interno para depuración.
        
        return null;                                        // Retornamos null como fallback defensivo.
    }
};


// Función asincrónica que crea un nuevo Prompt en Firestore
export const createNewPrompt = async (data) => { // "data" contiene los campos del Prompt (text, category) a guardar
    try
    {
        // INSERCIÓN EN FIRESTORE
        // Firestore genera automáticamente un ID único para este documento
        const docReference = await addDoc(promptsCollection, data);   

        // Construimos el objeto de respuesta 
        return {    
            id: docReference.id,        // ID único generado por Firestore
            text: data.text || "Sin datos",
            category: data.category || "Categoría desconocida"
        };
        
    }   
    catch (error)
    {
        console.error('createNewPrompt error:', error);        // Log interno para depuración
        
        throw new Error('Error al crear el Prompt en la base de datos'); // Re-lanzo el error para que el controller lo capture y devuelva un 500
    }
}


// Función asincrónica que modifica un Prompt de Firestore por su ID
export const updatePrompt = async (id, newData) => 
{
    try
    {
        const promptReference = doc(promptsCollection, id);   //  Obtengo la referencia al documento
        const snapshot = await getDoc(promptReference);     // Obtenemos el snapshot actual del documento para verificar si existe

        if (!snapshot.exists())                     // Si no existe, devolvemos false para que el controller mande 404
        {
            console.warn(`updatePrompt: no existe documento con id='${id}'`);
            return false;
        }


        await updateDoc(promptReference, newData);        // Actualizamos únicamente los campos provistos en newData (updateDoc no reemplaza todo el documento)
        
        // Volvemos a leer el documento actualizado para devolverlo con los nuevos valores
        const updatedSnapshot = await getDoc(promptReference);      // getDoc obtiene el snapshot (estado) del documento referenciado.
        const updatedData = updatedSnapshot.data();         // Del nuevo snapshot extraemos la data
        
        return {
            id,
            text: updatedData.text || "Sin datos",
            category: updatedData.category || "Categoría desconocida"
        }; 
        
    }
    catch(error)
    {
        console.error("updatePrompt error:", error);      // Log interno para depuración
        
        return null;                                    // Si ocurre un error inesperado, devolvemos null para que el controller responda con 500
    }
}


// Función asincrónica que elimina un Prompt de Firestore por su ID
export const deletePrompt = async (id) =>
{
    try
    {
        const promptReference = doc(promptsCollection, id);     // Obtenemos la referencia al documento dentro de la colección "prompts"
        const snapshot = await getDoc(promptReference);       // Leemos el documento para verificar si existe    

        if(!snapshot.exists())      // si no existe el Prompt retorno false
        {
            return false;
        }

        await deleteDoc(promptReference);         // Si existe, eliminamos el documento de Firestore

        const deletedData = snapshot.data();         // Extraemos los datos del snapshot leído antes de eliminar. Esto nos permite devolver información del Prompt eliminado

        return {    // Construimos el objeto de respuesta con valores por defecto si faltan
            id: snapshot.id,
            text: deletedData.text || "Sin datos",
            category: deletedData.category || "Categoría desconocida",
        };
    }
    catch(error)    // Log interno para depuración en caso de error inesperado
    {
        console.error('deletedPrompt error:', error);     

        return false;       // Retornamos false para indicar que la operación falló
    }
}

