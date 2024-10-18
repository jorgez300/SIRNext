import { FiltroCliente } from "@/domain/DTOs/Clientes/FiltroClientes";
import { z } from "zod";

export const FiltroClienteSchema = z.object({
  Nombre: z.string().max(50, "Maximo 50 caracteres"),
});

export const FiltroClienteDefault: FiltroCliente = {
  Nombre: "",
};
