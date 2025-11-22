import * as service from '../services/todos.service.js';        // Importo todas las funciones del service


/// ************************************************ RUTAS GET ************************************************



// Controller: obtiene todos los Todos desde el servicio.
export const getAllTodos = async (req, res) =>
{
    try
    {
        const { userId } = req.params;
        const todos = await service.getAllTodos(userId);      // Llamamos al servicio que encapsula la lógica de acceso a datos.
        
        return res.status(200).json(todos); // devolvemos el array de tareas
    }
    catch(error)
    {
        console.error("Controller error:", error);      // Log interno para depuración: muestra el error en consola.

        return res.status(500).json({ error: "500. Error al obtener las tareas" });  // Respuesta al cliente: error genérico 500 (Internal Server Error).
    }
}


// Controller: busca Todos filtrando por Category.
export const searchTodosByTask = async (req, res) => 
{
    const { userId } = req.params;
    const { task } = req.query;   // req.query Se usa para acceder a valores en la URL después del signo de interrogación (?)   
    
    if (!task || typeof task !== 'string' || task.trim() === '')    // Validación: aseguramos que 'task' exista, sea string y no esté vacío.
    {
        return res.status(400).json({ error: "400. Falta el parámetro 'task' en la query" });
    }
    
    try
    {
        const filteredTodos = await service.searchTodosByTask(userId, task);    // Llamamos al servicio para buscar todos que coincidan con el Category.
        
        if(filteredTodos.length === 0)                                 // Si no se encuentra ningún todo, devolvemos un 404.
        {
            return res.status(404).json({error: `404. No se encontraron Tareas con la categoría ${task}`});
        }
        
        return res.json(filteredTodos);                                 // Si hay resultados, respondemos con la lista filtrada.

    }
    catch(error)
    {
        console.error('filterTodosByCategory error:', error);                // Log interno para depuración.
        return res.status(500).json({error: '500. Error interno al buscar Tareas'});   // Respuesta al cliente: error genérico 500.
    }

};


// Controller: obtiene un todo específico por su ID.
export const getTodoById = async (req, res) => {
    
    const { userId, todoId } = req.params;                      // Extraemos el parámetro 'id' desde la URL usando desestructuración.
    const todo = await service.getTodoById(userId, todoId);     // Llamamos al servicio para buscar el todo por su ID.

    if(!todo)         // Si no existe el todo, devolvemos un 404.
    {
        return res.status(404).json({error: "404. Tarea no encontrada"});    
    }
    
    res.json(todo);   // Si existe, respondemos con el objeto todo en formato JSON.
};





/// ************************************************ RUTAS POST ************************************************

// Controller: crea de un nuevo todo
export const createNewTodo = async (req, res) =>
{
    const {valid, errors, normalizedData} = service.validateTodoData(req.body);     // Validamos los datos recibidos en el body de la request
    
    if(!valid)
    {
        return res.status(400).json({error: errors});  // Si la validación falla, devolvemos un error 400 con los mensajes correspondientes
    }
    
    const { userId } = req.params;              // Extraemos el userId de los parámetros de la URL
    
    try
    {
        const newTodo = await service.createNewTodo(userId, normalizedData);     // Llamamos al servicio para crear el nuevo todo en Firestore

        res.status(201).json({codigo: '201. Tarea creada con exito', todo: newTodo});    // Si todo sale bien, devolvemos un 201 con el todo creado
    }
    catch(error)
    {
        console.error('createNewTodo error:', error);   // Si ocurre un error inesperado, lo mostramos en consola y devolvemos un 500
        
        return res.status(500).json({error: '500. Error interno al crear una nueva Tarea'});
    }
    
}; 



/// ************************************************ RUTAS PUT ************************************************

// Controller encargado de manejar la actualización de un Todo existente
export const updateTodo = async (req, res) =>  
{
    const {userId, todoId} = req.params;                // Extraemos el id del todo desde los parámetros de la ruta (ej: /todos/:id)
    const newData = req.body;              // Extraemos los datos enviados por el cliente en el body de la request
    const {valid, errors} = service.validateTodoData(newData);     // Validamos los datos recibidos usando la función de servicio
    
    
    if(!todoId) // Valida que haya un id valido, o que no sea undefined o null
    {
        return res.status(400).json({error: '400. Se requiere el id de la Tarea en la ruta'});  // Si no se envió un id válido en la ruta, devolvemos un error 400 (Bad Request)
    }

    if(!valid)  // valid = true si los datos son correctos, errors = array con mensajes de error
    {
        return res.status(400).json({error: errors});  // Devuelvo un error 400 con los mensajes de error
    }
    
    try
    {
        const updatedTodo = await service.updateTodo(userId, todoId, newData); // Llamamos al servicio para actualizar el todo en la base de datos

        if(!updatedTodo) // Si el servicio devuelve false/null, significa que el todo no existe → devolvemos 404
        {
            return res.status(404).json({error: '404. Tarea no encontrada'});
        }

        return res.status(200).json({mensaje: 'Tarea modificado exitosamente', todoModificado: updatedTodo}) // Si todo salió bien, devolvemos un 200 con un mensaje y el todo actualizado
    }
    catch(error)   // Si ocurre un error inesperado, lo mostramos en consola y devolvemos un 500
    {
        console.error('updateTodo error: ', error);

        return res.status(500).json({error: '500. Error interno al actualizar la Tarea'});
    }

};



/// ************************************************ RUTAS DELETE ************************************************

// Controller encargado de manejar la eliminación de un Todo existente
export const deleteTodo = async (req, res) =>   // Ruta para eliminar el Todo
{
    const { userId, todoId} = req.params;        // Extraemos el id del todo desde los parámetros de la ruta 

    try
    {
        const deletedTodo = await service.deleteTodo(userId, todoId);       // Llamamos al servicio para eliminar el todo con el id recibido

        if(!deletedTodo)        // Si el servicio devuelve false/null, significa que el todo no existe → devolvemos 404
        {
            return res.status(404).json({error: '404. Tarea no encontrada'}); // Si todo salió bien, devolvemos un 200 con un mensaje y el todo eliminado
        }

        return res.status(200).json({mensaje: 'Tarea eliminada exitosamente', todoEliminado: deletedTodo});
    }
    catch(error)    // para errores inesperados durante ejecución
    {
        console.error('deleteTodo error:', error);  // Si ocurre un error inesperado durante la ejecución, lo mostramos en consola

        return res.status(500).json({error: 'Error interno al eliminar la Tarea'});   // Devolvemos un 500 (Internal Server Error) como respuesta al cliente
    }
};

