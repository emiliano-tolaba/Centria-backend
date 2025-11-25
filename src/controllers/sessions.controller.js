import * as service from '../services/sessions.service.js';        // Importo todas las funciones del service


/// ************************************************ RUTAS GET ************************************************



// Controller: obtiene sessions los Sessions desde el servicio.
export const getAllSessions = async (req, res) =>
{
    try
    {
        const { userId } = req.params;      // Extraemos userId de la ruta (/users/:userId/sessions)

        if(req.user.id !== userId)       // Validación de autorización: el userId de la ruta debe coincidir con el del token
        {
            return res.status(403).json({error: '403. No tenés permiso para acceder a estos datos'});
        }

        const sessions = await service.getAllSessions(userId);      // Llamamos al servicio que encapsula la lógica de acceso a datos.
        
        return res.status(200).json(sessions); // devolvemos el array de Sesiones
    }
    catch(error)
    {
        console.error("getAllSessions error:", error);      // Log interno para depuración: muestra el error en consola.

        return res.status(500).json({ error: "500. Error al obtener las Sesiones" });  // Respuesta al cliente: error genérico 500 (Internal Server Error).
    }
}


// Controller: busca Sessions por el campo Tag.
export const searchSessionsByTag = async (req, res) => 
{
    const { userId } = req.params;  // Extraemos userId (/users/:userId/sessions)
    const { tag } = req.query;      // req.query Se usa para acceder a valores en la URL después del signo de interrogación (?)   
    
    if(req.user.id !== userId)       // Validación de autorización: el userId de la ruta debe coincidir con el del token
    {
        return res.status(403).json({error: '403. No tenés permiso para acceder a estos datos'});
    }

    if (!tag || typeof tag !== 'string' || tag.trim() === '')    // Validación: aseguramos que 'tag' exista, sea string y no esté vacío.
    {
        return res.status(400).json({ error: "400. Falta el parámetro 'tag' en la query" });
    }
    
    try
    {
        const filteredSessions = await service.searchSessionsByTag(userId, tag);    // Llamamos al servicio para buscar sessions que coincidan con el Tag
        
        if(filteredSessions.length === 0)                                 // Si no se encuentra ningún session, devolvemos un 404.
        {
            return res.status(404).json({error: `404. No se encontraron Sesiones con la categoría ${tag}`});
        }
        
        return res.json(filteredSessions);                                 // Si hay resultados, respondemos con la lista filtrada.

    }
    catch(error)
    {
        console.error('filterSessionsByCategory error:', error);                // Log interno para depuración.
        return res.status(500).json({error: '500. Error interno al buscar Sesiones'});   // Respuesta al cliente: error genérico 500.
    }

};


// Controller: obtiene un session específico por su ID.
export const getSessionById = async (req, res) => {
    
    const { userId, sessionId } = req.params;                      // Extraemos userId y sessionId de la ruta (/users/:userId/sessions/:sessionId)

    if(req.user.id !== userId)       // Validación de autorización: el userId de la ruta debe coincidir con el del token
    {
        return res.status(403).json({error: '403. No tenés permiso para acceder a estos datos'});
    }

    const session = await service.getSessionById(userId, sessionId);     // Llamamos al servicio para buscar el session por su ID.

    if(!session)         // Si no existe el session, devolvemos un 404.
    {
        return res.status(404).json({error: "404. Sesión no encontrada"});    
    }
    
    res.json(session);   // Si existe, respondemos con el objeto session en formato JSON.
};





/// ************************************************ RUTAS POST ************************************************

