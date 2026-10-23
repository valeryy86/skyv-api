import { z } from "zod";

// OJO: aquí NO existe userId. Si alguien lo manda en el body, Zod lo descarta.
// El dueño del pedido siempre sale del token.
export const crearPedidoSchema = z.object({
  productoId: z.coerce
    .number({ invalid_type_error: "Seleccione un producto" })
    .int()
    .positive("Seleccione un producto"),
  cantidad: z.coerce
    .number({ invalid_type_error: "La cantidad debe ser un número" })
    .int("La cantidad debe ser un número entero")
    .min(1, "La cantidad mínima es 1")
    .max(100, "La cantidad máxima es 100"),
  telefono: z
    .string({ required_error: "El teléfono es obligatorio" })
    .trim()
    .regex(/^[0-9]{7,10}$/, "Ingrese un teléfono válido de 7 a 10 dígitos"),
  tipoCliente: z.enum(["Cliente", "Revendedor"], {
    errorMap: () => ({ message: "Debe seleccionar un tipo de cliente" }),
  }),
  mensaje: z.string().trim().max(500, "El mensaje es demasiado largo").nullable().optional(),
});
