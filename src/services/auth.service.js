import { findUserByEmail } from "../models/users.model.js";     // Importamos la función que busca un usuario por email en la base de datos (Firestore)
import bcrypt from "bcrypt";            // Importamos bcrypt para poder comparar contraseñas en texto plano con hashes encriptados


// Service encargado de autenticar un usuario con email y contraseña
export const authenticateUser = async (email, password) =>
{
    const user = await findUserByEmail(email);      // Buscamos el usuario en Firestore por su email    
    if (!user) return null;                         // Si no existe ningún usuario con ese email, devolvemos null (login inválido)

    // Comparamos la contraseña ingresada (texto plano) con el hash guardado en la base
    // bcrypt.compare se encarga de aplicar el mismo algoritmo y verificar si coinciden
    const match = await bcrypt.compare(password, user.password);

    if (!match) return null;    // Si la comparación falla (contraseña incorrecta), devolvemos null

    return user;    // Si todo es correcto, devolvemos el objeto usuario para que el controller genere el JWT
};
