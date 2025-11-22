import * as model from '../models/prompts.model.js';      // Importo todas las funciones del model


// Service: obtiene todos los Prompts
export const getAllPrompts = async () =>
{
    return await model.getAllPrompts();     // Simplemente delega la llamada al modelo.
    // El controlador recibirá la lista completa de Prompts.
}


// Service: busca Prompts filtrando por Categoria
export const filterPromptsByCategory = async (category) =>
{
    const prompts = await model.getAllPrompts();    // Primero obtenemos todos los Prompts desde el modelo.

    // Filtramos aquellos cuyo campo "category" sea exactamente igual al texto recibido.
    // Usamos toLowerCase() para hacer la búsqueda case-insensitive.
    return prompts.filter((prompt) =>
    {
        return prompt.category.toLowerCase() === (category.toLowerCase()); // Devuelve los Prompts que coincidan en su "category" el texto buscado.
    });  
}


// Service: obtiene un Prompt específico por su ID
export const getPromptById = async (id) =>
{
    return await model.getPromptById(id); // Delegamos la búsqueda al modelo, que accede directamente a la base de datos.
};

// Service: valida la data recibida en el body
export const validatePromptData = (data) =>
{
    const errors = [];  // Creo un array para guardar los errores encontrados

    if(!data)
    {
        return { valid: false, errors: ["No se proporcionó datos del Prompt"] }
    }

    // Validación del texto
    if (!data.text || typeof data.text !== 'string' || data.text.trim() === '')
    {
        errors.push("No se proporcionó datos del texto"); // Agrega un mensaje de error si el text está vacio        
    }

    // Validación de la categoría
    if (!data.category || typeof data.category !== 'string' || data.category.trim() === '')
    {
        errors.push("No se proporcionó datos de la categoría"); // Agrega un mensaje de error si la categoría está vacia        
    }


    // Devuelve un objeto con:
    // valid: true si no hay errores
    // errors: lista de errores encontrados (vacía si es válido)
    return {valid: errors.length === 0, errors};
}

// Service: crea un nuevo Prompt
export const createNewPrompt = async (data) =>
{
    return await model.createNewPrompt(data);     // delega la llamada al model. El controlador recibirá el Prompt creado.
}   


// Service: modifica un Prompt existente
export const updatePrompt = async (id, newData) =>
{
    return await model.updatePrompt(id, newData);        // delega la llamada al model. El controlador recibirá el Prompt actualizado.
}


// Service: elimina un Prompt
export const deletePrompt = async (id) =>
{
    return await model.deletePrompt(id);                  // delega la llamada al model. El controlador recibirá el Prompt eliminado.
} 

