import jwt from 'jsonwebtoken';   // Importamos la librería jsonwebtoken para trabajar con tokens JWT

// Middleware de autenticación: se ejecuta antes de las rutas protegidas
export const auth = (req, res, next) =>
{
    // Extraemos el token del header "Authorization"
    // El formato esperado es: "Bearer <token>"
    // split(" ") separa en ["Bearer", "<token>"] y tomamos el segundo elemento (índice 1)
    const token = req.headers["authorization"]?.split(" ")[1];   

    if(!token) return res.sendStatus(401);      // Si no hay token en el header, respondemos con 401 (Unauthorized)

    jwt.verify(token, process.env.JWT_secret, (error, decoded) =>   // "decoded" es el payload original que se firmó dentro del JWT.
    {
        if (error) return res.sendStatus(403);  // Si el token no es válido (firma incorrecta, expirado, etc.), devolvemos 403 (Forbidden)

        req.user = decoded;     // Guardamos esos datos en la request para que los siguientes middlewares/controladores puedan usarlos
        next();
    });
    
}