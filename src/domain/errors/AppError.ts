// Errores "conocidos" de la aplicación. Cada uno sabe qué código HTTP le corresponde.
export class AppError extends Error {
  public readonly statusCode: number;
  public readonly errors?: Record<string, string>;

  constructor(statusCode: number, message: string, errors?: Record<string, string>) {
    super(message);
    this.name = "AppError";
    this.statusCode = statusCode;
    this.errors = errors;
  }
}

export class ValidationError extends AppError {
  constructor(errors: Record<string, string>, message = "Datos inválidos") {
    super(400, message, errors);
  }
}

export class UnauthorizedError extends AppError {
  constructor(message = "No autenticado") {
    super(401, message);
  }
}

export class ForbiddenError extends AppError {
  constructor(message = "No tienes permisos para realizar esta acción") {
    super(403, message);
  }
}

export class NotFoundError extends AppError {
  constructor(message = "Recurso no encontrado") {
    super(404, message);
  }
}

export class ConflictError extends AppError {
  constructor(message: string, errors?: Record<string, string>) {
    super(409, message, errors);
  }
}
