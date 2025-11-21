import { Router } from 'express';                                   // Desestructuramos Router de Express
import * as controller from '../controllers/auth.controller.js';    // Importamos las funciones del controlador


const router = Router();                    // Creamos una instacia de Router


/// ************************************************ RUTAS  ************************************************************

// Loguear un usuario
router.post("/login", controller.login);



export default router;