import { Router } from 'express';                                   // Desestructuramos Router de express
import * as controller from '../controllers/users.controller.js';   // Importamos las funciones del controlador
import { authenticate } from '../middlewares/auth.middleware.js';
import todosRouter from "./todos.router.js";
import habitsRouter from './habits.router.js';
import sessionsRouter from './sessions.router.js';

const router = Router();                                            // Creamos una instacia de Router

router.use(authenticate);                                                   // Utilizo el middleware de autenticación para proteger TODAS las rutas


/// ************************************************ RUTAS GET ************************************************
// Método GET: se usa para leer información.


// Lista completa de Usuarios
router.get('/', controller.getAllUsers);


// Búsqueda por name usando query params
// http://localhost:3000/api/users/search?name=nombreEjemplo
router.get('/search', controller.searchUserByName);


// Búsqueda por ID usando parámetros de ruta
router.get('/:id', controller.getUserById);



/// ************************************************ RUTAS POST ************************************************
// POST se usa para crear Usuarios nuevos.


// Crear un nuevo Usuario
router.post('/', controller.createNewUser);



/// ************************************************ RUTAS PUT ************************************************
// PUT se usa para reemplazar completamente un Usuario


// Modifica un Usuario
router.put('/:id', controller.updateUser);



/// ************************************************ RUTAS DELETE ************************************************
// DELETE se usa para eliminar Usuario.


// Elimina un Usuario
router.delete('/:id', controller.deleteUser);



// ****************************************************************************************************************

// Subrutas de (tareas privadas de cada usuario)

router.use('/:userId/todos', todosRouter);          // Monta el router de todos dentro de users
router.use('/:userId/habits', habitsRouter);        // Monta el router de habits dentro de users
router.use('/:userId/sessions', sessionsRouter)     // Monta el router de sessions dentro de users


export default router;
