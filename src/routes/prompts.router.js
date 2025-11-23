import { Router } from 'express';                                   // Desestructuramos Router de express
import * as controller from '../controllers/prompts.controller.js';   // Importamos las funciones del controlador
import { authenticate } from '../middlewares/auth.middleware.js';


const router = Router();                                            // Creamos una instacia de Router


/// ************************************************ RUTAS GET ************************************************
// Método GET: se usa para leer información.


// Lista completa de Prompts
router.get('/', controller.getAllPrompts);


// Filtra por categoria usando query params
// http://localhost:3000/api/prompts/search?category=
router.get('/search', controller.filterPromptsByCategory);


// Búsqueda por ID usando parámetros de ruta
router.get('/:id', controller.getPromptById);



/// ************************************************ RUTAS POST ************************************************
// POST se usa para crear Prompts nuevos.


// Crear un nuevo Prompt
router.post('/', authenticate, controller.createNewPrompt);



/// ************************************************ RUTAS PUT ************************************************
// PUT se usa para reemplazar completamente un Prompt


// Modifica un Prompt
router.put('/:id', authenticate, controller.updatePrompt);



/// ************************************************ RUTAS DELETE ************************************************
// DELETE se usa para eliminar Prompt.


// Elimina un Prompt
router.delete('/:id', authenticate, controller.deletePrompt);



// ****************************************************************************************************************


export default router;
