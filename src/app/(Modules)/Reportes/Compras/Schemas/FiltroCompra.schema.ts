import { z } from "zod";

export const FiltroCompraSchema = z.object({
  ProveedorId: z.string().max(50, "Maximo 50 caracteres").optional(),
  CompraId: z.coerce
    .number({ message: "Numero invalido" })
    .nonnegative({ message: "Numero invalido" })
    .optional(),
  Estado: z.string().max(50, "Maximo 50 caracteres").optional(),
});


