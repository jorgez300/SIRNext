import { z } from "zod";

export const MantenedorUsuarioSchema = z.object({
  Id: z
    .string({ required_error: "Requerido" })
    .trim()
    .toUpperCase()
    .regex(/^\S*$/, "La contraseña no debe contener espacios en blanco")
    .min(8, "Minimo 8 caracteres")
    .max(20, "Maximo 20 caracteres"),
  Nombre: z
    .string({ required_error: "Requerido" })
    .toUpperCase()
    .min(2, "Minimo 2 caracteres")
    .max(50, "Maximo 50 caracteres"),
  Pass: z
    .string({ required_error: "Requerido" })
    .trim()
    .toUpperCase()
    .regex(/^\S*$/, "La contraseña no debe contener espacios en blanco")
    .min(8, "Minimo 8 caracteres")
    .max(20, "Maximo 20 caracteres"),
  Rol: z
    .string({ required_error: "Requerido" })
    .trim()
    .toUpperCase()
    .min(2, "Minimo 2 caracteres")
    .max(10, "Maximo 10 caracteres"),
});

