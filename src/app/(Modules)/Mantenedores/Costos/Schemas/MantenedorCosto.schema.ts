
import { Costo } from "@/domain/Models/Costos/Costo";
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
  Costo: z.coerce.number().positive(),
});

export const MantenedorCostoDefault: Costo = {
  Id: "",
  Codigo: "",
  Descripcion: "",
  Costo: 0
};