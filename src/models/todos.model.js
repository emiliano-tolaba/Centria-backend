import { db } from './data.js';         // Importamos la conexión a Firestore que configuramos en data.js
import { collection, getDocs, doc, getDoc, addDoc, deleteDoc, setDoc, updateDoc, serverTimestamp, query, where } from "firebase/firestore";    // Importamos las funciones necesarias del SDK de Firestore para trabajar con colecciones y documentos

// Función auxiliar: devuelve la referencia a la subcolección "todos" de un usuario.
// Cada usuario tiene su propio espacio privado de tareas: users/{userId}/todos
const todosCollection = (userId) => collection(db, "users", userId, "todos");


// Obtiene todas las tareas de un usuario
export const getAllTodos = async (userId) =>
{
    try
    {
        // Obtengo todos los documentos de la colección.
        const snapshot = await getDocs(todosCollection(userId));    // Leemos todos los documentos de la subcolección 
        
        return snapshot.docs.map((doc) =>   // Transformamos cada documento en un objeto con su id y datos.
        {
            const data = doc.data();

            return{                                         // Usamos valores por defecto para evitar campos undefined.
                id: doc.id,                                                         // ID único de la tarea
                task: data.task || "Sin datos",                                     // Texto de la tarea
                isCompleted: data.isCompleted || false,                             // Booleano: false = pendiente, true = completada
                completedAt: data.completedAt ? data.completedAt.toDate() : null,   // Fecha de completado (si existe)
                dueDate: data.dueDate ? data.dueDate.toDate() : null                // Nueva fecha de vencimiento (si existe)
            }
        });

    }
    catch (error)          // Si ocurre un error, lo mostramos en consola para depuración.
    {    
        console.error('getAllTodos error:', error);

        return []; // Retornamos un array vacío como fallback defensivo. Esto evita que la aplicación se rompa si falla la consulta.
    }
}


// Obtiene un solo Todo desde Firestore, para evitar traer toda la lista.
export const getTodoById = async (userId, todoId) => {
    try
    {
        const todoReference = doc(db, "users", userId, "todos", todoId);     // Referencia al documento dentro de la subcolección "todos" del usuario
        const snapshot = await getDoc(todoReference);       // Obtenemos el snapshot del documento.

        if(!snapshot.exists()){return null};                // Si el documento no existe, devolvemos null.

        const data = snapshot.data();                       // Extraemos los datos del documento.

        // Retornamos un objeto con el id y los datos del Todo.  
        return {
            id: snapshot.id,                                // ID único de la tarea
            task: data.task || "Sin datos",                 // Texto de la tarea
            isCompleted: data.isCompleted || false,         // Booleano: false = pendiente, true = completada
            completedAt: data.completedAt ? data.completedAt.toDate() : null, // Fecha de completado
            dueDate: data.dueDate ? data.dueDate.toDate() : null              // Fecha de vencimiento
        };

    }
    catch (error)
    {
        console.error("getTodoById error:", error);         // Log interno para depuración.
        
        return null;                                        // Retornamos null como fallback defensivo.
    }
};


// Función asincrónica que crea un nuevo Todo en Firestore
export const createNewTodo = async (userId, data) =>    // "data" contiene los campos del Todo (text, category) a guardar
{ 
    try
    {
        
        // INSERCIÓN EN FIRESTORE
        // Firestore genera automáticamente un ID único para este documento
        const docReference = await addDoc(todosCollection(userId),{
            task: data.task || "Sin datos",     // Guardamos el texto de la tarea
            isCompleted: false,                 // Siempre arranca como pendiente   
            completedAt: null,                  // No tiene fecha hasta que se complete
            dueDate: data.dueDate || null       // Fecha de vencimiento opcional
        });   

        // Construimos el objeto de respuesta 
        return {    
            id: docReference.id,        // ID único generado por Firestore
            task: data.task || "Sin datos",
            isCompleted: false,                 
            completedAt: null,                  
            dueDate: data.dueDate || null       
        };
        
    }   
    catch (error)
    {
        console.error('createNewTodo error:', error);        // Log interno para depuración
        
        throw new Error('Error al crear el Todo en la base de datos'); // Re-lanzo el error para que el controller lo capture y devuelva un 500
    }
}



