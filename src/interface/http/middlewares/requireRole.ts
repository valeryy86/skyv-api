import { RequestHandler } from "express";
import { Role } from "../../../domain/entities/User";
import { ForbiddenError, UnauthorizedError } from "../../../domain/errors/AppError";

// Middleware de rol: se usa DESPUÉS de authenticate.
// Token válido pero sin el rol necesario => 403
export function requireRole(...roles: Role[]): RequestHandler {
  return (req, _res, next) => {
    if (!req.user) {
      return next(new UnauthorizedError());
    }
    if (!roles.includes(req.user.role)) {
      return next(new ForbiddenError("Solo un administrador puede realizar esta acción"));
    }
    return next();
  };
}

export const soloAdmin = requireRole("admin");
