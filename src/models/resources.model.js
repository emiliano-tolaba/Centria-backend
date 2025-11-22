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


const resourcesCollection = collection(db, "resources");        // Referencia a la colección "resources" en Firestore

// Obtiene todos los recursos desde Firestore.
export const getAllResources = async () =>
{
    try
    {
        // Obtengo todos los documentos de la colección.
        const snapshot = await getDocs(resourcesCollection); // snapshot es como una "foto" del estado actual
                
        return snapshot.docs.map((doc) =>   // Mapeo cada doc a un objeto con id y sus datos.
        {
            const data = doc.data();
            return{
                id: doc.id,
                title: data.title || "Sin título",
                type: data.type || "Desconocido",
                content: data.content || "Sin contenido"
            }
        });

    }
    catch (error)          // Si hay error lo muestro en consola y retorno un array vacío para no romper la app.
    {    
        
        console.error('getAllResources error:', error);
        
        return []; // retorno defensivo en caso de error
    }
}

// Obtiene un solo recurso desde Firestore, para evitar traer toda la lista.
export const getResourceById = async (id) => {
    try
    {
        const resourceRef = doc(resourcesCollection, id);   // Construyo la referencia al documento dentro de la colección
        const snapshot = await getDoc(resourceRef);         // Obtengo el snapshot del documento

        if (!snapshot.exists()) return null;                // Si no existe retorna null

        const data = snapshot.data();

        return {
            id: snapshot.id,
            title: data.title || "Sin título",
            type: data.type || "Desconocido",
            content: data.content || "Sin contenido"
        };

    }
    catch (error)
    {
        console.error("getResourceById error:", error);
        
        return null;
    }
};

// Función asincrónica que crea un nuevo Recurso en Firestore
export const createNewResource = async (data) => { // "data" contiene los campos del Recurso (title, type, content, etc.) a guardar
    try
    {
        // INSERCIÓN EN FIRESTORE
        // Firestore genera automáticamente un ID único para este documento
        const docRef = await addDoc(resourcesCollection, data); // Espero a que se complete la operacion, obteniendo una referencia al nuevo documento

        // RESPUESTA AL CONTROLADOR
        // Devuelvo un objeto con el ID asignado y los datos que se guardaron
        return {
            id: docRef.id,                       // el ID del docReference generado por Firestore
            title: data.title || "Sin título",   // si no viene, usa valor por defecto
            type: data.type || "Desconocido",
            content: data.content || "Sin contenido"
        };
        
    } 
    catch (error)
    {
        console.error('createNewResource error:', error); // Log del error en consola para depuración
        
        throw new Error('Error al crear el Recurso en la base de datos'); // Re-lanzo el error para que el controlador (controller) lo capture y devuelva un 500
    }
}

export const updateResource = async (id, resourceData) => 
{
    try
    {
        // Referencia tentativa por doc id
        let resourceRef = doc(resourcesCollection, id); // doc es una función de Firestore que crea una referencia a un documento específico dentro de una colección. 
                                                    // La referencia se basa en el ID del documento proporcionado y la colección a la que pertenece. Pero aun no 
                                                    // obtenemos el snapshot o los datos del doc.
        let snapshot = await getDoc(resourceRef); // getDoc obtiene el snapshot (estado) del documento referenciado. Es un objeto que contiene los datos y 
                                                // metadatos (.exists(), .id) del documento en Firestore.

        // Si no existe un doc con ese doc.id, pasa a intentar otra estrategia de busqueda: por campo 'id' dentro de los datos de los documentos, NO en el doc.id (referencia)

        if (!snapshot.exists()) {
        console.warn(`Model -> updateResource: no existe doc con doc.id='${id}', buscando por campo 'id' en documentos...`);

        // Tomo todos los docs 
        const allSnapshot = await getDocs(resourcesCollection);

        // Busco un documento cuyo campo 'id' coincida (uso el operador "=="" para cubrir número vs string (por ejemplo "3" vs 3))

        const found = allSnapshot.docs.find(d => { // cada elemento d representa un documento de Firestore.
                const data = d.data();               // d.data() devuelve un objeto con los datos del documento
                // Comparo tanto string como número
                return data?.id == id || data?.id == Number(id); // Usa encadenamiento opcional (?.) para evitar errores si data es undefined o null.
                                                                // Si data existe, devuelve su propiedad id. Si data NO existe, devuelve undefined sin lanzar error
                                                                // Es una forma segura de acceder a propiedades.
                // Primero compara si data.id es igual a id tal cual viene.
                // Si eso no da true, intenta convertir el id a número (Number(id)) y vuelve a comparar.
                // En otras palabras:
                // “Considerá que el documento coincide si su id es igual al id recibido ya sea como string o como número.”
        });


        if (!found) { 
            console.warn(`Model -> updateResource: no se encontró documento con campo 'id' == ${id}`);
            return false; // indicar al controller que no existe
        }

        // Si lo encontré, actualizo resourceRef y snapshot para seguir el flujo
        // o sea crea una nueva referencia usando el found.id real (el ID interno del documento).
        // recupera el snapshot de ese documento correcto.

        resourceRef = doc(resourcesCollection, found.id);
        snapshot = await getDoc(resourceRef);
        console.log(`Model -> updateResource: document encontrado por campo 'id' -> doc.id='${found.id}'`);
        }

        // Ahora actualizamos (updateDoc actualiza solo campos provistos en resourceData). NO reemplaza todo el documento.
        // updateDoc es el equivalente al UPDATE en SQL

        await updateDoc(resourceRef, resourceData);

        // Obtener el documento actualizado para devolverlo (con doc.id correcto)
        // Vuelve a leer el documento actualizado para confirmar los nuevos valores.
        // Combina el ID interno (updateSnapshot.id) con los datos (updatedSnaphot.data())

        const updatedSnapshot = await getDoc(resourceRef); // getDoc obtiene el snapshot (estado) del documento referenciado.
        const updatedData = { id: updatedSnapshot.id, ...updatedSnapshot.data() };

        console.log("Model -> updateResource: Recurso actualizado correctamente:", updatedData);
        return updatedData;
    }
    catch (error)
    {
        console.error("Model -> updateResource error:", error);
        return null;
    }
}


export const deleteResource = async (id) =>
{
    try
    {
        const resourceReference = doc(resourcesCollection, id);     // referencia al documento
        const snapshot = await getDoc(resourceReference);           

        if(!snapshot.exists())  // si no existe el Recurso retorno false
        {
            return false;
        }

        await deleteDoc(resourceReference); // Si existe lo elimino

        return snapshot.data();     // Retorno los datos del Recurso eliminado
    }
    catch(error)    // Log en caso de error y retorno false para indicar el fallo
    {
        console.error('deletedResource error:', error);

        return false;
    }
}

