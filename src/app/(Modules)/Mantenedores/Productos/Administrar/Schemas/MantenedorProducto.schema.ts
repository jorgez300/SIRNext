import { Producto } from "@/domain/Models/Productos/Producto";
import { z } from "zod";

export const MantenedorProductoSchema = z.object({
  Codigo: z
    .string({ required_error: "Requerido" })
    .regex(/^\S+$/, "No se permiten espacios en blanco")
    .min(5, "Minimo 5 caracteres")
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
  Ubicacion: z.string({ required_error: "Requerido" }),
  Existencia: z.coerce
    .number({ message: "Numero invalido" })
    .nonnegative({ message: "Numero invalido" }),
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