// Función asincrónica que modifica un Todo de Firestore por su ID
export const updateTodo = async (userId, todoId, newData) => 
{
    try
    {
        const todoReference = doc(todosCollection(userId), todoId);   // Obtenemos la referencia al documento dentro de la subcolección "todos" del usuario
        const snapshot = await getDoc(todoReference);     // Obtenemos el snapshot actual del documento para verificar si existe

        if (!snapshot.exists())                     // Si no existe, devolvemos false para que el controller mande 404
        {
            console.warn(`updateTodo: no existe documento con id='${todoId}' para el usuario='${userId}'`);
            return false;   // El controller podrá responder con 404
        }


        // Normalización de fechas:
        // Si viene "dueDate" como string ISO, lo convertimos a Date para que Firestore lo guarde como Timestamp
        let updatePayload = { ...newData };

        if (newData.dueDate)    // dueDate → convertir string ISO a Date
        {
            const parsedDueDate = new Date(newData.dueDate);

            if (!isNaN(parsedDueDate.getTime()))
            {
                updatePayload.dueDate = parsedDueDate;          // Firestore lo convertirá a Timestamp
            }
            else
            {
                updatePayload.dueDate = null;                   // Si es inválido, lo dejamos en null
            }
        }

        // Si viene "completedAt" como string ISO, también lo convertimos a Date
        if (newData.completedAt)
        {
            const parsedCompletedAt = new Date(newData.completedAt);
            
            if (!isNaN(parsedCompletedAt.getTime()))
            {
                updatePayload.completedAt = parsedCompletedAt;
            }else
            {
                updatePayload.completedAt = null;
            }
        }

        // Actualizamos únicamente los campos provistos en newData
        await updateDoc(todoReference, updatePayload);

        // Volvemos a leer el documento actualizado para devolverlo con los nuevos valores
        const updatedSnapshot = await getDoc(todoReference);
        const updatedData = updatedSnapshot.data();

        //  Construimos el objeto de respuesta con valores por defecto
        return {
            id: todoId,
            task: updatedData.task || "Sin datos",
            isCompleted: updatedData.isCompleted || false,
            completedAt: updatedData.completedAt ? updatedData.completedAt.toDate() : null,
            dueDate: updatedData.dueDate ? updatedData.dueDate.toDate() : null
        }; 
        
    }
    catch(error)
    {
        console.error("updateTodo error:", error);      // Log interno para depuración
        
        return null;                                    // Si ocurre un error inesperado, devolvemos null para que el controller responda con 500
    }
}


// Función asincrónica que elimina un Todo de Firestore por su ID
export const deleteTodo = async (userId, todoId) =>
{
    try
    {
        const todoReference = doc(todosCollection(userId), todoId);     // Obtenemos la referencia al documento dentro de la colección "todos"
        const snapshot = await getDoc(todoReference);       // Leemos el documento para verificar si existe    

        if(!snapshot.exists())      // si no existe el Todo retorno false
        {
            return false;
        }

        await deleteDoc(todoReference);         // Si existe, eliminamos el documento de Firestore

        const deletedData = snapshot.data();         // Extraemos los datos del snapshot leído antes de eliminar. Esto nos permite devolver información del Todo eliminado

        return {    // Construimos el objeto de respuesta con valores por defecto si faltan
            id: snapshot.id,
            task: deletedData.task || "Sin datos",
            isCompleted: deletedData.isCompleted || false,
            completedAt: deletedData.completedAt ? deletedData.completedAt.toDate() : null,
            dueDate: deletedData.dueDate ? deletedData.dueDate.toDate() : null
        };
    }
    catch(error)    // Log interno para depuración en caso de error inesperado
    {
        console.error('deletedTodo error:', error);     

        return false;       // Retornamos false para indicar que la operación falló
    }
}
