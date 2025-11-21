// Middleware notFound: se ejecuta si ninguna de las rutas anteriores fue encontrada
// Maneja errores de tipo "No encontrado" (404) para cualquier método (GET, POST, etc.)

export const notFound = (req, res, next) =>
{
    res.status(404).json(
    {
        error: '404. Ruta no encontrada',       // mensaje de error genérico
        ruta: req.originalUrl,                  // Muestra al ruta que el cliente intentó acceder, originalURL es una propiedad del req
    });
};