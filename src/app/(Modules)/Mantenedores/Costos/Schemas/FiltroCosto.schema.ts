
import { FiltroCosto } from "@/domain/DTOs/Costos/FiltroCosto";
import { z } from "zod";

export const FiltroCostoSchema = z.object({
  Codigo: z.string().max(10).optional(),
  Descripcion: z.string().optional(),
});

export const FiltroCostoDefault: FiltroCosto = {
  Codigo: "",
  Descripcion: "",
};