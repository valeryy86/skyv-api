import { Prisma } from "@prisma/client";
import { AppError, ConflictError, NotFoundError } from "../../domain/errors/AppError";

// Traduce los errores de Prisma a errores de la aplicación con su código HTTP.
// Devuelve null si el error no es de Prisma.
export function mapPrismaError(error: unknown): AppError | null {
  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    switch (error.code) {
      case "P2002": // valor único repetido
        return new ConflictError("Ya existe un registro con ese valor único");
      case "P2003": // llave foránea
        return new ConflictError(
          "No se puede completar la operación porque hay registros relacionados (por ejemplo, pedidos de este producto)",
        );
      case "P2025": // registro no encontrado
        return new NotFoundError("Registro no encontrado");
      default:
        return new AppError(400, "Error al procesar la solicitud en la base de datos");
    }
  }
  if (error instanceof Prisma.PrismaClientValidationError) {
    return new AppError(400, "Datos inválidos para la base de datos");
  }
  if (error instanceof Prisma.PrismaClientInitializationError) {
    return new AppError(503, "No se pudo conectar con la base de datos");
  }
  return null;
}
