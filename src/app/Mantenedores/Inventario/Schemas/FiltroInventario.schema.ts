import { FiltroInventario } from "@/domain/DTOs/FiltroInventario";
import { z } from "zod";

export const FiltroInventarioSchema = z.object({
  Codigo: z.string().max(10).optional(),
  Descripcion: z.string().optional(),
});

export const FiltroInventarioDefault: FiltroInventario = {
  Codigo: "",
  Descripcion: "",
};
