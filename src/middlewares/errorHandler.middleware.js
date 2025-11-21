// Middleware errorHandler:
// Captura y maneja errores internos del servidor. Evita que el servidor se caiga ante un error inesperado y devuelve una respuesta JSON


export const errorHandler = (err, req, res, next) =>
{
    console.log("Se capturó un error en el middleware global: ");
    console.log("Mensaje: ", err.message);
    console.log("Stack: ", err.stack);      // En desarrollo muestra el stack trace completo, no recomendado en producción

    // Respondemos con código 500 (Internal Server Error) y detalles del error
    // En desarrollo mostramos detalles, en producción no
    const response = {
        error: `<<< INT >>> Error interno del servidor <<< INT >>>`,
        mensaje: err.mensaje,
    };

    if(process.env.NODE_ENV !== 'production')
    {
        response.stack = err.stack;
    }

    res.status(500).json(response);
};