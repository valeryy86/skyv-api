import { z } from "zod";
import { paginacionSchema } from "./comunes";

const categoria = z.enum(["maquillaje", "capilar"], {
  errorMap: () => ({ message: "La categoría debe ser maquillaje o capilar" }),
});

// Convierte "" en undefined para que un filtro vacío en la URL se ignore
const textoOpcional = z.preprocess(
  (v) => (typeof v === "string" && v.trim() === "" ? undefined : v),
  z.string().trim().max(100).optional(),
);
const numeroOpcional = z.preprocess(
  (v) => (v === "" || v === undefined ? undefined : v),
  z.coerce.number().int().min(0, "El precio no puede ser negativo").optional(),
);

export const listarProductosSchema = paginacionSchema
  .extend({
    marca: textoOpcional,
    q: textoOpcional,
    categoria: z.preprocess((v) => (v === "" ? undefined : v), categoria.optional()),
    minPrecio: numeroOpcional,
    maxPrecio: numeroOpcional,
  })
  .refine(
    (f) => f.minPrecio === undefined || f.maxPrecio === undefined || f.minPrecio <= f.maxPrecio,
    { message: "El precio mínimo no puede ser mayor que el máximo", path: ["minPrecio"] },
  );

export const crearProductoSchema = z.object({
  nombre: z
    .string({ required_error: "El nombre es obligatorio" })
    .trim()
    .min(2, "El nombre debe tener al menos 2 caracteres")
    .max(120),
  marca: z
    .string({ required_error: "La marca es obligatoria" })
    .trim()
    .toLowerCase()
    .min(2, "La marca debe tener al menos 2 caracteres")
    .max(50),
  categoria,
  precio: z
    .number({ required_error: "El precio es obligatorio", invalid_type_error: "El precio debe ser un número" })
    .int("El precio debe ser un número entero")
    .positive("El precio debe ser mayor que 0")
    .max(10_000_000, "El precio es demasiado alto"),
  imagen: z
    .string({ required_error: "La imagen es obligatoria" })
    .trim()
    .max(300)
    .refine((v) => v.startsWith("/") || /^https?:\/\//.test(v), {
      message: "La imagen debe ser una ruta como /img/... o una URL http(s)",
    }),
  descripcion: z.string().trim().max(500).nullable().optional(),
});

export const actualizarProductoSchema = crearProductoSchema
  .partial()
  .refine((data) => Object.keys(data).length > 0, {
    message: "Envía al menos un campo para actualizar",
    path: ["general"],
  });
