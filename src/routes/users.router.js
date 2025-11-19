import { Router } from 'express';                                   // Desestructuramos Router de express
import * as controller from '../controllers/users.controller.js';   // Importamos las funciones del controlador


const router = Router();                                            // Creamos una instacia de Router



/// ************************************************ RUTAS GET ************************************************
// Método GET: se usa para leer información.


// Lista completa de Usuarios
router.get('/users', controller.getAllUsers);


// Búsqueda por name usando query params
// http://localhost:3000/api/users/search?name=nombreEjemplo
router.get('/users/search', controller.searchUserByName);


// Búsqueda por ID usando parámetros de ruta
router.get('/users/:id', controller.getUserById);



/// ************************************************ RUTAS POST ************************************************
// POST se usa para crear Usuarios nuevos.


// Crear un nuevo Usuario
router.post('/users', controller.createNewUser);



/// ************************************************ RUTAS PUT ************************************************
// PUT se usa para reemplazar completamente un Usuario


// Modifica un Usuario
router.put('/users/:id', controller.updateUser);



/// ************************************************ RUTAS DELETE ************************************************
// DELETE se usa para eliminar Usuario.


// Elimina un Usuario
router.delete('/users/:id', controller.deleteUser);



// ****************************************************************************************************************


export default router;
