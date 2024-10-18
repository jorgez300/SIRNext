import { z } from "zod";

export const MantenedorClienteSchema = z.object({
  Identificacion: z
    .string({ required_error: "Requerido" })
    .min(2, "Minimo 2 caracteres")
    .max(50, "Maximo 50 caracteres"),
  Nombre: z
    .string({ required_error: "Requerido" })
    .min(2, "Minimo 2 caracteres")
    .max(50, "Maximo 50 caracteres"),
});

export const MantenedorClienteDefault = {
  Identificacion: "",
  Nombre: "",
};
