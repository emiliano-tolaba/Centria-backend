import jwt from "jsonwebtoken";

export const authenticate = (req, res, next) =>
{
    const authHeader = req.headers.authorization;
    if (!authHeader)
    {
        return res.status(401).json({ error: "No se proporcionó token" });
    }

    const token = authHeader.split(" ")[1];

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded; // guardamos el payload del token
        
        next();
    }
    catch (error)
    {
        return res.status(403).json({ error: "Token inválido o expirado" });
    }
};
