import { FiltroProveedor } from "@/domain/DTOs/Proveedores/FiltroProveedores";
import { z } from "zod";

export const FiltroProveedorSchema = z.object({
  Nombre: z.string().max(50, "Maximo 50 caracteres"),
});

export const FiltroProveedorDefault: FiltroProveedor = {
  Nombre: "",
};
