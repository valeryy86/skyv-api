import { ErrorRequestHandler, RequestHandler } from "express";
import { AppError } from "../../../domain/errors/AppError";
import { mapPrismaError } from "../../../infrastructure/prisma/prismaErrors";

// Rutas que no existen => 404
export const notFoundHandler: RequestHandler = (req, res) => {
  res.status(404).json({ message: `La ruta ${req.method} ${req.originalUrl} no existe` });
};

function esJsonMalFormado(err: unknown): boolean {
  return typeof err === "object" && err !== null && (err as { type?: string }).type === "entity.parse.failed";
}

// Manejador de errores CENTRAL: todos los errores terminan aquí.
// Nunca se envía el stack trace al cliente.
export const errorHandler: ErrorRequestHandler = (err, _req, res, _next) => {
  if (err instanceof AppError) {
    res.status(err.statusCode).json({
      message: err.message,
      ...(err.errors ? { errors: err.errors } : {}),
    });
    return;
  }

  if (esJsonMalFormado(err)) {
    res.status(400).json({ message: "El cuerpo de la petición no es un JSON válido" });
    return;
  }

  const errorPrisma = mapPrismaError(err);
  if (errorPrisma) {
    res.status(errorPrisma.statusCode).json({ message: errorPrisma.message });
    return;
  }

  console.error(err); // se ve en la consola del servidor, no en la respuesta
  res.status(500).json({ message: "Error interno del servidor" });
};
