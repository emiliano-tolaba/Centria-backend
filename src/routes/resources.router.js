import { Router } from 'express';   // Desestructuramos Router de Express
import * as controller from '../controllers/resources.controller.js';   // importamos las funciones del controlador

const router = Router();    // Es una instancia del Router



/// ************************************************ RUTAS GET ************************************************
// Método GET: se usa para leer información.


// Listado completo de Recursos
router.get('/resources', controller.getAllResources);


// Búsqueda por titulo usando query params
// http://localhost:3000/api/resources/search?title=478
router.get('/resources/search', controller.searchResourceByTitle);


// Búsqueda por ID usando parámetros de ruta
router.get('/resources/:id', controller.getResourceById);





/// ************************************************ RUTAS POST ************************************************
// POST se usa para crear recursos nuevos.

// Crear un nuevo Recurso
router.post('/resources', controller.createNewResource);



/// ************************************************ RUTAS PUT ************************************************
// PUT se usa para reemplazar completamente un Recurso

// Modifica un Recurso
router.put('/resources/:id', controller.updateResource);


/// ************************************************ RUTAS DELETE ************************************************
// DELETE se usa para eliminar recursos.

// Borrar un Recurso
router.delete('/resources/:id', controller.deleteResource);



export default router;
