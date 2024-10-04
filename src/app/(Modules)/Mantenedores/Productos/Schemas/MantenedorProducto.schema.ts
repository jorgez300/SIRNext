import { Producto } from "@/domain/Models/Productos/Producto";
import { z } from "zod";

export const MantenedorProductoSchema = z.object({
  Codigo: z
    .string({ required_error: "Requerido" })
    .min(2, "Minimo 2 caracteres")
    .max(50, "Maximo 50 caracteres"),
  Descripcion: z
    .string({ required_error: "Requerido" })
    .min(2, "Minimo 2 caracteres")
    .max(50, "Maximo 50 caracteres"),
  Existencia: z.coerce.number().positive(),
  Costo: z.coerce.number().positive(),
  Precio: z.coerce.number().positive(),
  Minimo: z.coerce.number().positive(),
  Maximo: z.coerce.number().positive(),
});

export const MantenedorProductoDefault: Producto = {
  Id: "",
  Codigo: "",
  Descripcion: "",
  Existencia: 0,
  Costo: 0,
  Precio: 0,
  Minimo: 0,
  Maximo: 0,
};
