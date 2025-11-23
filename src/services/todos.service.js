import * as model from '../models/todos.model.js';      // Importo todas las funciones del model


// Service: obtiene todos los Todos
export const getAllTodos = async (userId) =>
{
    return await model.getAllTodos(userId);     // Simplemente delega la llamada al modelo.
    // El controlador recibirá la lista completa de Todos.
}


// Service: busca Todos por el campo "task"
export const searchTodosByTask = async (userId, task) =>
{
    const todos = await model.getAllTodos(userId);    // Primero obtenemos todos los Todos desde el modelo.

    // Filtramos aquellos cuyo campo "task" contenga el texto recibido.
    // Usamos toLowerCase() para hacer la búsqueda case-insensitive.
    return todos.filter((todo) =>
    {
        return todo.task.toLowerCase().includes(task.toLowerCase()); // Devuelve los Todos que contengan en su "task" el texto buscado.
    });  
}


// Service: obtiene un Todo específico por su ID
export const getTodoById = async (userId, todoId) =>
{
    return await model.getTodoById(userId, todoId); // Delegamos la búsqueda al modelo, que accede directamente a la base de datos.
};


// Service: valida la data recibida en el body
export const validateTodoData = (data) =>
{
    const errors = [];  // Creo un array para guardar los errores encontrados

    if(!data)
    {
        return { valid: false, errors: ["No se proporcionó datos del Todo"] }
    }

    // Validación de la task
    if (!data.task || typeof data.task !== 'string' || data.task.trim() === '')
    {
        errors.push("No se proporcionó datos de la tarea"); // Agrega un mensaje de error si la categoría está vacia        
    }

    // Validación del campo isCompleted (booleano)
    if (data.isCompleted !== undefined && typeof data.isCompleted !== "boolean") {
        errors.push("El campo 'isCompleted' debe ser booleano (true/false)");
    }

    // Validación y parseo del campo dueDate
    let dueDateValue = null;

    if (data.dueDate !== undefined)
    {
        const parsed = new Date(data.dueDate);

        if (isNaN(parsed.getTime()))
        {
            errors.push("El campo 'dueDate' debe ser una fecha y hora válida (ej: 2025-11-22T18:30)");
        }
        else
        {
            const now = new Date();
            if (parsed < now) {
                errors.push("El campo 'dueDate' no puede ser una fecha pasada");
            } else {
                dueDateValue = parsed; // normalizamos a Date
            }
        }
    }

    // Construimos un objeto normalizado para pasar al model
    const normalizedData = {
        task: data.task,
        isCompleted: data.isCompleted || false,
        dueDate: dueDateValue
    };

    // Devuelve un objeto con:
    // valid: true si no hay errores
    // errors: lista de errores encontrados (vacía si es válido)
    return {valid: errors.length === 0, errors, normalizedData};
}



// Service: crea un nuevo Todo
export const createNewTodo = async (userId, data) =>
{
    return await model.createNewTodo(userId, data);     // delega la llamada al model. El controlador recibirá el Todo creado.
}   


// Service: modifica un Todo existente
export const updateTodo = async (userId, todoId, newData) =>
{
    return await model.updateTodo(userId, todoId, newData);        // delega la llamada al model. El controlador recibirá el Todo actualizado.
}


// Service: elimina un Todo
export const deleteTodo = async (userId, todoId) =>
{
    return await model.deleteTodo(userId, todoId);                  // delega la llamada al model. El controlador recibirá el Todo eliminado.
} 