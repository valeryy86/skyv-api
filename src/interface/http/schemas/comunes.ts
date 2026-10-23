import { z } from "zod";

export const idParamSchema = z.object({
  id: z.coerce.number().int().positive("El id debe ser un número entero positivo"),
});

export const paginacionSchema = z.object({
  page: z.coerce.number().int().min(1, "page debe ser mayor o igual a 1").default(1),
  limit: z.coerce.number().int().min(1).max(50, "limit no puede ser mayor a 50").default(6),
});
