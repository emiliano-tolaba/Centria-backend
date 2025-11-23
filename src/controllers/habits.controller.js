import * as service from '../services/habits.service.js';        // Importo todas las funciones del service


/// ************************************************ RUTAS GET ************************************************



// Controller: obtiene habits los Habits desde el servicio.
export const getAllHabits = async (req, res) =>
{
    try
    {
        const { userId } = req.params;      // Extraemos userId de la ruta (/users/:userId/habits)

        if(req.user.id !== userId)       // Validación de autorización: el userId de la ruta debe coincidir con el del token
        {
            return res.status(403).json({error: '403. No tenés permiso para acceder a estos datos'});
        }

        const habits = await service.getAllHabits(userId);      // Llamamos al servicio que encapsula la lógica de acceso a datos.
        
        return res.status(200).json(habits); // devolvemos el array de Hábitos
    }
    catch(error)
    {
        console.error("Controller error:", error);      // Log interno para depuración: muestra el error en consola.

        return res.status(500).json({ error: "500. Error al obtener los Hábitos" });  // Respuesta al cliente: error genérico 500 (Internal Server Error).
    }
}


// Controller: busca Habits por el campo Name.
export const searchHabitsByName = async (req, res) => 
{
    const { userId } = req.params;  // Extraemos userId (/users/:userId/habits)
    const { name } = req.query;   // req.query Se usa para acceder a valores en la URL después del signo de interrogación (?)   
    
    if(req.user.id !== userId)       // Validación de autorización: el userId de la ruta debe coincidir con el del token
    {
        return res.status(403).json({error: '403. No tenés permiso para acceder a estos datos'});
    }

    if (!name || typeof name !== 'string' || name.trim() === '')    // Validación: aseguramos que 'name' exista, sea string y no esté vacío.
    {
        return res.status(400).json({ error: "400. Falta el parámetro 'name' en la query" });
    }
    
    try
    {
        const filteredHabits = await service.searchHabitsByName(userId, name);    // Llamamos al servicio para buscar habits que coincidan con el Name.
        
        if(filteredHabits.length === 0)                                 // Si no se encuentra ningún habit, devolvemos un 404.
        {
            return res.status(404).json({error: `404. No se encontraron Hábitos con la categoría ${name}`});
        }
        
        return res.json(filteredHabits);                                 // Si hay resultados, respondemos con la lista filtrada.

    }
    catch(error)
    {
        console.error('searchHabitsByName error:', error);                // Log interno para depuración.

        return res.status(500).json({error: '500. Error interno al buscar Hábitos'});   // Respuesta al cliente: error genérico 500.
    }

};


// Controller: obtiene un habit específico por su ID.
export const getHabitById = async (req, res) => {
    
    const { userId, habitId } = req.params;                      // Extraemos userId y habitId de la ruta (/users/:userId/habits/:habitId)

    if(req.user.id !== userId)       // Validación de autorización: el userId de la ruta debe coincidir con el del token
    {
        return res.status(403).json({error: '403. No tenés permiso para acceder a estos datos'});
    }

    const habit = await service.getHabitById(userId, habitId);     // Llamamos al servicio para buscar el habit por su ID.

    if(!habit)         // Si no existe el habit, devolvemos un 404.
    {
        return res.status(404).json({error: "404. Hábito no encontrado"});    
    }
    
    res.json(habit);   // Si existe, respondemos con el objeto habit en formato JSON.
};




/// ************************************************ RUTAS POST ************************************************

