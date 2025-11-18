import * as service from "../services/resources.service.js";    // Importo todas las funciones del service


/// ************************************************ RUTAS GET ************************************************

export const getAllResources = async (req, res) =>
{
    try {
        const resources = await service.getAllResources();
        res.json(resources);
    } catch (err) {
        console.error("Controller error:", err);
        res.status(500).json({ error: "500. Error al obtener Recursos" });
    }
}

export const searchResource = async (req, res) => 
{
    const { title } = req.query;   // req.query Se usa para acceder a valores en la URL después del signo de interrogación (?)   
    
    if (!title || typeof title !== 'string' || title.trim() === '')
    {
        return res.status(400).json({ error: "400. Falta el parámetro 'title' en la query" });
    }
    
    try
    {
        const filteredResources = await service.searchResource(title);     
        
        if(filteredResources.length === 0)
        {
            return res.status(404).json({error: '404. Recurso no encontrado'});
        }
        
        return res.json(filteredResources);

    }
    catch(error)
    {
        console.error('searchResource error:', error);
        return res.status(500).json({error: '500. Error interno al buscar Recursos'});
    }

};

export const getResourceById = async (req, res) => {
    
    const { id } = req.params;    // desestructuración de objetos.Extraemos el parámetro dinámico 'id' desde la URL
    const resource = await service.getResourceById(id);   // Busca un Recurso por su id en la URL.

    if(!resource)
    {
        return res.status(404).json({error: "404. Recurso no encontrado"});    // Si no lo encuentra, responde con un error 404.
    }
    
    res.json(resource);  // Si existe, lo devolvemos
};






/// ************************************************ RUTAS POST ************************************************


export const createNewResource = async (req, res) =>
{
    const {valid, errors} = service.validateResourceData(req.body);
    
    if(!valid)
    {
        return res.status(400).json({error: errors});  // Devuelvo un error 400 con los mensajes de error
    }
    
    const {title, type, content} = req.body;   // req.body contiene los datos enviados por el cliente.
    
    try
    {
        const newResource = await service.createNewResource({title, type, content});     // guardamos el nuevo recurso que retornó la función para mostrarlo

        res.status(201).json({codigo: '201. Recurso creado con exito', recurso: newResource});    // Además muestra el recurso creado
    }
    catch(error)
    {
        console.error('createNewResource error:', error);   // Muestra el error en consola para depuración
        
        return res.status(500).json({error: '500. Error interno al crear un nuevo Recurso'});
    }
    
}; 



/// ************************************************ RUTAS PUT ************************************************


export const updateResource = async (req, res) =>  // Ruta para modificar el Recurso
{
    const {id} = req.params;               // Obtengo el id del Recurso a modificar
    const resourceData = req.body;   // req.body contiene los datos enviados por el cliente.
    const {valid, errors} = service.validateResourceData(resourceData);
    
    if(!id) // Valida que haya un id valido, o que no sea undefined o null
    {
        return res.status(400).json({error: '400. Se requiere el id del Recurso en la ruta'});
    }

    if(!valid)
    {
        return res.status(400).json({error: errors});  // Devuelvo un error 404 con los mensajes de error
    }
    
    try
    {
        const updatedResource = await service.updateResource(id, resourceData);

        if(!updatedResource) // Si no existe el Recurso, devuelve 404
        {
            return res.status(404).json({error: '404. Recurso No encontrado'});
        }

        return res.status(200).json({mensaje: 'Recurso modificado exitosamente', recursoModificado: updatedResource}) // Si se actualizó correctamente, devuelve el Recurso actualizado
    }
    catch(error)   // manejo de errores inesperados
    {
        console.error('updateResource error: ', error);

        return res.status(500).json({error: '500. Error interno al actualizar el Recurso'});
    }

};



/// ************************************************ RUTAS DELETE ************************************************


export const deleteResource = async (req, res) =>   // Ruta para eliminar el Recurso
{
    const {id} = req.params;

    try
    {
        const deletedResource = await service.deleteResource(id);

        if(!deletedResource)
        {
            return res.status(404).json({error: '404. Recurso no encontrado'});
        }

        return res.status(200).json({mensaje: 'Recurso eliminado exitosamente', recursoEliminado: deletedResource});
    }
    catch(error)    // para errores inesperados durante ejecución
    {
        console.error('deleteResource error:', error);
        return res.status(500).json({error: 'Error interno al eliminar el Recurso'});
    }
};