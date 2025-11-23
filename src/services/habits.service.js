import * as model from '../models/habits.model.js';      // Importo todas las funciones del model


// Service: obtiene habits los Habits
export const getAllHabits = async (userId) =>
{
    return await model.getAllHabits(userId);     // Simplemente delega la llamada al modelo.
    // El controlador recibirá la lista completa de Habits.
}


// Service: busca Habits por el campo "name"
export const searchHabitsByName = async (userId, name) =>
{
    const habits = await model.getAllHabits(userId);    // Primero obtenemos los Habits desde el modelo.

    // Filtramos aquellos cuyo campo "name" contenga el texto recibido.
    // Usamos toLowerCase() para hacer la búsqueda case-insensitive.
    return habits.filter((habit) =>
    {
        return habit.name.toLowerCase().includes(name.toLowerCase()); // Devuelve los Habits que contengan en su "name" el texto buscado.
    });  
}


// Service: obtiene un Habit específico por su ID
export const getHabitById = async (userId, habitId) =>
{
    return await model.getHabitById(userId, habitId); // Delegamos la búsqueda al modelo, que accede directamente a la base de datos.
};


// Service: valida la data recibida en el body
export const validateHabitData = (data) =>
{
    const errors = [];  // Creo un array para guardar los errores encontrados

    if(!data)
    {
        return { valid: false, errors: ["No se proporcionó datos del Hábito"] }
    }

    // Validación del name (string)
    if (!data.name || typeof data.name !== 'string' || data.name.trim() === '')
    {
        errors.push("No se proporcionó nombre del Hábito");      // Agrega un mensaje de error si el nombre está vacio
    }

    // Validación del campo frequency (string)
    if (!data.frequency || typeof data.frequency !== 'string' || data.frequency.trim() === '')
    {
        errors.push("No se proporcionó la frecuencia del Hábito");      // Agrega un mensaje de error si el frequencia está vacia
    }

    // Validación del targetCount
    if (data.targetCount === undefined || data.targetCount === null)
    {
        errors.push("No se proporcionó un número objetivo para el Hábito");
    }
    else
    {
        if (typeof data.targetCount !== "number" || isNaN(data.targetCount))
        {
            errors.push("El número objetivo debe ser un valor numérico");
        }
        else
        {
            if (data.targetCount <= 0)
            {
                errors.push("El número objetivo debe ser mayor a 0");
            }
        }
    }
    

    const validatedData = {
        name: data.name?.trim() || "Sin datos",
        frequency: data.frequency?.trim() || "Sin datos",
        targetCount: data.targetCount ?? 1, 
    };

    // Devuelve un objeto con:
    // valid: true si no hay errores
    // errors: lista de errores encontrados (vacía si es válido)
    return {valid: errors.length === 0, errors, validatedData};
}



// Service: crea un nuevo Habit
export const createNewHabit = async (userId, data) =>
{
    return await model.createNewHabit(userId, data);     // delega la llamada al model. El controlador recibirá el Habit creado.
}   


// Service: modifica un Habit existente
export const updateHabit = async (userId, habitId, newData) =>
{
    return await model.updateHabit(userId, habitId, newData);        // delega la llamada al model. El controlador recibirá el Habit actualizado.
}


// Service: elimina un Habit
export const deleteHabit = async (userId, habitId) =>
{
    return await model.deleteHabit(userId, habitId);                  // delega la llamada al model. El controlador recibirá el Habit eliminado.
} 

