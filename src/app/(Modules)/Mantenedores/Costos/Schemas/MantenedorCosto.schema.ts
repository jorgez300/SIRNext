import { z } from "zod";

export const MantenedorCostoSchema = z.object({
  Codigo: z
    .string({ required_error: "Requerido" })
    .min(2, "Minimo 2 caracteres")
    .max(50, "Maximo 50 caracteres"),
  Descripcion: z
    .string({ required_error: "Requerido" })
    .min(2, "Minimo 2 caracteres")
    .max(50, "Maximo 50 caracteres"),
  Costo: z.coerce
    .number({ message: "Numero invalido" })
    .positive({ message: "Numero invalido" }),
  Tipo: z
    .string({ required_error: "Requerido" })
    .min(1, "Minimo 1 caracteres")
    .max(50, "Maximo 50 caracteres"),
});
