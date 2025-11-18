import { Router } from 'express';   // Desestructuramos Router de Express
import * as controller from '../controllers/resources.controller.js';   // importamos las funciones del controlador

const router = Router();    // Es una instancia del Router



/// ************************************************ RUTAS GET ************************************************
// Método GET: se usa para leer información.


// 📦 Listado completo de recursos
router.get('/resources', controller.getAllResources);


// 🔍 Búsqueda por titulo usando query params
// http://localhost:3000/api/resources/search?title=478
router.get('/resources/search', controller.searchResource);


// 🔎 Búsqueda por ID usando parámetros de ruta
router.get('/resources/:id', controller.getResourceById);





/// ************************************************ RUTAS POST ************************************************
// POST se usa para crear recursos nuevos.

router.post('/resources', controller.createNewResource);



/// ************************************************ RUTAS PUT ************************************************
// PUT se usa para reemplazar completamente un recurso


router.put('/resources/:id', controller.updateResource);


/// ************************************************ RUTAS DELETE ************************************************
// DELETE se usa para eliminar recursos.

router.delete('/resources/:id', controller.deleteResource);



export default router;
