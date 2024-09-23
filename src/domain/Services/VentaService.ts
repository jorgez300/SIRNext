"use server";

import { ItemVenta } from "../Models/Ventas/ItemVenta";
import { Venta } from "../Models/Ventas/Venta";

export const GetItemsVenta = async (filtro?: Venta) => {
    console.log("GetInventario", filtro);
    const Lista: ItemVenta[] = [
      {
        VentaId: "1",
        InventarioId: "Producto_1",
        Cantidad: 1,
        Precio: 10.5,
        Posicion: 0
      },
      {
        VentaId: "1",
        InventarioId: "Producto_2",
        Cantidad: 1,
        Precio: 10.5,
        Posicion: 1
      },
      {
        VentaId: "1",
        InventarioId: "Producto_3",
        Cantidad: 1,
        Precio: 10.5,
        Posicion: 2
      },
    ];
  
    return Lista;
  };