// Controller: crea una nueva sesion
export const createNewSession = async (req, res) =>
{
    const { userId } = req.params;              // Extraemos userId de la ruta (/users/:userId/sessions/:sessionId)

    if(req.user.id !== userId)       // Validación de autorización: el userId de la ruta debe coincidir con el del token
    {
        return res.status(403).json({error: '403. No tenés permiso para acceder a estos datos'});
    }

    const {valid, errors, normalizedData} = service.validateSessionData(req.body);     // Validamos los datos recibidos en el body de la request
    
    if(!valid)
    {
        return res.status(400).json({error: errors});  // Si la validación falla, devolvemos un error 400 con los mensajes correspondientes
    }
    
    try
    {
        const newSession = await service.createNewSession(userId, normalizedData);     // Llamamos al servicio para crear el nuevo session en Firestore

        res.status(201).json({codigo: '201. Sesión creada con exito', session: newSession});    // Si session sale bien, devolvemos un 201 con el session creado
    }
    catch(error)
    {
        console.error('createNewSession error:', error);   // Si ocurre un error inesperado, lo mostramos en consola y devolvemos un 500
        
        return res.status(500).json({error: '500. Error interno al crear una nueva Sesión'});
    }
    
}; 



/// ************************************************ RUTAS PUT ************************************************

// Controller encargado de manejar la actualización de un Session existente
export const updateSession = async (req, res) =>  
{
    const {userId, sessionId} = req.params;                // Extraemos userId y sessionId de la ruta (/users/:userId/sessions/:sessionId)
    const newData = req.body;              // Extraemos los datos enviados por el cliente en el body de la request

    if(req.user.id !== userId)       // Validación de autorización: el userId de la ruta debe coincidir con el del token
    {
        return res.status(403).json({error: '403. No tenés permiso para acceder a estos datos'});
    }

    if(!sessionId) // Valida que haya un id valido, o que no sea undefined o null
    {
        return res.status(400).json({error: '400. Se requiere el id de la Sesión en la ruta'});  // Si no se envió un id válido en la ruta, devolvemos un error 400 (Bad Request)
    }

    const {valid, errors, validatedData} = service.validateSessionData(newData);     // Validamos los datos recibidos usando la función de servicio
    
    if(!valid)  // valid = true si los datos son correctos, errors = array con mensajes de error
    {
        return res.status(400).json({error: errors});  // Devuelvo un error 400 con los mensajes de error
    }
    
    try
    {
        const updatedSession = await service.updateSession(userId, sessionId, validatedData); // Llamamos al servicio para actualizar el session en la base de datos

        if(!updatedSession) // Si el servicio devuelve false/null, significa que el session no existe → devolvemos 404
        {
            return res.status(404).json({error: '404. Sesión no encontrada'});
        }

        return res.status(200).json({mensaje: 'Sesión modificada exitosamente', sessionModificado: updatedSession}) // Si session salió bien, devolvemos un 200 con un mensaje y el session actualizado
    }
    catch(error)   // Si ocurre un error inesperado, lo mostramos en consola y devolvemos un 500
    {
        console.error('updateSession error: ', error);

        return res.status(500).json({error: '500. Error interno al actualizar la Sesión'});
    }

};



/// ************************************************ RUTAS DELETE ************************************************

// Controller encargado de manejar la eliminación de un Session existente
export const deleteSession = async (req, res) =>   // Ruta para eliminar el Session
{
    const { userId, sessionId} = req.params;        // Extraemos userId y sessionId de la ruta (/users/:userId/sessions/:sessionId)
    
    if(req.user.id !== userId)       // Validación de autorización: el userId de la ruta debe coincidir con el del token
    {
        return res.status(403).json({error: '403. No tenés permiso para acceder a estos datos'});
    }

    try
    {
        const deletedSession = await service.deleteSession(userId, sessionId);       // Llamamos al servicio para eliminar el session con el id recibido

        if(!deletedSession)        // Si el servicio devuelve false/null, significa que el session no existe → devolvemos 404
        {
            return res.status(404).json({error: '404. Sesión no encontrada'}); // Si session salió bien, devolvemos un 200 con un mensaje y el session eliminado
        }

        return res.status(200).json({mensaje: 'Sesión eliminada exitosamente', sessionEliminado: deletedSession});
    }
    catch(error)    // para errores inesperados durante ejecución
    {
        console.error('deleteSession error:', error);  // Si ocurre un error inesperado durante la ejecución, lo mostramos en consola

        return res.status(500).json({error: 'Error interno al eliminar la Sesión'});   // Devolvemos un 500 (Internal Server Error) como respuesta al cliente
    }
};

