import { z } from "zod";

export const LoginSchema = z.object({
  Id: z
    .string({ required_error: "Requerido" })
    .min(8, "Minimo 8 caracteres")
    .max(20, "Maximo 20 caracteres"),
  Pass: z
    .string({ required_error: "Requerido" })
    .min(8, "Minimo 8 caracteres")
    .max(20, "Maximo 20 caracteres"),
});