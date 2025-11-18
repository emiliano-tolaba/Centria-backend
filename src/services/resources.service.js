import * as model from '../models/resources.model.js';

export const getAllResources = () =>
{
    return model.getAllResources();     
}

export const searchResource = async (title) =>
{
    const resources = await model.getAllResources();

    return resources.filter((resource) =>
    {
        return resource.title.toLowerCase().includes(title.toLowerCase()); // Devuelve los Recursos que contengan en su title el texto buscado
    });  
}

export const getResourceById = async (id) =>
{
    return await model.getResourceById(id);
};



export const validateResourceData = (data) =>
{
    const errors = [];  // Creo un array para guardar los errores encontrados

    if(!data)
    {
        return { valid: false, errors: ["No se proporcionó datos del Recurso"] }
    }

    if (!data.title || typeof data.title !== 'string' || data.title.trim() === '')
    {
        errors.push("No se proporcionó datos del título"); // Agrega un mensaje de error si el titulo está vacio        
    }

    if (!data.type || typeof data.type !== 'string' || data.type.trim() === '')
    {
        errors.push("No se proporcionó datos del tipo"); // Agrega un mensaje de error si el tipo está vacio        
    }

    if (!data.content || typeof data.content !== 'string' || data.content.trim() === '')
    {
        errors.push("No se proporcionó datos del contenido"); // Agrega un mensaje de error si el contenido está vacio        
    }

    // Devuelve un objeto con:
    // valid: true si no hay errores
    // errors: lista de errores encontrados (vacía si es válido)
    return {valid: errors.length === 0, errors};
}

export const createNewResource = async (data) =>
{
    return await model.createNewResource(data);
}


export const updateResource = async (id, resourceData) =>
{
    return await model.updateResource(id, resourceData);
}


export const deleteResource = async (id) =>
{
    return await model.deleteResource(id);
} 
