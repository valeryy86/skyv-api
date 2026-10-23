import { RequestHandler } from "express";
import { UnauthorizedError } from "../../../domain/errors/AppError";
import { TokenService } from "../../../domain/services/TokenService";

// Lee "Authorization: Bearer <token>", lo verifica y deja el usuario en req.user.
// Sin token, o con token inválido/expirado => 401
export function authenticate(tokens: TokenService): RequestHandler {
  return (req, _res, next) => {
    const header = req.headers.authorization;
    if (!header || !header.startsWith("Bearer ")) {
      return next(new UnauthorizedError("Debes iniciar sesión (token no enviado)"));
    }

    const token = header.slice("Bearer ".length).trim();
    try {
      req.user = tokens.verify(token);
      return next();
    } catch {
      return next(new UnauthorizedError("Token inválido o expirado"));
    }
  };
}
