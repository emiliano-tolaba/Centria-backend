import { Router } from 'express';                                       // Desestructuramos Router de Express
import * as controller from '../controllers/resources.controller.js';   // Importamos las funciones del controlador
import { auth } from '../middlewares/auth.middleware.js';                // Importamos el middleware de autenticación para proteger algunas rutas

const router = Router();    // Es una instancia del Router



/// ************************************************ RUTAS GET ************************************************
// Método GET: se usa para leer información.


// Listado completo de Recursos
router.get('/', controller.getAllResources);


// Búsqueda por titulo usando query params
// http://localhost:3000/api/resources/search?title=478
router.get('/search', controller.searchResourceByTitle);


// Búsqueda por ID usando parámetros de ruta
router.get('/:id', controller.getResourceById);





/// ************************************************ RUTAS POST ************************************************
// POST se usa para crear recursos nuevos.

// Crear un nuevo Recurso
router.post('/', auth, controller.createNewResource);



/// ************************************************ RUTAS PUT ************************************************
// PUT se usa para reemplazar completamente un Recurso

// Modifica un Recurso
router.put('/:id', auth, controller.updateResource);


/// ************************************************ RUTAS DELETE ************************************************
// DELETE se usa para eliminar recursos.

// Borrar un Recurso
router.delete('/:id', auth, controller.deleteResource);



export default router;
