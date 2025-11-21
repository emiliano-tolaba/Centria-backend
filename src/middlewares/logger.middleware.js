// Middleware de registro general: se ejecuta ANTES de cualquier ruta
export const logger = (req, res, next) =>
{
    const timestamp = new Date().toISOString(); // Fecha y hora actual en formato ISO - legible
    console.log("\n ========= NUEVA PETICIÓN ========="); 
    console.log("=> Fecha:", timestamp);
    console.log("=> Método:", req.method);  // GET, POST, PUT, DELETE, etc.
    console.log("=> URL original:", req.originalUrl); // La URL completa pedida
    console.log("=> Cabeceras:", req.headers);          // Infor enviada por el cliente
    console.log("=> content-type:", req.headers['content-type'] || 'No especificado');
    console.log("====================================");
    
    next(); // Continua al siguiente middleware o ruta
};