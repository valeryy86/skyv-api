import { z } from "zod";

export const registerSchema = z.object({
  nombre: z
    .string({ required_error: "El nombre es obligatorio" })
    .trim()
    .min(3, "El nombre debe tener al menos 3 caracteres")
    .max(100, "El nombre es demasiado largo"),
  email: z
    .string({ required_error: "El correo es obligatorio" })
    .trim()
    .toLowerCase()
    .email("Ingrese un correo electrónico válido"),
  password: z
    .string({ required_error: "La contraseña es obligatoria" })
    .min(8, "La contraseña debe tener al menos 8 caracteres")
    .max(72, "La contraseña es demasiado larga"),
});

export const loginSchema = z.object({
  email: z
    .string({ required_error: "El correo es obligatorio" })
    .trim()
    .toLowerCase()
    .email("Ingrese un correo electrónico válido"),
  password: z.string({ required_error: "La contraseña es obligatoria" }).min(1, "La contraseña es obligatoria"),
});
