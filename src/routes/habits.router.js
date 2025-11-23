import { Router } from 'express';                                   // Desestructuramos Router de express
import * as controller from '../controllers/habits.controller.js';   // Importamos las funciones del controlador
import { authenticate } from '../middlewares/auth.middleware.js';

const router = Router({ mergeParams: true });               // mergeParams: true → permite acceder a :userId desde este router

router.use(authenticate);                                                   // Utilizo el middleware de autenticación para proteger TODAS las rutas


/// ************************************************ RUTAS GET ************************************************
// Método GET: se usa para leer información.


// Lista completa de Habits
router.get('/', controller.getAllHabits);


// Búsqueda por el campo Name usando query params
// http://localhost:3000/api/:userId/habits/search?name=
router.get('/search', controller.searchHabitsByName);


// Búsqueda por ID usando parámetros de ruta
router.get('/:habitId', controller.getHabitById);



/// ************************************************ RUTAS POST ************************************************
// POST se usa para crear Habits nuevos.


// Crear un nuevo Habit
router.post('/', controller.createNewHabit);



/// ************************************************ RUTAS PUT ************************************************
// PUT se usa para reemplazar completamente un Habit


// Modifica un Habit
router.put('/:habitId', controller.updateHabit);



/// ************************************************ RUTAS DELETE ************************************************
// DELETE se usa para eliminar Habit.


// Elimina un Habit
router.delete('/:habitId', controller.deleteHabit);



// ****************************************************************************************************************



export default router;
