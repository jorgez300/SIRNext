"use server";

import { ExecQuery, GetCursor } from "../Clients/DatabaseClient";
import { FiltroProducto } from "../DTOs/Productos/FiltroProducto";
import { FiltroReporteProducto } from "../DTOs/Productos/FiltroReporteProducto";
import { ProductoCompleto } from "../DTOs/Productos/ProductoCompleto";
import { Producto } from "../Models/Productos/Producto";
import {
  EliminaVehiculosPorProducto,
  InsertaVehiculosPorProducto,
} from "./VehiculoService";

export const GetProductos = async (
  filtro?: FiltroProducto
): Promise<Producto[]> => {
  let query = ``;

  if (filtro) {
    query = `SELECT distinct p.codigo, p.descripcion, marcaprod, p.vigente, p.existencia, p.costo, p.precio, p.minimo, p.maximo
              FROM public.productos p left join public.productosvehiculos pv on p.codigo = pv.codigo
              WHERE 
                ( UPPER(p.codigo) like '%${
                  filtro.Codigo ? filtro.Codigo.toUpperCase() : ""
                }%' or '' = '${filtro.Codigo ?? ""}')
                and (UPPER(p.marcaprod) like '%${
                  filtro.MarcaProd ? filtro.MarcaProd.toUpperCase() : ""
                }%' or '' = '${filtro.MarcaProd ?? ""}')
                and (UPPER(p.descripcion) like '%${
                  filtro.Descripcion ? filtro.Descripcion.toUpperCase() : ""
                }%' or '' = '${filtro.Descripcion ?? ""}')
                and (pv.marca = '${filtro.Vehiculo!.Marca ?? ""}' or '' = '${
      filtro.Vehiculo!.Marca ?? ""
    }')
	              and (pv.modelo = '${filtro.Vehiculo!.Modelo ?? ""}' or '' = '${
      filtro.Vehiculo!.Modelo ?? ""
    }')
              ${filtro.ConExistencia ? "and p.existencia > 0" : ""}
              ORDER BY p.descripcion ASC
              LIMIT 100`;
  } else {
    query = `SELECT Codigo, Descripcion, marcaprod, Vigente, existencia, costo, precio, minimo, maximo 
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
      MarcaProd: item.marcaprod,
      Existencia: item.existencia,
      Vigente: item.vigente,
      Costo: item.costo,
      Precio: item.precio,
    });
  });
  return lista;
};

export const GetProductosOperacion = async (
  filtro: FiltroProducto
): Promise<Producto[]> => {
  let query = ``;

  query = `SELECT distinct p.codigo, p.descripcion, marcaprod, p.vigente, p.existencia, p.costo, p.precio, p.minimo, p.maximo
              FROM public.productos p left join public.productosvehiculos pv on p.codigo = pv.codigo
              WHERE 
                ( UPPER(p.codigo) like '%${
                  filtro.Codigo ? filtro.Codigo.toUpperCase() : ""
                }%' or '' = '${filtro.Codigo ?? ""}')
                or (UPPER(p.marcaprod) like '%${
                  filtro.MarcaProd ? filtro.MarcaProd.toUpperCase() : ""
                }%' or '' = '${filtro.MarcaProd ?? ""}')
                or (UPPER(p.descripcion) like '%${
                  filtro.Descripcion ? filtro.Descripcion.toUpperCase() : ""
                }%' or '' = '${filtro.Descripcion ?? ""}')
              and p.existencia > 0
              ORDER BY p.descripcion ASC
              LIMIT 20`;

  const lista: Producto[] = [];
  const data = await GetCursor(query);
  data.forEach((item) => {
    lista.push({
      Codigo: item.codigo,
      Descripcion: item.descripcion,
      MarcaProd: item.marcaprod,
      Existencia: item.existencia,
      Vigente: item.vigente,
      Costo: item.costo,
      Precio: item.precio,
    });
  });
  return lista;
};

export const GetProductoById = async (
  id: string
): Promise<Producto | undefined> => {
  const query = `SELECT Codigo, Descripcion, marcaprod, Vigente, existencia, costo, precio, minimo, maximo , Ubicacion 
                FROM public.productos 
                WHERE Codigo = UPPER('${id}')`;

  const data = await GetCursor(query);

  if (data.length == 0) {
    return undefined;
  }
  return {
    Codigo: data[0].codigo,
    Descripcion: data[0].descripcion,
    MarcaProd: data[0].marcaprod,
    Ubicacion: data[0].ubicacion,
    Existencia: data[0].existencia,
    Minimo: data[0].minimo,
    Maximo: data[0].maximo,
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
              marcaprod='${Producto.Item!.MarcaProd}', 
              ubicacion='${Producto.Item!.Ubicacion}', 
              vigente=${Producto.Item!.Vigente}, 
              existencia=${Producto.Item!.Existencia}, 
              costo=${Producto.Item!.Costo}, 
              precio=${Producto.Item!.Precio}, 
              minimo=${Producto.Item!.Minimo ? Producto.Item!.Minimo : "NULL"}, 
              maximo=${Producto.Item!.Maximo ? Producto.Item!.Maximo : "NULL"}
            WHERE codigo = UPPER('${Producto.Item!.Codigo ?? ""}')`;

  await ExecQuery(query);

  await InsertaVehiculosPorProducto(Producto.Item!.Codigo, Producto.Vehiculos!);
};

export const InsertaProducto = async (Producto: ProductoCompleto) => {
  await EliminaVehiculosPorProducto(Producto.Item!.Codigo);

  const query = `INSERT INTO Productos (Codigo, Descripcion, MarcaProd, ubicacion, Vigente, Existencia, Costo, Precio, Minimo, Maximo) VALUES
                  (
                    UPPER('${Producto.Item!.Codigo}'), 
                    '${Producto.Item!.Descripcion}', 
                    '${Producto.Item!.MarcaProd}', 
                    '${Producto.Item!.Ubicacion}', 
                    ${Producto.Item!.Vigente}, 
                    ${Producto.Item!.Existencia}, 
                    ${Producto.Item!.Costo}, 
                    ${Producto.Item!.Precio}, 
                    ${Producto.Item!.Minimo ? Producto.Item!.Minimo : "NULL"}, 
                    ${Producto.Item!.Maximo ? Producto.Item!.Maximo : "NULL"}
                  )`;

  await ExecQuery(query);

  await InsertaVehiculosPorProducto(Producto.Item!.Codigo, Producto.Vehiculos!);
};

export const ActualizaExistenciaProducto = async (
  ProductoId: string,
  Cantidad: number,
  Operacion: "-" | "+"
) => {
  if (Cantidad == 0) return;
  const query = `UPDATE public.productos
            SET 
              existencia= existencia ${Operacion} ${Cantidad}
            WHERE codigo = UPPER('${ProductoId}')`;

  await ExecQuery(query);
};

export const ActualizaCostoProducto = async (
  ProductoId: string,
  Costo: number
) => {
  const query = `UPDATE public.productos
            SET 
              costo = ${Costo}
            WHERE codigo = UPPER('${ProductoId}')`;

  await ExecQuery(query);
};

export const ActualizaPrecioProducto = async (
  ProductoId: string,
  Precio: number
) => {
  const query = `UPDATE public.productos
            SET 
              precio = ${Precio}
            WHERE codigo = UPPER('${ProductoId}')`;

  await ExecQuery(query);
};

export const GetReporteProductos = async (
  filtro?: FiltroReporteProducto
): Promise<Producto[]> => {
  let Tipo = "";
  console.log('filtro', filtro)

  if (filtro?.TipoReporte == "Exis<=0") {
    Tipo = "and existencia <= 0";
  }

  if (filtro?.TipoReporte == "Exis<=Min") {
    Tipo = "and existencia <= minimo";
  }

  if (filtro?.TipoReporte == "Exis>=Max") {
    Tipo = "and existencia >= maximo";
  }

  const query = `SELECT 
      codigo, 
      descripcion, 
      marcaprod, 
      vigente, 
      existencia, 
      costo, 
      precio, 
      minimo, 
      maximo, 
      ubicacion
    FROM public.productos
    WHERE
    vigente = true and
    (ubicacion = '${filtro?.Ubicacion}' or 'TODOS' = '${filtro?.Ubicacion}') 
    ${Tipo}
    order by descripcion asc
`;

console.log('query', query)

  const lista: Producto[] = [];
  const data = await GetCursor(query);
  data.forEach((item) => {
    lista.push({
      Codigo: item.codigo,
      Descripcion: item.descripcion,
      MarcaProd: item.marcaprod,
      Ubicacion: item.ubicacion,
      Existencia: item.existencia,
      Minimo: item.minimo,
      Maximo: item.maximo,
      Vigente: item.vigente,
      Costo: item.costo,
      Precio: item.precio,
    });
  });
  return lista;
};
