"use server";

import { randomUUID } from "crypto";
import { ExecQuery, GetCursor } from "../Clients/DatabaseClient";
import {
  ActualizaCostoProducto,
  ActualizaExistenciaProducto,
  ActualizaPrecioProducto,
} from "./ProductoService";
import { RegistroCompra } from "../DTOs/Compras/RegistroCompra";
import { Proveedor } from "../Models/Proveedores/Proveedor";
import { Compra } from "../Models/Compras/Compra";
import { ItemCompra } from "../Models/Compras/ItemCompra";
import { FiltroCompra } from "../DTOs/Compras/FiltroCompra";
import { DetalleCompra } from "../DTOs/Compras/DetalleCompra";
import { DatoGraficoUnaSerie } from "../DTOs/DatoGraficoUnaSerie.dto";

export const InsertaOperacionCompra = async (
  ItemCompra: RegistroCompra[],
  proveedor: Proveedor
) => {
  const Uid: string = randomUUID().toString();

  const compra: Compra = {
    Uid: Uid,
    ProveedorId: proveedor.Id,
    UsuarioId: "Admin",
    TotalArticulos: ItemCompra.reduce((accumulator, item) => {
      return accumulator + Number(item.Cantidad);
    }, 0),
    TotalCompra: ItemCompra.reduce((accumulator, item) => {
      return accumulator + Number(item.Total);
    }, 0),
  };

  await InsertaCompra(compra);
  ItemCompra.forEach(async (item) => {
    await InsertaItemCompra({
      CompraId: Uid,
      Posicion: item.Posicion,
      ProductoId: item.ProductoId,
      Cantidad: item.Cantidad,
      Costo: Number(item.Costo),
      Precio: Number(item.Precio),
      Total: item.Total,
    });
  });
  await ActualizaProducto(ItemCompra);
  return await RetornaIdCompra(Uid);
};

const InsertaCompra = async (compra: Compra) => {
  const query = `INSERT INTO public.Compras (Fecha, Uid, ProveedorId, UsuarioId, TotalArticulos, TotalCompra)VALUES 
                (CURRENT_TIMESTAMP, '${compra.Uid}', ${compra.ProveedorId}, '${compra.UsuarioId}', ${compra.TotalArticulos}, ${compra.TotalCompra})`;

  await ExecQuery(query);
};

const InsertaItemCompra = async (item: ItemCompra) => {
  const query = `INSERT INTO public.ItemCompras (CompraUid, Posicion, ProductoId, Cantidad, Costo, Precio, Total)
                VALUES ('${item.CompraId}', ${item.Posicion}, '${item.ProductoId}', ${item.Cantidad}, ${item.Costo}, ${item.Precio}, ${item.Total})`;

  await ExecQuery(query);
};

const RetornaIdCompra = async (Uid: string) => {
  let query = ``;

  query = `SELECT id FROM public.compras 
          WHERE uid = '${Uid}' 
          LIMIT 1`;

  const data = await GetCursor(query);

  if (data.length == 0) {
    return 0;
  } else {
    return data[0].id;
  }
};

