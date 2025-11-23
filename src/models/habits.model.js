import { db } from './data.js';         // Importamos la conexión a Firestore que configuramos en data.js
import { collection, getDocs, doc, getDoc, addDoc, deleteDoc, setDoc, updateDoc, serverTimestamp, query, where } from "firebase/firestore";    // Importamos las funciones necesarias del SDK de Firestore para trabajar con colecciones y documentos

// Función auxiliar: devuelve la referencia a la subcolección "habits" de un usuario.
// Cada usuario tiene su propio espacio privado de Hábitos: users/{userId}/habits
const habitsCollection = (userId) => collection(db, "users", userId, "habits");


// Obtiene todas las Hábitos de un usuario
export const getAllHabits = async (userId) =>
{
    try
    {
        // Obtengo habits los documentos de la colección.
        const snapshot = await getDocs(habitsCollection(userId));    // Leemos habits los documentos de la subcolección 
        
        return snapshot.docs.map((doc) =>   // Transformamos cada documento en un objeto con su id y datos.
        {
            const data = doc.data();

            return{                                         // Usamos valores por defecto para evitar campos undefined.
                id: doc.id,                                                         // ID único de la hábito
                name: data.name || "Sin datos",                                     // Texto de la hábito
                frequency: data.frequency || "Sin datos",                           // Frecuencia del hábito
                targetCount: data.targetCount || 0,                                 // Cúantas veces debe cumplirse en el período establecido
                isActive: data.isActive ?? true                                  // Usa el valor guardado, si no existe default true
            }
        });

    }
    catch (error)          // Si ocurre un error, lo mostramos en consola para depuración.
    {    
        console.error('getAllHabits error:', error);

        return []; // Retornamos un array vacío como fallback defensivo. Esto evita que la aplicación se rompa si falla la consulta.
    }
}


// Obtiene un solo Habit desde Firestore, para evitar traer toda la lista.
export const getHabitById = async (userId, habitId) => {
    try
    {
        const habitReference = doc(db, "users", userId, "habits", habitId);     // Referencia al documento dentro de la subcolección "habits" del usuario
        const snapshot = await getDoc(habitReference);       // Obtenemos el snapshot del documento.

        if(!snapshot.exists()){return null};                // Si el documento no existe, devolvemos null.

        const data = snapshot.data();                       // Extraemos los datos del documento.

        // Retornamos un objeto con el id y los datos del Habit.  
        return {
            id: snapshot.id,                                    // ID único de la hábito
            name: data.name || "Sin datos",                     // Texto de la hábito
            frequency: data.frequency || "Sin datos",           // Frecuencia del hábito
            targetCount: data.targetCount || 0,                 // Cúantas veces debe cumplirse en el período establecido
            isActive: data.isActive ?? true                     // Usa el valor guardado, si no existe default true
        };

    }
    catch (error)
    {
        console.error("getHabitById error:", error);         // Log interno para depuración.
        
        return null;                                        // Retornamos null como fallback defensivo.
    }
};


// Función asincrónica que crea un nuevo Habit en Firestore
export const createNewHabit = async (userId, data) =>    // "data" contiene los campos del Habit (name, frequency, targetCount) a guardar
{ 
    try
    {
        
        // INSERCIÓN EN FIRESTORE
        // Firestore genera automáticamente un ID único para este documento
        const docReference = await addDoc(habitsCollection(userId),{
            name: data.name || "Sin datos",                     // Nombre del hábito
            frequency: data.frequency || "Sin datos",           // Frecuencia del hábito
            targetCount: data.targetCount || 1,                 // Cúantas veces debe cumplirse en el período establecido
            isActive: true,                                     // Arranca en "true"
        });   


        // Construimos el objeto de respuesta 
        return {    
            id: docReference.id,        // ID único generado por Firestore
            name: data.name || "Sin datos",                     // Nombre del hábito
            frequency: data.frequency || "Sin datos",           // Frecuencia del hábito
            targetCount: data.targetCount || 1,                 // Cúantas veces debe cumplirse en el período establecido
            isActive: data.isActive ?? true                     // Usa el valor guardado, si no existe default true
        };
        
    }   
    catch (error)
    {
        console.error('createNewHabit error:', error);        // Log interno para depuración
        
        throw new Error('Error al crear el Habit en la base de datos'); // Re-lanzo el error para que el controller lo capture y devuelva un 500
    }
}



// Función asincrónica que modifica un Habit de Firestore por su ID
export const updateHabit = async (userId, habitId, newData) => 
{
    try
    {
        const habitReference = doc(habitsCollection(userId), habitId);   // Obtenemos la referencia al documento dentro de la subcolección "habits" del usuario
        const snapshot = await getDoc(habitReference);     // Obtenemos el snapshot actual del documento para verificar si existe

        if (!snapshot.exists())                     // Si no existe, devolvemos false para que el controller mande 404
        {
            console.warn(`updateHabit: no existe documento con id='${habitId}' para el usuario='${userId}'`);
            return false;   // El controller podrá responder con 404
        }

        // Actualizamos únicamente los campos provistos en newData
        await updateDoc(habitReference, newData);

        // Volvemos a leer el documento actualizado para devolverlo con los nuevos valores
        const updatedSnapshot = await getDoc(habitReference);
        const updatedData = updatedSnapshot.data();

        //  Construimos el objeto de respuesta con valores por defecto
        return {
            id: habitId,                                        // ID único generado por Firestore
            name: updatedData.name || "Sin datos",              // Nombre del hábito
            frequency: updatedData.frequency || "Sin datos",    // Frecuencia del hábito
            targetCount: updatedData.targetCount || 1 ,         // Cúantas veces debe cumplirse en el período establecido
            isActive: updatedData.isActive ?? true              // Usa el valor guardado, si no existe default true
        };
        
    }
    catch(error)
    {
        console.error("updateHabit error:", error);      // Log interno para depuración
        
        return null;                                    // Si ocurre un error inesperado, devolvemos null para que el controller responda con 500
    }
}


// Función asincrónica que elimina un Habit de Firestore por su ID
export const deleteHabit = async (userId, habitId) =>
{
    try
    {
        const habitReference = doc(habitsCollection(userId), habitId);     // Obtenemos la referencia al documento dentro de la colección "habits"
        const snapshot = await getDoc(habitReference);       // Leemos el documento para verificar si existe    

        if(!snapshot.exists())      // si no existe el Habit retorno false
        {
            return false;
        }

        await deleteDoc(habitReference);         // Si existe, eliminamos el documento de Firestore

        const deletedData = snapshot.data();         // Extraemos los datos del snapshot leído antes de eliminar. Esto nos permite devolver información del Habit eliminado

        return {    // Construimos el objeto de respuesta
            id: snapshot.id,
            name: deletedData.name || "Sin datos",              // Nombre del hábito
            frequency: deletedData.frequency || "Sin datos",    // Frecuencia del hábito
            targetCount: deletedData.targetCount || 1 ,         // Cúantas veces debe cumplirse en el período establecido
            isActive: deletedData.isActive ?? true              // Usa el valor guardado, si no existe default true
        };
    }
    catch(error)    // Log interno para depuración en caso de error inesperado
    {
        console.error('deletedHabit error:', error);     

        return false;       // Retornamos false para indicar que la operación falló
    }
}            