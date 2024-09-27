import { FiltroCliente } from "@/domain/DTOs/FiltroClientes";
import { z } from "zod";

export const FiltroClienteSchema = z.object({
  Nombre: z
    .string({ required_error: "Requerido" })
    .min(2, "Minimo 2 caracteres")
    .max(50, "Maximo 50 caracteres"),
});

export const FiltroClienteDefault: FiltroCliente = {
  Nombre: "",
};