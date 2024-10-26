"use server";

import { randomUUID } from "crypto";
import { ExecQuery, GetCursor } from "../Clients/DatabaseClient";
import { ItemVenta } from "../Models/Ventas/ItemVenta";
import { Venta } from "../Models/Ventas/Venta";
import { Cliente } from "../Models/Clientes/Cliente";
import { RegistroVenta } from "../DTOs/Ventas/RegistroVenta";
import { ActualizaExistenciaProducto } from "./ProductoService";
import { FiltroVenta } from "../DTOs/Ventas/FiltroVenta";
import { DetalleVenta } from "../DTOs/Ventas/DetalleVenta";
import { DatoGraficoUnaSerie } from "../DTOs/DatoGraficoUnaSerie.dto";
import { DatoGraficoDosSeries } from "../DTOs/DatoGraficoDosSeries.dto";

export const InsertaOperacionVenta = async (
  ItemVenta: RegistroVenta[],
  cliente: Cliente
) => {
  const Uid: string = randomUUID().toString();

  const venta: Venta = {
    Uid: Uid,
    ClienteId: cliente.Id,
    UsuarioId: "Admin",
    TotalArticulos: ItemVenta.reduce((accumulator, item) => {
      return accumulator + Number(item.Cantidad);
    }, 0),
    TotalVenta: ItemVenta.reduce((accumulator, item) => {
      return accumulator + Number(item.Total);
    }, 0),
  };

  await InsertaVenta(venta);
  ItemVenta.forEach(async (item) => {
    await InsertaItemVenta({
      VentaId: Uid,
      Posicion: item.Posicion,
      ProductoId: item.ProductoId,
      Cantidad: item.Cantidad,
      Costo: item.Costo,
      Precio: item.Precio,
      Total: item.Total,
    });

    await ActualizaExistenciaProducto(item.ProductoId, item.Cantidad, "-");
  });

  return await RetornaIdVenta(Uid);
};

const InsertaVenta = async (venta: Venta) => {
  const query = `INSERT INTO public.Ventas (Fecha, Uid, ClienteId, UsuarioId, TotalArticulos, TotalVenta)VALUES 
                (CURRENT_TIMESTAMP, '${venta.Uid}', ${venta.ClienteId}, '${venta.UsuarioId}', ${venta.TotalArticulos}, ${venta.TotalVenta})`;

  await ExecQuery(query);
};

const InsertaItemVenta = async (item: ItemVenta) => {
  const query = `INSERT INTO public.ItemVentas (VentaUid, Posicion, ProductoId, Cantidad, Costo, Precio, Total)
                VALUES ('${item.VentaId}', ${item.Posicion}, '${item.ProductoId}', ${item.Cantidad}, ${item.Costo}, ${item.Precio}, ${item.Total})`;

  await ExecQuery(query);
};

const RetornaIdVenta = async (Uid: string) => {
  let query = ``;

  query = `SELECT id FROM public.ventas 
          WHERE uid = '${Uid}' 
          LIMIT 1`;

  const data = await GetCursor(query);

  if (data.length == 0) {
    return 0;
  } else {
    return data[0].id;
  }
};

