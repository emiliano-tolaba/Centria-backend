import jwt from 'jsonwebtoken';   // Importamos la librería jsonwebtoken para generar y verificar tokens JWT
import * as service from '../services/auth.service.js';


// Controller de login: recibe email y password desde el body de la petición
export const login = async (req, res) =>
{
    const { email, password } = req.body;       // Extraemos las credenciales enviadas por el cliente

    try
    {
        // Llamamos al servicio de autenticación, que busca el usuario en Firestore
        // y compara la contraseña ingresada con el hash guardado usando bcrypt.
        const user = await service.authenticateUser(email, password);

        if (!user)  // Si no se encuentra el usuario o la contraseña no coincide, devolvemos un 401 (Unauthorized).
        {
            return res.status(401).json({ error: "401. Credenciales inválidas" });
        }

        // Si las credenciales son válidas, construimos el payload del JWT.
        const payload = { id: user.id, email: user.email };     //    Este payload contiene datos relevantes del usuario (id y email).
        const expiration = { expiresIn: "1h"};                  // Configuramos la expiración del token (1 hora)
        const token = jwt.sign(payload, process.env.JWT_secret, expiration);        // Firmamos el token con la clave secreta definida en las variables de entorno.

        res.json({ token });        // Respondemos al cliente con el token generado.


    }
    catch(error)
    {
        console.error('login error:', error);

        res.status(500).json({ error: "500. Error interno en login" });
    }
}
