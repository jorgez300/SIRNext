"use server";

import { ExecQuery, GetCursor } from "../Clients/DatabaseClient";
import { FiltroProducto } from "../DTOs/Productos/FiltroProducto";
import { ProductoCompleto } from "../DTOs/Productos/ProductoCompleto";
import { Producto } from "../Models/Productos/Producto";
import {
  EliminaVehiculosPorProducto,
  InsertaVehiculosPorProducto,
} from "./VehiculoService";

export const GetProductos = async (filtro?: FiltroProducto)  : Promise<Producto[]>=> {
  let query = ``;

  if (filtro) {
    query = `SELECT distinct p.codigo, p.descripcion, p.vigente, p.existencia, p.costo, p.precio, p.minimo, p.maximo
              FROM public.productos p left join public.productosvehiculos pv on p.codigo = pv.codigo
              WHERE 
                (p.codigo = '${filtro.Codigo ?? ""}' or '' = '${
      filtro.Codigo ?? ""
    }')
                and ( UPPER(p.descripcion) like '%${
                  filtro.Descripcion ? filtro.Descripcion.toUpperCase() : ""
                }%' or '' = '${filtro.Descripcion ?? ""}')
                and (pv.marca = '${filtro.Marca ?? ""}' or '' = '${
      filtro.Marca ?? ""
    }')
	              and (pv.modelo = '${filtro.Modelo ?? ""}' or '' = '${
      filtro.Modelo ?? ""
    }')
              ORDER BY p.descripcion ASC
              LIMIT 100`;
  } else {
    query = `SELECT Codigo, Descripcion, Vigente, existencia, costo, precio, minimo, maximo 
            FROM public.productos P 
            ORDER BY P.descripcion ASC
            LIMIT 100`;
  }

  const lista: Producto[] = [];
  const data = await GetCursor(query);
  data.forEach((item) => {
    lista.push({
      Codigo: item.codigo,
      Descripcion: item.descripcion,
      Existencia: item.existencia,
      Vigente: item.vigente,
      Costo: item.costo,
      Precio: item.precio,
    });
  });
  return lista;
};

export const GetProductoById = async (id: string) : Promise<Producto> => {
  const query = `SELECT Codigo, Descripcion, Vigente, existencia, costo, precio, minimo, maximo 
                FROM public.productos 
                WHERE Codigo = '${id}'`;

  const data = await GetCursor(query);

  return {
    Codigo: data[0].codigo,
    Descripcion: data[0].descripcion,
    Existencia: data[0].existencia,
    Vigente: data[0].vigente,
    Costo: data[0].costo,
    Precio: data[0].precio,
  };
};

export const ActualizaProducto = async (Producto: ProductoCompleto) => {
  await EliminaVehiculosPorProducto(Producto.Item!.Codigo);

  const query = `UPDATE public.productos
            SET 
              descripcion='${Producto.Item!.Descripcion}', 
              vigente=${Producto.Item!.Vigente}, 
              existencia=${Producto.Item!.Existencia}, 
              costo=${Producto.Item!.Costo}, 
              precio=${Producto.Item!.Precio}, 
              minimo=${Producto.Item!.Minimo ?? "NULL"}, 
              maximo=${Producto.Item!.Maximo ?? "NULL"}
            WHERE codigo = '${Producto.Item!.Codigo ?? ""}'`;

  await ExecQuery(query);

  await InsertaVehiculosPorProducto(Producto.Item!.Codigo, Producto.Vehiculos!);
};

export const InsertaProducto = async (Producto: ProductoCompleto) => {
  await EliminaVehiculosPorProducto(Producto.Item!.Codigo);

  const query = `INSERT INTO Productos (Codigo, Descripcion, Vigente, Existencia, Costo, Precio, Minimo, Maximo) VALUES
                  (
                    '${Producto.Item!.Codigo}', 
                    '${Producto.Item!.Descripcion}', 
                    ${Producto.Item!.Vigente}, 
                    ${Producto.Item!.Existencia}, 
                    ${Producto.Item!.Costo}, 
                    ${Producto.Item!.Precio}, 
                    ${Producto.Item!.Minimo ?? "NULL"}, 
                    ${Producto.Item!.Maximo ?? "NULL"}
                  )`;

  await ExecQuery(query);

  await InsertaVehiculosPorProducto(Producto.Item!.Codigo, Producto.Vehiculos!);
};