export const RetornaListaVentas = async (
  filtro: FiltroVenta
): Promise<DetalleVenta[]> => {
  let query = ``;

  query = `SELECT 
              V.id,
              V.uid,
              to_char(V.fecha, 'DD-MM-YYYY') as fecha,
              V.clienteid,
              C.nombre,
              V.usuarioid,
              V.totalarticulos,
              V.totalventa,
              V.estado
            FROM 
            PUBLIC.ventas V 
            INNER JOIN PUBLIC.clientes C ON V.clienteid = C.id
            WHERE
            (V.id = ${filtro.VentaId} OR '0' = '${filtro.VentaId}') AND
            (C.identificacion LIKE '%${filtro.ClienteId}%' OR '' = '${
    filtro.ClienteId
  }') AND
            (C.nombre LIKE '%${filtro.ClienteId}%' OR '' = '${
    filtro.ClienteId
  }') AND
            (V.estado = '${filtro.Estado}' OR 'TODOS' = '${filtro.Estado}') AND
            V.FECHA BETWEEN to_timestamp('${FormatDate(
              filtro.FechaDesde!
            )} 00:00:00', 'DD-MM-YYYY HH24:MI:SS') AND to_timestamp('${FormatDate(
    filtro.FechaHasta!
  )} 23:59:59', 'DD-MM-YYYY HH24:MI:SS')
            ORDER BY V.id DESC
            LIMIT 100`;

  const lista: DetalleVenta[] = [];
  const data = await GetCursor(query);
  data.forEach((item) => {
    lista.push({
      Id: item.id,
      Uid: item.uid,
      Fecha: item.fecha,
      ClienteId: item.clienteid,
      ClienteDsc: item.nombre,
      UsuarioId: item.usuarioid,
      TotalArticulos: item.totalarticulos,
      TotalVenta: item.totalventa,
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

export const RetornaDetalleVenta = async (
  item: DetalleVenta
): Promise<RegistroVenta[]> => {
  let query = ``;

  query = `SELECT
            IV.posicion,
            IV.productoid,
            P.descripcion,
            IV.cantidad,
            IV.costo,
            IV.precio,
            IV.total
          FROM 
          PUBLIC.itemventas IV 
          INNER JOIN PUBLIC.productos P ON IV.productoid = P.codigo
          WHERE IV.ventauid = '${item.Uid}'`;

  const lista: RegistroVenta[] = [];
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
  item: DetalleVenta,
  registros: RegistroVenta[]
) => {
  await DevuelveVenta(item);
  await ActualizaExistencia(registros);
};

const DevuelveVenta = async (item: DetalleVenta) => {
  const query = `UPDATE public.ventas
                  SET estado='DEVUELTO'
                  WHERE uid = '${item.Uid}'`;

  await ExecQuery(query);
};

const ActualizaExistencia = async (registros: RegistroVenta[]) => {
  registros.forEach(async (item) => {
    await ActualizaExistenciaProducto(item.ProductoId, item.Cantidad, "+");
  });
};

export const GetTotalVentas = async (periodo: string) => {
  const query = `select SUM(totalventa) total
                  from public.ventas
                  where 
                  EXTRACT(MONTH FROM fecha) = ${periodo.split("-")[1]}  and
                  EXTRACT(YEAR FROM fecha) = ${periodo.split("-")[0]} and
                  ESTADO = 'VIGENTE'`;

  const data = await GetCursor(query);

  if (data.length == 0) {
    return 0;
  }
  return data[0].total ? data[0].total : 0;
};

export const GetCantidadOperacionesVenta = async (periodo: string) => {
  const query = `select count(*) total
                  from public.ventas
                  where 
                  EXTRACT(MONTH FROM fecha) = ${periodo.split("-")[1]}  and
                  EXTRACT(YEAR FROM fecha) = ${periodo.split("-")[0]} and
                  ESTADO = 'VIGENTE'`;

  const data = await GetCursor(query);

  if (data.length == 0) {
    return 0;
  }
  return data[0].total ? data[0].total : 0;
};

export const GetVentasPorDia = async (periodo: string) => {
  const query = `select fecha,  sum (totalventa) total
                  from 
                  (
                    select 
                    TO_CHAR(fecha, 'YYYY-MM-DD') as fecha, 
                    totalventa
                    from public.ventas
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

export const GetCostosPreciosPorDia = async (periodo: string) => {
  const query = `select fecha,  sum (costo) costo,  sum (precio) precio
                  from 
                  (
                    select TO_CHAR(fecha, 'YYYY-MM-DD') fecha, (iv.cantidad * iv.costo) costo,  (iv.cantidad * iv.precio) precio
                    from public.ventas v 
                    inner join public.itemventas iv on v.uid = iv.ventauid
                    where
                      ESTADO = 'VIGENTE' and
                      EXTRACT(MONTH FROM fecha) = ${periodo.split("-")[1]}  and
                      EXTRACT(YEAR FROM fecha) = ${periodo.split("-")[0]}
                  )
                  group by fecha`;

  const data = await GetCursor(query);

  if (data.length == 0) {
    return [];
  }

  const ChartData: DatoGraficoDosSeries[] = data.map((item) => {
    return {
      Fecha: item.fecha.split('-')[2],
      ValorA: item.costo,
      ValorB: item.precio,
    };
  });

  return ChartData;
};