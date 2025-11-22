import { Router } from 'express';                                   // Desestructuramos Router de express
import * as controller from '../controllers/todos.controller.js';   // Importamos las funciones del controlador
import { auth } from '../middlewares/auth.middleware.js';

const router = Router({ mergeParams: true });               // mergeParams: true → permite acceder a :userId desde este router

router.use(auth);                                                   // Utilizo el middleware de autenticación para proteger TODAS las rutas


/// ************************************************ RUTAS GET ************************************************
// Método GET: se usa para leer información.


// Lista completa de Todos
router.get('/', controller.getAllTodos);


// Búsqueda por el campo Task usando query params
// http://localhost:3000/api/todos/search?task=
router.get('/search', controller.searchTodosByTask);


// Búsqueda por ID usando parámetros de ruta
router.get('/:todoId', controller.getTodoById);



/// ************************************************ RUTAS POST ************************************************
// POST se usa para crear Todos nuevos.


// Crear un nuevo Todo
router.post('/', controller.createNewTodo);



/// ************************************************ RUTAS PUT ************************************************
// PUT se usa para reemplazar completamente un Todo


// Modifica un Todo
router.put('/:todoId', controller.updateTodo);



/// ************************************************ RUTAS DELETE ************************************************
// DELETE se usa para eliminar Todo.


// Elimina un Todo
router.delete('/:todoId', controller.deleteTodo);



// ****************************************************************************************************************



export default router;
