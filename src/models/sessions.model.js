import { db } from './data.js';         // Importamos la conexión a Firestore que configuramos en data.js
import { collection, getDocs, doc, getDoc, addDoc, deleteDoc, setDoc, updateDoc, serverTimestamp, query, where } from "firebase/firestore";    // Importamos las funciones necesarias del SDK de Firestore para trabajar con colecciones y documentos

// Función auxiliar: devuelve la referencia a la subcolección "sessions" de un usuario.
// Cada usuario tiene su propio espacio privado de sesions: users/{userId}/sessions
const sessionsCollection = (userId) => collection(db, "users", userId, "sessions");


// Obtiene todas las sesions de un usuario
export const getAllSessions = async (userId) =>
{
    try
    {
        // Obtengo sessions los documentos de la colección.
        const snapshot = await getDocs(sessionsCollection(userId));    // Leemos todos los documentos de la subcolección 
        
        return snapshot.docs.map((doc) =>   // Transformamos cada documento en un objeto con su id y datos.
        {
            const data = doc.data();

            return{                                                                 // Usamos valores por defecto para evitar campos undefined.
                id: doc.id,                                                         // ID único de la sesion
                startTime: data.startTime ? data.startTime.toDate() : null,         // Fecha de inicio 
                endTime: data.endTime ? data.endTime.toDate() : null,               // Fecha de finalización
                focusTime: data.focusTime,                                          // Tiempo de enfoque    
                breakTime: data.breakTime,                                          // Tiempo de descanso
                tag: data.tag                                                       // Etiqueta
            }
        });

    }
    catch (error)          // Si ocurre un error, lo mostramos en consola para depuración.
    {    
        console.error('getAllSessions error:', error);

        return []; // Retornamos un array vacío como fallback defensivo. Esto evita que la aplicación se rompa si falla la consulta.
    }
}


    // Obtiene un solo Session desde Firestore, para evitar traer toda la lista.
    export const getSessionById = async (userId, sessionId) => {
        try
        {
            const sessionReference = doc(db, "users", userId, "sessions", sessionId);     // Referencia al documento dentro de la subcolección "sessions" del usuario
            const snapshot = await getDoc(sessionReference);       // Obtenemos el snapshot del documento.

            if(!snapshot.exists()){return null};                // Si el documento no existe, devolvemos null.

            const data = snapshot.data();                       // Extraemos los datos del documento.

            // Retornamos un objeto con el id y los datos del Session.  
            return {
                id: snapshot.id,
                startTime: data.startTime ? data.startTime.toDate() : null,              // Fecha de inicio (si existe)
                endTime: data.endTime ? data.endTime.toDate() : null,                    // Fecha de finalización (si existe)
                focusTime: data.focusTime,                                               // Tiempo de enfoque    
                breakTime: data.breakTime,                                               // Tiempo de descanso
                tag: data.tag                                                            // Etiqueta
            };
        }
        catch (error)
        {
            console.error("getSessionById error:", error);         // Log interno para depuración.
            
            return null;                                        // Retornamos null como fallback defensivo.
        }
    };


// Función asincrónica que crea un nuevo Session en Firestore
export const createNewSession = async (userId, data) =>    // "data" contiene los campos del Session (text, category) a guardar
{ 
    try
    {
        
        // INSERCIÓN EN FIRESTORE
        // Firestore genera automáticamente un ID único para este documento
        const docReference = await addDoc(sessionsCollection(userId),{
            startTime: data.startTime ? data.startTime.toDate() : null,              // Fecha de inicio (si existe)
            endTime: data.endTime ? data.endTime.toDate() : null,                    // Fecha de finalización (si existe)
            focusTime: data.focusTime,                                               // Tiempo de enfoque    
            breakTime: data.breakTime,                                               // Tiempo de descanso
            tag: data.tag                                                            // Etiqueta
        });   

            

        // Construimos el objeto de respuesta 
        return {    
            id: docReference.id,                             // ID único generado por Firestore
            startTime: data.startTime,                       // Fecha de inicio (si existe)
            endTime: data.endTime,                           // Fecha de finalización (si existe)
            focusTime: data.focusTime,                       // Tiempo de enfoque    
            breakTime: data.breakTime,                       // Tiempo de descanso
            tag: data.tag                                    // Etiqueta       
        };
        
    }   
    catch (error)
    {
        console.error('createNewSession error:', error);        // Log interno para depuración
        
        throw new Error('Error al crear el Session en la base de datos'); // Re-lanzo el error para que el controller lo capture y devuelva un 500
    }
}



// Función asincrónica que modifica un Session de Firestore por su ID
export const updateSession = async (userId, sessionId, newData) => 
{
    try
    {
        const sessionReference = doc(sessionsCollection(userId), sessionId);   // Obtenemos la referencia al documento dentro de la subcolección "sessions" del usuario
        const snapshot = await getDoc(sessionReference);     // Obtenemos el snapshot actual del documento para verificar si existe

        if (!snapshot.exists())                     // Si no existe, devolvemos false para que el controller mande 404
        {
            console.warn(`updateSession: no existe documento con id='${sessionId}' para el usuario='${userId}'`);
            return false;   // El controller podrá responder con 404
        }

        // Actualizamos únicamente los campos provistos en newData
        await updateDoc(sessionReference, newData);

        // Volvemos a leer el documento actualizado para devolverlo con los nuevos valores
        const updatedSnapshot = await getDoc(sessionReference);
        const updatedData = updatedSnapshot.data();

        //  Construimos el objeto de respuesta con valores por defecto
        return {
            id: sessionId,
            startTime: updatedData.startTime ? updatedData.startTime.toDate() : null,              // Fecha de inicio (si existe)
            endTime: updatedData.endTime ? updatedData.endTime.toDate() : null,                    // Fecha de finalización (si existe)
            focusTime: updatedData.focusTime,                                               // Tiempo de enfoque    
            breakTime: updatedData.breakTime,                                               // Tiempo de descanso
            tag: updatedData.tag                                                            // Etiqueta
        }; 
    }
    catch(error)
    {
        console.error("updateSession error:", error);      // Log interno para depuración
        
        return null;                                    // Si ocurre un error inesperado, devolvemos null para que el controller responda con 500
    }
}



// Función asincrónica que elimina un Session de Firestore por su ID
export const deleteSession = async (userId, sessionId) =>
{
    try
    {
        const sessionReference = doc(sessionsCollection(userId), sessionId);     // Obtenemos la referencia al documento dentro de la colección "sessions"
        const snapshot = await getDoc(sessionReference);       // Leemos el documento para verificar si existe    

        if(!snapshot.exists())      // si no existe el Session retorno false
        {
            return false;
        }

        await deleteDoc(sessionReference);         // Si existe, eliminamos el documento de Firestore

        const deletedData = snapshot.data();         // Extraemos los datos del snapshot leído antes de eliminar. Esto nos permite devolver información de la sesion eliminada

        return {    // Construimos el objeto de respuesta con valores por defecto si faltan
            id: snapshot.id,
            startTime: deletedData.startTime ? deletedData.startTime.toDate() : null,              // Fecha de inicio (si existe)
            endTime: deletedData.endTime ? deletedData.endTime.toDate() : null,                    // Fecha de finalización (si existe)
            focusTime: deletedData.focusTime,                                               // Tiempo de enfoque    
            breakTime: deletedData.breakTime,                                               // Tiempo de descanso
            tag: deletedData.tag                                                            // Etiqueta
        };
    }
    catch(error)    // Log interno para depuración en caso de error inesperado
    {
        console.error('deletedSession error:', error);     

        return false;       // Retornamos false para indicar que la operación falló
    }
}