// Controller: crea de un nuevo habit
export const createNewHabit = async (req, res) =>
{
    const { userId } = req.params;              // Extraemos userId de la ruta (/users/:userId/habits/:habitId)

    if(req.user.id !== userId)       // Validación de autorización: el userId de la ruta debe coincidir con el del token
    {
        return res.status(403).json({error: '403. No tenés permiso para acceder a estos datos'});
    }

    const {valid, errors, validatedData} = service.validateHabitData(req.body);     // Validamos los datos recibidos en el body de la request
    
    if(!valid)
    {
        return res.status(400).json({error: errors});  // Si la validación falla, devolvemos un error 400 con los mensajes correspondientes
    }
    
    try
    {
        const newHabit = await service.createNewHabit(userId, validatedData);     // Llamamos al servicio para crear el nuevo habit en Firestore

        res.status(201).json({codigo: '201. Hábito creada con exito', habit: newHabit});    // Si habit sale bien, devolvemos un 201 con el habit creado
    }
    catch(error)
    {
        console.error('createNewHabit error:', error);   // Si ocurre un error inesperado, lo mostramos en consola y devolvemos un 500
        
        return res.status(500).json({error: '500. Error interno al crear un nuevo Hábito'});
    }
    
}; 



/// ************************************************ RUTAS PUT ************************************************

// Controller encargado de manejar la actualización de un Habit existente
export const updateHabit = async (req, res) =>  
{
    const {userId, habitId} = req.params;                // Extraemos userId y habitId de la ruta (/users/:userId/habits/:habitId)
    const newData = req.body;              // Extraemos los datos enviados por el cliente en el body de la request

    if(req.user.id !== userId)       // Validación de autorización: el userId de la ruta debe coincidir con el del token
    {
        return res.status(403).json({error: '403. No tenés permiso para acceder a estos datos'});
    }

    if(!habitId) // Valida que haya un id valido, o que no sea undefined o null
    {
        return res.status(400).json({error: '400. Se requiere el id de la hábito en la ruta'});  // Si no se envió un id válido en la ruta, devolvemos un error 400 (Bad Request)
    }

    const {valid, errors} = service.validateHabitData(newData);     // Validamos los datos recibidos usando la función de servicio
    
    if(!valid)  // valid = true si los datos son correctos, errors = array con mensajes de error
    {
        return res.status(400).json({error: errors});  // Devuelvo un error 400 con los mensajes de error
    }
    
    try
    {
        const updatedHabit = await service.updateHabit(userId, habitId, newData); // Llamamos al servicio para actualizar el habit en la base de datos

        if(!updatedHabit) // Si el servicio devuelve false/null, significa que el habit no existe → devolvemos 404
        {
            return res.status(404).json({error: '404. Hábito no encontrado'});
        }

        return res.status(200).json({mensaje: 'Hábito modificado exitosamente', habitModificado: updatedHabit}) // Si habit salió bien, devolvemos un 200 con un mensaje y el habit actualizado
    }
    catch(error)   // Si ocurre un error inesperado, lo mostramos en consola y devolvemos un 500
    {
        console.error('updateHabit error: ', error);

        return res.status(500).json({error: '500. Error interno al actualizar la hábito'});
    }

};



/// ************************************************ RUTAS DELETE ************************************************

// Controller encargado de manejar la eliminación de un Habit existente
export const deleteHabit = async (req, res) =>   // Ruta para eliminar el Habit
{
    const { userId, habitId} = req.params;        // Extraemos userId y habitId de la ruta (/users/:userId/habits/:habitId)
    
    if(req.user.id !== userId)       // Validación de autorización: el userId de la ruta debe coincidir con el del token
    {
        return res.status(403).json({error: '403. No tenés permiso para acceder a estos datos'});
    }

    try
    {
        const deletedHabit = await service.deleteHabit(userId, habitId);       // Llamamos al servicio para eliminar el habit con el id recibido

        if(!deletedHabit)        // Si el servicio devuelve false/null, significa que el habit no existe → devolvemos 404
        {
            return res.status(404).json({error: '404. Hábito no encontrado'}); // Si habit salió bien, devolvemos un 200 con un mensaje y el habit eliminado
        }

        return res.status(200).json({mensaje: 'Hábito eliminado exitosamente', habitEliminado: deletedHabit});
    }
    catch(error)    // para errores inesperados durante ejecución
    {
        console.error('deleteHabit error:', error);  // Si ocurre un error inesperado durante la ejecución, lo mostramos en consola

        return res.status(500).json({error: 'Error interno al eliminar el Hábito'});   // Devolvemos un 500 (Internal Server Error) como respuesta al cliente
    }
};

