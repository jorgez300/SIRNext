"use server";

import { FiltroInventario } from "../DTOs/FiltroInventario";
import { Inventario } from "../Models/Inventario/Inventario";



export const GetInventario = async (filtro?: FiltroInventario) => {
  console.log("GetInventario", filtro);
  const Lista: Inventario[] = [
    {
      Id: "1",
      Codigo: "Producto_1",
      Descripcion: "Producto 1",
      Existencia: 1,
      Costo: 10.5,
      Precio: 15.5
    },

  ];

  return Lista;
};

export const GetInventarioById = async (id: string) => {
  console.log("GetInventarioById", id);
  const Item: Inventario =
    {
        Id: "1",
        Codigo: "Producto_1",
        Descripcion: "Producto 1",
        Existencia: 1,
        Costo: 10.5,
        Precio: 15.5
    };

  return Item;
};

export const GuardaInventario = async (Item:Inventario) => {
  console.log("GuardaInventario", Item);
};