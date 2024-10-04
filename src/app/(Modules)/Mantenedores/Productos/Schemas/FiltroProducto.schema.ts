
import { FiltroProducto } from "@/domain/DTOs/Productos/FiltroProducto";
import { z } from "zod";

export const FiltroProductoSchema = z.object({
  Codigo: z.string().max(10).optional(),
  Descripcion: z.string().optional(),
});

export const FiltroProductoDefault: FiltroProducto = {
  Codigo: "",
  Descripcion: "",
};