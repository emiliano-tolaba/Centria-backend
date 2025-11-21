// index.js - PUERTO DE ENTRADA PRINCIPAL DEL SERVIDOR Node.js CON Express

import 'dotenv/config';         // Importamos 'dotenv/config' para poder usar variables de entorno definidas en un archivo .env
import express from 'express';  // Importamos el módulo 'express' que nos permite crear un servidor HTTP de forma sencilla
import cors from 'cors';        // Importamos 'cors' para permitir solicitudes desde distintons origenes (dominios diferentes)
import usersRouter from './src/routes/users.router.js'              // Importamos el router que maneja todas las rutas relacionadas con Users
import resourcesRouter from './src/routes/resources.router.js';     // Importamos el router que maneja las rutas relacionadas con Recursos
import authRouter from './src/routes/auth.router.js';               // Importamos el router que maneja las rutas de Autenticación


/// ************************************************ CONFIGURACIÓN INICIAL DEL SERVIDOR ************************************************


const app = express();                      // Creamos una instancia de la aplicación Express; este objeto es nuestro servidor
const PORT = process.env.PORT || 3001;      // Definimos el puerto en el que se correrá el servidor

console.log("PORT: ", process.env.PORT)             // Muestra la variable de entorno PORT
console.log("NODE_ENV: ", process.env.NODE_ENV);    // Muestra el entorno actual (development, production, etc.)


// MIDDLEWARES GLOBALES

app.use(cors());                    // Habilita CORS permitiendo que otros dominios accedan a nuestra API
app.use(express.json());            // Permite a Express interpretar automáticamente cuerpos de solicitud en formato JSON



/// ************************************************ MIDDLEWARE DE REGISTRO GENERAL ************************************************
// Se ejecuta *antes* de cualquier ruta


app.use((req, res, next) =>
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
});



/// ************************************************ RUTAS PRINCIPALES ************************************************


app.use('/api/auth', authRouter);
app.use("/api/resources", resourcesRouter);
app.use("/api/users", usersRouter);



/// ************************************************ RUTA RAÍZ **************************************************************
// Definimos una ruta GET en la raiz ("/") que responde con un mensaje
// Esto sirve como endpoint de prueba para confirmar que el server funciona


app.get('/', (req, res)=>
{
    res.json({mensaje: 'API REST corriendo desde la URL: /'});
});



/// ************************************************ MIDDLEWARE 404 NOT FOUND ************************************************
// Este middleware se ejecuta si ninguna de las rutas anteriores fue encontrada
// Maneja errores de tipo "No encontrado" (404) para cualquier método (GET, POST, etc.)


app.use((req, res, next) =>
{
    res.status(404).json(
    {
        error: '404. Ruta no encontrada',       // mensaje de error genérico
        ruta: req.originalUrl,                  // Muestra al ruta que el cliente intentó acceder, originalURL es una propiedad del req
    });
});



/// ************************************************ MIDDLEWARE - MANEJADOR GLOBAL DE ERRORES ************************************************
// Captura y maneja errores internos del servidor. Evita que el servidor se caiga ante un error inesperado y devuelve una respuesta JSON


app.use((err, req, res, next) =>
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
});




/// ************************************************ INICIO DEL SERVIDOR ************************************************


app.listen(PORT, ()=>
{
    console.log(`Servidor escuchando en http://localhost:${PORT}`);
});