export const RetornaListaCompras = async (
  filtro: FiltroCompra
): Promise<DetalleCompra[]> => {
  let query = ``;
  query = `SELECT 
              C.id,
              C.uid,
              to_char(C.fecha, 'DD-MM-YYYY') as fecha,
              C.proveedorid,
              P.nombre,
              C.usuarioid,
              C.totalarticulos,
              C.totalcompra,
              C.estado
            FROM 
            PUBLIC.COMPRAS C 
            INNER JOIN PUBLIC.proveedores P ON C.proveedorid = P.id
            WHERE
            (C.id = ${filtro.CompraId} OR '0' = '${filtro.CompraId}') AND
            ((UPPER(P.identificacion) LIKE '%${filtro.ProveedorId}%' OR '' = '${
    filtro.ProveedorId
  }') OR
            (UPPER(P.nombre) LIKE '%${filtro.ProveedorId}%' OR '' = '${
    filtro.ProveedorId
  }')) AND
            (C.estado = '${filtro.Estado}' OR 'TODOS' = '${filtro.Estado}') AND
            C.FECHA BETWEEN to_timestamp('${FormatDate(
              filtro.FechaDesde!
            )} 00:00:00', 'DD-MM-YYYY HH24:MI:SS') AND to_timestamp('${FormatDate(
    filtro.FechaHasta!
  )} 23:59:59', 'DD-MM-YYYY HH24:MI:SS')
            ORDER BY C.id DESC
            LIMIT 100`;

  const lista: DetalleCompra[] = [];
  const data = await GetCursor(query);
  data.forEach((item) => {
    lista.push({
      Id: item.id,
      Uid: item.uid,
      Fecha: item.fecha,
      ProveedorId: item.proveedorid,
      ProveedorDsc: item.nombre,
      UsuarioId: item.usuarioid,
      TotalArticulos: item.totalarticulos,
      TotalCompra: item.totalcompra,
      Estado: item.estado,
    });
  });

  return lista;
};

const FormatDate = (fecha: Date): string => {
  const day = String(fecha.getDate()).padStart(2, "0");
  const month = String(fecha.getMonth() + 1).padStart(2, "0"); // Los meses en JavaScript comienzan desde 0
  const year = fecha.getFullYear();
  return `${day}-${month}-${year}`;
};

export const RetornaDetalleCompra = async (
  item: DetalleCompra
): Promise<RegistroCompra[]> => {
  let query = ``;

  query = `SELECT
            IC.posicion,
            IC.productoid,
            P.descripcion,
            IC.cantidad,
            IC.costo,
            IC.precio,
            IC.total
          FROM 
          PUBLIC.itemcompras IC 
          INNER JOIN PUBLIC.productos P ON IC.productoid = P.codigo
          WHERE IC.comprauid = '${item.Uid}'`;

  const lista: RegistroCompra[] = [];
  const data = await GetCursor(query);
  data.forEach((item) => {
    lista.push({
      Posicion: item.posicion,
      ProductoId: item.productoid,
      ProductoDsc: item.descripcion,
      Cantidad: item.cantidad,
      Costo: item.costo,
      Precio: item.precio,
      Total: item.total,
    });
  });

  return lista;
};

export const GeneraDevolucion = async (
  item: DetalleCompra,
  registros: RegistroCompra[]
) => {
  await DevuelveCompra(item);
  registros.forEach(async (item) => {
    await ActualizaExistenciaProducto(item.ProductoId, item.Cantidad, "-");
  });
};

const DevuelveCompra = async (item: DetalleCompra) => {
  const query = `UPDATE public.compras
                  SET estado='DEVUELTO'
                  WHERE uid = '${item.Uid}'`;

  await ExecQuery(query);
};

const ActualizaProducto = async (registros: RegistroCompra[]) => {
  registros.forEach(async (item) => {
    await ActualizaExistenciaProducto(item.ProductoId, item.Cantidad, "+");
    await ActualizaCostoProducto(item.ProductoId, Number(item.Costo));
    await ActualizaPrecioProducto(item.ProductoId, Number(item.Precio));
  });
};

export const GetComprasPorDia = async (periodo: string) => {
  const query = `select fecha,  sum (totalcompra) total
                  from 
                  (
                    select 
                    TO_CHAR(fecha, 'YYYY-MM-DD') as fecha, 
                    totalcompra
                    from public.compras
                    where 
                    EXTRACT(MONTH FROM fecha) = ${periodo.split("-")[1]}  and
                    EXTRACT(YEAR FROM fecha) = ${periodo.split("-")[0]} and
                    ESTADO = 'VIGENTE'
                  )
                  group by fecha
                  order by fecha asc`;

  const data = await GetCursor(query);

  if (data.length == 0) {
    return [];
  }
  const ChartData: DatoGraficoUnaSerie[] = data.map((item) => {
    return {
      Fecha: item.fecha.split('-')[2],
      ValorA: item.total,
    };
  });

  return ChartData;
};
