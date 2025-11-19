import * as service from '../services/users.service.js';        // Importo todas las funciones del service


/// ************************************************ RUTAS GET ************************************************



// Controller: obtiene todos los Usuarios desde el servicio.
export const getAllUsers = async (req, res) =>
{
    try
    {
        const users = await service.getAllUsers();      // Llamamos al servicio que encapsula la lógica de acceso a datos.
        res.json(users);                                // Respondemos con la lista de usuarios en formato JSON.
    }
    catch(error)
    {
        console.error("Controller error:", error);      // Log interno para depuración: muestra el error en consola.
        res.status(500).json({ error: "500. Error al obtener Usuarios" });  // Respuesta al cliente: error genérico 500 (Internal Server Error).
    }
}


// Controller: busca Usuarios filtrando por nombre.
export const searchUserByName = async (req, res) => 
{
    const { name } = req.query;   // req.query Se usa para acceder a valores en la URL después del signo de interrogación (?)   
    
    if (!name || typeof name !== 'string' || name.trim() === '')    // Validación: aseguramos que 'name' exista, sea string y no esté vacío.
    {
        return res.status(400).json({ error: "400. Falta el parámetro 'name' en la query" });
    }
    
    try
    {
        const filteredUsers = await service.searchUserByName(name);    // Llamamos al servicio para buscar usuarios que coincidan con el nombre.
        
        if(filteredUsers.length === 0)                                 // Si no se encuentra ningún usuario, devolvemos un 404.
        {
            return res.status(404).json({error: '404. Usuario no encontrado'});
        }
        
        return res.json(filteredUsers);                                 // Si hay resultados, respondemos con la lista filtrada.

    }
    catch(error)
    {
        console.error('searchUserByName error:', error);                // Log interno para depuración.
        return res.status(500).json({error: '500. Error interno al buscar Usuarios'});   // Respuesta al cliente: error genérico 500.
    }

};


// Controller: obtiene un usuario específico por su ID.
export const getUserById = async (req, res) => {
    
    const { id } = req.params;                      // Extraemos el parámetro 'id' desde la URL usando desestructuración.
    const user = await service.getUserById(id);     // Llamamos al servicio para buscar el usuario por su ID.

    if(!user)         // Si no existe el usuario, devolvemos un 404.
    {
        return res.status(404).json({error: "404. Usuario no encontrado"});    
    }
    
    res.json(user);   // Si existe, respondemos con el objeto usuario en formato JSON.
};





/// ************************************************ RUTAS POST ************************************************

// Controller: crea de un nuevo usuario
export const createNewUser = async (req, res) =>
{
    const {valid, errors} = service.validateUserData(req.body);     // Validamos los datos recibidos en el body de la request
    
    if(!valid)
    {
        return res.status(400).json({error: errors});  // Si la validación falla, devolvemos un error 400 con los mensajes correspondientes
    }
    
    const {name, email} = req.body;       // Extraemos los campos necesarios del body
    
    try
    {
        const newUser = await service.createNewUser({name, email});     // Llamamos al servicio para crear el nuevo usuario en Firestore

        res.status(201).json({codigo: '201. Usuario creado con exito', user: newUser});    // Si todo sale bien, devolvemos un 201 con el usuario creado
    }
    catch(error)
    {
        console.error('createNewUser error:', error);   // Si ocurre un error inesperado, lo mostramos en consola y devolvemos un 500
        
        return res.status(500).json({error: '500. Error interno al crear un nuevo Usuario'});
    }
    
}; 



/// ************************************************ RUTAS PUT ************************************************

// Controller encargado de manejar la actualización de un Usuario existente
export const updateUser = async (req, res) =>  
{
    const {id} = req.params;                // Extraemos el id del usuario desde los parámetros de la ruta (ej: /users/:id)
    const userData = req.body;              // Extraemos los datos enviados por el cliente en el body de la request
    const {valid, errors} = service.validateUserData(userData);     // Validamos los datos recibidos usando la función de servicio
    
    
    if(!id) // Valida que haya un id valido, o que no sea undefined o null
    {
        return res.status(400).json({error: '400. Se requiere el id del Usuario en la ruta'});  // Si no se envió un id válido en la ruta, devolvemos un error 400 (Bad Request)
    }

    if(!valid)  // valid = true si los datos son correctos, errors = array con mensajes de error
    {
        return res.status(400).json({error: errors});  // Devuelvo un error 400 con los mensajes de error
    }
    
    try
    {
        const updatedUser = await service.updateUser(id, userData); // Llamamos al servicio para actualizar el usuario en la base de datos

        if(!updatedUser) // Si el servicio devuelve false/null, significa que el usuario no existe → devolvemos 404
        {
            return res.status(404).json({error: '404. Usuario No encontrado'});
        }

        return res.status(200).json({mensaje: 'Usuario modificado exitosamente', usuarioModificado: updatedUser}) // Si todo salió bien, devolvemos un 200 con un mensaje y el usuario actualizado
    }
    catch(error)   // Si ocurre un error inesperado, lo mostramos en consola y devolvemos un 500
    {
        console.error('updateUser error: ', error);

        return res.status(500).json({error: '500. Error interno al actualizar el Usuario'});
    }

};



/// ************************************************ RUTAS DELETE ************************************************

// Controller encargado de manejar la eliminación de un Usuario existente
export const deleteUser = async (req, res) =>   // Ruta para eliminar el Usuario
{
    const {id} = req.params;        // Extraemos el id del usuario desde los parámetros de la ruta 

    try
    {
        const deletedUser = await service.deleteUser(id);       // Llamamos al servicio para eliminar el usuario con el id recibido

        if(!deletedUser)        // Si el servicio devuelve false/null, significa que el usuario no existe → devolvemos 404
        {
            return res.status(404).json({error: '404. Usuario no encontrado'}); // Si todo salió bien, devolvemos un 200 con un mensaje y el usuario eliminado
        }

        return res.status(200).json({mensaje: 'Usuario eliminado exitosamente', usuarioEliminado: deletedUser});
    }
    catch(error)    // para errores inesperados durante ejecución
    {
        console.error('deleteUser error:', error);  // Si ocurre un error inesperado durante la ejecución, lo mostramos en consola

        return res.status(500).json({error: 'Error interno al eliminar el Usuario'});   // Devolvemos un 500 (Internal Server Error) como respuesta al cliente
    }
};

