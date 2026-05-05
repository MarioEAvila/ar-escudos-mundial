import { verifyToken } from "../lib/auth.js";
import User from "../models/User.js";

export async function requireAuth(req, _res, next) {
  const token = req.cookies.token;

  if (!token) {
    const error = new Error("Necesitas iniciar sesion.");
    error.statusCode = 401;
    throw error;
  }

  const payload = verifyToken(token);
  const user = await User.findById(payload.userId);

  if (!user) {
    const error = new Error("La sesion ya no es valida.");
    error.statusCode = 401;
    throw error;
  }

  req.user = user;
  next();
}
