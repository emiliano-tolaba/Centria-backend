import * as model from '../models/users.model.js';      // Importo todas las funciones del model

// Service: obtiene todos los usuarios
export const getAllUsers = async () =>
{
    return await model.getAllUsers();     // Simplemente delega la llamada al modelo.
    // El controlador recibirá la lista completa de usuarios.
}


// Service: busca usuarios filtrando por nombre
export const searchUserByName = async (name) =>
{
    const users = await model.getAllUsers();    // Primero obtenemos todos los usuarios desde el modelo.

    // Luego filtramos en memoria aquellos cuyo campo "name" contenga el texto buscado.
    // Usamos toLowerCase() para hacer la búsqueda case-insensitive.
    return users.filter((user) =>
    {
        return user.name.toLowerCase().includes(name.toLowerCase()); // Devuelve los usuarios que contengan en su "name" el texto buscado.
    });  
}


// Service: obtiene un usuario específico por su ID
export const getUserById = async (id) =>
{
    return await model.getUserById(id); // Delegamos la búsqueda al modelo, que accede directamente a la base de datos.
};

// Service: valida la data recibida en el body
export const validateUserData = (data) =>
{
    const errors = [];  // Creo un array para guardar los errores encontrados

    if(!data)
    {
        return { valid: false, errors: ["No se proporcionó datos del Usuario"] }
    }

    if (!data.name || typeof data.name !== 'string' || data.name.trim() === '')
    {
        errors.push("No se proporcionó datos del nombre"); // Agrega un mensaje de error si el name está vacio        
    }

    if (!data.email || typeof data.email !== 'string' || data.email.trim() === '')
    {
        errors.push("No se proporcionó datos del email"); // Agrega un mensaje de error si el email está vacio        
    }

    // Devuelve un objeto con:
    // valid: true si no hay errores
    // errors: lista de errores encontrados (vacía si es válido)
    return {valid: errors.length === 0, errors};
}

// Service: crea un nuevo usuario
export const createNewUser = async (data) =>
{
    return await model.createNewUser(data);     // delega la llamada al model. El controlador recibirá el Usuario creado.
}   


// Service: modifica un usuario existente
export const updateUser = async (id, userData) =>
{
    return await model.updateUser(id, userData);        // delega la llamada al model. El controlador recibirá el Usuario actualizado.
}


// Service: elimina un usuario
export const deleteUser = async (id) =>
{
    return await model.deleteUser(id);                  // delega la llamada al model. El controlador recibirá el Usuario eliminado.
} 

