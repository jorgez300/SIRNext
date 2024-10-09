import { FiltroProducto } from "@/domain/DTOs/Productos/FiltroProducto";
import { z } from "zod";

export const FiltroProductoSchema = z.object({
  Codigo: z.string().max(50, "Maximo 50 caracteres").optional(),
  Descripcion: z.string().max(50, "Maximo 50 caracteres").optional(),
});

export const FiltroProductoDefault: FiltroProducto = {
  Codigo: "",
  Descripcion: "",
};
