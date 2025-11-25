import * as model from '../models/sessions.model.js';      // Importo todas las funciones del model


// Service: obtiene todos los Sessions
export const getAllSessions = async (userId) =>
{
    return await model.getAllSessions(userId);     // Simplemente delega la llamada al modelo.
    // El controlador recibirá la lista completa de Sessions.
}


// Service: busca Sessions por el campo "tag"
export const searchSessionsByTag = async (userId, tag) =>
{
    const sessions = await model.getAllSessions(userId);    // Primero obtenemos todos los Sessions desde el modelo.

    // Filtramos aquellos cuyo campo "tag" contenga el texto recibido.
    // Usamos toLowerCase() para hacer la búsqueda case-insensitive.
    return sessions.filter((session) =>
    {
        return session.tag.toLowerCase().includes(tag.toLowerCase()); // Devuelve los Sessions que contengan en su "tag" el texto buscado.
    });  
}


// Service: obtiene un Session específico por su ID
export const getSessionById = async (userId, sessionId) =>
{
    return await model.getSessionById(userId, sessionId);          // Delegamos la búsqueda al modelo, que accede directamente a la base de datos.
};


// Service: valida la data recibida en el body
export const validateSessionData = (data) =>
{
    const errors = [];  // Creo un array para guardar los errores encontrados

    if(!data)
    {
        return { valid: false, errors: ["No se proporcionó datos de la Sesion"] }
    }

    let tagValue = "Pomodoro"; // valor por defecto

    if (data.tag && typeof data.tag === "string" && data.tag.trim() !== "")
    {
        tagValue = data.tag.trim();
    }

    // Validación del focusTime (número)
    if (data.focusTime === undefined || data.focusTime === null)
    {
        errors.push("No se proporcionó un tiempo de enfoque para la Sesion");
    }
    else
    {
        if (typeof data.focusTime !== "number" || isNaN(data.focusTime))
        {
            errors.push("El tiempo de enfoque debe ser un valor numérico");
        }
        else
        {
            if (data.focusTime <= 0)
            {
                errors.push("El tiempo de enfoque debe ser mayor a 0");
            }
        }
    }

    // Validación del breakTime (número)
    if (data.breakTime === undefined || data.breakTime === null)
    {
        errors.push("No se proporcionó un tiempo de descanso para la Sesion");
    }
    else
    {
        if (typeof data.breakTime !== "number" || isNaN(data.breakTime))
        {
            errors.push("El tiempo de descanso debe ser un valor numérico");
        }
        else
        {
            if (data.breakTime <= 0)
            {
                errors.push("El tiempo de descanso debe ser mayor a 0");
            }
        }
    }

    // Validación y parseo del campo startTime
    let startTimeValue = null;

    if (data.startTime !== undefined)
    {
        const parsed = new Date(data.startTime);

        if (isNaN(parsed.getTime()))
        {
            errors.push("El campo 'startTime' debe ser una fecha y hora válida (ej: 2025-01-01T00:00)");
        }
        else
        {
            startTimeValue = parsed;
        }
    }

    // Validación y parseo del campo endTime
    let endTimeValue = null;

    if (data.endTime !== undefined)
    {
        const parsed = new Date(data.endTime);

        if (isNaN(parsed.getTime()))
        {
            errors.push("El campo 'endTime' debe ser una fecha y hora válida (ej: 2025-01-01T00:00)");
        }
        else
        {
            if (parsed < startTimeValue)
            {
                errors.push("El campo 'endTime' no puede ser una fecha anterior a 'startTime");
            }
            else
            {
                endTimeValue = parsed; // normalizamos a Date
            }
        }
    }

    // Construimos un objeto normalizado para pasar al model
    const validatedData = {
        startTime: startTimeValue,                                          // Fecha de inicio (si existe)
        endTime: endTimeValue,                                              // Fecha de finalización (si existe)
        focusTime: data.focusTime ?? 0,                                     // Tiempo de enfoque    
        breakTime: data.breakTime ?? 0,                                     // Tiempo de descanso
        tag: tagValue                                                       // Valor por default: "Pomodoro"
    };

    // Devuelve un objeto con:
    // valid: true si no hay errores
    // errors: lista de errores encontrados (vacía si es válido)
    return {valid: errors.length === 0, errors, validatedData};
}



// Service: crea un nuevo Session
export const createNewSession = async (userId, data) =>
{
    return await model.createNewSession(userId, data);     // delega la llamada al model. El controlador recibirá el Session creado.
}   


// Service: modifica un Session existente
export const updateSession = async (userId, sessionId, newData) =>
{
    return await model.updateSession(userId, sessionId, newData);        // delega la llamada al model. El controlador recibirá el Session actualizado.
}


// Service: elimina un Session
export const deleteSession = async (userId, sessionId) =>
{
    return await model.deleteSession(userId, sessionId);                  // delega la llamada al model. El controlador recibirá el Session eliminado.
} 

