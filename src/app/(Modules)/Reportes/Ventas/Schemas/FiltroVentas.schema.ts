import { z } from "zod";

export const FiltroVentaSchema = z.object({
  ClienteId: z.string().max(50, "Maximo 50 caracteres").optional(),
  VentaId: z.coerce
    .number({ message: "Numero invalido" })
    .nonnegative({ message: "Numero invalido" })
    .optional(),
  Estado: z.string().max(50, "Maximo 50 caracteres").optional(),
});


