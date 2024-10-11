import { Producto } from "@/domain/Models/Productos/Producto";
import { z } from "zod";

export const MantenedorProductoSchema = z.object({
  Codigo: z
    .string({ required_error: "Requerido" })
    .min(2, "Minimo 2 caracteres")
    .max(50, "Maximo 50 caracteres"),
  Vigente: z.boolean(),
  Descripcion: z
    .string({ required_error: "Requerido" })
    .min(2, "Minimo 2 caracteres")
    .max(100, "Maximo 50 caracteres"),
  MarcaProd: z
    .string({ required_error: "Requerido" })
    .min(2, "Minimo 2 caracteres")
    .max(100, "Maximo 50 caracteres"),
  Existencia: z.coerce.number().positive(),
  Costo: z.coerce
    .number({ message: "Numero invalido" })
    .positive({ message: "Numero invalido" }),
  Precio: z.coerce
    .number({ message: "Numero invalido" })
    .positive({ message: "Numero invalido" }),
});

export const MantenedorProductoDefault: Producto = {
  Codigo: "",
  Descripcion: "",
  MarcaProd: "",
  Vigente: true,
  Existencia: 0,
  Costo: 0,
  Precio: 0,
  Minimo: 0,
  Maximo: 0,
};
