import { ZodTypeAny, z } from "zod";
import { ValidationError } from "../../../domain/errors/AppError";

// Valida datos con un esquema de Zod. Si algo está mal lanza un 400
// con un mensaje por cada campo: { errors: { email: "...", password: "..." } }
export function parse<T extends ZodTypeAny>(schema: T, data: unknown): z.infer<T> {
  const resultado = schema.safeParse(data ?? {});
  if (!resultado.success) {
    const errors: Record<string, string> = {};
    for (const issue of resultado.error.issues) {
      const campo = issue.path.join(".") || "general";
      if (!errors[campo]) errors[campo] = issue.message;
    }
    throw new ValidationError(errors);
  }
  return resultado.data;
}
