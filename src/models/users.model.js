import { db } from './data.js';         // Importamos la conexión a Firestore que configuramos en data.js
import { collection, getDocs, doc, getDoc, addDoc, deleteDoc, setDoc, updateDoc, serverTimestamp  } from "firebase/firestore";    // Importamos las funciones necesarias del SDK de Firestore para trabajar con colecciones y documentos


// Creamos una referencia a la colección "users" dentro de la base de datos.
const usersCollection = collection(db, "users");    // Esta referencia se reutiliza en todas las operaciones de lectura/escritura.


// Obtiene todos los Usuarios desde Firestore.
export const getAllUsers = async () =>
{
    try
    {
        // Obtengo todos los documentos de la colección.
        const snapshot = await getDocs(usersCollection);    // Cada snapshot es como una "foto" del estado actual de la colección.
        
        return snapshot.docs.map((doc) =>   // Transformamos cada documento en un objeto con su id y datos.
        {
            const data = doc.data();

            return{                                         // Usamos valores por defecto para evitar campos undefined.
                id: doc.id,                                         // ID único del documento en Firestore
                name: data.name || "Sin nombre",
                email: data.email || "Email desconocido",
                registrationDate: data.registrationDate?.toDate() || null   // Convertimos Timestamp a Date para mostrarlo con un formato fecha
            }
        });

    }
    catch (error)          // Si ocurre un error, lo mostramos en consola para depuración.
    {    
        console.error('getAllUsers error:', error);

        return []; // Retornamos un array vacío como fallback defensivo. Esto evita que la aplicación se rompa si falla la consulta.
    }
}


// Obtiene un solo Usuario desde Firestore, para evitar traer toda la lista.
export const getUserById = async (id) => {
    try
    {
        const userReference = doc(usersCollection, id);     // Construimos la referencia al documento dentro de la colección "users".
        const snapshot = await getDoc(userReference);       // Obtenemos el snapshot del documento.

        if(!snapshot.exists()){return null};                // Si el documento no existe, devolvemos null.

        const data = snapshot.data();                       // Extraemos los datos del documento.

        // Retornamos un objeto con el id y los datos del usuario.  
        return {
            id: snapshot.id,                                 // Acá conviene usar snapshot.id en lugar de doc.id
            name: data.name || "Sin nombre",
            email: data.email || "Email desconocido",
            registrationDate: data.registrationDate?.toDate() || null   // Convertimos Timestamp a Date para mostrarlo con un formato fecha
        };

    }
    catch (error)
    {
        console.error("getUserById error:", error);         // Log interno para depuración.
        
        return null;                                        // Retornamos null como fallback defensivo.
    }
};


// Función asincrónica que crea un nuevo Usuario en Firestore
export const createNewUser = async (data) => { // "data" contiene los campos del Usuario (name, email) a guardar
    try
    {
        // INSERCIÓN EN FIRESTORE
        // Firestore genera automáticamente un ID único para este documento
        const docReference = await addDoc(usersCollection, {...data, registrationDate: serverTimestamp()}); // Usamos serverTimestamp() para guardar la fecha/hora del servidor

        // Leemos el documento recién creado para obtener los datos tal como quedaron en Firestore
        const snapshot = await getDoc(docReference);
        const savedData = snapshot.data();

        // Construimos el objeto de respuesta para el controlador
        return {
            id: docReference.id,
            name: savedData.name || "Sin nombre",
            email: savedData.email || "Sin email ingresado",
            registrationDate: savedData.registrationDate?.toDate() || null  // Convertimos Timestamp a Date para mostrarlo con un formato fecha
        }; 
        
    }   
    catch (error)
    {
        console.error('createNewUser error:', error);        // Log interno para depuración
        
        throw new Error('Error al crear el Usuario en la base de datos'); // Re-lanzo el error para que el controlador (controller) lo capture y devuelva un 500
    }
}

// Función asincrónica que modifica un Usuario de Firestore por su ID
export const updateUser = async (id, userData) => 
{
    try
    {
        // Referencia tentativa por doc id
        const userRef = doc(usersCollection, id);   //  Obtengo la referencia al documento
        const snapshot = await getDoc(userRef);     // Obtenemos el snapshot actual del documento para verificar si existe

        if (!snapshot.exists())                     // Si no existe, devolvemos false para que el controller mande 404
        {
            console.warn(`updateUser: no existe documento con id='${id}'`);
            return false;
        }

        await updateDoc(userRef, userData);        // Actualizamos únicamente los campos provistos en userData (updateDoc no reemplaza todo el documento)
        
        // Volvemos a leer el documento actualizado para devolverlo con los nuevos valores
        const updatedSnapshot = await getDoc(userRef);      // getDoc obtiene el snapshot (estado) del documento referenciado.
        const updatedData = updatedSnapshot.data();         // Del nuevo snapshot extraemos la data
        
        return {
            id: updatedSnapshot.id,
            name: updatedData.name || "Sin nombre",
            email: updatedData.email || "Sin email ingresado",
            registrationDate: updatedData.registrationDate?.toDate() || null  // Convertimos Timestamp a Date para mostrarlo con un formato fecha
        }; 
        
    }
    catch(error)
    {
        console.error("updateUser error:", error);      // Log interno para depuración
        
        return null;                                    // Si ocurre un error inesperado, devolvemos null para que el controller responda con 500
    }
}

// Función asincrónica que elimina un Usuario de Firestore por su ID
export const deleteUser = async (id) =>
{
    try
    {
        const userReference = doc(usersCollection, id);     // Obtenemos la referencia al documento dentro de la colección "users"
        const snapshot = await getDoc(userReference);       // Leemos el documento para verificar si existe    

        if(!snapshot.exists())      // si no existe el Usuario retorno false
        {
            return false;
        }

        await deleteDoc(userReference);         // Si existe, eliminamos el documento de Firestore

        const deletedData = snapshot.data();         // Extraemos los datos del snapshot leído antes de eliminar. Esto nos permite devolver información del usuario eliminado

        return {    // Construimos el objeto de respuesta con valores por defecto si faltan
            id: snapshot.id,
            name: deletedData.name || "Sin nombre",
            email: deletedData.email || "Sin email ingresado",
            registrationDate: deletedData.registrationDate?.toDate() || null  // Convertimos Timestamp a Date para mostrarlo con un formato fecha
        };
        
    }
    catch(error)    // Log interno para depuración en caso de error inesperado
    {
        console.error('deletedUser error:', error);     

        return false;       // Retornamos false para indicar que la operación falló
    }
}

