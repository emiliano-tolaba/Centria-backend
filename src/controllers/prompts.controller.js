import * as service from '../services/prompts.service.js';        // Importo todas las funciones del service


/// ************************************************ RUTAS GET ************************************************



// Controller: obtiene todos los Prompts desde el servicio.
export const getAllPrompts = async (req, res) =>
{
    try
    {
        const prompts = await service.getAllPrompts();      // Llamamos al servicio que encapsula la lógica de acceso a datos.
        res.json(prompts);                                // Respondemos con la lista de prompts en formato JSON.
    }
    catch(error)
    {
        console.error("Controller error:", error);      // Log interno para depuración: muestra el error en consola.
        res.status(500).json({ error: "500. Error al obtener Prompts" });  // Respuesta al cliente: error genérico 500 (Internal Server Error).
    }
}


// Controller: busca Prompts filtrando por Category.
export const filterPromptsByCategory = async (req, res) => 
{
    const { category } = req.query;   // req.query Se usa para acceder a valores en la URL después del signo de interrogación (?)   
    
    if (!category || typeof category !== 'string' || category.trim() === '')    // Validación: aseguramos que 'category' exista, sea string y no esté vacío.
    {
        return res.status(400).json({ error: "400. Falta el parámetro 'category' en la query" });
    }
    
    try
    {
        const filteredPrompts = await service.filterPromptsByCategory(category);    // Llamamos al servicio para buscar prompts que coincidan con el Category.
        
        if(filteredPrompts.length === 0)                                 // Si no se encuentra ningún prompt, devolvemos un 404.
        {
            return res.status(404).json({error: `404. No se encontraron Prompts con la categoría ${category}`});
        }
        
        return res.json(filteredPrompts);                                 // Si hay resultados, respondemos con la lista filtrada.

    }
    catch(error)
    {
        console.error('filterPromptsByCategory error:', error);                // Log interno para depuración.
        return res.status(500).json({error: '500. Error interno al buscar Prompts'});   // Respuesta al cliente: error genérico 500.
    }

};


// Controller: obtiene un prompt específico por su ID.
export const getPromptById = async (req, res) => {
    
    const { id } = req.params;                      // Extraemos el parámetro 'id' desde la URL usando desestructuración.
    const prompt = await service.getPromptById(id);     // Llamamos al servicio para buscar el prompt por su ID.

    if(!prompt)         // Si no existe el prompt, devolvemos un 404.
    {
        return res.status(404).json({error: "404. Prompt no encontrado"});    
    }
    
    res.json(prompt);   // Si existe, respondemos con el objeto prompt en formato JSON.
};





/// ************************************************ RUTAS POST ************************************************

// Controller: crea de un nuevo prompt
export const createNewPrompt = async (req, res) =>
{
    const {valid, errors} = service.validatePromptData(req.body);     // Validamos los datos recibidos en el body de la request
    
    if(!valid)
    {
        return res.status(400).json({error: errors});  // Si la validación falla, devolvemos un error 400 con los mensajes correspondientes
    }
    
    const {text, category} = req.body;       // Extraemos los campos necesarios del body
    
    try
    {
        const newPrompt = await service.createNewPrompt({text, category});     // Llamamos al servicio para crear el nuevo prompt en Firestore

        res.status(201).json({codigo: '201. Prompt creado con exito', prompt: newPrompt});    // Si todo sale bien, devolvemos un 201 con el prompt creado
    }
    catch(error)
    {
        console.error('createNewPrompt error:', error);   // Si ocurre un error inesperado, lo mostramos en consola y devolvemos un 500
        
        return res.status(500).json({error: '500. Error interno al crear un nuevo Prompt'});
    }
    
}; 



/// ************************************************ RUTAS PUT ************************************************

// Controller encargado de manejar la actualización de un Prompt existente
export const updatePrompt = async (req, res) =>  
{
    const {id} = req.params;                // Extraemos el id del prompt desde los parámetros de la ruta (ej: /prompts/:id)
    const newData = req.body;              // Extraemos los datos enviados por el cliente en el body de la request
    const {valid, errors} = service.validatePromptData(newData);     // Validamos los datos recibidos usando la función de servicio
    
    
    if(!id) // Valida que haya un id valido, o que no sea undefined o null
    {
        return res.status(400).json({error: '400. Se requiere el id del Prompt en la ruta'});  // Si no se envió un id válido en la ruta, devolvemos un error 400 (Bad Request)
    }

    if(!valid)  // valid = true si los datos son correctos, errors = array con mensajes de error
    {
        return res.status(400).json({error: errors});  // Devuelvo un error 400 con los mensajes de error
    }
    
    try
    {
        const updatedPrompt = await service.updatePrompt(id, newData); // Llamamos al servicio para actualizar el prompt en la base de datos

        if(!updatedPrompt) // Si el servicio devuelve false/null, significa que el prompt no existe → devolvemos 404
        {
            return res.status(404).json({error: '404. Prompt No encontrado'});
        }

        return res.status(200).json({mensaje: 'Prompt modificado exitosamente', promptModificado: updatedPrompt}) // Si todo salió bien, devolvemos un 200 con un mensaje y el prompt actualizado
    }
    catch(error)   // Si ocurre un error inesperado, lo mostramos en consola y devolvemos un 500
    {
        console.error('updatePrompt error: ', error);

        return res.status(500).json({error: '500. Error interno al actualizar el Prompt'});
    }

};



/// ************************************************ RUTAS DELETE ************************************************

// Controller encargado de manejar la eliminación de un Prompt existente
export const deletePrompt = async (req, res) =>   // Ruta para eliminar el Prompt
{
    const {id} = req.params;        // Extraemos el id del prompt desde los parámetros de la ruta 

    try
    {
        const deletedPrompt = await service.deletePrompt(id);       // Llamamos al servicio para eliminar el prompt con el id recibido

        if(!deletedPrompt)        // Si el servicio devuelve false/null, significa que el prompt no existe → devolvemos 404
        {
            return res.status(404).json({error: '404. Prompt no encontrado'}); // Si todo salió bien, devolvemos un 200 con un mensaje y el prompt eliminado
        }

        return res.status(200).json({mensaje: 'Prompt eliminado exitosamente', promptEliminado: deletedPrompt});
    }
    catch(error)    // para errores inesperados durante ejecución
    {
        console.error('deletePrompt error:', error);  // Si ocurre un error inesperado durante la ejecución, lo mostramos en consola

        return res.status(500).json({error: 'Error interno al eliminar el Prompt'});   // Devolvemos un 500 (Internal Server Error) como respuesta al cliente
    }
};

