import { Producto } from "@/domain/Models/Productos/Producto";
import { Vehiculo } from "@/domain/Models/Vehiculos/Vehiculo";

export type ProductoCompleto = {
    Item?: Producto;
    Marcas?: Vehiculo[]
}