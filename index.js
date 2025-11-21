// index.js - PUERTO DE ENTRADA PRINCIPAL DEL SERVIDOR Node.js CON Express

import 'dotenv/config';         // Importamos 'dotenv/config' para poder usar variables de entorno definidas en un archivo .env
import express from 'express';  // Importamos el módulo 'express' que nos permite crear un servidor HTTP de forma sencilla
import cors from 'cors';        // Importamos 'cors' para permitir solicitudes desde distintons origenes (dominios diferentes)
import usersRouter from './src/routes/users.router.js'              // Importamos el router que maneja todas las rutas relacionadas con Users
import resourcesRouter from './src/routes/resources.router.js';     // Importamos el router que maneja las rutas relacionadas con Recursos
import authRouter from './src/routes/auth.router.js';               // Importamos el router que maneja las rutas de Autenticación
import { logger } from './src/middlewares/logger.middleware.js';
import { notFound } from './src/middlewares/notfound.middleware.js';
import { errorHandler } from './src/middlewares/errorHandler.middleware.js';


/// ************************************************ CONFIGURACIÓN INICIAL DEL SERVIDOR ************************************************


const app = express();                      // Creamos una instancia de la aplicación Express; este objeto es nuestro servidor
const PORT = process.env.PORT || 3001;      // Definimos el puerto en el que se correrá el servidor

console.log("PORT: ", process.env.PORT)             // Muestra la variable de entorno PORT
console.log("NODE_ENV: ", process.env.NODE_ENV);    // Muestra el entorno actual (development, production, etc.)


// MIDDLEWARES GLOBALES

app.use(cors());                    // Habilita CORS permitiendo que otros dominios accedan a nuestra API
app.use(express.json());            // Permite a Express interpretar automáticamente cuerpos de solicitud en formato JSON



// Middleware de registro general: se ejecuta ANTES de cualquier ruta

app.use(logger);


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



// Middleware 404 not found

app.use(notFound);


// Middleware errorHandler (maneja errores globales)

app.use(errorHandler);




/// ************************************************ INICIO DEL SERVIDOR ************************************************


app.listen(PORT, ()=>
{
    console.log(`Servidor escuchando en http://localhost:${PORT}`);
});