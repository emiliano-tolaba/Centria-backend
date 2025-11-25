import { Router } from 'express';                                   // Desestructuramos Router de express
import * as controller from '../controllers/sessions.controller.js';   // Importamos las funciones del controlador
import { authenticate } from '../middlewares/auth.middleware.js';

const router = Router({ mergeParams: true });               // mergeParams: true → permite acceder a :userId desde este router

router.use(authenticate);                                   // Utilizo el middleware de autenticación para proteger TODAS las rutas


/// ************************************************ RUTAS GET ************************************************
// Método GET: se usa para leer información.


// Lista completa de Sessions
router.get('/', controller.getAllSessions);


// Búsqueda por el campo Tag usando query params
// http://localhost:3000/api/sessions/search?tag=
router.get('/search', controller.searchSessionsByTag);


// Búsqueda por ID usando parámetros de ruta
router.get('/:sessionId', controller.getSessionById);



/// ************************************************ RUTAS POST ************************************************
// POST se usa para crear Sessions nuevos.


// Crear una nueva Session
router.post('/', controller.createNewSession);



/// ************************************************ RUTAS PUT ************************************************
// PUT se usa para reemplazar completamente un Session


// Modifica un Session
router.put('/:sessionId', controller.updateSession);



/// ************************************************ RUTAS DELETE ************************************************
// DELETE se usa para eliminar Session.


// Elimina un Session
router.delete('/:sessionId', controller.deleteSession);



// ****************************************************************************************************************



export default router;
