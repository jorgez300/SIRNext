"use server";

import { FiltroProducto } from "../DTOs/Productos/FiltroProducto";
import { ProductoCompleto } from "../DTOs/Productos/ProductoCompleto";
import { Producto } from "../Models/Productos/Producto";




export const GetProductos = async (filtro?: FiltroProducto) => {
  console.log("GetProductos", filtro);
  const Lista: Producto[] = [
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

export const GetProductoById = async (id: string) => {
  console.log("GetProductoById", id);
  const Item: Producto =
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

export const GetProductoCompletoById = async (id: string) => {
  console.log("GetProductoCompletoById", id);
  const Item: ProductoCompleto =
    {Item: {
        Id: "1",
        Codigo: "Producto_1",
        Descripcion: "Producto 1",
        Existencia: 1,
        Costo: 10.5,
        Precio: 15.5
    },
    Marcas: [{Model: "Model 1", Brand: "Brand 1"}]
  };

  return Item;
};

export const GuardaProducto = async (Item:Producto) => {
  console.log("GuardaProducto", Item);
};

export const GuardaProductoCompleto = async (Item:ProductoCompleto) => {
    console.log("GuardaProducto", Item);
  };